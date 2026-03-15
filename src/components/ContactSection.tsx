import { Mail, MapPin, Globe, MessageSquare, Send, Instagram, Linkedin, Copy, Phone } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
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
    <section id="contacto" className="py-28 bg-surface">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">Fale Comigo</span>
                <span className="h-px w-12 bg-gold/40" />
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-body font-black leading-tight text-foreground">
                Vamos criar algo{" "}
                <span className="font-display italic gold-gradient-text">extraordinário</span>{" "}
                juntos.
              </h2>
              <p className="mt-4 text-muted-foreground font-body leading-relaxed max-w-md">
                Tens uma ideia inovadora? Estou pronta para transformar a tua visão em realidade digital de alto impacto.
              </p>
            </div>

            {/* Email box */}
            <div className="border border-border/50 hover:border-gold/40 p-5 flex items-center justify-between group cursor-pointer transition-all" onClick={copyEmail}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">E-MAIL</div>
                  <div className="text-sm font-body text-foreground">{email}</div>
                </div>
              </div>
              {copied ? <span className="text-xs text-gold font-body">Copiado!</span> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Phone, label: "Telefone", value: phone },
                { icon: MapPin, label: "Localização", value: settings.location || "Luanda, Angola · Disponível Remoto" },
                { icon: Globe, label: "Disponibilidade", value: settings.availability || "Projectos freelance · Full-time remoto" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 border border-border/50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">{item.label}</div>
                    <div className="text-xs text-foreground font-body leading-relaxed">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6 border-t border-border/30">
              {[{ n: "5+", l: "Projectos" }, { n: "100%", l: "Satisfação" }, { n: "24h", l: "Resposta" }].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-black text-gold font-body">{s.n}</div>
                  <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mt-1">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-4">Redes Sociais</div>
              <div className="flex gap-3">
                <a href={settings.linkedin_url || "#"} className="flex items-center gap-2 px-4 py-2 border border-border/50 hover:border-gold/50 hover:text-gold text-muted-foreground text-xs font-body tracking-wide transition-all">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a href={settings.instagram_url || "#"} className="flex items-center gap-2 px-4 py-2 border border-border/50 hover:border-gold/50 hover:text-gold text-muted-foreground text-xs font-body tracking-wide transition-all">
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-background border border-border/50 p-8 space-y-5">
            <div className="mb-6">
              <h3 className="text-xl font-black text-foreground font-body">Enviar Mensagem</h3>
              <p className="text-xs text-muted-foreground font-body mt-1">Responderei em até 24 horas úteis.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-2">Nome</label>
                  <input type="text" placeholder="O seu nome" className="w-full bg-surface border border-border/50 focus:border-gold/60 outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-body transition-colors" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-2">E-mail</label>
                  <input type="email" placeholder="email@exemplo.com" className="w-full bg-surface border border-border/50 focus:border-gold/60 outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-body transition-colors" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-2">Serviço de Interesse</label>
                <select className="w-full bg-surface border border-border/50 focus:border-gold/60 outline-none px-4 py-3 text-sm text-foreground font-body transition-colors appearance-none" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
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
                <textarea rows={5} placeholder="Conte-me sobre o seu projecto..." className="w-full bg-surface border border-border/50 focus:border-gold/60 outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-body transition-colors resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
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
  );
};

export default ContactSection;
