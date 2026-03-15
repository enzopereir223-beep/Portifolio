
-- Fix the overly permissive INSERT policy on leads
-- The public can only insert (submit contact form), not select/update/delete
-- This is intentional and correct. Drop and re-add with explicit operation scope.
DROP POLICY IF EXISTS "Leads can be inserted by anyone" ON public.leads;
CREATE POLICY "Public can submit contact form" ON public.leads FOR INSERT WITH CHECK (true);
