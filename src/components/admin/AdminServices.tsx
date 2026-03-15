import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Check, Layers } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Service = {
  id: string; title: string; description: string; items: string[];
  price: string | null; icon_name: string; is_active: boolean; sort_order: number;
};

const emptyService = (): Omit<Service, "id"> => ({
  title: "", description: "", items: [], price: "", icon_name: "Layers", is_active: true, sort_order: 0,
});

export default function AdminServices() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyService());
  const [itemsText, setItemsText] = useState("");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").order("sort_order");
      return (data || []) as Service[];
    },
  });

  const save = useMutation({
    mutationFn: async (s: typeof form) => {
      const payload = { ...s, items: itemsText.split("\n").map(i => i.trim()).filter(Boolean) };
      if (editing) {
        const { error } = await supabase.from("services").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      qc.invalidateQueries({ queryKey: ["services"] });
      toast({ title: editing ? "Serviço actualizado!" : "Serviço criado!" });
      setEditing(null); setCreating(false); setForm(emptyService()); setItemsText("");
    },
    onError: () => toast({ title: "Erro ao guardar", variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      qc.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Serviço eliminado!" });
    },
  });

  const startEdit = (s: Service) => {
    setEditing(s); setCreating(false);
    setForm({ title: s.title, description: s.description, items: s.items, price: s.price || "", icon_name: s.icon_name, is_active: s.is_active, sort_order: s.sort_order });
    setItemsText(s.items.join("\n"));
  };

  const startCreate = () => {
    setEditing(null); setCreating(true); setForm(emptyService()); setItemsText("");
  };

  const cancel = () => { setEditing(null); setCreating(false); setForm(emptyService()); setItemsText(""); };

  const FormPanel = () => (
    <div className="bg-surface border border-gold/30 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground font-body">{editing ? "Editar Serviço" : "Novo Serviço"}</h3>
        <button onClick={cancel}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Título *</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Preço</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" placeholder="A partir de $500" value={form.price || ""} onChange={e => setForm({ ...form, price: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Descrição *</label>
        <textarea rows={3} className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Itens (um por linha)</label>
        <textarea rows={4} className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground resize-none" placeholder={"User Research\nUsability Testing\nJourney Mapping"} value={itemsText} onChange={e => setItemsText(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Ícone</label>
          <input className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" placeholder="Layers" value={form.icon_name} onChange={e => setForm({ ...form, icon_name: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Ordem</label>
          <input type="number" className="w-full bg-background border border-border/50 focus:border-gold/60 outline-none px-3 py-2 text-sm font-body text-foreground" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="active-s" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-gold" />
        <label htmlFor="active-s" className="text-xs text-muted-foreground font-body">Activo (visível no site)</label>
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
          <h2 className="text-xl font-black text-foreground font-body">Serviços</h2>
          <p className="text-xs text-muted-foreground font-body mt-1">Gerir os serviços apresentados no site</p>
        </div>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all">
          <Plus className="w-3.5 h-3.5" /> Novo Serviço
        </button>
      </div>

      {(creating || editing) && <FormPanel />}

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className={`bg-surface border p-5 flex items-start justify-between gap-4 transition-all ${editing?.id === s.id ? "border-gold/40" : "border-border/50 hover:border-gold/20"}`}>
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-foreground font-body">{s.title}</span>
                    {!s.is_active && <span className="text-[9px] border border-muted-foreground/30 text-muted-foreground px-1.5 py-0.5 font-body uppercase">Inactivo</span>}
                    {s.price && <span className="text-xs text-gold font-body">{s.price}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground font-body line-clamp-1">{s.description}</p>
                  {s.items.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.items.slice(0, 3).map(item => (
                        <span key={item} className="text-[9px] border border-border/50 text-muted-foreground px-1.5 py-0.5 font-body">{item}</span>
                      ))}
                      {s.items.length > 3 && <span className="text-[9px] text-muted-foreground font-body">+{s.items.length - 3}</span>}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(s)} className="p-2 hover:bg-surface-elevated transition-colors text-muted-foreground hover:text-gold">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if (confirm("Eliminar este serviço?")) del.mutate(s.id); }} className="p-2 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
