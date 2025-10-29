"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Download, Sparkles, BrainCircuit } from "lucide-react";
import clsx from "clsx";

type AiInsightsProps = {
  insights: string[];
  alerts: string[];
  onGeneratePdf: () => void;
  monthlySummary: string;
  t: {
    title: string;
    subtitle: string;
    insights: string;
    alerts: string;
    summary: string;
    download: string;
  };
};

export function AiInsights({ insights, alerts, onGeneratePdf, monthlySummary, t }: AiInsightsProps) {
  return (
    <section className={clsx("glass")} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t.title}</h3>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{t.subtitle}</span>
        </div>
        <button
          onClick={onGeneratePdf}
          className="glass"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 14,
            border: "var(--glass-border)",
            background: "linear-gradient(135deg, rgba(14, 126, 249, 0.25), rgba(30, 227, 181, 0.18))",
            cursor: "pointer",
            fontSize: 12
          }}
        >
          <Download size={16} />
          {t.download}
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          borderRadius: 16,
          border: "var(--glass-border)",
          background: "rgba(255,255,255,0.03)",
          padding: 16,
          fontSize: 13,
          lineHeight: 1.5,
          color: "var(--color-muted)"
        }}
      >
        <strong
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
            fontSize: 12,
            color: "var(--color-text)"
          }}
        >
          <BrainCircuit size={16} />
          {t.summary}
        </strong>
        {monthlySummary}
      </motion.div>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div
          style={{
            borderRadius: 16,
            border: "var(--glass-border)",
            background: "rgba(14, 126, 249, 0.08)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}
        >
          <strong style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Sparkles size={16} />
            {t.insights}
          </strong>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--color-muted)", fontSize: 12 }}>
            {insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        </div>
        <div
          style={{
            borderRadius: 16,
            border: "var(--glass-border)",
            background: "rgba(255, 94, 150, 0.08)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}
        >
          <strong style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <AlertTriangle size={16} />
            {t.alerts}
          </strong>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--color-muted)", fontSize: 12 }}>
            {alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
