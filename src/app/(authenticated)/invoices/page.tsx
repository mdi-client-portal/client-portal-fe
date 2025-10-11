"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcherWithAuth } from "@/lib/fetcher";
import type { InvoiceResponse } from "@/response/invoiceResponse";
import { CardContent } from "@/components/ui/card";

function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "partial":
      return "secondary";
    case "overdue":
      return "destructive";
    default:
      return "default";
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function InvoicesPage() {
  const { data: session } = useSession();

  const jwtToken = session?.user?.token || null;
  console.log("Using JWT Token from session:", jwtToken);
  const { data, error, isLoading, mutate } = useSWR<InvoiceResponse>(
    jwtToken ? "http://localhost:8080/api/invoices/get" : null,
    (url: string) =>
      fetcherWithAuth<InvoiceResponse>(url, jwtToken || undefined),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  console.log("Fetched invoices data:", data);

  if (isLoading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            All Invoices
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading invoices...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            All Invoices
          </h1>
          <p className="mt-2 text-sm text-destructive">
            Error loading invoices: {error.message}
          </p>
        </div>
      </div>
    );
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          All Invoices
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and manage all your invoices
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">
                Issue Date
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Due Date
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Total
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Payment Status
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Amount Paid
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data && data.data.length > 0 ? (
              data.data.map((invoice) => (
                <TableRow
                  key={invoice.InvoiceID}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-medium">
                    {formatDate(invoice.IssueDate)}
                  </TableCell>
                  <TableCell>{formatDate(invoice.DueDate)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(invoice.Total)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(invoice.PaymentStatus)}
                      className={
                        invoice.PaymentStatus.toLowerCase() === "paid"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : invoice.PaymentStatus.toLowerCase() === "pending" ||
                            invoice.PaymentStatus.toLowerCase() === "partial"
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : ""
                      }
                    >
                      {invoice.PaymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(invoice.AmountPaid)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link href={`/invoices/${invoice.InvoiceID}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
