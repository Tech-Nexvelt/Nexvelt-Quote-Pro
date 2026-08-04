import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  const workerId = `worker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    // 1. Row-level lock claim using FOR UPDATE SKIP LOCKED
    const { data: events, error } = await supabase.rpc('claim_outbox_events', {
      p_worker_id: workerId,
      p_batch_size: 10,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending events to process' }), { status: 200 });
    }

    const processedIds: string[] = [];

    // 2. Process each claimed outbox event idempotently
    for (const event of events) {
      try {
        console.log(`Processing event ${event.event_id}: ${event.event_type}`);

        // Handle specific event types (e.g. email dispatch, PDF generation)
        if (event.event_type === 'quotation.created') {
          console.log(`[Event Handler] Quotation created: ${event.payload.quotation_number}`);
        } else if (event.event_type === 'staff.invited') {
          console.log(`[Event Handler] Staff invited: ${event.payload.email}`);
        }

        // Mark completed
        await supabase
          .from('outbox_events')
          .update({ status: 'completed', processed_at: new Date().toISOString() })
          .eq('event_id', event.event_id);

        processedIds.push(event.event_id);
      } catch (err: any) {
        console.error(`Failed processing event ${event.event_id}:`, err);
        const nextRetry = (event.retry_count || 0) + 1;

        if (nextRetry >= 5) {
          // Transfer to Dead Letter Queue
          await supabase.from('dead_letter_events').insert({
            original_event_id: event.event_id,
            company_id: event.company_id,
            event_type: event.event_type,
            payload: event.payload,
            failure_reason: err.message || 'Exceeded 5 retries',
            retry_count: nextRetry,
          });

          await supabase.from('outbox_events').delete().eq('event_id', event.event_id);
        } else {
          await supabase
            .from('outbox_events')
            .update({ status: 'pending', retry_count: nextRetry, error_message: err.message })
            .eq('event_id', event.event_id);
        }
      }
    }

    return new Response(JSON.stringify({ workerId, processedCount: processedIds.length }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
