import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Shield, Lock, Mail } from "lucide-react";

interface AdminLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

const AdminLogin = ({ onSuccess, onClose }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Credenciais inválidas. Verifique o e-mail e a senha.");
      } else if (data.session) {
        onSuccess();
      }
    } catch {
      setError("Erro de ligação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 50%, hsl(43 74% 60% / 0.12), transparent 60%), radial-gradient(ellipse 40% 40% at 70% 60%, hsl(185 85% 55% / 0.08), transparent 55%), hsl(0 0% 4%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 0% / 0.02) 2px, hsl(0 0% 0% / 0.02) 4px)",
        }}
      />

      {/* Top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(43 74% 60% / 0.8) 50%, transparent 100%)",
          boxShadow: "0 0 20px hsl(43 74% 60% / 0.5)",
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-xs text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase font-body"
      >
        ← Voltar ao Site
      </button>

      {/* Login card */}
      <div className="relative w-full max-w-md mx-6">
        {/* Corner accents */}
        <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-gold/40 pointer-events-none" />
        <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-gold/20 pointer-events-none" />

        <div className="bg-surface border border-border/50 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold/10 border border-gold/40 flex items-center justify-center">
                <Shield className="w-5 h-5 text-gold" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-foreground font-body tracking-tight">
              PAINEL <span className="gold-gradient-text">ADMIN</span>
            </h1>
            <p className="text-xs text-muted-foreground font-body tracking-widest uppercase">
              Acesso Restrito — Introduza as suas credenciais
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemplo.com"
                  className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-body transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body">
                Palavra-Passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none pl-10 pr-12 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-body transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive font-body">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-primary-foreground font-body font-semibold text-sm tracking-wide hover:bg-gold-bright transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Entrar no Painel
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground font-body tracking-widest uppercase">
              Acesso via <span className="text-gold">Shift + Ctrl + A</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
