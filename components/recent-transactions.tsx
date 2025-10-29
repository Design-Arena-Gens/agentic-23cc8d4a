"use client";

import { useState } from "react";
import { Filter, FilterX, ChevronDown } from "lucide-react";
import clsx from "clsx";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  method: string;
};

export type TransactionFilter = {
  category: string;
  method: string;
};

type RecentTransactionsProps = {
  transactions: Transaction[];
  onFilterChange: (filter: TransactionFilter) => void;
  filters: TransactionFilter;
  t: {
    title: string;
    filterBy: string;
    category: string;
    method: string;
    reset: string;
    empty: string;
  };
};

const CATEGORY_OPTIONS = ["All", "Food", "Travel", "Bills", "Shopping", "Wellness", "Utilities"];
const METHOD_OPTIONS = ["All", "UPI", "Card", "Cash", "Wallet"];

export function RecentTransactions({ transactions, onFilterChange, filters, t }: RecentTransactionsProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (type: keyof TransactionFilter, value: string) => {
    onFilterChange({ ...filters, [type]: value });
  };

  return (
    <section className={clsx("glass")} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t.title}</h3>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{t.filterBy}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 12,
              border: "var(--glass-border)",
              cursor: "pointer",
              background: "rgba(255,255,255,0.04)",
              fontSize: 13
            }}
          >
            <Filter size={16} />
            {t.filterBy}
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => onFilterChange({ category: "All", method: "All" })}
            className="glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 12,
              border: "var(--glass-border)",
              cursor: "pointer",
              background: "rgba(255,255,255,0.02)",
              fontSize: 12
            }}
          >
            <FilterX size={16} />
            {t.reset}
          </button>
        </div>
      </header>

      {showFilters && (
        <div
          className="glass"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            padding: 16,
            borderRadius: 14
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
            <span style={{ color: "var(--color-muted)" }}>{t.category}</span>
            <select
              value={filters.category}
              onChange={(event) => handleChange("category", event.target.value)}
              style={{
                borderRadius: 12,
                padding: "10px 12px",
                border: "var(--glass-border)",
                background: "rgba(255,255,255,0.06)",
                color: "var(--color-text)"
              }}
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
            <span style={{ color: "var(--color-muted)" }}>{t.method}</span>
            <select
              value={filters.method}
              onChange={(event) => handleChange("method", event.target.value)}
              style={{
                borderRadius: 12,
                padding: "10px 12px",
                border: "var(--glass-border)",
                background: "rgba(255,255,255,0.06)",
                color: "var(--color-text)"
              }}
            >
              {METHOD_OPTIONS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div style={{ overflowX: "auto" }} className="scroll">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 640
          }}
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                fontSize: 12,
                color: "var(--color-muted)",
                letterSpacing: 0.6
              }}
            >
              <th style={{ padding: "12px 10px" }}>Date</th>
              <th style={{ padding: "12px 10px" }}>Description</th>
              <th style={{ padding: "12px 10px" }}>Category</th>
              <th style={{ padding: "12px 10px" }}>Method</th>
              <th style={{ padding: "12px 10px", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "24px 10px",
                    color: "var(--color-muted)",
                    fontSize: 13
                  }}
                >
                  {t.empty}
                </td>
              </tr>
            )}
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  fontSize: 13
                }}
              >
                <td style={{ padding: "12px 10px" }}>{transaction.date}</td>
                <td style={{ padding: "12px 10px", fontWeight: 600 }}>{transaction.description}</td>
                <td style={{ padding: "12px 10px" }}>{transaction.category}</td>
                <td style={{ padding: "12px 10px" }}>{transaction.method}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 600 }}>
                  ₹{transaction.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
