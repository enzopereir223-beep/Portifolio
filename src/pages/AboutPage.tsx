import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import lucilenePortrait from "@/assets/lucilene-portrait.jpg";
import { Award, Briefcase, Download, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const tools = ["Figma", "Visily", "HTML", "CSS", "Tailwind", "JavaScript", "React", "Next.js", "PHP", "MySQL", "GitHub"];

const SkillBar = ({ name, level }: { name: string; level: number }) => {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && barRef.current) barRef.current.style.width = `${level}%`; },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [level]);
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs font-body text-foreground tracking-wide">{name}</span>
        <span className="text-xs text-gold font-body">{level}%</span>
      </div>
      <div className="h-0.5 bg-border/50 overflow-hidden">
        <div ref={barRef} className="h-full bg-gradient-to-r from-gold to-gold-bright transition-all duration-1000 ease-out" style={{ width: "0%" }} />
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await supabase.from("skills").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const { data: experiences = [] } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data } = await supabase.from("experiences").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — animated */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        {/* Animated bg orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 animate-pulse-gold" style={{ background: "radial-gradient(circle, hsl(43 74% 60%), transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 animate-pulse-cyan" style={{ background: "radial-gradient(circle, hsl(185 85% 55%), transparent 70%)" }} />
        </div>
        {/* Top line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.8) 50%, transparent 100%)" }} />
        {/* Vertical line left */}
        <div className="absolute left-0 top-32 bottom-0 w-px opacity-20" style={{ background: "linear-gradient(180deg, hsl(43 74% 60%), transparent)" }} />

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-3 h-3 text-gold animate-pulse" />
            <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">Sobre Mim</span>
            <span className="h-px flex-1 max-w-xs bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-body font-black text-foreground uppercase tracking-tight animate-fade-up" style={{ fontSize: "clamp(2.5rem,7vw,6rem)", lineHeight: 0.9 }}>
              CONHEÇA A<br />
              <span className="gold-gradient-text">LUCILENE</span>
            </h1>
          </div>
          {/* Animated underline */}
          <div className="mt-4 h-0.5 bg-gradient-to-r from-gold via-gold-bright to-transparent animate-[expand_1.2s_0.4s_ease-out_forwards] w-0" />
          <p className="mt-6 text-muted-foreground font-body text-lg max-w-xl leading-relaxed animate-fade-up delay-300">
            UI/UX Designer apaixonada por criar experiências digitais que combinam beleza, funcionalidade e propósito real.
          </p>

          {/* Floating stat badges */}
          <div className="flex flex-wrap gap-4 mt-8 animate-fade-up delay-400">
            {[
              { num: "1+", label: "Anos" },
              { num: "5+", label: "Projectos" },
              { num: "100%", label: "Satisfação" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 border border-gold/20 bg-gold/5 px-5 py-3 backdrop-blur">
                <span className="text-2xl font-black text-gold font-body glow-text">{s.num}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-body">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio + Photo */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-32 h-32 border border-gold/20 pointer-events-none animate-pulse-gold" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold/10 pointer-events-none animate-pulse-cyan" />
              {/* Glow behind */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(43 74% 60% / 0.15), transparent 70%)" }} />
              <div className="overflow-hidden shadow-gold relative">
                <img src={lucilenePortrait} alt="Lucilene Pereira" className="w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700" style={{ maxHeight: "520px" }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(0 0% 4% / 0.5) 0%, transparent 40%)" }} />
              </div>
              <div className="absolute -right-4 top-12 bg-background/95 border border-gold/30 px-4 py-3 hidden lg:block backdrop-blur">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold" />
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Reconhecimento</div>
                    <div className="text-xs font-bold text-foreground font-body">UI/UX Designer</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-foreground font-body mb-4">
                  Design que <span className="gold-gradient-text italic">transforma</span> vidas
                </h2>
                <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
                  <p>Sou Lucilene Pereira, designer UI/UX apaixonada por criar experiências digitais que combinam beleza e funcionalidade. Baseada em Angola, trabalho com clientes em todo o mundo para transformar ideias em produtos digitais memoráveis.</p>
                  <p>A minha abordagem começa sempre com pesquisa profunda do utilizador. Acredito que o melhor design é invisível — aquele que o utilizador simplesmente "entende" sem pensar.</p>
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-4">Ferramentas</div>
                <div className="flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <span key={t} className="px-3 py-1.5 border border-border/50 hover:border-gold/50 text-xs text-muted-foreground hover:text-gold transition-all font-body cursor-default">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <a href="#" className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-primary-foreground font-body font-semibold text-sm tracking-wide hover:bg-gold-bright transition-all">
                <Download className="w-4 h-4" />
                Descarregar CV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-surface relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.4) 50%, transparent 100%)" }} />
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">Competências</span>
            <span className="h-px w-16 bg-gold/40" />
          </div>
          <h2 className="text-2xl font-black text-foreground font-body mb-10">Minhas <span className="gold-gradient-text">Habilidades</span></h2>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((s) => <SkillBar key={s.id} name={s.name} level={s.level} />)}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-4 mb-3">
            <Briefcase className="w-4 h-4 text-gold" />
            <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">Experiência</span>
            <span className="h-px w-16 bg-gold/40" />
          </div>
          <h2 className="text-2xl font-black text-foreground font-body mb-10">Minha <span className="gold-gradient-text">Trajectória</span></h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent" />
            {experiences.map((item, i) => (
              <div key={item.id} className="relative pl-16 pb-12 last:pb-0 group">
                <div className="absolute left-4 top-1.5 w-4 h-4 border-2 border-gold bg-background group-hover:bg-gold transition-colors duration-300" />
                <div className="absolute left-3 top-0.5 w-6 h-6 border border-gold/20 group-hover:border-gold/60 transition-colors duration-300" style={{ animationDelay: `${i * 0.1}s` }} />
                <div className="text-[10px] text-gold tracking-widest uppercase font-body mb-1">{item.year_range}</div>
                <h3 className="text-lg font-black text-foreground font-body group-hover:text-gold transition-colors duration-300">{item.role}</h3>
                <div className="text-sm text-gold-dim font-body mb-2">{item.company}</div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
