import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProjectsSection = () => {
  const [active, setActive] = useState("Todos");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data || [];
    },
  });

  const categories = ["Todos", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = active === "Todos" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projectos" className="py-28 bg-background">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">03 —</span>
            <span className="h-px w-16 bg-gold/40" />
          </div>
          <h2 className="font-body font-black leading-tight text-foreground uppercase tracking-tight" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
            PROJECTOS EM<br />
            <span className="gold-gradient-text">DESTAQUE</span>
          </h2>
          <div className="mt-4 h-px w-16 bg-gold/60" />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 text-xs tracking-widest uppercase font-body border transition-all ${
                active === f
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-border/50 text-muted-foreground hover:border-gold/50 hover:text-gold"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project, i) => (
              <Link
                key={project.id}
                to={`/projectos/${project.id}`}
                className={`group relative overflow-hidden border border-border/50 hover:border-gold/40 transition-all duration-500 cursor-pointer bg-gradient-to-br ${project.color} to-background`}
              >
                <div className="p-8 h-64 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] tracking-widest text-gold uppercase border border-gold/40 px-2 py-1 font-body">
                        {project.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-body">{project.year}</span>
                    </div>
                    {project.featured && (
                      <div className="text-[9px] text-gold-bright tracking-widest uppercase mb-2 font-body flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Destaque
                      </div>
                    )}
                    <h3 className="text-xl font-black text-foreground font-body mb-2 group-hover:text-gold transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-gold transition-colors font-body">
                    <span>Ver Projecto</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 50%, hsl(43 74% 60% / 0.05), transparent 70%)" }}
                />
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/projectos"
            className="inline-flex items-center gap-3 bg-surface border border-border/50 hover:border-gold/40 px-8 py-4 transition-all group"
          >
            <span className="text-sm font-body text-muted-foreground group-hover:text-gold transition-colors tracking-wide">
              Ver Todos os Projectos
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
