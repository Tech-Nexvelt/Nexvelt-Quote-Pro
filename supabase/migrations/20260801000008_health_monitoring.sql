-- PostgreSQL Migration: 20260801000008_health_monitoring.sql
-- Description: System Diagnostic Health Check RPC

CREATE OR REPLACE FUNCTION public.check_system_health()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_total_companies INT;
    v_total_users INT;
    v_pending_outbox INT;
    v_dlq_count INT;
BEGIN
    SELECT COUNT(*) INTO v_total_companies FROM public.companies;
    SELECT COUNT(*) INTO v_total_users FROM public.profiles;
    SELECT COUNT(*) INTO v_pending_outbox FROM public.outbox_events WHERE status = 'pending';
    SELECT COUNT(*) INTO v_dlq_count FROM public.dead_letter_events;

    RETURN jsonb_build_object(
        'status', 'healthy',
        'timestamp', NOW(),
        'database', 'connected',
        'total_companies', v_total_companies,
        'total_users', v_total_users,
        'pending_outbox', v_pending_outbox,
        'dlq_count', v_dlq_count
    );
END;
$$;
