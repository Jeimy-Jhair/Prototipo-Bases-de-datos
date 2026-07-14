import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, Users, Building2, Truck, Wrench, UserCheck,
  Package, BarChart3, LogOut, Search, Plus, Edit2, Trash2,
  Download, ChevronRight, X, AlertTriangle, Check, Filter,
  TrendingUp, TrendingDown, MapPin, Bell, Settings, Eye,
  ChevronLeft, ChevronDown, RefreshCw, FileText, Printer
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} from "./services/clientesService";

import {
    obtenerSucursales,
    crearSucursal,
    actualizarSucursal,
    eliminarSucursal
} from "./services/sucursalesService";

import {
    obtenerVehiculosIdentificacion,
    crearVehiculoIdentificacion,
    actualizarVehiculoIdentificacion,
    eliminarVehiculoIdentificacion
} from "./services/vehiculosIdentificacionService";

// ── Types ──────────────────────────────────────────────────────────────────
type Screen =
  | "login" | "dashboard" | "clientes" | "sucursales"
  | "vehiculos-id" | "vehiculos-tec" | "repartidores" | "envios" | "reportes";

type Branch = "UIO" | "GYE";

interface Cliente {
  cedula: string; nombres: string; apellidos: string;
  calle:string; ciudad: string; provincia: string; telefono: string; contacto: string;
}
interface Sucursal {
    codigo_iata: string;
    ciudad: string;
}
interface VehiculoId {
    placa: string;
    marca: string;
}
interface VehiculoTec { placa: string; anio: number; capacidad: string; codigo_iata: Branch; }
interface Repartidor {
  codigo: string; cedula: string; nombres: string; apellidos: string;
  fecha_nac: string; direccion: string; ciudad: string; provincia: string;
  telefono: string; codigo_iata: Branch;
}
interface Envio {
  codigo_paquete: string; fecha_recepcion: string; estado: string;
  destino: string; cedula_cliente: string; placa: string; codigo_unico: string;
  codigo_iata: Branch;
}

// ── Seed data ──────────────────────────────────────────────────────────────


const seedSucursales: Sucursal[] = [
  { codigo_iata: "UIO", ciudad: "Quito"},
  { codigo_iata: "GYE", ciudad: "Guayaquil" },
];

const seedVehiculosId: VehiculoId[] = [
  { placa: "PBB-1234", marca: "Toyota"},
  { placa: "GXA-5678", marca: "Chevrolet" },
  { placa: "PCN-9012", marca: "Ford" },
  { placa: "GYM-3456", marca: "Hino", },
  { placa: "PEF-7890", marca: "Mazda"},
  { placa: "GHJ-2345", marca: "Mitsubishi"},
];

const seedVehiculosTec: VehiculoTec[] = [
  { placa: "PBB-1234", anio: 2021, capacidad: "1.5 Ton", codigo_iata: "UIO" },
  { placa: "GXA-5678", anio: 2020, capacidad: "3.5 Ton", codigo_iata: "GYE" },
  { placa: "PCN-9012", anio: 2022, capacidad: "2.0 Ton", codigo_iata: "UIO" },
  { placa: "GYM-3456", anio: 2019, capacidad: "5.0 Ton", codigo_iata: "GYE" },
  { placa: "PEF-7890", anio: 2023, capacidad: "1.0 Ton", codigo_iata: "UIO" },
  { placa: "GHJ-2345", anio: 2018, capacidad: "2.5 Ton", codigo_iata: "GYE" },
];

const seedRepartidores: Repartidor[] = [
  { codigo: "REP-001", cedula: "1767890123", nombres: "Javier Ernesto", apellidos: "Quito Lema", fecha_nac: "1990-03-15", direccion: "Calle Cotocollao 45", ciudad: "Quito", provincia: "Pichincha", telefono: "0991122334", codigo_iata: "UIO" },
  { codigo: "REP-002", cedula: "0956789012", nombres: "Miguel Ángel", apellidos: "Reyes Calle", fecha_nac: "1988-07-22", direccion: "Cdla. Kennedy Norte", ciudad: "Guayaquil", provincia: "Guayas", telefono: "0962233445", codigo_iata: "GYE" },
  { codigo: "REP-003", cedula: "1778901234", nombres: "Cristian Paul", apellidos: "Naranjo Paz", fecha_nac: "1995-11-08", direccion: "Av. La Prensa N58-12", ciudad: "Quito", provincia: "Pichincha", telefono: "0983344556", codigo_iata: "UIO" },
  { codigo: "REP-004", cedula: "0967890123", nombres: "Elvis Rodrigo", apellidos: "Ponce León", fecha_nac: "1992-04-30", direccion: "Av. Quito 890", ciudad: "Guayaquil", provincia: "Guayas", telefono: "0974455667", codigo_iata: "GYE" },
  { codigo: "REP-005", cedula: "1789012345", nombres: "Santiago Iván", apellidos: "Cevallos Cruz", fecha_nac: "1993-09-14", direccion: "Barrio La Floresta", ciudad: "Quito", provincia: "Pichincha", telefono: "0985566778", codigo_iata: "UIO" },
];

const seedEnvios: Envio[] = [
  { codigo_paquete: "ENV-2024-001", fecha_recepcion: "2024-01-15", estado: "Entregado", destino: "Av. República E7-45, Quito", cedula_cliente: "1712345678", placa: "PBB-1234", codigo_unico: "REP-001", codigo_iata: "UIO" },
  { codigo_paquete: "ENV-2024-002", fecha_recepcion: "2024-01-16", estado: "En Tránsito", destino: "Cdla. Urdesa Central, GYE", cedula_cliente: "0923456789", placa: "GXA-5678", codigo_unico: "REP-002", codigo_iata: "GYE" },
  { codigo_paquete: "ENV-2024-003", fecha_recepcion: "2024-01-17", estado: "Pendiente", destino: "Calle Rocafuerte 234, Quito", cedula_cliente: "1801234567", placa: "PCN-9012", codigo_unico: "REP-003", codigo_iata: "UIO" },
  { codigo_paquete: "ENV-2024-004", fecha_recepcion: "2024-01-18", estado: "Entregado", destino: "Av. 9 de Octubre 1200, GYE", cedula_cliente: "0934567890", placa: "GYM-3456", codigo_unico: "REP-004", codigo_iata: "GYE" },
  { codigo_paquete: "ENV-2024-005", fecha_recepcion: "2024-01-19", estado: "En Tránsito", destino: "Barrio Solanda, Quito", cedula_cliente: "1723456789", placa: "PEF-7890", codigo_unico: "REP-005", codigo_iata: "UIO" },
  { codigo_paquete: "ENV-2024-006", fecha_recepcion: "2024-01-20", estado: "Cancelado", destino: "Vía a Samborondón Km 2", cedula_cliente: "0945678901", placa: "GHJ-2345", codigo_unico: "REP-002", codigo_iata: "GYE" },
];

// ── Charts data ────────────────────────────────────────────────────────────
const enviosMonthly = [
  { mes: "Ago", UIO: 45, GYE: 38 }, { mes: "Sep", UIO: 52, GYE: 41 },
  { mes: "Oct", UIO: 61, GYE: 55 }, { mes: "Nov", UIO: 49, GYE: 62 },
  { mes: "Dic", UIO: 78, GYE: 71 }, { mes: "Ene", UIO: 67, GYE: 58 },
];
const estadoEnvios = [
  { name: "Entregado", value: 58, color: "#16a34a" },
  { name: "En Tránsito", value: 27, color: "#2563eb" },
  { name: "Pendiente", value: 10, color: "#d97706" },
  { name: "Cancelado", value: 5, color: "#dc2626" },
];
const clientesCrecimiento = [
  { mes: "Ago", total: 120 }, { mes: "Sep", total: 138 }, { mes: "Oct", total: 155 },
  { mes: "Nov", total: 162 }, { mes: "Dic", total: 180 }, { mes: "Ene", total: 194 },
];

