import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("id", id!).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("id, title, sort_order").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const currentIndex = allProjects.findIndex((p) => p.id === id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-body text-sm">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-foreground font-body mb-4">Projecto não encontrado</h1>
          <Link to="/projectos" className="text-gold hover:text-gold-bright font-body">← Voltar aos Projectos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className={`pt-32 pb-24 relative overflow-hidden bg-gradient-to-br ${project.color} to-background`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.8) 50%, transparent 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px opacity-30" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(185 85% 55% / 0.5) 50%, transparent 100%)" }} />
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(hsl(43 74% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 74% 60%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <Link to="/projectos" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-gold transition-colors font-body uppercase tracking-widest mb-8 group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Todos os Projectos
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[10px] tracking-widest text-gold uppercase border border-gold/40 px-2 py-1 font-body">{project.category}</span>
            <span className="text-[10px] text-muted-foreground font-body">{project.year}</span>
            {project.featured && (
              <span className="flex items-center gap-1 text-[9px] text-gold-bright tracking-widest uppercase font-body">
                <Sparkles className="w-2.5 h-2.5" /> Destaque
              </span>
            )}
          </div>
          <h1 className="font-body font-black text-foreground uppercase tracking-tight mb-4" style={{ fontSize: "clamp(2rem,5vw,4.5rem)" }}>
            {project.title}
          </h1>
          <div className="h-0.5 bg-gradient-to-r from-gold via-gold-bright to-transparent w-0 animate-[expand_1s_0.3s_ease-out_forwards] mb-6" />
          <p className="text-muted-foreground font-body text-lg max-w-2xl leading-relaxed">{project.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              {/* Mockup */}
              <div className={`h-80 bg-gradient-to-br ${project.color} to-background border border-border/50 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(43 74% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 74% 60%) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="text-center relative z-10">
                  <div className="text-5xl mb-3">🎨</div>
                  <div className="text-xs text-muted-foreground font-body uppercase tracking-widest">Mockup — {project.title}</div>
                </div>
              </div>

              {project.challenge && (
                <div className="border-l-2 border-gold/40 pl-6">
                  <h2 className="text-xl font-black text-foreground font-body mb-3">O Desafio</h2>
                  <p className="text-muted-foreground font-body leading-relaxed">{project.challenge}</p>
                </div>
              )}

              {project.solution && (
                <div className="border-l-2 border-gold/20 pl-6">
                  <h2 className="text-xl font-black text-foreground font-body mb-3">A Solução</h2>
                  <p className="text-muted-foreground font-body leading-relaxed">{project.solution}</p>
                </div>
              )}

              {project.results.length > 0 && (
                <div>
                  <h2 className="text-xl font-black text-foreground font-body mb-6">Resultados</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {project.results.map((r, i) => (
                      <div key={i} className="border border-border/50 hover:border-gold/40 p-4 transition-all group">
                        <div className="w-2 h-2 bg-gold mb-3 group-hover:shadow-[0_0_8px_hsl(43_74%_60%_/_0.8)] transition-all" />
                        <p className="text-sm text-foreground font-body">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-surface border border-border/50 p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground font-body uppercase tracking-widest">Detalhes</h3>
                <div className="space-y-3">
                  {[
                    { label: "Cliente", value: project.client },
                    { label: "Ano", value: project.year },
                    { label: "Categoria", value: project.category },
                  ].filter(d => d.value).map((d) => (
                    <div key={d.label}>
                      <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body">{d.label}</div>
                      <div className="text-sm text-foreground font-body mt-0.5">{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {project.tags.length > 0 && (
                <div className="bg-surface border border-border/50 p-6">
                  <h3 className="text-sm font-bold text-foreground font-body uppercase tracking-widest mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span key={t} className="px-3 py-1.5 border border-border/50 text-[10px] text-muted-foreground font-body uppercase tracking-wider hover:border-gold/40 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link to="/contacto" className="flex items-center justify-center gap-3 py-4 bg-gold text-primary-foreground font-body font-semibold text-sm tracking-wide hover:bg-gold-bright transition-all shadow-gold">
                Contratar para Projecto Similar
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-border/30">
            {prevProject ? (
              <Link to={`/projectos/${prevProject.id}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors font-body group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-1">Projecto Anterior</div>
                  <div className="font-semibold">{prevProject.title}</div>
                </div>
              </Link>
            ) : <div />}
            {nextProject ? (
              <Link to={`/projectos/${nextProject.id}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors font-body group text-right">
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-1">Próximo Projecto</div>
                  <div className="font-semibold">{nextProject.title}</div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
