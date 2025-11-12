import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

export const SignatureCounter = () => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Buscar contagem inicial
    const fetchCount = async () => {
      const { count: initialCount, error } = await supabase
        .from("signatures")
        .select("*", { count: "exact", head: true });

      if (!error && initialCount !== null) {
        setCount(initialCount);
      }
      setIsLoading(false);
    };

    fetchCount();

    // Configurar listener em tempo real
    const channel = supabase
      .channel("signatures-count")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "signatures",
        },
        () => {
          setCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 text-muted-foreground">
        <Users className="w-8 h-8 animate-pulse" />
        <span className="text-2xl">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 p-8 bg-card rounded-2xl shadow-card border-2 border-primary/20">
      <Users className="w-10 h-10 text-primary" />
      <div className="text-center">
        <div className="text-5xl font-bold text-primary animate-pulse">
          {count.toLocaleString("pt-BR")}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {count === 1 ? "assinatura" : "assinaturas"}
        </div>
      </div>
    </div>
  );
};