// ── Shared UI Components ───────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: string }) {
  const map: Record<string, string> = {
    green: "bg-green-100 text-green-700 border border-green-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    yellow: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    red: "bg-red-100 text-red-700 border border-red-200",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[color] ?? map.gray}`}>
      {label}
    </span>
  );
}

function StatusBadge({ estado }: { estado: string }) {
  const map: Record<string, { color: string }> = {
    "Entregado": { color: "green" },
    "En Tránsito": { color: "blue" },
    "Pendiente": { color: "yellow" },
    "Cancelado": { color: "red" },
  };
  const cfg = map[estado] ?? { color: "gray" };
  return <Badge label={estado} color={cfg.color} />;
}

function BranchBadge({ branch }: { branch: Branch }) {
  return <Badge label={branch === "UIO" ? "Quito · UIO" : "Guayaquil · GYE"} color={branch === "UIO" ? "blue" : "green"} />;
}

function Btn({
  children, onClick, variant = "primary", size = "md", disabled = false, icon
}: {
  children: React.ReactNode; onClick?: () => void; variant?: string;
  size?: "sm" | "md"; disabled?: boolean; icon?: React.ReactNode;
}) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  const sizes: Record<string, string> = { sm: "px-2.5 py-1 text-xs", md: "px-3.5 py-1.5 text-sm" };
  const variants: Record<string, string> = {
    primary: "bg-[#1a3a6b] text-white hover:bg-[#15305a] focus:ring-[#1a3a6b]",
    save: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    edit: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-white text-[#1a3a6b] border border-[#1a3a6b]/20 hover:bg-[#e8edf5] focus:ring-[#1a3a6b]",
    export: "bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus:ring-[#2563eb]",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant] ?? variants.primary}`}
      onClick={onClick} disabled={disabled}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#1a3a6b] uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border border-[#1a3a6b]/20 rounded px-3 py-2 text-sm transition-all placeholder:text-gray-400
          ${
            disabled
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-[#f5f7fb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          }`}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#1a3a6b] uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-[#1a3a6b]/20 rounded px-3 py-2 text-sm bg-[#f5f7fb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all cursor-pointer"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Modal({ title, children, onClose, footer }: {
  title: string; children: React.ReactNode; onClose: () => void; footer?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#0f2447]">
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-5 py-4 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Confirmar eliminación</h3>
          <p className="text-sm text-gray-500 text-center">{message}</p>
        </div>
        <div className="flex gap-2 px-5 pb-4 justify-center">
          <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
          <Btn variant="danger" icon={<Trash2 size={14} />} onClick={onConfirm}>Eliminar</Btn>
        </div>
      </div>
    </div>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#1a3a6b]/10">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#1a3a6b] uppercase tracking-wider bg-[#e8edf5] border-b border-[#1a3a6b]/10 whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2.5 border-b border-gray-50 text-gray-700 whitespace-nowrap">{children}</td>;
}

function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-3">
      <span className="text-xs text-gray-500">
        Mostrando {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} de {total} registros
      </span>
      <div className="flex items-center gap-1">
        <button
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          onClick={() => onChange(page - 1)} disabled={page === 1}>
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p}
            onClick={() => onChange(p)}
            className={`w-7 h-7 text-xs rounded font-medium cursor-pointer transition-colors ${p === page ? "bg-[#1a3a6b] text-white" : "hover:bg-gray-100 text-gray-600"}`}>
            {p}
          </button>
        ))}
        <button
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          onClick={() => onChange(page + 1)} disabled={page === pages}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-1">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          <span className={i === items.length - 1 ? "text-[#1a3a6b] font-medium" : ""}>{item}</span>
        </span>
      ))}
    </nav>
  );
}

function PageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-[#0f2447]">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? "Buscar..."}
        className="pl-9 pr-3 py-1.5 text-sm border border-[#1a3a6b]/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] w-56 transition-all"
      />
    </div>
  );
}

function FilterBtn({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded border transition-all cursor-pointer ${active
        ? "bg-[#1a3a6b] text-white border-[#1a3a6b]"
        : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a6b]/40"}`}>
      {label}
    </button>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: null },
  { id: "clientes", label: "Clientes", icon: Users, section: "Replicación" },
  { id: "sucursales", label: "Sucursales", icon: Building2, section: "Replicación" },
  { id: "vehiculos-id", label: "Vehículo Identificación", icon: Truck, section: "Frag. Vertical" },
  { id: "vehiculos-tec", label: "Vehículo Técnico", icon: Wrench, section: "Frag. Mixta" },
  { id: "repartidores", label: "Repartidores", icon: UserCheck, section: "Frag. Horizontal" },
  { id: "envios", label: "Envíos", icon: Package, section: "Frag. Derivada" },
  { id: "reportes", label: "Reportes", icon: BarChart3, section: null },
];

function Sidebar({ current, onNav, activeBranch }: {
  current: Screen; onNav: (s: Screen) => void; activeBranch: Branch;
}) {
  const sections = ["Replicación", "Frag. Vertical", "Frag. Mixta", "Frag. Horizontal", "Frag. Derivada"];
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#0f2447] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#2563eb] rounded flex items-center justify-center shrink-0">
            <Package size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">DobleJJ</div>
            <div className="text-white/50 text-[10px] uppercase tracking-widest">Corporation</div>
          </div>
        </div>
      </div>

      {/* Branch indicator */}
      <div className="mx-3 mt-3 px-3 py-2 bg-white/5 rounded border border-white/10">
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Sucursal Activa</div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${activeBranch === "UIO" ? "bg-blue-400" : "bg-green-400"} shrink-0`} />
          <span className="text-white text-xs font-medium">
            {activeBranch === "UIO" ? "Quito · UIO (GCS/LCS1)" : "Guayaquil · GYE (LCS2)"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {(() => {
          const rendered: string[] = [];
          return NAV_ITEMS.map(item => {
            const showSection = item.section && !rendered.includes(item.section);
            if (showSection) rendered.push(item.section!);
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <div key={item.id}>
                {showSection && (
                  <div className="px-2 pt-3 pb-1 text-[9px] text-white/30 uppercase tracking-widest font-semibold">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => onNav(item.id as Screen)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-all cursor-pointer mb-0.5 ${active
                    ? "bg-[#2563eb] text-white font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/8"}`}>
                  <Icon size={15} className="shrink-0" />
                  <span className="text-xs leading-tight">{item.label}</span>
                  {active && <ChevronRight size={12} className="ml-auto" />}
                </button>
              </div>
            );
          });
        })()}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 text-[10px] text-white/30 text-center">
        v2.4.1 · SQL Server Distribuido
      </div>
    </aside>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────
