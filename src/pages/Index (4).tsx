import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Search, Smartphone, Award } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Services teaser */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">02 —</span>
            <span className="h-px w-16 bg-gold/40" />
          </div>
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-body font-black text-foreground uppercase tracking-tight" style={{ fontSize: "clamp(2rem,5vw,4rem)" }}>
              SERVIÇOS<br /><span className="gold-gradient-text">ESPECIALIZADOS</span>
            </h2>
            <Link to="/servicos" className="hidden md:flex items-center gap-2 text-xs text-gold hover:text-gold-bright transition-colors font-body uppercase tracking-widest">
              Ver Todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: "UX Research", desc: "Pesquisa profunda de utilizadores para fundamentar cada decisão de design." },
              { icon: Smartphone, title: "UI Design", desc: "Interfaces belas, intuitivas e funcionais para web e mobile." },
              { icon: Layers, title: "Design Systems", desc: "Sistemas de design escaláveis e consistentes para equipas." },
            ].map((s) => (
              <div key={s.title} className="group border border-border/50 hover:border-gold/40 p-6 transition-all">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center mb-4 group-hover:border-gold transition-colors">
                  <s.icon className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-base font-black text-foreground font-body mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 md:hidden text-center">
            <Link to="/servicos" className="inline-flex items-center gap-2 text-xs text-gold font-body uppercase tracking-widest">
              Ver Todos os Serviços <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects section */}
      <ProjectsSection />

      {/* Awards / Testimonial strip */}
      <section className="py-16 bg-surface border-y border-border/30">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { num: "40+", label: "Projectos Entregues" },
              { num: "100%", label: "Clientes Satisfeitos" },
              { num: "3+", label: "Anos de Experiência" },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="text-4xl font-black text-gold glow-text font-body">{s.num}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-body">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact section */}
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
