"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, AlarmClockCheck, ArrowLeftRight, Plus } from "lucide-react";
import clsx from "clsx";

export type SplitwiseGroup = {
  id: string;
  name: string;
  total: number;
  owed: number;
  owe: number;
  suggestion: string;
  reminder: string;
};

type SplitwiseAIProps = {
  groups: SplitwiseGroup[];
  onAddGroup: (name: string) => void;
  onGenerateSuggestion: (groupId: string) => void;
  t: {
    title: string;
    subtitle: string;
    addGroup: string;
    placeholder: string;
    owed: string;
    owe: string;
    settle: string;
    reminder: string;
  };
};

export function SplitwiseAI({ groups, onAddGroup, onGenerateSuggestion, t }: SplitwiseAIProps) {
  const [groupName, setGroupName] = useState("");

  return (
    <section className={clsx("glass")} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t.title}</h3>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{t.subtitle}</span>
        </div>
        <Users size={18} color="var(--color-muted)" />
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (groupName.trim()) {
            onAddGroup(groupName.trim());
            setGroupName("");
          }
        }}
        style={{ display: "flex", gap: 10 }}
      >
        <input
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          placeholder={t.placeholder}
          style={{
            flex: 1,
            borderRadius: 14,
            border: "var(--glass-border)",
            background: "rgba(255,255,255,0.04)",
            padding: "12px 14px",
            color: "var(--color-text)",
            fontSize: 13
          }}
        />
        <button
          type="submit"
          className="glass"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          padding: "10px 12px",
            borderRadius: 14,
            border: "var(--glass-border)",
            background: "linear-gradient(135deg, rgba(14, 126, 249, 0.3), rgba(30, 227, 181, 0.22))",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600
          }}
        >
          <Plus size={16} />
          {t.addGroup}
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
        }}
      >
        {groups.map((group, index) => (
          <motion.article
            key={group.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            style={{
              borderRadius: 16,
              border: "var(--glass-border)",
              background: "rgba(255,255,255,0.03)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong style={{ fontSize: 14 }}>{group.name}</strong>
              <span style={{ fontSize: 12, color: "var(--color-muted)" }}>₹{group.total.toLocaleString("en-IN")}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12
              }}
            >
              <span>
                {t.owed}: <strong>₹{group.owed.toLocaleString("en-IN")}</strong>
              </span>
              <span>
                {t.owe}: <strong>₹{group.owe.toLocaleString("en-IN")}</strong>
              </span>
            </div>
            <button
              onClick={() => onGenerateSuggestion(group.id)}
              className="glass"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 12,
                border: "var(--glass-border)",
                background: "linear-gradient(135deg, rgba(14, 126, 249, 0.24), rgba(30, 227, 181, 0.18))",
                cursor: "pointer",
                fontSize: 12
              }}
            >
              <ArrowLeftRight size={16} />
              {t.settle}
            </button>
            <div
              style={{
                borderRadius: 12,
                padding: 12,
                background: "rgba(255,255,255,0.04)",
                fontSize: 12,
                color: "var(--color-muted)"
              }}
            >
              {group.suggestion}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                color: "var(--color-muted)"
              }}
            >
              <AlarmClockCheck size={14} />
              <span>{t.reminder} — {group.reminder}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
