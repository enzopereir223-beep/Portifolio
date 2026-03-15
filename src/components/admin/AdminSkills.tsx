import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Skill = { id: string; name: string; level: number; category: string; is_active: boolean; sort_order: number; };
const empty = (): Omit<Skill, "id"> => ({ name: "", level: 80, category: "Design", is_active: true, sort_order: 0 });

export default function AdminSkills() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Skill | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty());

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: async () => {
      const { data } = await supabase.from("skills").select("*").order("sort_order");
      return (data || []) as Skill[];
    },
  });

  const save = useMutation({
    mutationFn: async (s: typeof form) => {
      if (editing) {
        const { error } = await supabase.from("skills").update(s).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("skills").insert(s);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-skills"] });
      qc.invalidateQueries({ queryKey: ["skills"] });
      toast({ title: editing ? "Competência actualizada!" : "Competência criada!" });
      setEditing(null); setCreating(false); setForm(empty());
    },
    onError: () => toast({ title: "Erro ao guardar", variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-skills"] }); qc.invalidateQueries({ queryKey: ["skills"] }); toast({ title: "Competência eliminada!" }); },
  });

  const startEdit = (s: Skill) => {
    setEditing(s); setCreating(false);
    setForm({ name: s.name, level: s.level, category: s.category, is_active: s.is_active, sort_order: s.sort_order });
  };
  const startCreate = () => { setEditing(null); setCreating(true); setForm(empty()); };
  const cancel = () => { setEditing(null); setCreating(false); setForm(empty()); };

  const FormPanel = () => (
    <div className="bg-surface border border-gold/30 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground font-body">{editing ? "Editar Competência" : "Nova Competência"}</h3>
        <button onClick={cancel}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Nome *</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" placeholder="Figma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Categoria</label>
          <select className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="Design">Design</option>
            <option value="Tools">Tools</option>
            <option value="Research">Research</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Nível: {form.level}%</label>
        <input type="range" min={0} max={100} className="w-full accent-gold" value={form.level} onChange={e => setForm({ ...form, level: +e.target.value })} />
        <div className="flex justify-between text-[10px] text-muted-foreground font-body mt-1">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
        {/* Preview bar */}
        <div className="mt-2 h-1 bg-border/50">
          <div className="h-full bg-gradient-to-r from-gold to-gold-bright transition-all" style={{ width: `${form.level}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Ordem</label>
          <input type="number" className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
        </div>
        <div className="flex items-end pb-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active-sk" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-gold" />
            <label htmlFor="active-sk" className="text-xs text-muted-foreground font-body">Activo</label>
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => save.mutate(form)} disabled={save.isPending} className="flex items-center gap-2 px-5 py-2.5 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all disabled:opacity-50">
          <Save className="w-3.5 h-3.5" /> {save.isPending ? "A guardar..." : "Guardar"}
        </button>
        <button onClick={cancel} className="px-4 py-2.5 border border-border/50 text-xs text-muted-foreground font-body hover:border-gold/40 transition-all">Cancelar</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground font-body">Competências</h2>
          <p className="text-xs text-muted-foreground font-body mt-1">Gerir as competências e habilidades exibidas</p>
        </div>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all">
          <Plus className="w-3.5 h-3.5" /> Nova Competência
        </button>
      </div>

      {(creating || editing) && <FormPanel />}

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((s) => (
            <div key={s.id} className={`bg-surface border p-5 transition-all ${editing?.id === s.id ? "border-gold/40" : "border-border/50 hover:border-gold/20"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-foreground font-body">{s.name}</span>
                    {!s.is_active && <span className="text-[9px] border border-muted-foreground/30 text-muted-foreground px-1.5 py-0.5 font-body uppercase">Inactivo</span>}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-body uppercase tracking-widest">{s.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-gold font-body">{s.level}%</span>
                </div>
              </div>
              <div className="h-0.5 bg-border/50 mb-3">
                <div className="h-full bg-gradient-to-r from-gold to-gold-bright transition-all duration-500" style={{ width: `${s.level}%` }} />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => startEdit(s)} className="p-1.5 hover:bg-surface-elevated transition-colors text-muted-foreground hover:text-gold">
                  <Edit2 className="w-3 h-3" />
                </button>
                <button onClick={() => { if (confirm("Eliminar?")) del.mutate(s.id); }} className="p-1.5 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
