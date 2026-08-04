-- PostgreSQL Migration: 20260801000006_storage_security.sql
-- Description: Hardened Storage Bucket Policies and Folder Level Tenant Isolation

-- Drop existing storage policies on storage.objects to replace with hardened policies
DROP POLICY IF EXISTS "Users can view own company files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own company files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own company files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own company files" ON storage.objects;

-- SELECT policy: Users can only read files inside company-assets/{company_id}/*
CREATE POLICY "Users can view own company files"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
);

-- INSERT policy: Upload path must start with company_id/
CREATE POLICY "Users can upload own company files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
);

-- UPDATE policy
CREATE POLICY "Users can update own company files"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
)
WITH CHECK (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
);

-- DELETE policy
CREATE POLICY "Users can delete own company files"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
);
