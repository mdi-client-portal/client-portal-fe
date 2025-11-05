"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcherWithAuth } from "@/lib/fetcher";

import type { PaymentResponse, Payment } from "@/response/paymentResponse";

// Helper: format tanggal
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper: format currency IDR
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

export default function PaymentsPage() {
  const { data: session } = useSession();
  const jwtToken = session?.user?.token || null;

  // Fetch data dari API payments/get
  const { data, error, isLoading } = useSWR<PaymentResponse>(
    jwtToken ? `${process.env.NEXT_PUBLIC_API_URL}/api/payments/get` : null,
    (url: string) =>
      fetcherWithAuth<PaymentResponse>(url, jwtToken || undefined),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="mt-2 text-muted-foreground">Loading payments...</p>
      </div>
    );

  if (error)
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="mt-2 text-destructive">
          Error loading payments: {error.message}
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Payments
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all payment records
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">
                Invoice Number
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Payment Date
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Payment Amount
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Proof of Transfer
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Payment Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data && data.data.length > 0 ? (
              data.data.map((payment, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-semibold">
                    {payment.invoice_number}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDate(payment.payment_date)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(payment.amount_paid)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    <button
                      onClick={() => {
                        const proof = payment.proof_of_transfer;
                        if (!proof) {
                          alert("No proof of transfer available");
                          return;
                        }

                        try {
                          // Ambil data base64 dari string
                          const base64Data = proof.split(",")[1];
                          const contentType = proof
                            .split(",")[0]
                            .split(":")[1]
                            .split(";")[0];

                          // Decode base64 ke Blob
                          const byteCharacters = atob(base64Data);
                          const byteNumbers = new Array(byteCharacters.length);
                          for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                          }
                          const byteArray = new Uint8Array(byteNumbers);
                          const blob = new Blob([byteArray], {
                            type: contentType,
                          });

                          // Buat object URL dan buka di tab baru
                          const blobUrl = URL.createObjectURL(blob);
                          window.open(blobUrl, "_blank");

                          // Hapus URL setelah beberapa detik untuk hemat memori
                          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                        } catch (err) {
                          console.error("Error opening image:", err);
                        }
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      See Details
                    </button>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {payment.voided_at ? (
                      <span className="text-red-600">Voided</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
