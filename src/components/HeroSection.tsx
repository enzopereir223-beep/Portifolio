import { useEffect, useRef, useState } from "react";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import lucilenePortrait from "@/assets/lucilene-portrait.jpg";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    // Particles
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number; phase: number;
    }> = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 0.3,
        opacity: Math.random() * 0.7 + 0.1,
        hue: Math.random() > 0.5 ? 43 : 185,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Orbs for dramatic aurora
    const orbs = [
      { x: 0.15, y: 0.45, r: 0.38, hue: 43, sat: 74, lit: 60, alpha: 0.18, speed: 0.0008 },
      { x: 0.78, y: 0.25, r: 0.30, hue: 185, sat: 85, lit: 55, alpha: 0.14, speed: 0.0011 },
      { x: 0.5, y: 0.8, r: 0.25, hue: 30, sat: 90, lit: 65, alpha: 0.10, speed: 0.0006 },
    ];

    let t = 0;
    let animId: number;

    const animate = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw aurora orbs
      orbs.forEach((orb, i) => {
        const ox = orb.x + Math.sin(t * orb.speed + i * 2) * 0.08;
        const oy = orb.y + Math.cos(t * orb.speed * 1.3 + i) * 0.06;
        const cx = ox * canvas.width;
        const cy = oy * canvas.height;
        const radius = orb.r * Math.min(canvas.width, canvas.height);
        const pulse = 1 + Math.sin(t * orb.speed * 3) * 0.1;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * pulse);
        grad.addColorStop(0, `hsla(${orb.hue}, ${orb.sat}%, ${orb.lit}%, ${orb.alpha * 2})`);
        grad.addColorStop(0.4, `hsla(${orb.hue}, ${orb.sat}%, ${orb.lit}%, ${orb.alpha})`);
        grad.addColorStop(1, `hsla(${orb.hue}, ${orb.sat}%, ${orb.lit}%, 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Mouse repulsion + draw particles
      const mx = mousePosRef.current.x * canvas.width;
      const my = mousePosRef.current.y * canvas.height;

      particles.forEach((p) => {
        // Mouse attraction/repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.08;
          p.vy += (dy / dist) * force * 0.08;
        }

        // Dampen
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const breathe = p.size * (1 + Math.sin(p.phase) * 0.3);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, breathe * 4);
        glow.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.opacity})`);
        glow.addColorStop(1, `hsla(${p.hue}, 80%, 65%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, breathe * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, breathe, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            const alpha = 0.08 * (1 - d / 100);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(43, 74%, 60%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Light streaks
      if (t % 180 === 0) {
        const sx = Math.random() * canvas.width;
        const sy = 0;
        const streak = ctx.createLinearGradient(sx, sy, sx + 200, sy + canvas.height);
        streak.addColorStop(0, "hsla(43, 90%, 75%, 0)");
        streak.addColorStop(0.5, "hsla(43, 90%, 75%, 0.08)");
        streak.addColorStop(1, "hsla(43, 90%, 75%, 0)");
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx + 200, canvas.height);
        ctx.strokeStyle = streak;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: (e.clientX - rect.left) / canvas.width,
        y: (e.clientY - rect.top) / canvas.height,
      };
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden hero-bg flex items-center">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 0% / 0.015) 2px, hsl(0 0% 0% / 0.015) 4px)",
          zIndex: 2,
        }}
      />

      {/* Gold top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.8) 50%, transparent 100%)",
          boxShadow: "0 0 20px hsl(43 74% 60% / 0.5)",
          zIndex: 3,
        }}
      />

      <div className="container relative mx-auto px-6 lg:px-16 pt-28 pb-20" style={{ zIndex: 10 }}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Label */}
            <div className="opacity-0 animate-fade-up delay-100 flex items-center gap-3">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-xs tracking-[0.3em] text-gold font-body uppercase">UI / UX Designer</span>
              <span className="h-px w-12 bg-gold/40" />
            </div>

            {/* Name */}
            <div className="opacity-0 animate-fade-up delay-200">
              <h1 className="font-body font-black leading-[0.88] tracking-tight text-foreground"
                style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}>
                LUCILENE<br />
                <span className="gold-gradient-text">PEREIRA</span>
              </h1>
              {/* Animated underline */}
              <div className="mt-3 h-0.5 bg-gradient-to-r from-gold via-gold-bright to-transparent w-0 animate-[expand_1s_0.8s_ease-out_forwards]" />
            </div>

            {/* Bio */}
            <div className="opacity-0 animate-fade-up delay-300">
              <div className="border-l-2 border-gold/60 pl-4">
                <p className="text-muted-foreground font-body text-base lg:text-lg leading-relaxed max-w-md">
                  Criando experiências digitais memoráveis com foco em usabilidade, estética e impacto real. Design que inspira e converte.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="opacity-0 animate-fade-up delay-400 flex flex-wrap gap-4">
              <a href="#projectos" className="group flex items-center gap-3 px-8 py-4 bg-gold text-primary-foreground font-body font-semibold text-sm tracking-wide transition-all hover:bg-gold-bright shadow-gold">
                Ver Projectos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contacto" className="flex items-center gap-3 px-8 py-4 border border-foreground/30 text-foreground font-body font-semibold text-sm tracking-wide hover:border-gold hover:text-gold transition-all">
                Contactar
              </a>
            </div>

            {/* Stats */}
            <div className="opacity-0 animate-fade-up delay-500 flex gap-8 pt-4 border-t border-border/50">
              {[
                { num: "3+", label: "Anos de Prática" },
                { num: "40+", label: "Projectos" },
                { num: "15+", label: "Clientes" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-gold glow-text font-body">{s.num}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-body">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo */}
          <div className="relative opacity-0 animate-fade-up delay-300">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Corner decorations */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border border-gold/30 pointer-events-none animate-pulse-gold" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-gold/20 pointer-events-none animate-pulse-cyan" />

              {/* Floating tech badges */}
              <div
                className="absolute -left-6 top-1/3 bg-background/90 backdrop-blur border border-gold/30 px-3 py-2 hidden lg:block animate-float"
                style={{ zIndex: 20 }}
              >
                <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Especialidade</div>
                <div className="text-xs font-bold text-gold font-body">UX Research</div>
              </div>
              <div
                className="absolute -right-6 bottom-1/3 bg-background/90 backdrop-blur border border-border px-3 py-2 hidden lg:block animate-float"
                style={{ animationDelay: "1s", zIndex: 20 }}
              >
                <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Stack</div>
                <div className="text-xs font-bold text-foreground font-body">Figma · Framer</div>
              </div>

              {/* Photo */}
              <div className="relative overflow-hidden shadow-gold">
                {/* Gold glow overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, hsl(43 74% 60% / 0.12) 0%, transparent 50%, hsl(185 85% 55% / 0.08) 100%)",
                    zIndex: 5,
                  }}
                />
                <img
                  src={lucilenePortrait}
                  alt="Lucilene Pereira — UI/UX Designer"
                  className="w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                  style={{ aspectRatio: "3/4", maxHeight: "580px" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, hsl(0 0% 4% / 0.6) 0%, transparent 40%)",
                    zIndex: 4,
                  }}
                />
              </div>

              {/* Location badge */}
              <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur border border-border px-4 py-3" style={{ zIndex: 20 }}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-gold" />
                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Localização</div>
                    <div className="text-xs font-semibold text-foreground font-body">Angola</div>
                  </div>
                </div>
              </div>

              {/* Available badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-background/90 backdrop-blur border border-gold/30 px-4 py-2" style={{ zIndex: 20 }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gold tracking-wide font-medium font-body">Disponível</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase font-body">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-border/30 bg-background/40 backdrop-blur py-3" style={{ zIndex: 10 }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-8 mx-8 text-xs tracking-[0.3em] text-muted-foreground uppercase font-body">
              <span className="text-gold">✦</span> UI Design
              <span className="text-gold">✦</span> UX Research
              <span className="text-gold">✦</span> Prototyping
              <span className="text-gold">✦</span> Design Systems
              <span className="text-gold">✦</span> Figma Expert
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
