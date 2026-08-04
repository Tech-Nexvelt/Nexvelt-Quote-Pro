-- PostgreSQL Migration: 20260801000007_audit_logging.sql
-- Description: Audit Logging Procedure for Critical Operations

CREATE OR REPLACE FUNCTION public.log_audit_event(
    p_action TEXT,
    p_module TEXT,
    p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_company_id UUID;
    v_profile_id UUID;
BEGIN
    SELECT id, company_id INTO v_profile_id, v_company_id
    FROM public.profiles
    WHERE user_id = auth.uid();

    INSERT INTO public.audit_logs (
        company_id, user_id, action, module, created_at
    ) VALUES (
        v_company_id, v_profile_id, p_action, p_module, NOW()
    );
END;
$$;
