"use client";

import { useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Wifi, CreditCard } from "lucide-react";
import clsx from "clsx";

export type CreditCardData = {
  id: string;
  brand: string;
  number: string;
  holder: string;
  balance: number;
  limit: number;
  dueDate: string;
};

type CreditCardsCarouselProps = {
  cards: CreditCardData[];
  t: {
    title: string;
    due: string;
    available: string;
  };
};

export function CreditCardsCarousel({ cards, t }: CreditCardsCarouselProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const controls = useAnimation();

  if (inView) {
    controls.start({ x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } });
  }

  const cardsWithUsage = useMemo(
    () =>
      cards.map((card) => ({
        ...card,
        usage: Math.min(100, Math.round((card.balance / card.limit) * 100))
      })),
    [cards]
  );

  return (
    <section className={clsx("glass")} style={{ padding: 20, overflow: "hidden" }} ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t.title}</h3>
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{t.available}</span>
      </div>
      <motion.div
        initial={{ x: 24, opacity: 0 }}
        animate={controls}
        style={{
          display: "flex",
          gap: 16,
          marginTop: 16,
          overflowX: "auto",
          paddingBottom: 4
        }}
        className="scroll"
      >
        {cardsWithUsage.map((card, index) => (
          <motion.article
            key={card.id}
            style={{
              minWidth: 280,
              height: 170,
              borderRadius: 20,
              background: `linear-gradient(135deg, rgba(14, 126, 249, ${0.5 + index * 0.1}), rgba(30, 227, 181, 0.25))`,
              position: "relative",
              padding: 20,
              color: "#eaf8ff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 20px 48px rgba(10, 30, 60, 0.35)"
            }}
            whileHover={{ y: -6 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>{card.brand}</span>
              <Wifi size={18} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "monospace",
                  letterSpacing: 4,
                  fontSize: 16,
                  marginBottom: 16
                }}
              >
                {card.number}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div>
                  <div style={{ opacity: 0.65 }}>Holder</div>
                  <strong>{card.holder}</strong>
                </div>
                <div>
                  <div style={{ opacity: 0.65 }}>{t.due}</div>
                  <strong>{card.dueDate}</strong>
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>Balance</span>
                <span>₹{card.balance.toLocaleString("en-IN")}</span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.25)",
                  marginTop: 8,
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${card.usage}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #62f2ff, #1ee3b5)"
                  }}
                />
              </div>
            </div>
            <CreditCard
              size={44}
              style={{
                position: "absolute",
                right: 20,
                bottom: 20,
                opacity: 0.08
              }}
            />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
