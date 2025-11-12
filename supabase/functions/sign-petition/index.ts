import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: in-memory store (resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

// IP validation regex
const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_REGEX = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

function validateIP(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  if (ip.length > 45) return false; // Max IPv6 length
  return IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip);
}

function validateFingerprint(fingerprint: string): boolean {
  if (!fingerprint || typeof fingerprint !== 'string') return false;
  if (fingerprint.length > 1000) return false;
  // Check if it's valid base64
  try {
    atob(fingerprint);
    return true;
  } catch {
    return false;
  }
}

function checkRateLimit(identifier: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetIn = Math.ceil((record.resetTime - now) / 1000 / 60); // minutes
    return { allowed: false, resetIn };
  }

  record.count++;
  return { allowed: true };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ip, fingerprint } = await req.json();

    // Validate inputs
    if (!validateIP(ip)) {
      console.log(`Invalid IP format: ${ip}`);
      return new Response(
        JSON.stringify({ error: 'Dados inválidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateFingerprint(fingerprint)) {
      console.log(`Invalid fingerprint format`);
      return new Response(
        JSON.stringify({ error: 'Dados inválidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const rateLimitKey = `${ip}:${fingerprint}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for ${ip}`);
      return new Response(
        JSON.stringify({ 
          error: 'Muitas tentativas',
          message: `Aguarde ${rateLimit.resetIn} minutos antes de tentar novamente.`
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check for existing signature (server-side duplicate check)
    const { data: existingSignatures, error: checkError } = await supabaseAdmin
      .from('signatures')
      .select('id')
      .or(`ip_address.eq.${ip},browser_fingerprint.eq.${fingerprint}`)
      .limit(1);

    if (checkError) {
      console.error('Database check error:', checkError);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar solicitação' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingSignatures && existingSignatures.length > 0) {
      console.log(`Duplicate signature attempt from IP: ${ip}`);
      return new Response(
        JSON.stringify({ 
          error: 'Assinatura duplicada',
          message: 'Você já assinou esta petição!'
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert new signature
    const { error: insertError } = await supabaseAdmin
      .from('signatures')
      .insert({
        ip_address: ip,
        browser_fingerprint: fingerprint,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Erro ao registrar assinatura' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Signature successfully added for IP: ${ip}`);
    return new Response(
      JSON.stringify({ success: true, message: 'Assinatura registrada com sucesso!' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
