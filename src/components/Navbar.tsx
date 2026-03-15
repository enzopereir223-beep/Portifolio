import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Sobre", href: "/sobre" },
    { label: "Serviços", href: "/servicos" },
    { label: "Projectos", href: "/projectos" },
    { label: "Contacto", href: "/contacto" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 border border-gold rotate-45 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
            <div className="w-2 h-2 bg-gold rotate-45" />
          </div>
          <span className="font-body font-bold text-sm tracking-wider text-foreground">
            LUCILENE <span className="text-gold">PEREIRA</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`text-xs tracking-widest uppercase font-body transition-colors ${
                isActive(l.href) ? "text-gold" : "text-muted-foreground hover:text-gold"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/contacto"
            className="px-5 py-2 border border-gold/60 text-gold text-xs tracking-widest uppercase font-body hover:bg-gold hover:text-primary-foreground transition-all"
          >
            Trabalhe Comigo
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur border-t border-border/30 px-6 py-6 space-y-4">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`block text-sm tracking-widest uppercase font-body py-2 border-b border-border/30 transition-colors ${
                isActive(l.href) ? "text-gold" : "text-muted-foreground hover:text-gold"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contacto"
            className="block w-full mt-4 px-5 py-3 border border-gold/60 text-gold text-xs tracking-widest uppercase font-body hover:bg-gold hover:text-primary-foreground transition-all text-center"
            onClick={() => setMobileOpen(false)}
          >
            Trabalhe Comigo
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
