-- Remove public INSERT policy and add service role only policy
DROP POLICY IF EXISTS "Qualquer um pode assinar" ON public.signatures;

-- Create policy that only allows service role to insert
-- This ensures all inserts go through the validated edge function
CREATE POLICY "Only service role can insert signatures"
ON public.signatures
FOR INSERT
TO service_role
WITH CHECK (true);

-- Keep SELECT policy as is for the public counter
-- This is acceptable as aggregate counts don't expose individual PII