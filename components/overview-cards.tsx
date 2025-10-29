"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import clsx from "clsx";

export type OverviewStat = {
  id: string;
  title: string;
  value: string;
  delta: string;
  positive: boolean;
  hint: string;
  accent?: string;
  actionLabel?: string;
  onAction?: () => void;
};

type OverviewCardsProps = {
  stats: OverviewStat[];
};

export function OverviewCards({ stats }: OverviewCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
      }}
    >
      {stats.map((stat, index) => (
        <motion.article
          key={stat.id}
          className={clsx("glass")}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          style={{
            padding: "18px 20px",
            position: "relative",
            overflow: "hidden",
            background:
              stat.id === "wallet"
                ? "linear-gradient(135deg, rgba(14, 126, 249, 0.42), rgba(30, 227, 181, 0.22))"
                : undefined
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                stat.accent ??
                "radial-gradient(circle at top right, rgba(30, 227, 181, 0.22), transparent 65%)",
              opacity: 0.85,
              pointerEvents: "none"
            }}
          />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{stat.title}</h3>
              <div
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "6px 10px",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: stat.positive ? "#2de0ac" : "#ff5a8c"
                }}
              >
                {stat.positive ? (
                  <TrendingUp size={14} />
                ) : stat.id === "wallet" ? (
                  <Zap size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {stat.delta}
              </div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 10 }}>{stat.value}</div>
            <p style={{ fontSize: 13, color: "var(--color-muted)", margin: 0 }}>{stat.hint}</p>
            {stat.actionLabel && (
              <button
                onClick={stat.onAction}
                style={{
                  marginTop: 16,
                  borderRadius: 12,
                  border: "var(--glass-border)",
                  background: "rgba(255,255,255,0.12)",
                  padding: "10px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "inherit",
                  cursor: "pointer"
                }}
              >
                {stat.actionLabel}
              </button>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
