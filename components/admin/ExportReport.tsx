"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function firstOfMonthStr() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split("T")[0];
}

const INPUT_CLASS =
  "h-10 rounded-xl border border-jb-border bg-white px-3 text-sm text-jb-text " +
  "focus:outline-none focus:ring-2 focus:ring-jb-primary transition-colors";

interface ReportData {
  generatedAt: string;
  periodFrom: string;
  periodTo: string;
  stats: { label: string; count: number }[];
}

export function ExportReport() {
  const [from, setFrom] = useState(firstOfMonthStr());
  const [to, setTo] = useState(todayStr());
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState("");

  function validate(): boolean {
    setError("");
    if (!from || !to) { setError("Please select both a From and To date."); return false; }
    if (from > to) { setError("The From date must be on or before the To date."); return false; }
    return true;
  }

  async function handleExportCsv() {
    if (!validate()) return;
    setLoadingCsv(true);
    try {
      const res = await fetch(`/api/admin/report?from=${from}&to=${to}&format=csv`);
      if (!res.ok) { setError("Failed to generate report. Please try again."); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pdjb-report-${from}-to-${to}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoadingCsv(false);
    }
  }

  async function handleExportPdf() {
    if (!validate()) return;
    setLoadingPdf(true);
    try {
      const res = await fetch(`/api/admin/report?from=${from}&to=${to}&format=json`);
      if (!res.ok) { setError("Failed to generate report. Please try again."); return; }
      const data: ReportData = await res.json();

      // Dynamic import — jsPDF only loads when actually needed
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageW = doc.internal.pageSize.getWidth();
      const margin = 20;
      const colRight = pageW - margin;

      // Header band
      doc.setFillColor(37, 99, 235); // jb-primary
      doc.rect(0, 0, pageW, 38, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Protocol Directorate JobBoard", margin, 16);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Activity Report", margin, 25);
      doc.text(`Generated: ${data.generatedAt}`, margin, 33);

      // Period subheading
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Period: ${data.periodFrom} — ${data.periodTo}`, margin, 52);

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin, 57, colRight, 57);

      // Table header
      const tableTop = 65;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, tableTop - 5, colRight - margin, 10, 2, 2, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("METRIC", margin + 4, tableTop + 1.5);
      doc.text("COUNT", colRight - 4, tableTop + 1.5, { align: "right" });

      // Table rows
      doc.setFont("helvetica", "normal");
      data.stats.forEach((s, i) => {
        const y = tableTop + 14 + i * 12;
        if (i % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 5, colRight - margin, 12, "F");
        }
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(s.label, margin + 4, y + 2);
        doc.setFont("helvetica", "bold");
        doc.text(String(s.count), colRight - 4, y + 2, { align: "right" });
        doc.setFont("helvetica", "normal");
      });

      // Footer
      const footerY = 272;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, footerY, colRight, footerY);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("Protocol Directorate JobBoard  ·  Confidential", margin, footerY + 6);
      doc.text("Page 1 of 1", colRight, footerY + 6, { align: "right" });

      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pdjb-report-${from}-to-${to}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setLoadingPdf(false);
    }
  }

  const busy = loadingCsv || loadingPdf;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-jb-border shadow-sm p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-jb-text">Export Activity Report</h2>
        <p className="mt-0.5 text-sm text-jb-text-muted">
          Download a summary of listing activity for any date range.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-jb-text-muted uppercase tracking-wide">
            From
          </label>
          <input
            type="date"
            value={from}
            max={to || todayStr()}
            onChange={(e) => setFrom(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-jb-text-muted uppercase tracking-wide">
            To
          </label>
          <input
            type="date"
            value={to}
            min={from}
            max={todayStr()}
            onChange={(e) => setTo(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCsv}
            loading={loadingCsv}
            disabled={busy}
            variant="secondary"
          >
            <Download size={15} />
            {loadingCsv ? "Generating…" : "CSV"}
          </Button>
          <Button
            onClick={handleExportPdf}
            loading={loadingPdf}
            disabled={busy}
          >
            <FileText size={15} />
            {loadingPdf ? "Generating…" : "PDF"}
          </Button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-jb-danger">{error}</p>}

      <div className="mt-5 border-t border-jb-border pt-4">
        <p className="text-xs text-jb-text-muted font-medium mb-2">Report includes:</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-jb-text-muted">
          {[
            "Total Posts",
            "Active Listings",
            "Auto-Expired (30-day)",
            "Archived by Admin",
            "Expiring Soon (≤7 days)",
          ].map((s) => (
            <span key={s} className="flex items-center gap-1.5 before:content-['·'] before:text-jb-primary">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
