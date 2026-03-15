import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Layers, Search, Smartphone, Monitor, Palette, BarChart3, Sparkles, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search, Smartphone, Monitor, Layers, Palette, BarChart3, Zap, Sparkles,
};

const ServicesPage = () => {
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — animated */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full opacity-10 animate-pulse-gold" style={{ background: "radial-gradient(circle, hsl(43 74% 60%), transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full opacity-8 animate-pulse-cyan" style={{ background: "radial-gradient(circle, hsl(185 85% 55%), transparent 70%)" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(43 74% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 74% 60%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.8) 50%, transparent 100%)" }} />

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-3 h-3 text-gold animate-pulse" />
            <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">Serviços</span>
            <span className="h-px flex-1 max-w-xs bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <h1 className="font-body font-black text-foreground uppercase tracking-tight animate-fade-up" style={{ fontSize: "clamp(2.5rem,7vw,6rem)", lineHeight: 0.9 }}>
            O QUE<br />
            <span className="gold-gradient-text">OFEREÇO</span>
          </h1>
          <div className="mt-4 h-0.5 bg-gradient-to-r from-gold via-gold-bright to-transparent animate-[expand_1.2s_0.4s_ease-out_forwards] w-0" />
          <p className="mt-6 text-muted-foreground font-body text-lg max-w-xl leading-relaxed animate-fade-up delay-300">
            Serviços de design completos para transformar as suas ideias em experiências digitais de alto impacto.
          </p>

          {/* Service count badge */}
          <div className="mt-8 inline-flex items-center gap-3 border border-gold/30 bg-gold/5 px-6 py-3 animate-fade-up delay-400">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-xs text-gold font-body tracking-widest uppercase">{services.length} Serviços Disponíveis</span>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = iconMap[s.icon_name] || Layers;
              return (
                <div
                  key={s.id}
                  className="group border border-border/50 hover:border-gold/40 p-8 transition-all duration-500 bg-surface hover:bg-surface-elevated relative overflow-hidden"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 30%, hsl(43 74% 60% / 0.06), transparent 60%)" }} />
                  {/* Number */}
                  <div className="absolute top-4 right-4 text-[10px] text-muted-foreground/30 font-black font-body">{String(i + 1).padStart(2, '0')}</div>
                  <div className="w-12 h-12 border border-gold/30 group-hover:border-gold/60 flex items-center justify-center mb-6 transition-colors relative">
                    <Icon className="w-5 h-5 text-gold" />
                    <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-foreground font-body mb-3 group-hover:text-gold transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-5">{s.description}</p>
                  <ul className="space-y-1.5 mb-6">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                        <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="text-xs text-gold font-body font-semibold">{s.price}</span>
                    <Link to="/contacto" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors font-body group-hover:text-gold">
                      Contratar <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-5 animate-pulse-gold" style={{ background: "radial-gradient(circle, hsl(43 74% 60%), transparent 70%)" }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.4) 50%, transparent 100%)" }} />
        <div className="container mx-auto px-6 lg:px-16 text-center relative z-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-xs tracking-[0.3em] text-gold uppercase font-body">Trabalhe Comigo</div>
            <h2 className="text-4xl font-black text-foreground font-body">
              Pronta para o seu <span className="gold-gradient-text">próximo projecto?</span>
            </h2>
            <p className="text-muted-foreground font-body">Vamos conversar sobre como posso ajudar a transformar a sua visão em realidade.</p>
            <Link to="/contacto" className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-primary-foreground font-body font-semibold text-sm tracking-wide hover:bg-gold-bright transition-all shadow-gold">
              Iniciar Projecto <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
