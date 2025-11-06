"use client";

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
import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";

import type { PaymentResponse, Payment } from "@/response/paymentResponse";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

type SortColumn =
  | "invoice_number"
  | "payment_date"
  | "amount_paid"
  | "proof_of_transfer"
  | "voided_at";
type SortDirection = "asc" | "desc";

export default function PaymentsPage() {
  const { data: session } = useSession();
  const jwtToken = session?.user?.token || null;
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR<PaymentResponse>(
    jwtToken ? `${process.env.NEXT_PUBLIC_API_URL}/api/payments/get` : null,
    (url: string) =>
      fetcherWithAuth<PaymentResponse>(url, jwtToken || undefined),
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

    let filteredData = data.data.filter((payment) => {
      const matchesSearch = payment.invoice_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" ? !payment.voided_at : payment.voided_at);
      return matchesSearch && matchesStatus;
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

      <div className="mb-6 space-y-4 rounded-lg border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-2">
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
                onClick={() => setStatusFilter(null)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  statusFilter === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  statusFilter === "active"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("voided")}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  statusFilter === "voided"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Voided
              </button>
            </div>
          </div>
        </div>
        {(searchTerm || statusFilter) && (
          <div className="flex items-center gap-2">
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
            {statusFilter && (
              <button
                onClick={() => setStatusFilter(null)}
                className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
              >
                Status: {statusFilter}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      <Card>
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
                onClick={() => handleSort("payment_date")}
              >
                <div className="flex items-center gap-2">
                  Payment Date
                  {renderSortIcon("payment_date")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-foreground text-right cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("amount_paid")}
              >
                <div className="flex items-center justify-end gap-2">
                  Payment Amount
                  {renderSortIcon("amount_paid")}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Proof of Transfer
              </TableHead>
              <TableHead
                className="font-semibold text-foreground text-right cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("voided_at")}
              >
                <div className="flex items-center justify-end gap-2">
                  Payment Status
                  {renderSortIcon("voided_at")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedData().length > 0 ? (
              getSortedData().map((payment, index) => (
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
                          const base64Data = proof.split(",")[1];
                          const contentType = proof
                            .split(",")[0]
                            .split(":")[1]
                            .split(";")[0];

                          const byteCharacters = atob(base64Data);
                          const byteNumbers = new Array(byteCharacters.length);
                          for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                          }
                          const byteArray = new Uint8Array(byteNumbers);
                          const blob = new Blob([byteArray], {
                            type: contentType,
                          });

                          const blobUrl = URL.createObjectURL(blob);
                          window.open(blobUrl, "_blank");

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
                      <span className="text-red-600">Void</span>
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
