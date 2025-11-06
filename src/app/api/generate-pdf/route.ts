// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import PDFTemplate from "@/components/common/template/invoiceTemplate";
import type { InvoiceWithDetailResponse } from "@/response/invoiceDetailResponse";
import React from "react";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { invoice_id, jwt_token } = body;

    if (!invoice_id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const apiResponse = await fetch(
      `${process.env.API_URL}/api/invoices/get/detail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt_token}`,
        },
        body: JSON.stringify({
          invoice_id: invoice_id,
        }),
      }
    );

    if (!apiResponse.ok) {
      throw new Error(
        `API call failed: ${apiResponse.status} ${apiResponse.statusText}`
      );
    }

    const invoiceData: InvoiceWithDetailResponse = await apiResponse.json();

    const element = React.createElement(PDFTemplate, { invoiceData }) as any;
    const pdfBuffer = await renderToBuffer(element);

    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${
          invoiceData.invoice.invoice_number || invoice_id
        }.pdf"`,
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
    const dummyInvoiceData: InvoiceWithDetailResponse = {
      invoice: {
        invoice_id: "test-123",
        invoice_number: "INV-2025-001",
        issue_date: "2025-10-17T00:00:00Z",
        due_date: "2025-11-17T00:00:00Z",
        tax_rate: 11,
        tax_amount: 110000,
        sub_total: 1000000,
        total: 1110000,
        tax_invoice_number: "TAX-001",
        amount_paid: 500000,
        payment_status: "partial",
        voided_at: "",
      },
      invoice_details: [
        {
          invoice_detail_id: "detail-1",
          invoice_id: "test-123",
          amount: 500000,
          created_at: "2025-10-17T00:00:00Z",
          price_per_delivery: 50000,
          transaction_note: "SMS Gateway Service",
          updated_at: "2025-10-17T00:00:00Z",
          delivery_count: 10,
          deleted_at: "",
        },
        {
          invoice_detail_id: "detail-2",
          invoice_id: "test-123",
          amount: 500000,
          created_at: "2025-10-17T00:00:00Z",
          price_per_delivery: 25000,
          transaction_note: "Email Service",
          updated_at: "2025-10-17T00:00:00Z",
          delivery_count: 20,
          deleted_at: "",
        },
      ],
    };

    const pdfBuffer = await renderToBuffer(
      React.createElement(PDFTemplate, { invoiceData: dummyInvoiceData }) as any
    );

    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="test-invoice.pdf"`,
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
