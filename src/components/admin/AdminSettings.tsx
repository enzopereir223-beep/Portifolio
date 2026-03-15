import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SETTING_KEYS = [
  { key: "email", label: "Email de Contacto", type: "email", group: "Contacto" },
  { key: "phone", label: "Telefone", type: "text", group: "Contacto" },
  { key: "whatsapp", label: "WhatsApp", type: "text", group: "Contacto" },
  { key: "location", label: "Localização", type: "text", group: "Contacto" },
  { key: "availability", label: "Disponibilidade", type: "text", group: "Contacto" },
  { key: "linkedin_url", label: "URL LinkedIn", type: "url", group: "Redes Sociais" },
  { key: "instagram_url", label: "URL Instagram", type: "url", group: "Redes Sociais" },
  { key: "behance_url", label: "URL Behance", type: "url", group: "Redes Sociais" },
  { key: "hero_bio", label: "Bio do Hero", type: "textarea", group: "Conteúdo" },
];

export default function AdminSettings() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingGroup, setSavingGroup] = useState<string | null>(null);

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    const map: Record<string, string> = {};
    settings.forEach((s: any) => { map[s.key] = s.value || ""; });
    setValues(map);
  }, [settings]);

  const upsertSetting = async (key: string, value: string) => {
    // Try update first, if no rows affected do insert
    const { data: existing } = await supabase.from("settings").select("id").eq("key", key).maybeSingle();
    if (existing) {
      const { error } = await supabase.from("settings").update({ value }).eq("key", key);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("settings").insert({ key, value });
      if (error) throw error;
    }
  };

  const saveGroup = async (group: string) => {
    setSavingGroup(group);
    try {
      const groupKeys = SETTING_KEYS.filter(s => s.group === group).map(s => s.key);
      await Promise.all(groupKeys.map(key => upsertSetting(key, values[key] || "")));
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      toast({ title: `✓ ${group} guardado com sucesso!` });
    } catch {
      toast({ title: "Erro ao guardar. Tente novamente.", variant: "destructive" });
    } finally {
      setSavingGroup(null);
    }
  };

  const saveAll = async () => {
    setSavingGroup("all");
    try {
      await Promise.all(SETTING_KEYS.map(({ key }) => upsertSetting(key, values[key] || "")));
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      toast({ title: "✓ Todas as configurações guardadas!" });
    } catch {
      toast({ title: "Erro ao guardar", variant: "destructive" });
    } finally {
      setSavingGroup(null);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "A senha deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "✓ Senha actualizada com sucesso!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: `Erro: ${err.message}`, variant: "destructive" });
    }
  };

  const groups = Array.from(new Set(SETTING_KEYS.map(s => s.group)));

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground font-body">Configurações</h2>
          <p className="text-xs text-muted-foreground font-body mt-1">Gerir informações de contacto, redes sociais e segurança</p>
        </div>
        <button
          onClick={saveAll}
          disabled={savingGroup === "all"}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all disabled:opacity-50"
        >
          {savingGroup === "all" ? (
            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> A guardar...</>
          ) : (
            <><Save className="w-3.5 h-3.5" /> Guardar Tudo</>
          )}
        </button>
      </div>

      {groups.map(group => (
        <div key={group} className="bg-surface border border-border/50 p-6 space-y-4">
          <h3 className="text-xs font-bold text-gold uppercase tracking-widest font-body border-b border-border/30 pb-3">{group}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {SETTING_KEYS.filter(s => s.group === group).map(({ key, label, type }) => (
              <div key={key} className={type === "textarea" ? "md:col-span-2" : ""}>
                <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    rows={3}
                    className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none"
                    value={values[key] || ""}
                    onChange={e => setValues({ ...values, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    type={type}
                    className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground"
                    value={values[key] || ""}
                    onChange={e => setValues({ ...values, [key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="pt-2">
            <button
              onClick={() => saveGroup(group)}
              disabled={savingGroup === group}
              className="flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold text-xs font-body hover:bg-gold hover:text-primary-foreground transition-all disabled:opacity-50"
            >
              {savingGroup === group ? (
                <><RefreshCw className="w-3 h-3 animate-spin" /> A guardar...</>
              ) : (
                <><Save className="w-3 h-3" /> Guardar {group}</>
              )}
            </button>
          </div>
        </div>
      ))}

      {/* Password change */}
      <div className="bg-surface border border-border/50 p-6 space-y-4">
        <h3 className="text-xs font-bold text-gold uppercase tracking-widest font-body border-b border-border/30 pb-3">Segurança</h3>
        <p className="text-xs text-muted-foreground font-body">Altere a senha da sua conta de acesso ao painel.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Nova Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 pr-10 text-sm font-body text-foreground"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Confirmar Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repetir senha"
            />
          </div>
        </div>
        <button
          onClick={changePassword}
          disabled={!newPassword || !confirmPassword}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" /> Alterar Senha
        </button>
      </div>
    </div>
  );
}
