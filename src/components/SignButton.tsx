import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PenLine, Loader2, CheckCircle } from "lucide-react";

// Função para gerar fingerprint do navegador
const getBrowserFingerprint = (): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillText("fingerprint", 2, 2);
  }
  const canvasData = canvas.toDataURL();
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasFingerprint: canvasData.slice(0, 100),
  };
  
  return btoa(JSON.stringify(fingerprint));
};

export const SignButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const handleSign = async () => {
    setIsLoading(true);

    try {
      // Obter IP do usuário via serviço externo
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();
      
      // Gerar fingerprint do navegador
      const fingerprint = getBrowserFingerprint();

      // Verificar se já existe assinatura com este IP ou fingerprint
      const { data: existingSignatures, error: checkError } = await supabase
        .from("signatures")
        .select("id")
        .or(`ip_address.eq.${ip},browser_fingerprint.eq.${fingerprint}`)
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (existingSignatures && existingSignatures.length > 0) {
        toast.error("Você já assinou esta petição!", {
          description: "Cada pessoa pode assinar apenas uma vez.",
        });
        setHasSigned(true);
        setIsLoading(false);
        return;
      }

      // Inserir nova assinatura
      const { error: insertError } = await supabase
        .from("signatures")
        .insert({
          ip_address: ip,
          browser_fingerprint: fingerprint,
        });

      if (insertError) {
        throw insertError;
      }

      setHasSigned(true);
      toast.success("Assinatura registrada com sucesso!", {
        description: "Obrigado por apoiar a simplificação do português! 🇧🇷",
      });
    } catch (error) {
      console.error("Erro ao assinar:", error);
      toast.error("Erro ao registrar assinatura", {
        description: "Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasSigned) {
    return (
      <Button
        size="lg"
        disabled
        className="text-lg px-8 py-6 bg-primary hover:bg-primary text-primary-foreground"
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        Você já assinou!
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={handleSign}
      disabled={isLoading}
      className="text-lg px-8 py-6 bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-xl"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Registrando...
        </>
      ) : (
        <>
          <PenLine className="mr-2 h-5 w-5" />
          Assinar Abaixo-Assinado
        </>
      )}
    </Button>
  );
};
