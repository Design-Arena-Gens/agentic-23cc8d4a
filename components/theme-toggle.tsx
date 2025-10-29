"use client";

import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="glass"
        style={{
          width: 44,
          height: 44,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%"
        }}
      >
        <Sun size={18} />
      </button>
    );
  }

  const isLight = theme === "light";

  return (
    <button
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="glass"
      aria-label="Toggle theme"
      style={{
        width: 48,
        height: 48,
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
        cursor: "pointer",
        border: "var(--glass-border)"
      }}
    >
      {isLight ? <MoonStar size={18} /> : <Sun size={18} />}
    </button>
  );
}
