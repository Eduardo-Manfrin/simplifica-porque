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
      // Obter IP do usuário via serviço externo (com timeout)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const ipResponse = await fetch("https://api.ipify.org?format=json", {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const { ip } = await ipResponse.json();
      
      // Gerar fingerprint do navegador
      const fingerprint = getBrowserFingerprint();

      // Chamar edge function segura com validação server-side
      const { data, error } = await supabase.functions.invoke('sign-petition', {
        body: { ip, fingerprint }
      });

      if (error) {
        // Tratar erros específicos sem expor detalhes técnicos
        if (error.message?.includes('409') || data?.error === 'Assinatura duplicada') {
          toast.error("Você já assinou esta petição!", {
            description: "Cada pessoa pode assinar apenas uma vez.",
          });
          setHasSigned(true);
        } else if (error.message?.includes('429') || data?.error === 'Muitas tentativas') {
          toast.error("Muitas tentativas", {
            description: data?.message || "Por favor, aguarde antes de tentar novamente.",
          });
        } else if (error.message?.includes('400') || data?.error === 'Dados inválidos') {
          toast.error("Erro de validação", {
            description: "Por favor, tente novamente.",
          });
        } else {
          toast.error("Erro ao registrar assinatura", {
            description: "Por favor, tente novamente mais tarde.",
          });
        }
        setIsLoading(false);
        return;
      }

      setHasSigned(true);
      toast.success("Assinatura registrada com sucesso!", {
        description: "Obrigado por apoiar a simplificação do português! 🇧🇷",
      });
    } catch (error) {
      // Erro genérico sem exposição de detalhes
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
