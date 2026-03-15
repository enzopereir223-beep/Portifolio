import { useState } from "react";
import { Trash2, Mail, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Lead = { id: string; name: string; email: string; service: string | null; message: string; status: string; created_at: string; };

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  new: { label: "Novo", color: "text-gold border-gold/40 bg-gold/10", icon: AlertCircle },
  contacted: { label: "Contactado", color: "text-blue-400 border-blue-400/40 bg-blue-400/10", icon: Mail },
  in_progress: { label: "Em Progresso", color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10", icon: Clock },
  closed: { label: "Fechado", color: "text-green-400 border-green-400/40 bg-green-400/10", icon: CheckCircle },
};

export default function AdminLeads() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return (data || []) as Lead[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-leads"] }); qc.invalidateQueries({ queryKey: ["leads-count"] }); toast({ title: "Status actualizado!" }); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("leads").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-leads"] }); qc.invalidateQueries({ queryKey: ["leads-count"] }); setSelected(null); toast({ title: "Lead eliminada!" }); },
  });

  const filtered = filterStatus === "all" ? leads : leads.filter(l => l.status === filterStatus);
  const newCount = leads.filter(l => l.status === "new").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground font-body flex items-center gap-3">
            Leads
            {newCount > 0 && <span className="px-2 py-0.5 bg-gold text-primary-foreground text-xs font-body font-bold">{newCount} novos</span>}
          </h2>
          <p className="text-xs text-muted-foreground font-body mt-1">Mensagens recebidas via formulário de contacto</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[["all", "Todos"], ["new", "Novos"], ["contacted", "Contactados"], ["in_progress", "Em Progresso"], ["closed", "Fechados"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilterStatus(val)} className={`px-3 py-1.5 text-xs font-body border transition-all ${filterStatus === val ? "border-gold bg-gold text-primary-foreground" : "border-border/50 text-muted-foreground hover:border-gold/40"}`}>
            {label} {val !== "all" && `(${leads.filter(l => l.status === val).length})`}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* List */}
        <div className="space-y-3">
          {isLoading ? <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div> : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-body text-sm">Nenhuma lead encontrada</div>
          ) : filtered.map((lead) => {
            const cfg = statusConfig[lead.status] || statusConfig.new;
            const Icon = cfg.icon;
            return (
              <button key={lead.id} onClick={() => setSelected(lead)} className={`w-full text-left bg-surface border p-4 transition-all ${selected?.id === lead.id ? "border-gold/60" : "border-border/50 hover:border-gold/20"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-bold text-foreground font-body">{lead.name}</span>
                    <div className="text-xs text-muted-foreground font-body">{lead.email}</div>
                  </div>
                  <span className={`flex items-center gap-1 text-[9px] border px-1.5 py-0.5 font-body uppercase ${cfg.color}`}>
                    <Icon className="w-2.5 h-2.5" />{cfg.label}
                  </span>
                </div>
                {lead.service && <div className="text-[10px] text-gold font-body mb-1">{lead.service}</div>}
                <p className="text-xs text-muted-foreground font-body line-clamp-2">{lead.message}</p>
                <div className="text-[10px] text-muted-foreground/50 font-body mt-2">{new Date(lead.created_at).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        {selected && (
          <div className="bg-surface border border-gold/30 p-6 space-y-5 h-fit">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-foreground font-body">{selected.name}</h3>
                <a href={`mailto:${selected.email}`} className="text-xs text-gold font-body hover:text-gold-bright">{selected.email}</a>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            {selected.service && <div><div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Serviço</div><div className="text-sm text-foreground font-body">{selected.service}</div></div>}
            <div><div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Mensagem</div><p className="text-sm text-foreground font-body leading-relaxed">{selected.message}</p></div>
            <div><div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">Recebido em</div><div className="text-xs text-foreground font-body">{new Date(selected.created_at).toLocaleString("pt-AO")}</div></div>
            <div>
              <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-2">Mudar Status</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(statusConfig).map(([val, cfg]) => (
                  <button key={val} onClick={() => updateStatus.mutate({ id: selected.id, status: val })} className={`flex items-center gap-1.5 px-3 py-2 border text-xs font-body transition-all ${selected.status === val ? `${cfg.color} font-bold` : "border-border/50 text-muted-foreground hover:border-gold/40"}`}>
                    <cfg.icon className="w-3 h-3" />{cfg.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-border/30">
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all">
                <Mail className="w-3.5 h-3.5" /> Responder
              </a>
              <button onClick={() => { if (confirm("Eliminar lead?")) del.mutate(selected.id); }} className="flex items-center gap-2 px-3 py-2 border border-destructive/40 text-destructive text-xs font-body hover:bg-destructive/10 transition-all">
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
