import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/30 py-16">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-gold rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gold rotate-45" />
              </div>
              <span className="font-body font-bold text-sm tracking-wider text-foreground">
                LUCILENE <span className="text-gold">PEREIRA</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-xs">
              UI/UX Designer criando experiências digitais que inspiram e convertem.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-4">Navegação</div>
            <div className="space-y-2">
              {[
                { label: "Sobre Mim", href: "/sobre" },
                { label: "Serviços", href: "/servicos" },
                { label: "Projectos", href: "/projectos" },
                { label: "Contacto", href: "/contacto" },
              ].map(({ label, href }) => (
                <Link key={label} to={href} className="block text-sm text-muted-foreground hover:text-gold transition-colors font-body">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-4">Contacto</div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground font-body">lucilene.designer@gmail.com</p>
              <p className="text-sm text-muted-foreground font-body">Luanda, Angola</p>
            </div>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-8 h-8 border border-border/50 hover:border-gold/50 flex items-center justify-center text-muted-foreground hover:text-gold transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-body">
            © 2026 Lucilene Pereira. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {["Política de Privacidade", "Termos"].map((l) => (
              <a key={l} href="#" className="text-[10px] tracking-widest text-muted-foreground hover:text-gold transition-colors uppercase font-body">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
