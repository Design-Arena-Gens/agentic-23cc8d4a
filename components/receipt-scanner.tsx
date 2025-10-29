"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import clsx from "clsx";

export type ReceiptRecord = {
  id: string;
  fileName: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  status: "processing" | "done";
  summary: string;
  url?: string;
};

type ReceiptScannerProps = {
  receipts: ReceiptRecord[];
  onUpload: (files: FileList) => void;
  selectedReceipt?: ReceiptRecord | null;
  onSelect: (id: string) => void;
  onCloseDetail: () => void;
  t: {
    title: string;
    uploadCta: string;
    dragLabel: string;
    empty: string;
    detailTitle: string;
    summary: string;
    extracted: string;
    view: string;
  };
};

export function ReceiptScanner({
  receipts,
  onUpload,
  selectedReceipt,
  onSelect,
  onCloseDetail,
  t
}: ReceiptScannerProps) {
  const [open, setOpen] = useState(false);
  const pending = useMemo(() => receipts.some((receipt) => receipt.status === "processing"), [receipts]);

  return (
    <>
      <section className={clsx("glass")} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t.title}</h3>
            <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{t.uploadCta}</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(14, 126, 249, 0.24), rgba(30, 227, 181, 0.18))",
              border: "var(--glass-border)",
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            <Upload size={16} />
            {pending ? "Processing..." : t.uploadCta}
          </button>
        </header>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div
            style={{
              flex: "2 1 360px",
              borderRadius: 16,
              border: "var(--glass-border)",
              background: "rgba(255,255,255,0.02)",
              padding: 16,
              maxHeight: 300,
              overflowY: "auto"
            }}
            className="scroll"
          >
            {receipts.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-muted)", fontSize: 12 }}>
                {t.empty}
              </div>
            )}
            {receipts.map((receipt) => (
              <button
                key={receipt.id}
                onClick={() => onSelect(receipt.id)}
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "var(--glass-border)",
                  padding: 14,
                  marginBottom: 12,
                  background:
                    selectedReceipt?.id === receipt.id
                      ? "linear-gradient(135deg, rgba(14, 126, 249, 0.2), rgba(30, 227, 181, 0.15))"
                      : "rgba(255,255,255,0.02)",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, rgba(14, 126, 249, 0.55), rgba(30, 227, 181, 0.35))"
                  }}
                >
                  {receipt.status === "processing" ? <Loader2 size={18} className="spin" /> : <FileText size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <strong>{receipt.merchant}</strong>
                    <span>₹{receipt.amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-muted)" }}>
                    {receipt.date} • {receipt.category}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedReceipt && (
              <motion.div
                key={selectedReceipt.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                style={{
                  flex: "1 1 280px",
                  borderRadius: 16,
                  border: "var(--glass-border)",
                  background: "rgba(255,255,255,0.02)",
                  padding: 18,
                  minHeight: 220,
                  position: "relative"
                }}
              >
                <button
                  onClick={onCloseDetail}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "transparent",
                    border: "none",
                    color: "var(--color-muted)",
                    cursor: "pointer"
                  }}
                  aria-label="Close receipt"
                >
                  <X size={16} />
                </button>
                <h4 style={{ margin: "0 0 8px 0", fontSize: 15 }}>{t.detailTitle}</h4>
                <p style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 0 }}>{selectedReceipt.summary}</p>

                <dl style={{ margin: "14px 0", display: "grid", gap: 8, fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "var(--color-muted)" }}>Merchant</dt>
                    <dd style={{ margin: 0 }}>{selectedReceipt.merchant}</dd>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "var(--color-muted)" }}>Date</dt>
                    <dd style={{ margin: 0 }}>{selectedReceipt.date}</dd>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "var(--color-muted)" }}>Amount</dt>
                    <dd style={{ margin: 0 }}>₹{selectedReceipt.amount.toLocaleString("en-IN")}</dd>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "var(--color-muted)" }}>Category</dt>
                    <dd style={{ margin: 0 }}>{selectedReceipt.category}</dd>
                  </div>
                </dl>

                {selectedReceipt.url && (
                  <a
                    href={selectedReceipt.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 12,
                      fontSize: 12,
                      background: "rgba(255,255,255,0.05)"
                    }}
                  >
                    <FileText size={14} />
                    {t.view}
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 32,
          bottom: 32,
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #0e7ef9, #1ee3b5)",
          color: "#021020",
          fontWeight: 700,
          fontSize: 26,
          cursor: "pointer",
          boxShadow: "0 18px 36px rgba(12, 90, 160, 0.45)",
          zIndex: 35
        }}
        aria-label="Upload receipt"
      >
        +
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(4, 12, 24, 0.68)",
              backdropFilter: "blur(14px)",
              zIndex: 50,
              display: "grid",
              placeItems: "center",
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass"
              style={{
                width: "min(520px, 100%)",
                padding: "28px 24px",
                position: "relative"
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  border: "none",
                  background: "transparent",
                  color: "var(--color-muted)",
                  cursor: "pointer"
                }}
                aria-label="Close upload modal"
              >
                <X size={18} />
              </button>
              <h3 style={{ margin: "0 0 12px 0", fontSize: 18 }}>{t.uploadCta}</h3>
              <p style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 0 }}>{t.dragLabel}</p>
              <label
                style={{
                  marginTop: 20,
                  borderRadius: 18,
                  border: "2px dashed rgba(255,255,255,0.12)",
                  padding: "32px 20px",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--color-muted)",
                  cursor: "pointer",
                  gap: 10
                }}
              >
                <Upload size={28} />
                <span style={{ fontSize: 13 }}>{t.dragLabel}</span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(event) => {
                    if (event.target.files?.length) {
                      onUpload(event.target.files);
                      setOpen(false);
                    }
                  }}
                />
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
