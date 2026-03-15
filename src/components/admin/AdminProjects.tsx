import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Project = { id: string; title: string; category: string; year: string; client: string | null; description: string; challenge: string | null; solution: string | null; results: string[]; tags: string[]; color: string; featured: boolean; is_active: boolean; sort_order: number; };
const empty = (): Omit<Project, "id"> => ({ title: "", category: "Web App", year: "2024", client: "", description: "", challenge: "", solution: "", results: [], tags: [], color: "from-yellow-900/40", featured: false, is_active: true, sort_order: 0 });

export default function AdminProjects() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty());
  const [resultsText, setResultsText] = useState("");
  const [tagsText, setTagsText] = useState("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      return (data || []) as Project[];
    },
  });

  const save = useMutation({
    mutationFn: async (s: typeof form) => {
      const payload = { ...s, results: resultsText.split("\n").map(i => i.trim()).filter(Boolean), tags: tagsText.split(",").map(i => i.trim()).filter(Boolean) };
      if (editing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: editing ? "Projecto actualizado!" : "Projecto criado!" });
      setEditing(null); setCreating(false); setForm(empty()); setResultsText(""); setTagsText("");
    },
    onError: () => toast({ title: "Erro ao guardar", variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("projects").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); qc.invalidateQueries({ queryKey: ["projects"] }); toast({ title: "Projecto eliminado!" }); },
  });

  const startEdit = (s: Project) => {
    setEditing(s); setCreating(false);
    setForm({ title: s.title, category: s.category, year: s.year, client: s.client || "", description: s.description, challenge: s.challenge || "", solution: s.solution || "", results: s.results, tags: s.tags, color: s.color, featured: s.featured, is_active: s.is_active, sort_order: s.sort_order });
    setResultsText(s.results.join("\n")); setTagsText(s.tags.join(", "));
  };
  const cancel = () => { setEditing(null); setCreating(false); setForm(empty()); setResultsText(""); setTagsText(""); };

  const FormPanel = () => (
    <div className="bg-surface border border-gold/30 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground font-body">{editing ? "Editar Projecto" : "Novo Projecto"}</h3>
        <button onClick={cancel}><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Título *</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Categoria</label>
          <select className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option>Mobile</option><option>Web App</option><option>Branding</option><option>UX Research</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Ano</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Cliente</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.client || ""} onChange={e => setForm({ ...form, client: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Ordem</label>
          <input type="number" className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Descrição *</label>
        <textarea rows={2} className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Desafio</label>
          <textarea rows={3} className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none" value={form.challenge || ""} onChange={e => setForm({ ...form, challenge: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Solução</label>
          <textarea rows={3} className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none" value={form.solution || ""} onChange={e => setForm({ ...form, solution: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Resultados (um por linha)</label>
          <textarea rows={3} className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none" value={resultsText} onChange={e => setResultsText(e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Tags (separadas por vírgula)</label>
          <textarea rows={3} className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none" value={tagsText} onChange={e => setTagsText(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="feat-p" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-gold" />
          <label htmlFor="feat-p" className="text-xs text-muted-foreground font-body">Em Destaque</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active-p" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-gold" />
          <label htmlFor="active-p" className="text-xs text-muted-foreground font-body">Activo</label>
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
          <h2 className="text-xl font-black text-foreground font-body">Projectos</h2>
          <p className="text-xs text-muted-foreground font-body mt-1">Gerir o portfolio de projectos</p>
        </div>
        <button onClick={() => { setEditing(null); setCreating(true); setForm(empty()); setResultsText(""); setTagsText(""); }} className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all">
          <Plus className="w-3.5 h-3.5" /> Novo Projecto
        </button>
      </div>
      {(creating || editing) && <FormPanel />}
      {isLoading ? <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="space-y-3">
          {projects.map((s) => (
            <div key={s.id} className={`bg-surface border p-5 flex items-start justify-between gap-4 transition-all ${editing?.id === s.id ? "border-gold/40" : "border-border/50 hover:border-gold/20"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-bold text-foreground font-body">{s.title}</span>
                  <span className="text-[9px] border border-gold/40 text-gold px-1.5 py-0.5 font-body uppercase">{s.category}</span>
                  <span className="text-[10px] text-muted-foreground font-body">{s.year}</span>
                  {s.featured && <Star className="w-3 h-3 text-gold fill-gold" />}
                  {!s.is_active && <span className="text-[9px] border border-muted-foreground/30 text-muted-foreground px-1.5 py-0.5 font-body uppercase">Inactivo</span>}
                </div>
                <p className="text-xs text-muted-foreground font-body line-clamp-1">{s.description}</p>
                {s.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.tags.slice(0, 4).map(t => <span key={t} className="text-[9px] border border-border/50 text-muted-foreground px-1.5 py-0.5 font-body">{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(s)} className="p-2 hover:bg-surface-elevated transition-colors text-muted-foreground hover:text-gold"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => { if (confirm("Eliminar projecto?")) del.mutate(s.id); }} className="p-2 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
