"use client";

import { Sparkles, Search, Bell, MessageCircle } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import clsx from "clsx";

type NavbarProps = {
  onSearch: (value: string) => void;
  t: {
    brand: string;
    searchPlaceholder: string;
    aiPulse: string;
    notifications: string;
    profileGreeting: string;
    profileRole: string;
    languageLabel: string;
  };
  language: string;
  onLanguageChange: (language: string) => void;
};

const languageOptions = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" }
];

export function Navbar({ onSearch, t, language, onLanguageChange }: NavbarProps) {
  const [search, setSearch] = useState("");

  return (
    <header
      className={clsx("glass fade-in")}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        gap: 18,
        position: "sticky",
        top: 0,
        zIndex: 30
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "16px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #0e7ef9, #1ee3b5)"
          }}
        >
          <Sparkles size={24} color="#f4fbff" />
        </div>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              letterSpacing: 0.1,
              fontWeight: 600
            }}
            className="gradient-text"
          >
            {t.brand}
          </h1>
          <span style={{ color: "var(--color-muted)", fontSize: 13 }}>
            {t.aiPulse}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flex: 1,
          maxWidth: 480
        }}
      >
        <div
          className="glass"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            gap: 12,
            width: "100%",
            background: "rgba(10, 16, 28, 0.6)"
          }}
        >
          <Search size={18} color="var(--color-muted)" />
          <input
            value={search}
            onChange={(event) => {
              const value = event.target.value;
              setSearch(value);
              onSearch(value);
            }}
            placeholder={t.searchPlaceholder}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text)",
              width: "100%",
              fontSize: 14
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <select
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          className="glass"
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            background: "rgba(255, 255, 255, 0.06)",
            color: "var(--color-text)",
            border: "var(--glass-border)",
            fontSize: 13
          }}
          aria-label={t.languageLabel}
        >
          {languageOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
        <ThemeToggle />
        <button
          className="glass"
          style={{
            width: 48,
            height: 48,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            border: "var(--glass-border)",
            cursor: "pointer"
          }}
          aria-label={t.notifications}
        >
          <Bell size={18} />
        </button>
        <button
          className="glass"
          style={{
            height: 48,
            padding: "0 18px",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(135deg, rgba(14, 126, 249, 0.2), rgba(30, 227, 181, 0.12))",
            border: "var(--glass-border)",
            cursor: "pointer"
          }}
          aria-label="Chat with AI"
        >
          <MessageCircle size={18} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{t.aiPulse}</span>
        </button>
        <div
          className="glass"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderRadius: 16
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b8bfd, #5afbd4)",
              display: "grid",
              placeItems: "center",
              color: "#031021",
              fontWeight: 600
            }}
          >
            A
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.profileGreeting}</div>
            <span style={{ fontSize: 11, color: "var(--color-muted)" }}>{t.profileRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
