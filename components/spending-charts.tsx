"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import clsx from "clsx";

type SpendingChartsProps = {
  monthly: { name: string; spending: number; aiProjection: number }[];
  categories: { name: string; value: number }[];
  t: {
    monthly: string;
    categories: string;
    projectionLabel: string;
  };
};

const CHART_COLORS = ["#0e7ef9", "#1ee3b5", "#62f2ff", "#78ffd6", "#7c83ff", "#58c5f9"];

export function SpendingCharts({ monthly, categories, t }: SpendingChartsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
        gap: 20,
        width: "100%"
      }}
    >
      <div
        className={clsx("glass")}
        style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t.monthly}</h3>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{t.projectionLabel}</span>
        </div>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--color-muted)" />
              <Tooltip
                contentStyle={{
                  background: "rgba(6, 14, 28, 0.88)",
                  borderRadius: 12,
                  border: "var(--glass-border)",
                  color: "var(--color-text)"
                }}
              />
              <Bar dataKey="spending" name="Spending" fill="#0e7ef9" radius={[8, 8, 0, 0]} />
              <Bar
                dataKey="aiProjection"
                name="AI Projection"
                fill="rgba(30, 227, 181, 0.65)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={clsx("glass")} style={{ padding: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          {t.categories}
        </h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={6}
              >
                {categories.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {categories.map((category, index) => (
            <span
              key={category.name}
              style={{
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "var(--color-muted)"
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: CHART_COLORS[index % CHART_COLORS.length]
                }}
              />
              {category.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
