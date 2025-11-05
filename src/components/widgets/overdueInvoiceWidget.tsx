"use client";

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcherWithAuth } from "@/lib/fetcher";
import { AlertCircle } from "lucide-react";
import type { InvoiceResponse } from "@/response/invoiceResponse";

function isOverdue(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export function OverdueInvoiceWidget() {
  const { data: session } = useSession();
  const jwtToken = session?.user?.token || null;

  const { data } = useSWR<InvoiceResponse>(
    jwtToken ? `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/get` : null,
    (url: string) =>
      fetcherWithAuth<InvoiceResponse>(url, jwtToken || undefined),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const overdueCount =
    data?.data?.filter(
      (invoice) =>
        isOverdue(invoice.due_date) &&
        invoice.payment_status.toLowerCase() !== "paid"
    ).length || 0;

  return (
    <Card className="border-l-4 border-l-red-500 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-red-100 p-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Overdue Invoices
            </p>
            <p className="text-2xl font-bold text-foreground">{overdueCount}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
