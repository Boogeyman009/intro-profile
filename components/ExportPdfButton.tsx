"use client";

import { Profile } from "@/lib/profile";

function wrapText(doc: import("jspdf").jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export default function ExportPdfButton({
  profile,
  className = "btn btn-secondary",
  label = "↓ Download PDF",
}: {
  profile: Profile;
  className?: string;
  label?: string;
}) {
  async function handleExport() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(profile.name, margin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(profile.title, margin, y);
    y += 6;

    doc.setFontSize(9);
    const contact = [profile.email, profile.phone, profile.location, profile.linkedin].filter(Boolean).join("  ·  ");
    doc.text(contact, margin, y);
    y += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PROFESSIONAL SUMMARY", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    y = wrapText(doc, profile.summary, margin, y, contentWidth, 4.5) + 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("WORK EXPERIENCE", margin, y);
    y += 5;

    for (const exp of profile.experience) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${exp.role} — ${exp.company}`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(exp.period, pageWidth - margin, y, { align: "right" });
      y += 5;

      doc.setFontSize(9);
      for (const hl of exp.highlights) {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        y = wrapText(doc, `• ${hl}`, margin + 2, y, contentWidth - 2, 4.2) + 1;
      }
      y += 3;
    }

    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TECHNICAL SKILLS", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    for (const [category, items] of Object.entries(profile.skills)) {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      y = wrapText(doc, `${category}:`, margin, y, contentWidth, 4.2);
      doc.setFont("helvetica", "normal");
      y = wrapText(doc, items.join(", "), margin + 2, y, contentWidth - 2, 4.2) + 2;
    }

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("EDUCATION", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    for (const edu of profile.education) {
      const line = `${edu.degree} — ${edu.institution}${edu.details ? ` (${edu.details})` : ""} · ${edu.year}`;
      y = wrapText(doc, line, margin, y, contentWidth, 4.5) + 1;
    }

    const filename = `${profile.name.replace(/\s+/g, "_")}_Profile.pdf`;
    doc.save(filename);
  }

  return (
    <button className={className} onClick={handleExport}>
      {label}
    </button>
  );
}
