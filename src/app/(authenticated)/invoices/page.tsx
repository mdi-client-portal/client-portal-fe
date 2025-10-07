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

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { InvoiceResponse } from "@/response/invoiceResponse";

// Sample invoice data
const invoices = [
  {
    id: "INV-001",
    issueDate: "2025-01-15",
    dueDate: "2025-02-15",
    total: 1250.0,
    paymentStatus: "Paid",
    amountPaid: 1250.0,
  },
  {
    id: "INV-002",
    issueDate: "2025-02-01",
    dueDate: "2025-03-01",
    total: 3500.0,
    paymentStatus: "Pending",
    amountPaid: 0,
  },
  {
    id: "INV-003",
    issueDate: "2024-12-20",
    dueDate: "2025-01-20",
    total: 875.5,
    paymentStatus: "Overdue",
    amountPaid: 0,
  },
  {
    id: "INV-004",
    issueDate: "2025-02-10",
    dueDate: "2025-03-10",
    total: 2100.0,
    paymentStatus: "Paid",
    amountPaid: 2100.0,
  },
  {
    id: "INV-005",
    issueDate: "2025-02-15",
    dueDate: "2025-03-15",
    total: 4250.0,
    paymentStatus: "Pending",
    amountPaid: 0,
  },
];

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "Paid":
      return "default";
    case "Pending":
      return "secondary";
    case "Overdue":
      return "destructive";
    default:
      return "default";
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function InvoicesPage() {
  const { data, error, isLoading, mutate } = useSWR<InvoiceResponse[]>(
    `${process.env.API_URL}`,
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
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
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="transition-colors hover:bg-muted/30"
              >
                <TableCell className="font-medium">
                  {formatDate(invoice.issueDate)}
                </TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.total)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(invoice.paymentStatus)}
                    className={
                      invoice.paymentStatus === "Paid"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : invoice.paymentStatus === "Pending"
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : ""
                    }
                  >
                    {invoice.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoice.amountPaid)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link href={`/invoices/${invoice.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
