import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, MessageSquare, Copy, Send, Instagram, Linkedin, Globe, Sparkles, Phone, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [sending, setSending] = useState(false);

  const { data: settings = {} } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((s) => { map[s.key] = s.value || ""; });
      return map;
    },
  });

  const email = settings.email || "lucilenepereirr123@gmail.com";
  const phone = settings.phone || "+244 928 861 696";
  const linkedinUrl = settings.linkedin_url || "#";
  const instagramUrl = settings.instagram_url || "#";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name,
        email: form.email,
        service: form.service || null,
        message: form.message,
      });
      if (error) throw error;
      toast({ title: "✓ Mensagem enviada!", description: "Responderei em menos de 24 horas." });
      setForm({ name: "", email: "", service: "", message: "" });
    } catch {
      toast({ title: "Erro ao enviar", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.8) 50%, transparent 100%)" }} />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse-gold" style={{ background: "radial-gradient(circle, hsl(43 74% 60%), transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full opacity-8 animate-pulse-cyan" style={{ background: "radial-gradient(circle, hsl(185 85% 55%), transparent 70%)" }} />
          {/* Diagonal lines decoration */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, hsl(43 74% 60%), hsl(43 74% 60%) 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        </div>

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-3 h-3 text-gold animate-pulse" />
            <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">Contacto</span>
            <span className="h-px flex-1 max-w-xs bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <h1 className="font-body font-black text-foreground uppercase tracking-tight" style={{ fontSize: "clamp(2.5rem,7vw,6rem)", lineHeight: 0.9 }}>
            VAMOS<br />
            <span className="gold-gradient-text">FALAR</span>
          </h1>
          <div className="mt-4 h-0.5 bg-gradient-to-r from-gold via-gold-bright to-transparent animate-[expand_1.2s_0.4s_ease-out_forwards] w-0" />
          <p className="mt-6 text-muted-foreground font-body text-lg max-w-xl leading-relaxed">
            Disponível para projectos freelance, colaborações e consultas. Respondo sempre.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-foreground font-body mb-4">
                  Tens um projecto<br />em mente? <span className="gold-gradient-text italic">Conta-me.</span>
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Estou disponível para projectos freelance, colaborações e consultas. Respondo em menos de 24 horas.
                </p>
              </div>

              {/* Email copy */}
              <div className="border border-border/50 hover:border-gold/40 p-5 flex items-center justify-between group cursor-pointer transition-all" onClick={copyEmail}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center group-hover:border-gold/60 transition-colors">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">E-MAIL</div>
                    <div className="text-sm font-body text-foreground">{email}</div>
                  </div>
                </div>
                {copied ? <span className="text-xs text-gold font-body">Copiado!</span> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />}
              </div>

              {/* Info blocks */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Phone, label: "Telefone", value: phone },
                  { icon: MapPin, label: "Localização", value: settings.location || "Luanda, Angola · Disponível Remoto" },
                  { icon: Globe, label: "Disponibilidade", value: settings.availability || "Projectos freelance · Full-time remoto" },
                  { icon: MessageSquare, label: "WhatsApp", value: settings.whatsapp || phone },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 border border-border/30 hover:border-gold/20 p-4 transition-all">
                    <div className="mt-0.5 w-8 h-8 border border-border/50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">{item.label}</div>
                      <div className="text-xs text-foreground font-body">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div>
                <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-4">Redes Sociais</div>
                <div className="flex gap-3">
                  <a href={linkedinUrl} className="flex items-center gap-2 px-4 py-2 border border-border/50 hover:border-gold/50 hover:text-gold text-muted-foreground text-xs font-body tracking-wide transition-all">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href={instagramUrl} className="flex items-center gap-2 px-4 py-2 border border-border/50 hover:border-gold/50 hover:text-gold text-muted-foreground text-xs font-body tracking-wide transition-all">
                    <Instagram className="w-3.5 h-3.5" /> Instagram
                  </a>
                  <a href="https://github.com/enzopereir223-beep" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-border/50 hover:border-gold/50 hover:text-gold text-muted-foreground text-xs font-body tracking-wide transition-all">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                </div>
              </div>

              <div className="flex gap-8 pt-6 border-t border-border/30">
                {[{ n: "24h", l: "Resposta" }, { n: "100%", l: "Satisfação" }, { n: "Remoto", l: "Disponível" }].map((s) => (
                  <div key={s.l}>
                    <div className="text-2xl font-black text-gold font-body">{s.n}</div>
                    <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-surface border border-border/50 p-8 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 animate-pulse-gold pointer-events-none" style={{ background: "radial-gradient(circle, hsl(43 74% 60%), transparent)" }} />
              <div>
                <h3 className="text-xl font-black text-foreground font-body">Enviar Mensagem</h3>
                <p className="text-xs text-muted-foreground font-body mt-1">Responderei em até 24 horas úteis.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-2">Nome</label>
                    <input type="text" placeholder="O seu nome" className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-body transition-colors" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-2">E-mail</label>
                    <input type="email" placeholder="email@exemplo.com" className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-body transition-colors" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-2">Serviço de Interesse</label>
                  <select className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-4 py-3 text-sm text-foreground font-body transition-colors appearance-none" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                    <option value="" className="bg-background">Seleccionar serviço...</option>
                    <option value="UX Research" className="bg-background">UX Research</option>
                    <option value="UI Design Mobile" className="bg-background">UI Design Mobile</option>
                    <option value="Web UI Design" className="bg-background">Web UI Design</option>
                    <option value="Design Systems" className="bg-background">Design System</option>
                    <option value="Branding" className="bg-background">Branding & Identidade</option>
                    <option value="Auditoria UX" className="bg-background">Auditoria UX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-2">Mensagem</label>
                  <textarea rows={5} placeholder="Conte-me sobre o seu projecto, desafios e objetivos..." className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-body transition-colors resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-primary-foreground font-body font-semibold text-sm tracking-wide hover:bg-gold-bright transition-all disabled:opacity-50">
                  <Send className="w-4 h-4" />
                  {sending ? "A enviar..." : "Enviar Mensagem"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
