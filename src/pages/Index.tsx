import { SignatureCounter } from "@/components/SignatureCounter";
import { SignButton } from "@/components/SignButton";
import { FileQuestion, ArrowRight, CheckCircle2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileQuestion className="w-4 h-4" />
            Movimento pela Simplificação do Português
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Chega de 4 "Porquês"!
            <span className="block text-primary mt-2">Vamos Unificar!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            É hora de simplificar a língua portuguesa. Uma palavra, um jeito: <strong className="text-primary">porque</strong>.
          </p>

          <div className="mb-12">
            <SignButton />
          </div>

          <SignatureCounter />
        </div>
      </section>

      {/* Problema Atual */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            O Problema Atual
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card p-6 rounded-xl shadow-card border border-border">
              <div className="text-6xl mb-4 text-center">😵</div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">4 Formas Diferentes</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-primary">porque</span>
                  <span>- Usado em respostas e explicações</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-primary">porquê</span>
                  <span>- Substantivo (o porquê)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-primary">por que</span>
                  <span>- Usado em perguntas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-primary">por quê</span>
                  <span>- Final de frase interrogativa</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-hero p-6 rounded-xl shadow-glow border-2 border-primary">
              <div className="text-6xl mb-4 text-center">✨</div>
              <h3 className="text-2xl font-bold mb-3 text-primary-foreground">Nossa Proposta</h3>
              <div className="text-center py-8">
                <div className="text-5xl font-bold text-primary-foreground mb-4">
                  porque
                </div>
                <p className="text-lg text-primary-foreground/90">
                  Uma única forma para todas as situações!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="container mx-auto px-4 py-16 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Por que isso é importante?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Mais Simples</h3>
              <p className="text-muted-foreground">
                Elimina confusão e facilita o aprendizado da língua
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Mais Rápido</h3>
              <p className="text-muted-foreground">
                Digitar e escrever se tornam mais ágeis e naturais
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Mais Inclusivo</h3>
              <p className="text-muted-foreground">
                Reduz barreiras para quem está aprendendo português
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Junte-se ao Movimento
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Cada assinatura conta para mostrar que o Brasil quer uma língua mais simples e acessível para todos.
          </p>
          <SignButton />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Movimento pela Simplificação do Português - 2025
          </p>
          <p className="text-sm">
            Um projeto para tornar nossa língua mais fácil e unida 🇧🇷
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
