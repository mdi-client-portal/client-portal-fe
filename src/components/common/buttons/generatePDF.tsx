// app/components/PDFButton.tsx
"use client";

import { useState } from "react";

export default function PDFButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: "Invoice #12345",
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
    >
      {isGenerating ? "Generating..." : "View"}
    </button>
  );
}