function Header({ activeBranch, onBranchSwitch, onLogout, userName }: {
  activeBranch: Branch; onBranchSwitch: () => void; onLogout: () => void; userName: string;
}) {
  return (
    <header className="h-12 bg-white border-b border-[#1a3a6b]/10 flex items-center justify-between px-5 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-medium text-[#1a3a6b]">DobleJJ ERP</span>
        <span className="text-gray-300">|</span>
        <span>Sistema de Gestión Distribuida</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onBranchSwitch}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#1a3a6b]/20 text-xs font-medium text-[#1a3a6b] hover:bg-[#e8edf5] transition-all cursor-pointer">
          <div className={`w-2 h-2 rounded-full ${activeBranch === "UIO" ? "bg-blue-500" : "bg-green-500"}`} />
          {activeBranch === "UIO" ? "Quito" : "Guayaquil"}
          <ChevronDown size={12} />
        </button>
        <button className="relative p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white text-xs font-bold">
            {userName[0]}
          </div>
          <span className="text-xs font-medium text-gray-700 hidden md:block">{userName}</span>
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-red-600 hover:bg-red-50 border border-red-200 transition-all cursor-pointer">
          <LogOut size={13} />
          Salir
        </button>
      </div>
    </header>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (user: string) => void }) {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pass) { setError("Complete todos los campos."); return; }
    setLoading(true);
    setTimeout(() => {
      if (user === "admin" && pass === "admin123") { onLogin(user); }
      else { setError("Credenciales incorrectas. Intente nuevamente."); setLoading(false); }
    }, 800);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel — image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#0f2447]">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=900&fit=crop&auto=format"
          alt="Centro logístico de distribución"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <div className="text-lg font-bold leading-tight">DobleJJ Corporation</div>
              <div className="text-white/50 text-xs uppercase tracking-widest">Mensajería & Logística</div>
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold leading-snug mb-3">
              Sistema de Gestión<br />Distribuida
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Administre clientes, vehículos, repartidores y envíos en las sucursales de Quito y Guayaquil desde una única plataforma.
            </p>
            <div className="mt-8 flex gap-6">
              {[{ n: "8 módulos", d: "integrados" }, { n: "2 nodos", d: "distribuidos" }, { n: "SQL Server", d: "replicado" }].map(s => (
                <div key={s.n}>
                  <div className="text-lg font-bold text-[#2563eb]">{s.n}</div>
                  <div className="text-xs text-white/50">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-white/30">
            © 2024 DobleJJ Corporation — Todos los derechos reservados
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[420px] flex items-center justify-center bg-[#f0f2f5] px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-[#1a3a6b] rounded-lg flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <div className="text-lg font-bold text-[#0f2447]">DobleJJ Corporation</div>
          </div>

          <h1 className="text-2xl font-bold text-[#0f2447] mb-1">Bienvenido</h1>
          <p className="text-sm text-gray-500 mb-8">Ingrese sus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#1a3a6b] uppercase tracking-wide">Usuario</label>
              <input
                type="text" value={user} onChange={e => setUser(e.target.value)}
                placeholder="Ingrese su usuario"
                className="border border-[#1a3a6b]/20 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#1a3a6b] uppercase tracking-wide">Contraseña</label>
              <input
                type="password" value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                className="border border-[#1a3a6b]/20 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="mt-2 w-full py-3 bg-[#1a3a6b] text-white text-sm font-semibold rounded-lg hover:bg-[#15305a] transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb] disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2">
              {loading ? (
                <><RefreshCw size={15} className="animate-spin" />Autenticando...</>
              ) : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
            <p>© 2026–2027 DobleJJ Corporation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({ activeBranch, clientes, vehiculos, repartidores, envios, sucursales }: {
  activeBranch: Branch;
  clientes: Cliente[]; vehiculos: VehiculoId[]; repartidores: Repartidor[];
  envios: Envio[]; sucursales: Sucursal[];
}) {
  const stats = [
    { label: "Clientes", value: clientes.length, icon: Users, color: "blue", delta: "+12%" },
    { label: "Vehículos", value: vehiculos.length, icon: Truck, color: "indigo", delta: "+3%" },
    { label: "Repartidores", value: repartidores.length, icon: UserCheck, color: "violet", delta: "+8%" },
    { label: "Envíos", value: envios.length, icon: Package, color: "emerald", delta: "+24%" },
    { label: "Sucursales", value: sucursales.length, icon: Building2, color: "amber", delta: "estable" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  const recentEnvios = envios.slice(-4).reverse();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[#0f2447]">Dashboard</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Resumen operativo · Sucursal activa: <span className="font-semibold text-[#2563eb]">{activeBranch === "UIO" ? "Quito (GCS/LCS1)" : "Guayaquil (LCS2)"}</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          const isPositive = s.delta.startsWith("+");
          return (
            <div key={s.label} className="bg-white rounded-lg border border-[#1a3a6b]/8 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorMap[s.color]}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0f2447]">{s.value}</div>
                <div className={`text-xs font-medium flex items-center gap-0.5 mt-0.5 ${isPositive ? "text-green-600" : "text-gray-500"}`}>
                  {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {s.delta} vs mes anterior
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Envíos por sucursal */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#1a3a6b]/8 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0f2447]">Envíos por Sucursal</h3>
              <p className="text-xs text-gray-400">Últimos 6 meses</p>
            </div>
            <Badge label="Actualizado hoy" color="green" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={enviosMonthly} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="UIO" name="Quito" fill="#1a3a6b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="GYE" name="Guayaquil" fill="#2563eb" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estado de envíos */}
        <div className="bg-white rounded-lg border border-[#1a3a6b]/8 p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#0f2447]">Estado de Envíos</h3>
            <p className="text-xs text-gray-400">Distribución actual</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={estadoEnvios} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                dataKey="value" paddingAngle={3}>
                {estadoEnvios.map((entry) => (
                  <Cell key={`pie-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {estadoEnvios.map(e => (
              <div key={e.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                <span className="text-[10px] text-gray-600">{e.name} ({e.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Crecimiento clientes */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#1a3a6b]/8 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0f2447]">Crecimiento de Clientes</h3>
              <p className="text-xs text-gray-400">Base total acumulada</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={clientesCrecimiento}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2}
                fill="url(#colorTotal)" dot={{ r: 3, fill: "#2563eb" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-lg border border-[#1a3a6b]/8 p-4">
          <h3 className="text-sm font-semibold text-[#0f2447] mb-3">Envíos Recientes</h3>
          <div className="space-y-2.5">
            {recentEnvios.map(e => (
              <div key={e.codigo_paquete} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#e8edf5] flex items-center justify-center shrink-0 mt-0.5">
                  <Package size={13} className="text-[#1a3a6b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 truncate">{e.codigo_paquete}</div>
                  <div className="text-[10px] text-gray-400 truncate">{e.destino}</div>
                </div>
                <StatusBadge estado={e.estado} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CLIENTES ───────────────────────────────────────────────────────────────
function ClientesScreen({ data, setData }: {
  data: Cliente[]; setData: (d: Cliente[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"" | "new" | "edit">("") ;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<Cliente>({ cedula: "", nombres: "", apellidos: "", calle:"" , ciudad: "", provincia: "", telefono: "", contacto: "" });
  const PER_PAGE = 5;

  const filtered = useMemo(() => data.filter(c =>
    [c.cedula, c.nombres, c.apellidos, c.ciudad].some(f => f.toLowerCase().includes(search.toLowerCase()))
  ), [data, search]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openNew = () => { setForm({ cedula: "", nombres: "", apellidos: "",calle: "", ciudad: "", provincia: "", telefono: "", contacto: "" }); setModal("new"); };
  const openEdit = (c: Cliente) => { setForm({ ...c }); setModal("edit"); };
  //Cambio aqui
  const save = async () => {
      if (!form.cedula || !form.nombres) {
          alert("Complete los campos obligatorios.");
          return;
      }
      try {
          if (modal === "new") {
              await crearCliente(form);
          } else {
              await actualizarCliente(form);
          }
          const datos = await obtenerClientes();
          setData(datos);
          setModal("");
      } catch (error) {
          console.error(error);
          alert("Ocurrió un error al guardar el cliente.");
      }
  };

  //Se añadio
  const remove = async (cedula: string) => {
    await eliminarCliente(cedula);
    const datos = await obtenerClientes();
    setData(datos);
    setConfirmId(null);
};

  return (
    <div>
      <Breadcrumb items={["Inicio", "Replicación", "Clientes"]} />
      <PageHeader
        title="Gestión de Clientes"
        subtitle="Tabla replicada en ambos nodos (UIO ↔ GYE)"
        actions={
          <>
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Buscar cliente..." />
            <Btn variant="export" icon={<Download size={14} />}>Exportar</Btn>
            <Btn variant="save" icon={<Plus size={14} />} onClick={openNew}>Nuevo Cliente</Btn>
          </>
        }
      />

      <div className="bg-white rounded-lg border border-[#1a3a6b]/10 shadow-sm">
        <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2 text-xs text-gray-500">
          <Filter size={12} />
          <span>{filtered.length} registros encontrados</span>
          <Badge label="Replicado" color="blue" />
        </div>
        <TableWrap>
          <thead>
            <tr>
              <Th>Cédula</Th><Th>Nombres</Th><Th>Apellidos</Th>
              <Th>Ciudad</Th><Th>Provincia</Th><Th>Teléfono</Th><Th>Contacto Alterno</Th><Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr key={c.cedula} className={`hover:bg-[#f5f7fb] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <Td><span className="font-mono text-xs text-gray-600">{c.cedula}</span></Td>
                <Td><span className="font-medium text-gray-800">{c.nombres}</span></Td>
                <Td>{c.apellidos}</Td>
                <Td><div className="flex items-center gap-1"><MapPin size={11} className="text-gray-400" />{c.ciudad}</div></Td>
                <Td>{c.provincia}</Td>
                <Td><span className="font-mono text-xs">{c.telefono}</span></Td>
                <Td><span className="font-mono text-xs">{c.contacto}</span></Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <Btn size="sm" variant="edit" icon={<Edit2 size={11} />} onClick={() => openEdit(c)}>Editar</Btn>
                    <Btn size="sm" variant="danger" icon={<Trash2 size={11} />} onClick={() => setConfirmId(c.cedula)}>Eliminar</Btn>
                  </div>
                </Td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-sm text-gray-400">No se encontraron registros</td></tr>
            )}
          </tbody>
        </TableWrap>
        <div className="px-4 pb-3">
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </div>

      {(modal === "new" || modal === "edit") && (
        <Modal
          title={modal === "new" ? "Nuevo Cliente" : "Editar Cliente"}
          onClose={() => setModal("")}
          footer={<><Btn variant="ghost" onClick={() => setModal("")}>Cancelar</Btn><Btn variant="save" icon={<Check size={14} />} onClick={save}>Guardar</Btn></>}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cédula" value={form.cedula} onChange={v => setForm({ ...form, cedula: v })} required/>
            <Input label="Teléfono" value={form.telefono} onChange={v => setForm({ ...form, telefono: v })} />
            <Input label="Nombres" value={form.nombres} onChange={v => setForm({ ...form, nombres: v })} required />
            <Input label="Apellidos" value={form.apellidos} onChange={v => setForm({ ...form, apellidos: v })} required />
            <Input label="Calle" value={form.calle} onChange={v => setForm({ ...form, calle: v })}/>
            <Input label="Ciudad" value={form.ciudad} onChange={v => setForm({ ...form, ciudad: v })} />
            <Input label="Provincia" value={form.provincia} onChange={v => setForm({ ...form, provincia: v })} />
            <div className="col-span-2">
              <Input label="Contacto Alterno" value={form.contacto} onChange={v => setForm({ ...form, contacto: v })} />
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message={`¿Eliminar el cliente con cédula ${confirmId}? Esta acción no se puede deshacer.`}
          onConfirm={() => remove(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}

// ── SUCURSALES ─────────────────────────────────────────────────────────────
function SucursalesScreen({ data, setData }: { data: Sucursal[]; setData: (d: Sucursal[]) => void }) {
  const [modal, setModal] = useState<"" | "new" | "edit">("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<Sucursal>({
    codigo_iata: "",
    ciudad: ""
});

   const openNew = () => {
    setForm({
        codigo_iata: "",
        ciudad: ""
    });

    setModal("new");
};
  const openEdit = (s: Sucursal) => { setForm({ ...s }); setModal("edit"); };
  const save = async () => {

    if (!form.codigo_iata || !form.ciudad) return;

    try {

        if (modal === "new") {

            await crearSucursal({
                codigo: form.codigo_iata,
                ciudad: form.ciudad
            });

        } else {

            await actualizarSucursal({
                codigo: form.codigo_iata,
                ciudad: form.ciudad
            });

        }

        const datos = await obtenerSucursales();

        setData(datos);

        setModal("");

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al guardar la sucursal.");

    }

};

 const remove = async (codigo_iata: string) => {

    try {

        await eliminarSucursal(codigo_iata);

        const datos = await obtenerSucursales();

        setData(datos);

        setConfirmId(null);

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al eliminar la sucursal.");

    }

};

  return (
    <div>
        <Breadcrumb items={["Inicio", "Replicación", "Sucursales"]} />

        <PageHeader
            title="Gestión de Sucursales"
            subtitle="Tabla replicada en ambos nodos"
            actions={
                <>
                    <Btn
                        variant="save"
                        icon={<Plus size={14} />}
                        onClick={openNew}
                    >
                        Nueva Sucursal
                    </Btn>
                </>
            }
        />

        <div className="bg-white rounded-lg border border-[#1a3a6b]/10 shadow-sm">

            <TableWrap>

                <thead>

                    <tr>

                        <Th>Código IATA</Th>

                        <Th>Ciudad</Th>

                        <Th>Rol DB</Th>

                        <Th>Acciones</Th>

                    </tr>

                </thead>

                <tbody>

                    {data.map((s, i) => (

                        <tr
                            key={s.codigo_iata}
                            className={`hover:bg-[#f5f7fb] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}
                        >

                            <Td>

                                <span className="font-mono font-bold text-[#1a3a6b] text-sm">

                                    {s.codigo_iata}

                                </span>

                            </Td>

                            <Td>

                                <div className="flex items-center gap-1.5">

                                    <MapPin
                                        size={13}
                                        className="text-[#2563eb]"
                                    />

                                    <span className="font-medium">

                                        {s.ciudad}

                                    </span>

                                </div>

                            </Td>

                            <Td>

                                {s.codigo_iata === "UIO"

                                    ?

                                    <div className="flex gap-1">

                                        <Badge label="GCS" color="blue" />

                                        <Badge label="LCS1" color="gray" />

                                    </div>

                                    :

                                    <Badge label="LCS2" color="green" />

                                }

                            </Td>

                            <Td>

                                <div className="flex gap-1">

                                    <Btn
                                        size="sm"
                                        variant="edit"
                                        icon={<Edit2 size={11} />}
                                        onClick={() => openEdit(s)}
                                    >
                                        Editar
                                    </Btn>

                                    <Btn
                                        size="sm"
                                        variant="danger"
                                        icon={<Trash2 size={11} />}
                                        onClick={() => setConfirmId(s.codigo_iata)}
                                    >
                                        Eliminar
                                    </Btn>

                                </div>

                            </Td>

                        </tr>

                    ))}

                </tbody>

            </TableWrap>

        </div>

        {(modal === "new" || modal === "edit") && (

            <Modal

                title={modal === "new"
                    ? "Nueva Sucursal"
                    : "Editar Sucursal"}

                onClose={() => setModal("")}

                footer={
                    <>

                        <Btn
                            variant="ghost"
                            onClick={() => setModal("")}
                        >
                            Cancelar
                        </Btn>

                        <Btn
                            variant="save"
                            icon={<Check size={14} />}
                            onClick={save}
                        >
                            Guardar
                        </Btn>

                    </>
                }

            >

                <div className="grid grid-cols-2 gap-3">

                <Input
    label="Código IATA"
    value={form.codigo_iata}
    onChange={v =>
        setForm({
            ...form,
            codigo_iata: v
        })
    }
    disabled={modal === "edit"}
    required
/>

                    <Input
                        label="Ciudad"
                        value={form.ciudad}
                        onChange={v =>
                            setForm({
                                ...form,
                                ciudad: v
                            })
                        }
                        required
                    />

                </div>

            </Modal>

        )}

        {confirmId && (

            <ConfirmDialog

                message={`¿Eliminar la sucursal ${confirmId}?`}

                onConfirm={() => remove(confirmId)}

                onCancel={() => setConfirmId(null)}

            />

        )}

    </div>
);
}

// ── VEHICULOS ID ───────────────────────────────────────────────────────────
function VehiculosIdScreen({ data, setData }: { data: VehiculoId[]; setData: (d: VehiculoId[]) => void }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"" | "new" | "edit">("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
 const [form, setForm] = useState<VehiculoId>({
    placa: "",
    marca: ""
});
  const PER_PAGE = 6;

  const filtered = useMemo(() => data.filter(v =>
    [v.placa, v.marca].some(f => f.toLowerCase().includes(search.toLowerCase()))
  ), [data, search]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const openNew = () => { setForm({ placa: "", marca: "" }); setModal("new"); };
  const openEdit = (v: VehiculoId) => { setForm({ ...v }); setModal("edit"); };
 const save = async () => {

    if (!form.placa || !form.marca) return;

    try {

        if (modal === "new") {

            await crearVehiculoIdentificacion({
                placa: form.placa,
                marca: form.marca
            });

        } else {

            await actualizarVehiculoIdentificacion({
                placa: form.placa,
                marca: form.marca
            });

        }

        const datos = await obtenerVehiculosIdentificacion();

        setData(datos);

        setModal("");

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al guardar el vehículo.");

    }

};
const remove = async (placa: string) => {

    try {

        await eliminarVehiculoIdentificacion(placa);

        const datos = await obtenerVehiculosIdentificacion();

        setData(datos);

        setConfirmId(null);

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al eliminar el vehículo.");

    }

};

  return (
    <div>
      <Breadcrumb items={["Inicio", "Fragmentación Vertical", "Vehículo Identificación"]} />
      <PageHeader
        title="Vehículo — Identificación"
        subtitle="Fragmento vertical: Placa, Marca (compartido entre nodos)"
        actions={
          <>
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Buscar vehículo..." />
            <Btn variant="save" icon={<Plus size={14} />} onClick={openNew}>Nuevo Vehículo</Btn>
          </>
        }
      />
      <div className="bg-white rounded-lg border border-[#1a3a6b]/10 shadow-sm">
        <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2 text-xs text-gray-500">
          <Badge label="Frag. Vertical" color="blue" />
          <span className="text-gray-300">|</span>
          <span>{filtered.length} vehículos registrados</span>
        </div>
        <TableWrap>
          <thead><tr><Th>Placa</Th><Th>Marca</Th><Th>Acciones</Th></tr></thead>
          <tbody>
            {paged.map((v, i) => (
              <tr key={v.placa} className={`hover:bg-[#f5f7fb] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <Td><span className="font-mono font-semibold text-[#1a3a6b]">{v.placa}</span></Td>
                <Td><div className="flex items-center gap-1.5"><Truck size={13} className="text-gray-400" /><span className="font-medium">{v.marca}</span></div></Td>
                <Td>
                  <div className="flex gap-1">
                    <Btn size="sm" variant="edit" icon={<Edit2 size={11} />} onClick={() => openEdit(v)}>Editar</Btn>
                    <Btn size="sm" variant="danger" icon={<Trash2 size={11} />} onClick={() => setConfirmId(v.placa)}>Eliminar</Btn>
                  </div>
                </Td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={3} className="text-center py-8 text-sm text-gray-400">Sin resultados</td></tr>}
          </tbody>
        </TableWrap>
        <div className="px-4 pb-3"><Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} /></div>
      </div>

      {(modal === "new" || modal === "edit") && (
        <Modal title={modal === "new" ? "Nuevo Vehículo" : "Editar Vehículo"} onClose={() => setModal("")}
          footer={<><Btn variant="ghost" onClick={() => setModal("")}>Cancelar</Btn><Btn variant="save" icon={<Check size={14} />} onClick={save}>Guardar</Btn></>}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Placa" value={form.placa} onChange={v => setForm({ ...form, placa: v })} required />
            <Input label="Marca" value={form.marca} onChange={v => setForm({ ...form, marca: v })} required />
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message={`¿Eliminar el vehículo ${confirmId}?`} onConfirm={() => remove(confirmId)} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}

// ── VEHICULOS TEC ──────────────────────────────────────────────────────────
function VehiculosTecScreen({ data, setData, activeBranch }: { data: VehiculoTec[]; setData: (d: VehiculoTec[]) => void; activeBranch: Branch }) {
  const [filter, setFilter] = useState<"ALL" | Branch>(activeBranch);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"" | "new" | "edit">("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<VehiculoTec>({ placa: "", anio: 2020, capacidad: "", codigo_iata: "UIO" });
  const PER_PAGE = 6;
  useEffect(() => { setFilter(activeBranch); setPage(1); }, [activeBranch]);

  const filtered = useMemo(() => data
    .filter(v => filter === "ALL" || v.codigo_iata === filter)
    .filter(v => [v.placa, v.capacidad].some(f => f.toLowerCase().includes(search.toLowerCase())))
  , [data, filter, search]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const openNew = () => { setForm({ placa: "", anio: 2022, capacidad: "", codigo_iata: filter === "ALL" ? "UIO" : filter }); setModal("new"); };
  const openEdit = (v: VehiculoTec) => { setForm({ ...v }); setModal("edit"); };
  const save = () => {
    if (!form.placa) return;
    if (modal === "new") setData([...data, form]);
    else setData(data.map(v => v.placa === form.placa ? form : v));
    setModal("");
  };
  const remove = (placa: string) => { setData(data.filter(v => v.placa !== placa)); setConfirmId(null); };

  return (
    <div>
      <Breadcrumb items={["Inicio", "Fragmentación Mixta", "Vehículo Técnico"]} />
      <PageHeader
        title="Vehículo — Técnico"
        subtitle="Fragmentación mixta: vertical + horizontal (UIO / GYE)"
        actions={
          <>
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Buscar placa..." />
            <Btn variant="save" icon={<Plus size={14} />} onClick={openNew}>Nuevo Registro</Btn>
          </>
        }
      />

      <div className="flex items-center gap-2 mb-3">
        {(["ALL", "UIO", "GYE"] as const).map(b => (
          <FilterBtn key={b} label={b === "ALL" ? "Todos" : b === "UIO" ? "Quito · UIO" : "Guayaquil · GYE"}
            active={filter === b} onClick={() => { setFilter(b); setPage(1); }} />
        ))}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} registros</span>
      </div>

      <div className="bg-white rounded-lg border border-[#1a3a6b]/10 shadow-sm">
        <TableWrap>
          <thead><tr><Th>Placa</Th><Th>Año Fabricación</Th><Th>Capacidad Carga</Th><Th>Sucursal</Th><Th>Fragmento DB</Th><Th>Acciones</Th></tr></thead>
          <tbody>
            {paged.map((v, i) => (
              <tr key={v.placa} className={`hover:bg-[#f5f7fb] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <Td><span className="font-mono font-semibold text-[#1a3a6b]">{v.placa}</span></Td>
                <Td>{v.anio}</Td>
                <Td><span className="font-medium">{v.capacidad}</span></Td>
                <Td><BranchBadge branch={v.codigo_iata} /></Td>
                <Td><Badge label={`Vehiculo_Tecnico_${v.codigo_iata}`} color="gray" /></Td>
                <Td>
                  <div className="flex gap-1">
                    <Btn size="sm" variant="edit" icon={<Edit2 size={11} />} onClick={() => openEdit(v)}>Editar</Btn>
                    <Btn size="sm" variant="danger" icon={<Trash2 size={11} />} onClick={() => setConfirmId(v.placa)}>Eliminar</Btn>
                  </div>
                </Td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-sm text-gray-400">Sin resultados</td></tr>}
          </tbody>
        </TableWrap>
        <div className="px-4 pb-3"><Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} /></div>
      </div>

      {(modal === "new" || modal === "edit") && (
        <Modal title={modal === "new" ? "Nuevo Vehículo Técnico" : "Editar Vehículo Técnico"} onClose={() => setModal("")}
          footer={<><Btn variant="ghost" onClick={() => setModal("")}>Cancelar</Btn><Btn variant="save" icon={<Check size={14} />} onClick={save}>Guardar</Btn></>}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Placa" value={form.placa} onChange={v => setForm({ ...form, placa: v })} required />
            <Input label="Año Fabricación" type="number" value={String(form.anio)} onChange={v => setForm({ ...form, anio: parseInt(v) || 2020 })} required />
            <Input label="Capacidad Carga" value={form.capacidad} onChange={v => setForm({ ...form, capacidad: v })} placeholder="ej. 2.5 Ton" />
            <Select label="Sucursal (IATA)" value={form.codigo_iata} onChange={v => setForm({ ...form, codigo_iata: v as Branch })}
              options={[{ value: "UIO", label: "Quito (UIO)" }, { value: "GYE", label: "Guayaquil (GYE)" }]} required />
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message={`¿Eliminar registro técnico del vehículo ${confirmId}?`} onConfirm={() => remove(confirmId)} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}

// ── REPARTIDORES ───────────────────────────────────────────────────────────
function RepartidoresScreen({ data, setData, activeBranch }: { data: Repartidor[]; setData: (d: Repartidor[]) => void; activeBranch: Branch }) {
  const [filter, setFilter] = useState<"ALL" | Branch>(activeBranch);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"" | "new" | "edit">("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  useEffect(() => { setFilter(activeBranch); setPage(1); }, [activeBranch]);
  const [form, setForm] = useState<Repartidor>({ codigo: "", cedula: "", nombres: "", apellidos: "", fecha_nac: "", direccion: "", ciudad: "", provincia: "", telefono: "", codigo_iata: "UIO" });
  const PER_PAGE = 5;

  const filtered = useMemo(() => data
    .filter(r => filter === "ALL" || r.codigo_iata === filter)
    .filter(r => [r.cedula, r.nombres, r.apellidos, r.codigo].some(f => f.toLowerCase().includes(search.toLowerCase())))
  , [data, filter, search]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const openNew = () => { setForm({ codigo: "", cedula: "", nombres: "", apellidos: "", fecha_nac: "", direccion: "", ciudad: "", provincia: "", telefono: "", codigo_iata: filter === "ALL" ? "UIO" : filter }); setModal("new"); };
  const openEdit = (r: Repartidor) => { setForm({ ...r }); setModal("edit"); };
  const save = () => {
    if (!form.codigo || !form.cedula) return;
    if (modal === "new") setData([...data, form]);
    else setData(data.map(r => r.codigo === form.codigo ? form : r));
    setModal("");
  };
  const remove = (id: string) => { setData(data.filter(r => r.codigo !== id)); setConfirmId(null); };

  return (
    <div>
      <Breadcrumb items={["Inicio", "Fragmentación Horizontal Primaria", "Repartidores"]} />
      <PageHeader
        title="Gestión de Repartidores"
        subtitle="Fragmentación horizontal primaria: Repartidor_UIO / Repartidor_GYE"
        actions={
          <>
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Buscar repartidor..." />
            <Btn variant="export" icon={<Download size={14} />}>Exportar</Btn>
            <Btn variant="save" icon={<Plus size={14} />} onClick={openNew}>Nuevo Repartidor</Btn>
          </>
        }
      />

      <div className="flex items-center gap-2 mb-3">
        {(["ALL", "UIO", "GYE"] as const).map(b => (
          <FilterBtn key={b} label={b === "ALL" ? "Todos" : b === "UIO" ? "Quito · UIO" : "Guayaquil · GYE"}
            active={filter === b} onClick={() => { setFilter(b); setPage(1); }} />
        ))}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} registros</span>
      </div>

      <div className="bg-white rounded-lg border border-[#1a3a6b]/10 shadow-sm">
        <TableWrap>
          <thead>
            <tr>
              <Th>Código</Th><Th>Cédula</Th><Th>Nombres</Th><Th>Apellidos</Th>
              <Th>F. Nacimiento</Th><Th>Ciudad</Th><Th>Teléfono</Th><Th>Sucursal</Th><Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.codigo} className={`hover:bg-[#f5f7fb] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <Td><span className="font-mono text-xs font-semibold text-[#1a3a6b]">{r.codigo}</span></Td>
                <Td><span className="font-mono text-xs">{r.cedula}</span></Td>
                <Td><span className="font-medium">{r.nombres}</span></Td>
                <Td>{r.apellidos}</Td>
                <Td><span className="font-mono text-xs">{r.fecha_nac}</span></Td>
                <Td>{r.ciudad}</Td>
                <Td><span className="font-mono text-xs">{r.telefono}</span></Td>
                <Td><BranchBadge branch={r.codigo_iata} /></Td>
                <Td>
                  <div className="flex gap-1">
                    <Btn size="sm" variant="edit" icon={<Edit2 size={11} />} onClick={() => openEdit(r)}>Editar</Btn>
                    <Btn size="sm" variant="danger" icon={<Trash2 size={11} />} onClick={() => setConfirmId(r.codigo)}>Eliminar</Btn>
                  </div>
                </Td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-sm text-gray-400">Sin resultados</td></tr>}
          </tbody>
        </TableWrap>
        <div className="px-4 pb-3"><Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} /></div>
      </div>

      {(modal === "new" || modal === "edit") && (
        <Modal title={modal === "new" ? "Nuevo Repartidor" : "Editar Repartidor"} onClose={() => setModal("")}
          footer={<><Btn variant="ghost" onClick={() => setModal("")}>Cancelar</Btn><Btn variant="save" icon={<Check size={14} />} onClick={save}>Guardar</Btn></>}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Código Único" value={form.codigo} onChange={v => setForm({ ...form, codigo: v })} required />
            <Input label="Cédula" value={form.cedula} onChange={v => setForm({ ...form, cedula: v })} required />
            <Input label="Nombres" value={form.nombres} onChange={v => setForm({ ...form, nombres: v })} required />
            <Input label="Apellidos" value={form.apellidos} onChange={v => setForm({ ...form, apellidos: v })} required />
            <Input label="Fecha Nacimiento" type="date" value={form.fecha_nac} onChange={v => setForm({ ...form, fecha_nac: v })} />
            <Input label="Teléfono" value={form.telefono} onChange={v => setForm({ ...form, telefono: v })} />
            <div className="col-span-2"><Input label="Dirección" value={form.direccion} onChange={v => setForm({ ...form, direccion: v })} /></div>
            <Input label="Ciudad" value={form.ciudad} onChange={v => setForm({ ...form, ciudad: v })} />
            <Input label="Provincia" value={form.provincia} onChange={v => setForm({ ...form, provincia: v })} />
            <Select label="Sucursal (Fragmento)" value={form.codigo_iata}
              onChange={v => setForm({ ...form, codigo_iata: v as Branch })}
              options={[{ value: "UIO", label: "Quito — Repartidor_UIO" }, { value: "GYE", label: "Guayaquil — Repartidor_GYE" }]} required />
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message={`¿Eliminar al repartidor ${confirmId}?`} onConfirm={() => remove(confirmId)} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}

// ── ENVIOS ─────────────────────────────────────────────────────────────────
const ESTADOS = ["Pendiente", "En Tránsito", "Entregado", "Cancelado"];

function EnviosScreen({ data, setData, clientes, vehiculos, repartidores, activeBranch }: {
  data: Envio[]; setData: (d: Envio[]) => void;
  clientes: Cliente[]; vehiculos: VehiculoId[]; repartidores: Repartidor[];
  activeBranch: Branch;
}) {
  const [filter, setFilter] = useState<"ALL" | Branch>(activeBranch);
  const [estadoFilter, setEstadoFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"" | "new" | "edit">("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const blank: Envio = { codigo_paquete: "", fecha_recepcion: "", estado: "Pendiente", destino: "", cedula_cliente: "", placa: "", codigo_unico: "", codigo_iata: "UIO" };
  const [form, setForm] = useState<Envio>(blank);
  const PER_PAGE = 5;
  useEffect(() => { setFilter(activeBranch); setPage(1); }, [activeBranch]);

  const filtered = useMemo(() => data
    .filter(e => filter === "ALL" || e.codigo_iata === filter)
    .filter(e => estadoFilter === "ALL" || e.estado === estadoFilter)
    .filter(e => [e.codigo_paquete, e.destino, e.cedula_cliente].some(f => f.toLowerCase().includes(search.toLowerCase())))
  , [data, filter, estadoFilter, search]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const openNew = () => { setForm({ ...blank, codigo_iata: filter === "ALL" ? "UIO" : filter }); setModal("new"); };
  const openEdit = (e: Envio) => { setForm({ ...e }); setModal("edit"); };
  const save = () => {
    if (!form.codigo_paquete) return;
    if (modal === "new") setData([...data, form]);
    else setData(data.map(e => e.codigo_paquete === form.codigo_paquete ? form : e));
    setModal("");
  };
  const remove = (id: string) => { setData(data.filter(e => e.codigo_paquete !== id)); setConfirmId(null); };

  const clienteNombre = (cedula: string) => {
    const c = clientes.find(x => x.cedula === cedula);
    return c ? `${c.nombres} ${c.apellidos}` : cedula;
  };

  return (
    <div>
      <Breadcrumb items={["Inicio", "Fragmentación Derivada", "Envíos"]} />
      <PageHeader
        title="Gestión de Envíos"
        subtitle="Fragmentación horizontal derivada: Envio_UIO / Envio_GYE"
        actions={
          <>
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Buscar envío..." />
            <Btn variant="export" icon={<Download size={14} />}>Exportar</Btn>
            <Btn variant="save" icon={<Plus size={14} />} onClick={openNew}>Nuevo Envío</Btn>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {(["ALL", "UIO", "GYE"] as const).map(b => (
          <FilterBtn key={b} label={b === "ALL" ? "Todas las sucursales" : b === "UIO" ? "Quito · UIO" : "Guayaquil · GYE"}
            active={filter === b} onClick={() => { setFilter(b); setPage(1); }} />
        ))}
        <div className="h-4 w-px bg-gray-200" />
        {["ALL", ...ESTADOS].map(e => (
          <FilterBtn key={e} label={e === "ALL" ? "Todos los estados" : e}
            active={estadoFilter === e} onClick={() => { setEstadoFilter(e); setPage(1); }} />
        ))}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} registros</span>
      </div>

      <div className="bg-white rounded-lg border border-[#1a3a6b]/10 shadow-sm">
        <TableWrap>
          <thead>
            <tr>
              <Th>Código Paquete</Th><Th>Fecha Recepción</Th><Th>Estado</Th>
              <Th>Destino</Th><Th>Cliente</Th><Th>Vehículo</Th><Th>Repartidor</Th><Th>Sucursal</Th><Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {paged.map((e, i) => (
              <tr key={e.codigo_paquete} className={`hover:bg-[#f5f7fb] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <Td><span className="font-mono text-xs font-semibold text-[#1a3a6b]">{e.codigo_paquete}</span></Td>
                <Td><span className="font-mono text-xs">{e.fecha_recepcion}</span></Td>
                <Td><StatusBadge estado={e.estado} /></Td>
                <Td><div className="max-w-[140px] truncate text-xs">{e.destino}</div></Td>
                <Td><div className="text-xs max-w-[100px] truncate">{clienteNombre(e.cedula_cliente)}</div></Td>
                <Td><span className="font-mono text-xs">{e.placa}</span></Td>
                <Td><span className="font-mono text-xs">{e.codigo_unico}</span></Td>
                <Td><BranchBadge branch={e.codigo_iata} /></Td>
                <Td>
                  <div className="flex gap-1">
                    <Btn size="sm" variant="edit" icon={<Edit2 size={11} />} onClick={() => openEdit(e)}>Editar</Btn>
                    <Btn size="sm" variant="danger" icon={<Trash2 size={11} />} onClick={() => setConfirmId(e.codigo_paquete)}>Eliminar</Btn>
                  </div>
                </Td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-sm text-gray-400">Sin resultados</td></tr>}
          </tbody>
        </TableWrap>
        <div className="px-4 pb-3"><Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} /></div>
      </div>

      {(modal === "new" || modal === "edit") && (
        <Modal title={modal === "new" ? "Nuevo Envío" : "Editar Envío"} onClose={() => setModal("")}
          footer={<><Btn variant="ghost" onClick={() => setModal("")}>Cancelar</Btn><Btn variant="save" icon={<Check size={14} />} onClick={save}>Guardar</Btn></>}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Código Paquete" value={form.codigo_paquete} onChange={v => setForm({ ...form, codigo_paquete: v })} required />
            <Input label="Fecha Recepción" type="date" value={form.fecha_recepcion} onChange={v => setForm({ ...form, fecha_recepcion: v })} required />
            <Select label="Estado" value={form.estado} onChange={v => setForm({ ...form, estado: v })}
              options={ESTADOS.map(e => ({ value: e, label: e }))} required />
            <Select label="Sucursal" value={form.codigo_iata} onChange={v => setForm({ ...form, codigo_iata: v as Branch })}
              options={[{ value: "UIO", label: "Quito (UIO)" }, { value: "GYE", label: "Guayaquil (GYE)" }]} required />
            <div className="col-span-2"><Input label="Destino" value={form.destino} onChange={v => setForm({ ...form, destino: v })} required /></div>
            <Select label="Cliente (Cédula)" value={form.cedula_cliente}
              onChange={v => setForm({ ...form, cedula_cliente: v })}
              options={[{ value: "", label: "Seleccionar..." }, ...clientes.map(c => ({ value: c.cedula, label: `${c.nombres} ${c.apellidos}` }))]} required />
            <Select label="Vehículo (Placa)" value={form.placa}
              onChange={v => setForm({ ...form, placa: v })}
              options={[{ value: "", label: "Seleccionar..." }, ...vehiculos.map(v => ({ value: v.placa, label: `${v.placa} — ${v.marca}` }))]} required />
            <div className="col-span-2">
              <Select label="Repartidor" value={form.codigo_unico}
                onChange={v => setForm({ ...form, codigo_unico: v })}
                options={[{ value: "", label: "Seleccionar..." }, ...repartidores.map(r => ({ value: r.codigo, label: `${r.codigo} — ${r.nombres} ${r.apellidos}` }))]} required />
            </div>
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message={`¿Eliminar el envío ${confirmId}?`} onConfirm={() => remove(confirmId)} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}

// ── REPORTES ───────────────────────────────────────────────────────────────
function ReportesScreen({ clientes, vehiculosId, vehiculosTec, repartidores, envios, sucursales }: {
  clientes: Cliente[]; vehiculosId: VehiculoId[]; vehiculosTec: VehiculoTec[];
  repartidores: Repartidor[]; envios: Envio[]; sucursales: Sucursal[];
}) {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const reports = [
    { id: "clientes", label: "Clientes", desc: "Listado completo — replicado", icon: Users, color: "blue", count: clientes.length, data: clientes },
    { id: "veh-uio", label: "Vehículos Quito", desc: "Vehiculo_Tecnico_UIO", icon: Truck, color: "indigo", count: vehiculosTec.filter(v => v.codigo_iata === "UIO").length, data: vehiculosTec.filter(v => v.codigo_iata === "UIO") },
    { id: "veh-gye", label: "Vehículos Guayaquil", desc: "Vehiculo_Tecnico_GYE", icon: Truck, color: "indigo", count: vehiculosTec.filter(v => v.codigo_iata === "GYE").length, data: vehiculosTec.filter(v => v.codigo_iata === "GYE") },
    { id: "rep-uio", label: "Repartidores Quito", desc: "Repartidor_UIO", icon: UserCheck, color: "violet", count: repartidores.filter(r => r.codigo_iata === "UIO").length, data: repartidores.filter(r => r.codigo_iata === "UIO") },
    { id: "rep-gye", label: "Repartidores Guayaquil", desc: "Repartidor_GYE", icon: UserCheck, color: "violet", count: repartidores.filter(r => r.codigo_iata === "GYE").length, data: repartidores.filter(r => r.codigo_iata === "GYE") },
    { id: "env-uio", label: "Envíos Quito", desc: "Envio_UIO", icon: Package, color: "emerald", count: envios.filter(e => e.codigo_iata === "UIO").length, data: envios.filter(e => e.codigo_iata === "UIO") },
    { id: "env-gye", label: "Envíos Guayaquil", desc: "Envio_GYE", icon: Package, color: "emerald", count: envios.filter(e => e.codigo_iata === "GYE").length, data: envios.filter(e => e.codigo_iata === "GYE") },
    { id: "sucursales", label: "Sucursales", desc: "Replicado (UIO/GYE)", icon: Building2, color: "amber", count: sucursales.length, data: sucursales },
  ];

  const colorIcons: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  const enviosByEstado = ESTADOS.map(e => ({ estado: e, total: envios.filter(x => x.estado === e).length }));
  const repartidoresByBranch = [
    { branch: "Quito (UIO)", total: repartidores.filter(r => r.codigo_iata === "UIO").length },
    { branch: "Guayaquil (GYE)", total: repartidores.filter(r => r.codigo_iata === "GYE").length },
  ];

  return (
    <div>
      <Breadcrumb items={["Inicio", "Reportes"]} />
      <PageHeader title="Módulo de Reportes" subtitle="Consulta por fragmento de base de datos distribuida" />

      {/* Report cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {reports.map(r => {
          const Icon = r.icon;
          const active = activeReport === r.id;
          return (
            <button key={r.id} onClick={() => setActiveReport(active ? null : r.id)}
              className={`text-left rounded-lg border p-4 transition-all cursor-pointer ${active ? "border-[#1a3a6b] bg-[#1a3a6b] shadow-lg" : "border-[#1a3a6b]/10 bg-white hover:shadow-md hover:border-[#1a3a6b]/30"}`}>
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${active ? "bg-white/15 border-white/20 text-white" : colorIcons[r.color]}`}>
                <Icon size={18} />
              </div>
              <div className={`text-sm font-semibold leading-tight mb-0.5 ${active ? "text-white" : "text-[#0f2447]"}`}>{r.label}</div>
              <div className={`text-xs mb-2 ${active ? "text-white/60" : "text-gray-400"}`}>{r.desc}</div>
              <div className={`text-xl font-bold ${active ? "text-white" : "text-[#1a3a6b]"}`}>{r.count}</div>
              <div className={`text-[10px] mt-1 ${active ? "text-white/50" : "text-gray-400"}`}>registros</div>
            </button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#1a3a6b]/10 p-4">
          <h3 className="text-sm font-semibold text-[#0f2447] mb-4">Envíos por Estado</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={enviosByEstado} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="estado" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Bar dataKey="total" fill="#2563eb" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg border border-[#1a3a6b]/10 p-4">
          <h3 className="text-sm font-semibold text-[#0f2447] mb-4">Repartidores por Sucursal</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={repartidoresByBranch}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="branch" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Bar dataKey="total" radius={[3, 3, 0, 0]}>
                {repartidoresByBranch.map((entry, i) => (
                  <Cell key={`bar-branch-${entry.branch}`} fill={i === 0 ? "#1a3a6b" : "#16a34a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Preview table */}
      {activeReport && (() => {
        const r = reports.find(x => x.id === activeReport)!;
        return (
          <div className="bg-white rounded-lg border border-[#1a3a6b]/10 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#0f2447]">Vista previa: {r.label}</h3>
                <p className="text-xs text-gray-400">{r.count} registros · Fragmento: {r.desc}</p>
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" size="sm" icon={<Printer size={13} />}>Imprimir</Btn>
                <Btn variant="export" size="sm" icon={<Download size={13} />}>Exportar CSV</Btn>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#e8edf5]">
                    {Object.keys((r.data as any[])[0] ?? {}).map(k => (
                      <th key={k} className="px-3 py-2 text-left font-semibold text-[#1a3a6b] uppercase tracking-wider whitespace-nowrap border-b border-[#1a3a6b]/10">
                        {k.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(r.data as any[]).map((row, i) => (
                    <tr key={i} className={`hover:bg-[#f5f7fb] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="px-3 py-2 border-b border-gray-50 text-gray-700">
                          {val === "UIO" ? <BranchBadge branch="UIO" /> : val === "GYE" ? <BranchBadge branch="GYE" /> : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {(r.data as any[]).length === 0 && (
                    <tr><td colSpan={10} className="text-center py-6 text-gray-400">Sin datos en este fragmento</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── ROOT APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState("");
  const [activeBranch, setActiveBranch] = useState<Branch>("UIO");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
 const [vehiculosId, setVehiculosId] = useState<VehiculoId[]>([]);
  const [vehiculosTec, setVehiculosTec] = useState<VehiculoTec[]>(seedVehiculosTec);
  const [repartidores, setRepartidores] = useState<Repartidor[]>(seedRepartidores);
  const [envios, setEnvios] = useState<Envio[]>(seedEnvios);

  useEffect(() => {
      cargarClientes();
      cargarSucursales();
      cargarVehiculosIdentificacion();

  }, []);

  async function cargarClientes() {
      try {
          const datos = await obtenerClientes();
          setClientes(datos);
      } catch (error) {
          console.error(error);
      }
  }

  async function cargarSucursales() {

    try {

        const datos = await obtenerSucursales();

        setSucursales(datos);

    }
    catch (error) {

        console.error(error);

    }

}

const cargarVehiculosIdentificacion = async () => {

    try {

        const datos = await obtenerVehiculosIdentificacion();

        setVehiculosId(datos);

    } catch (error) {

        console.error(error);

    }

};

  const handleLogin = (u: string) => { setUser(u); setScreen("dashboard"); };
  const handleLogout = () => { setScreen("login"); setUser(""); };
  const toggleBranch = () => setActiveBranch(b => b === "UIO" ? "GYE" : "UIO");

  if (screen === "login") return <LoginScreen onLogin={handleLogin} />;

  const SCREEN_LABELS: Record<Screen, string> = {
    login: "Login", dashboard: "Dashboard", clientes: "Clientes",
    sucursales: "Sucursales", "vehiculos-id": "Vehículo Identificación",
    "vehiculos-tec": "Vehículo Técnico", repartidores: "Repartidores",
    envios: "Envíos", reportes: "Reportes",
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar current={screen} onNav={setScreen} activeBranch={activeBranch} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeBranch={activeBranch}
          onBranchSwitch={toggleBranch}
          onLogout={handleLogout}
          userName={user === "admin" ? "Administrador" : user}
        />
        <main className="flex-1 overflow-y-auto p-5">
          {screen === "dashboard" && (
            <Dashboard activeBranch={activeBranch} clientes={clientes} vehiculos={vehiculosId}
              repartidores={repartidores} envios={envios} sucursales={sucursales} />
          )}
          {screen === "clientes" && <ClientesScreen data={clientes} setData={setClientes} />}
          {screen === "sucursales" && <SucursalesScreen data={sucursales} setData={setSucursales} />}
          {screen === "vehiculos-id" && <VehiculosIdScreen data={vehiculosId} setData={setVehiculosId} />}
          {screen === "vehiculos-tec" && <VehiculosTecScreen data={vehiculosTec} setData={setVehiculosTec} activeBranch={activeBranch} />}
          {screen === "repartidores" && <RepartidoresScreen data={repartidores} setData={setRepartidores} activeBranch={activeBranch} />}
          {screen === "envios" && (
            <EnviosScreen data={envios} setData={setEnvios}
              clientes={clientes} vehiculos={vehiculosId} repartidores={repartidores} activeBranch={activeBranch} />
          )}
          {screen === "reportes" && (
            <ReportesScreen clientes={clientes} vehiculosId={vehiculosId} vehiculosTec={vehiculosTec}
              repartidores={repartidores} envios={envios} sucursales={sucursales} />
          )}
        </main>
      </div>
    </div>
  );
}
