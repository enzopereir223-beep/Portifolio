import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles, Grid3X3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProjectsPage = () => {
  const [active, setActive] = useState("Todos");

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const categories = ["Todos", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = active === "Todos" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — dramatic */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(hsl(43 74% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 74% 60%) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] rounded-full opacity-10 animate-pulse-gold" style={{ background: "radial-gradient(ellipse, hsl(43 74% 60%), transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-8 animate-pulse-cyan" style={{ background: "radial-gradient(circle, hsl(185 85% 55%), transparent 70%)" }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.8) 50%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(185 85% 55% / 0.3) 50%, transparent 100%)" }} />

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Grid3X3 className="w-3 h-3 text-gold" />
            <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">Portfolio</span>
            <span className="h-px flex-1 max-w-xs bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <h1 className="font-body font-black text-foreground uppercase tracking-tight" style={{ fontSize: "clamp(2.5rem,7vw,6rem)", lineHeight: 0.9 }}>
            MEUS<br />
            <span className="gold-gradient-text">PROJECTOS</span>
          </h1>
          <div className="mt-4 h-0.5 bg-gradient-to-r from-gold via-gold-bright to-transparent animate-[expand_1.2s_0.4s_ease-out_forwards] w-0" />
          <p className="mt-6 text-muted-foreground font-body text-lg max-w-xl leading-relaxed">
            Uma selecção dos meus trabalhos de UI/UX mais impactantes — cada projecto conta uma história de problema resolvido.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { num: projects.length, label: "Projectos" },
              { num: projects.filter(p => p.featured).length, label: "Em Destaque" },
              { num: categories.length - 1, label: "Categorias" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-xl font-black text-gold font-body">{s.num}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-body">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-body border transition-all ${
                  active === f ? "border-gold bg-gold text-primary-foreground" : "border-border/50 text-muted-foreground hover:border-gold/50 hover:text-gold"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <Link
                key={project.id}
                to={`/projectos/${project.id}`}
                className={`group relative overflow-hidden border border-border/50 hover:border-gold/40 transition-all duration-500 bg-gradient-to-br ${project.color} to-background`}
              >
                <div className="p-8 h-64 flex flex-col justify-between relative">
                  {/* Hover overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, hsl(43 74% 60% / 0.08), transparent 70%)" }} />
                  {/* Number */}
                  <div className="absolute top-4 right-4 text-[10px] text-muted-foreground/20 font-black font-body">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] tracking-widest text-gold uppercase border border-gold/40 px-2 py-1 font-body">{project.category}</span>
                      <span className="text-[10px] text-muted-foreground font-body">{project.year}</span>
                    </div>
                    {project.featured && (
                      <div className="text-[9px] text-gold-bright tracking-widest uppercase mb-2 font-body flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Destaque
                      </div>
                    )}
                    <h3 className="text-xl font-black text-foreground font-body mb-2 group-hover:text-gold transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gold group-hover:gap-4 transition-all">
                    <span className="font-body">Ver Projecto</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
