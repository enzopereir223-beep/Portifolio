import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Briefcase } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Experience = { id: string; year_range: string; role: string; company: string; description: string; is_active: boolean; sort_order: number; };
const empty = (): Omit<Experience, "id"> => ({ year_range: "", role: "", company: "", description: "", is_active: true, sort_order: 0 });

export default function AdminExperiences() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Experience | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty());

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["admin-experiences"],
    queryFn: async () => {
      const { data } = await supabase.from("experiences").select("*").order("sort_order");
      return (data || []) as Experience[];
    },
  });

  const save = useMutation({
    mutationFn: async (s: typeof form) => {
      if (editing) {
        const { error } = await supabase.from("experiences").update(s).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("experiences").insert(s);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-experiences"] });
      qc.invalidateQueries({ queryKey: ["experiences"] });
      toast({ title: editing ? "Experiência actualizada!" : "Experiência criada!" });
      setEditing(null); setCreating(false); setForm(empty());
    },
    onError: () => toast({ title: "Erro ao guardar", variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-experiences"] }); qc.invalidateQueries({ queryKey: ["experiences"] }); toast({ title: "Eliminada!" }); },
  });

  const startEdit = (s: Experience) => {
    setEditing(s); setCreating(false);
    setForm({ year_range: s.year_range, role: s.role, company: s.company, description: s.description, is_active: s.is_active, sort_order: s.sort_order });
  };
  const cancel = () => { setEditing(null); setCreating(false); setForm(empty()); };

  const FormPanel = () => (
    <div className="bg-surface border border-gold/30 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground font-body">{editing ? "Editar Experiência" : "Nova Experiência"}</h3>
        <button onClick={cancel}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Período *</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" placeholder="2024 – Presente" value={form.year_range} onChange={e => setForm({ ...form, year_range: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Cargo *</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" placeholder="UI/UX Designer Sénior" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Empresa *</label>
        <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" placeholder="Nome da empresa" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
      </div>
      <div>
        <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Descrição *</label>
        <textarea rows={3} className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Ordem</label>
          <input type="number" className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
        </div>
        <div className="flex items-end pb-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active-ex" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-gold" />
            <label htmlFor="active-ex" className="text-xs text-muted-foreground font-body">Activo</label>
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
          <h2 className="text-xl font-black text-foreground font-body">Experiência</h2>
          <p className="text-xs text-muted-foreground font-body mt-1">Gerir a timeline de experiência profissional</p>
        </div>
        <button onClick={() => { setEditing(null); setCreating(true); setForm(empty()); }} className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all">
          <Plus className="w-3.5 h-3.5" /> Nova Experiência
        </button>
      </div>

      {(creating || editing) && <FormPanel />}

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="relative space-y-0">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent pointer-events-none" />
          {experiences.map((s) => (
            <div key={s.id} className="relative pl-16 pb-6">
              <div className="absolute left-4 top-1.5 w-4 h-4 border-2 border-gold bg-background" />
              <div className={`border p-5 transition-all ${editing?.id === s.id ? "border-gold/40 bg-gold/5" : "border-border/50 hover:border-gold/20 bg-surface"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] text-gold tracking-widest uppercase font-body mb-1">{s.year_range}</div>
                    <div className="text-sm font-black text-foreground font-body">{s.role}</div>
                    <div className="text-xs text-gold-dim font-body">{s.company}</div>
                    <p className="text-xs text-muted-foreground font-body mt-2 leading-relaxed">{s.description}</p>
                    {!s.is_active && <span className="text-[9px] border border-muted-foreground/30 text-muted-foreground px-1.5 py-0.5 font-body uppercase mt-2 inline-block">Inactivo</span>}
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button onClick={() => startEdit(s)} className="p-2 hover:bg-surface-elevated transition-colors text-muted-foreground hover:text-gold">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { if (confirm("Eliminar?")) del.mutate(s.id); }} className="p-2 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
