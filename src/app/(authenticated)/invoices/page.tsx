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

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcherWithAuth } from "@/lib/fetcher";
import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InvoiceResponse } from "@/response/invoiceResponse";

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

function isOverdue(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

type SortColumn =
  | "invoice_number"
  | "issue_date"
  | "due_date"
  | "total"
  | "payment_status"
  | "amount_paid"
  | "voided_at";
type SortDirection = "asc" | "desc";

export default function InvoicesPage() {
  const { data: session } = useSession();
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(
    null
  );
  const [overdueFilter, setOverdueFilter] = useState<string | null>(null);
  const [voidedFilter, setVoidedFilter] = useState<string | null>(null);

  const jwtToken = session?.user?.token || null;
  const { data, error, isLoading } = useSWR<InvoiceResponse>(
    jwtToken ? `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/get` : null,
    (url: string) =>
      fetcherWithAuth<InvoiceResponse>(url, jwtToken || undefined),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedData = () => {
    if (!data?.data) {
      return [];
    }

    let filteredData = data.data.filter((invoice) => {
      const matchesSearch = invoice.invoice_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesPaymentStatus =
        !paymentStatusFilter ||
        invoice.payment_status.toLowerCase() ===
          paymentStatusFilter.toLowerCase();

      const matchesOverdue =
        !overdueFilter ||
        (overdueFilter === "overdue"
          ? isOverdue(invoice.due_date)
          : !isOverdue(invoice.due_date));

      const matchesVoided =
        !voidedFilter ||
        (voidedFilter === "active" ? !invoice.voided_at : invoice.voided_at);

      return (
        matchesSearch && matchesPaymentStatus && matchesOverdue && matchesVoided
      );
    });

    if (sortColumn === null) {
      return filteredData;
    }

    const sortedData = [...filteredData].sort((a, b) => {
      let aVal: any = a[sortColumn as keyof typeof a];
      let bVal: any = b[sortColumn as keyof typeof b];

      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sortedData;
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <div className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleGeneratePDF = async (invoiceId: string) => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice_id: invoiceId,
          jwt_token: jwtToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

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

      <div className="mb-6 space-y-4 rounded-lg border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground">
              Search Invoice Number
            </label>
            <Input
              type="text"
              placeholder="Search by invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Payment Status
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              <button
                onClick={() => setPaymentStatusFilter(null)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  paymentStatusFilter === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {["paid", "partial", "unpaid"].map((status) => (
                <button
                  key={status}
                  onClick={() => setPaymentStatusFilter(status)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors capitalize ${
                    paymentStatusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Overdue Status
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              <button
                onClick={() => setOverdueFilter(null)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  overdueFilter === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setOverdueFilter("overdue")}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  overdueFilter === "overdue"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Overdue
              </button>
              <button
                onClick={() => setOverdueFilter("ontime")}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  overdueFilter === "ontime"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Before Due
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Voided Status
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            <button
              onClick={() => setVoidedFilter(null)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                voidedFilter === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVoidedFilter("active")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                voidedFilter === "active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setVoidedFilter("voided")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                voidedFilter === "voided"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Voided
            </button>
          </div>
        </div>

        {(searchTerm ||
          paymentStatusFilter ||
          overdueFilter ||
          voidedFilter) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
              >
                Invoice: {searchTerm}
                <X className="h-3 w-3" />
              </button>
            )}
            {paymentStatusFilter && (
              <button
                onClick={() => setPaymentStatusFilter(null)}
                className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
              >
                Payment: {paymentStatusFilter}
                <X className="h-3 w-3" />
              </button>
            )}
            {overdueFilter && (
              <button
                onClick={() => setOverdueFilter(null)}
                className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
              >
                Overdue:{" "}
                {overdueFilter === "overdue" ? "Overdue" : "Belum Telat"}
                <X className="h-3 w-3" />
              </button>
            )}
            {voidedFilter && (
              <button
                onClick={() => setVoidedFilter(null)}
                className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
              >
                Voided: {voidedFilter}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead
                className="font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("invoice_number")}
              >
                <div className="flex items-center gap-2">
                  Invoice Number
                  {renderSortIcon("invoice_number")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("issue_date")}
              >
                <div className="flex items-center gap-2">
                  Issue Date
                  {renderSortIcon("issue_date")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("due_date")}
              >
                <div className="flex items-center gap-2">
                  Due Date
                  {renderSortIcon("due_date")}
                </div>
              </TableHead>
              <TableHead
                className="text-right font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center justify-end gap-2">
                  Total
                  {renderSortIcon("total")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("payment_status")}
              >
                <div className="flex items-center gap-2">
                  Payment Status
                  {renderSortIcon("payment_status")}
                </div>
              </TableHead>
              <TableHead
                className="text-right font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("amount_paid")}
              >
                <div className="flex items-center justify-end gap-2">
                  Amount Paid
                  {renderSortIcon("amount_paid")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("voided_at")}
              >
                <div className="flex items-center gap-2">
                  Invoice Status
                  {renderSortIcon("voided_at")}
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedData().length > 0 ? (
              getSortedData().map((invoice, index) => (
                <TableRow
                  key={index}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-semibold">
                    {invoice.invoice_number}
                  </TableCell>
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
                  <TableCell>
                    {invoice.voided_at ? (
                      <span className="text-red-600 font-semibold">Void</span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleGeneratePDF(invoice.invoice_id)}
                    >
                      View PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
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
