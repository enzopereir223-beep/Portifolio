import { useState, useEffect } from "react";
import {
  LayoutDashboard, FolderOpen, Users, BarChart3, Settings,
  Bell, Shield, LogOut, Plus, TrendingUp, Eye, Star,
  ArrowUpRight, Activity, ChevronRight, Search, Mail,
  Briefcase, Award, MessageSquare, X, Edit2, Trash2, Save, Check
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminServices from "./admin/AdminServices";
import AdminSkills from "./admin/AdminSkills";
import AdminExperiences from "./admin/AdminExperiences";
import AdminProjects from "./admin/AdminProjects";
import AdminLeads from "./admin/AdminLeads";
import AdminSettings from "./admin/AdminSettings";

const chartData = [
  { name: "Seg", visitas: 2400, conversoes: 400 },
  { name: "Ter", visitas: 3200, conversoes: 580 },
  { name: "Qua", visitas: 9800, conversoes: 1200 },
  { name: "Qui", visitas: 7200, conversoes: 960 },
  { name: "Sex", visitas: 6800, conversoes: 820 },
  { name: "Sáb", visitas: 5400, conversoes: 720 },
  { name: "Dom", visitas: 4900, conversoes: 660 },
];

type Section = "dashboard" | "services" | "skills" | "experiences" | "projects" | "leads" | "settings";

interface AdminPanelProps {
  onClose: () => void;
}

const navItems: { icon: React.ComponentType<{ className?: string }>; label: string; section: Section | null; group: string | null }[] = [
  { icon: LayoutDashboard, label: "Dashboard", section: "dashboard", group: "MENU PRINCIPAL" },
  { icon: FolderOpen, label: "Projectos", section: "projects", group: null },
  { icon: BarChart3, label: "Serviços", section: "services", group: null },
  { icon: Award, label: "Competências", section: "skills", group: null },
  { icon: Briefcase, label: "Experiência", section: "experiences", group: null },
  { icon: MessageSquare, label: "Leads", section: "leads", group: "GESTÃO" },
  { icon: Settings, label: "Configurações", section: "settings", group: "SISTEMA" },
];

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

  const { data: leadsCount = 0 } = useQuery({
    queryKey: ["leads-count"],
    queryFn: async () => {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new");
      return count || 0;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [projects, services, skills, leads] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }),
      ]);
      return {
        projects: projects.count || 0,
        services: services.count || 0,
        skills: skills.count || 0,
        leads: leads.count || 0,
      };
    },
  });

  const renderContent = () => {
    switch (activeSection) {
      case "services": return <AdminServices />;
      case "skills": return <AdminSkills />;
      case "experiences": return <AdminExperiences />;
      case "projects": return <AdminProjects />;
      case "leads": return <AdminLeads />;
      case "settings": return <AdminSettings />;
      default: return <AdminDashboard stats={stats} leadsCount={leadsCount} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 bg-surface border-r border-border/50 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-body font-bold text-sm text-foreground">
              Lux<span className="text-gold">Admin</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
          {navItems.map((item, i) => (
            <div key={i}>
              {item.group && (
                <div className="text-[9px] tracking-widest text-muted-foreground/50 uppercase font-body px-3 pt-4 pb-2">{item.group}</div>
              )}
              <button
                onClick={() => item.section && setActiveSection(item.section)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-xs font-body transition-all rounded-sm ${
                  activeSection === item.section
                    ? "bg-gold/15 text-gold border-l-2 border-gold"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </div>
                {item.section === "leads" && leadsCount > 0 && (
                  <span className="w-5 h-5 bg-gold text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {leadsCount}
                  </span>
                )}
              </button>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-xs font-bold">LP</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-body font-semibold text-foreground truncate">Lucilene Pereira</div>
              <div className="text-[10px] text-muted-foreground font-body truncate">Admin</div>
            </div>
          </div>
          <button onClick={onClose} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors font-body">
            <LogOut className="w-3.5 h-3.5" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-surface border-b border-border/50 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-lg bg-background border border-border/50 px-3 py-2 rounded-sm">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input type="text" placeholder="Pesquisar..." className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none font-body" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative" onClick={() => setActiveSection("leads")}>
              <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
              {leadsCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />}
            </button>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground font-body">Seção actual</div>
              <div className="text-[10px] text-gold font-body capitalize">{navItems.find(n => n.section === activeSection)?.label}</div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-surface-elevated transition-colors rounded-sm">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>

        <footer className="border-t border-border/30 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <span className="text-[10px] text-muted-foreground font-body">© 2024 LuxAdmin · Lucilene Pereira Portfolio</span>
          <div className="flex gap-4">
            {["Ajuda", "Privacidade"].map((l) => (
              <span key={l} className="text-[10px] text-muted-foreground font-body cursor-default">{l}</span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

const AdminDashboard = ({ stats, leadsCount, onNavigate }: { stats: any; leadsCount: number; onNavigate: (s: Section) => void }) => (
  <div className="p-6 space-y-6">
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-black text-foreground font-body">Visão Geral</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Bem-vinda, Lucilene. Aqui está o resumo do seu portfolio.</p>
      </div>
      <button onClick={() => onNavigate("projects")} className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground text-xs font-body font-semibold hover:bg-gold-bright transition-all">
        <Plus className="w-3.5 h-3.5" /> Novo Projecto
      </button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "PROJECTOS", value: stats?.projects || 0, icon: FolderOpen, section: "projects" as Section },
        { label: "SERVIÇOS", value: stats?.services || 0, icon: BarChart3, section: "services" as Section },
        { label: "COMPETÊNCIAS", value: stats?.skills || 0, icon: Award, section: "skills" as Section },
        { label: "LEADS", value: stats?.leads || 0, icon: MessageSquare, section: "leads" as Section, highlight: leadsCount > 0 },
      ].map((stat) => (
        <button key={stat.label} onClick={() => onNavigate(stat.section)} className="bg-surface border border-border/50 hover:border-gold/40 p-5 text-left transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 border border-border/50 group-hover:border-gold/40 flex items-center justify-center transition-colors">
              <stat.icon className="w-3.5 h-3.5 text-gold" />
            </div>
            {(stat as any).highlight && (
              <div className="flex items-center gap-1 text-gold text-xs font-body">
                <ArrowUpRight className="w-3 h-3" /> Novo
              </div>
            )}
          </div>
          <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mb-1">{stat.label}</div>
          <div className="text-2xl font-black text-foreground font-body">{stat.value}</div>
        </button>
      ))}
    </div>

    {/* Chart */}
    <div className="bg-surface border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-foreground font-body">Tráfego Semanal</h3>
          <p className="text-xs text-muted-foreground font-body mt-0.5">Dados de visitas e conversões</p>
        </div>
        <span className="text-[10px] border border-border/50 px-3 py-1 text-muted-foreground font-body tracking-wider">Semanal</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(43, 74%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(43, 74%, 60%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(40, 20%, 95%)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(40, 20%, 95%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(40, 10%, 55%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(40, 10%, 55%)" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "hsl(0, 0%, 7%)", border: "1px solid hsl(0, 0%, 15%)", borderRadius: 0, fontSize: 11 }} labelStyle={{ color: "hsl(40, 20%, 95%)" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="visitas" name="Visitas" stroke="hsl(43, 74%, 60%)" fill="url(#goldGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="conversoes" name="Conversões" stroke="hsl(40, 20%, 95%)" fill="url(#whiteGrad)" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* Quick actions */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        { label: "Novo Projecto", section: "projects" as Section, highlight: true },
        { label: "Novo Serviço", section: "services" as Section, highlight: false },
        { label: "Nova Competência", section: "skills" as Section, highlight: false },
        { label: "Ver Leads", section: "leads" as Section, highlight: false },
      ].map((a) => (
        <button
          key={a.label}
          onClick={() => onNavigate(a.section)}
          className={`flex items-center justify-center gap-2 p-4 text-xs font-body transition-all hover:scale-105 ${
            a.highlight ? "bg-gold text-primary-foreground" : "bg-surface-elevated text-foreground border border-border/50 hover:border-gold/40"
          }`}
        >
          <Plus className="w-4 h-4" />
          {a.label}
        </button>
      ))}
    </div>
  </div>
);

export default AdminPanel;
