"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcherWithAuth } from "@/lib/fetcher";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceResponse } from "@/response/invoiceResponse";
import Link from "next/link";

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

function isOverdue(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export default function Home() {
  const { data: session } = useSession();
  const jwtToken = session?.user?.token || null;

  const { data: invoicesData, isLoading } = useSWR<InvoiceResponse>(
    jwtToken ? `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/get` : null,
    (url: string) =>
      fetcherWithAuth<InvoiceResponse>(url, jwtToken || undefined),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Calculate summary metrics
  const totalUnpaidAmount =
    invoicesData?.data?.reduce((total, invoice) => {
      if (invoice.payment_status.toLowerCase() !== "paid") {
        return total + (invoice.total - invoice.amount_paid);
      }
      return total;
    }, 0) || 0;

  const totalPaidAmount =
    invoicesData?.data?.reduce((total, invoice) => {
      return total + invoice.amount_paid;
    }, 0) || 0;

  const overdueInvoices =
    invoicesData?.data?.filter(
      (invoice) =>
        isOverdue(invoice.due_date) &&
        invoice.payment_status.toLowerCase() !== "paid"
    ).length || 0;

  const recentInvoices = invoicesData?.data?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Overview of your account and recent activities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Outstanding
          </h3>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {formatCurrency(totalUnpaidAmount)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Paid
          </h3>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {formatCurrency(totalPaidAmount)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Overdue Invoices
          </h3>
          <p className="mt-2 text-3xl font-bold text-destructive">
            {overdueInvoices}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Invoices
          </h3>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {invoicesData?.data?.length || 0}
          </p>
        </Card>
      </div>

      {/* Recent Invoices */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Invoices
          </h2>
          <Link
            href="/invoices"
            className="text-sm text-primary hover:text-primary/90"
          >
            View all
          </Link>
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
                  Status
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Amount Paid
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice, index) => (
                  <TableRow
                    key={index}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      {formatDate(invoice.issue_date)}
                    </TableCell>
                    <TableCell
                      className={`${
                        isOverdue(invoice.due_date)
                          ? "bg-red-100 text-red-900 font-semibold"
                          : ""
                      }`}
                    >
                      {formatDate(invoice.due_date)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(invoice.payment_status)}
                        className={
                          invoice.payment_status.toLowerCase() === "paid"
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : invoice.payment_status.toLowerCase() ===
                                "pending" ||
                              invoice.payment_status.toLowerCase() === "partial"
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : ""
                        }
                      >
                        {invoice.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.amount_paid)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No recent invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
