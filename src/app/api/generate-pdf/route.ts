// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import PDFTemplate from "@/components/common/template/invoiceTemplate";
import React from "react";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting PDF generation...");

    const body = await request.json();
    console.log("Request body:", body);

    const { title, date } = body;

    console.log("Rendering PDF template...");
    const pdfBuffer = await renderToBuffer(
      React.createElement(PDFTemplate, {
        title: title || "Default Title",
        date: date || new Date().toISOString(),
      })
    );

    console.log("PDF generated successfully, size:", pdfBuffer.length);

    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="document-${Date.now()}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET method untuk testing mudah
export async function GET() {
  try {
    console.log("Starting PDF generation via GET...");

    console.log("Rendering PDF template...");
    const pdfBuffer = await renderToBuffer(
      React.createElement(PDFTemplate, {
        title: "Test Invoice",
        date: new Date().toISOString(),
      })
    );

    console.log("PDF generated successfully, size:", pdfBuffer.length);

    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="test-document.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
