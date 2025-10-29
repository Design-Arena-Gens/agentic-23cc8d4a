"use client";

import { useMemo } from "react";
import {
  Gauge,
  PieChart,
  Receipt,
  CreditCard,
  Users,
  Settings
} from "lucide-react";
import clsx from "clsx";

type SidebarProps = {
  activeKey: string;
  onChange: (key: string) => void;
  t: {
    dashboard: string;
    analytics: string;
    receipts: string;
    cards: string;
    splitwise: string;
    settings: string;
  };
};

export function Sidebar({ activeKey, onChange, t }: SidebarProps) {
  const items = useMemo(
    () => [
      { id: "dashboard", title: t.dashboard, icon: Gauge },
      { id: "analytics", title: t.analytics, icon: PieChart },
      { id: "receipts", title: t.receipts, icon: Receipt },
      { id: "cards", title: t.cards, icon: CreditCard },
      { id: "splitwise", title: t.splitwise, icon: Users },
      { id: "settings", title: t.settings, icon: Settings }
    ],
    [t]
  );

  return (
    <aside
      className={clsx("glass fade-in")}
      style={{
        width: 236,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "sticky",
        top: 100,
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto"
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeKey;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 14px",
              borderRadius: 14,
              border: "var(--glass-border)",
              cursor: "pointer",
              background: active
                ? "linear-gradient(135deg, rgba(14, 126, 249, 0.28), rgba(30, 227, 181, 0.2))"
                : "rgba(255,255,255,0.02)",
              transition: "transform 0.2s ease, background 0.2s ease",
              color: "inherit",
              fontSize: 14,
              fontWeight: active ? 600 : 500
            }}
          >
            <Icon size={18} />
            {item.title}
          </button>
        );
      })}
    </aside>
  );
}
