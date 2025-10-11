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
import { Eye } from "lucide-react";
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
                Payment Date
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Payment Amount
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Proof of Transfer
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Action
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
                  <TableCell className="font-medium">
                    {formatDate(payment.payment_date)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(payment.amount_paid)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.proof_of_transfer}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
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
