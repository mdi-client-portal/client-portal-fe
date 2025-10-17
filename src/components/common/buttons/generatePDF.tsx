// app/components/PDFButton.tsx
"use client";

import { useState } from "react";

export default function PDFButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);

      // 1. Kirim request ke API route
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Kirim data yang mau di-render di PDF (optional)
        body: JSON.stringify({
          title: "Invoice #12345",
          date: new Date().toISOString(),
          // ... data lain
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // 2. Convert response jadi Blob (binary data)
      const blob = await response.blob();

      // 3. Buat URL dari blob untuk bisa dibuka di browser
      // URL.createObjectURL() membuat temporary URL yang point ke blob di memory
      const url = URL.createObjectURL(blob);

      // 4. Buka di new tab
      // Browser akan otomatis render PDF karena Content-Type: application/pdf
      window.open(url, "_blank");

      // 5. Cleanup: revoke URL setelah beberapa saat untuk free memory
      // Kasih delay supaya browser sempat load PDF-nya
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
