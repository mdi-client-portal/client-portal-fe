// app/components/PDFTemplate.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { InvoiceWithDetailResponse } from "@/response/invoiceDetailResponse";
import { LogOut } from "lucide-react";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #000",
    paddingBottom: 10,
  },
  companyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 5,
  },
  companyAddress: {
    fontSize: 10,
    color: "#666",
    lineHeight: 1.4,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 8,
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
  },
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  invoiceInfoSection: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#374151",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    width: "40%",
    color: "#6b7280",
  },
  value: {
    fontSize: 10,
    width: "60%",
    color: "#111827",
  },
  logo: {
    width: 60,
    height: 60,
  },
  table: {
    marginTop: 20,
    borderTop: "1 solid #e5e7eb",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottom: "1 solid #e5e7eb",
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #f3f4f6",
    paddingVertical: 6,
  },
  tableCol1: { width: "40%", paddingHorizontal: 8 },
  tableCol2: { width: "15%", paddingHorizontal: 8, textAlign: "center" },
  tableCol3: { width: "20%", paddingHorizontal: 8, textAlign: "right" },
  tableCol4: { width: "25%", paddingHorizontal: 8, textAlign: "right" },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  tableCellText: {
    fontSize: 9,
    color: "#111827",
  },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
    width: "50%",
  },
  totalLabel: {
    fontSize: 10,
    width: "60%",
    textAlign: "right",
    paddingRight: 10,
  },
  totalValue: {
    fontSize: 10,
    width: "40%",
    textAlign: "right",
    fontWeight: "bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1 solid #374151",
    width: "50%",
  },
  grandTotalLabel: {
    fontSize: 12,
    width: "60%",
    textAlign: "right",
    paddingRight: 10,
    fontWeight: "bold",
    color: "#1f2937",
  },
  grandTotalValue: {
    fontSize: 12,
    width: "40%",
    textAlign: "right",
    fontWeight: "bold",
    color: "#1f2937",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 10,
  },
});

interface PDFTemplateProps {
  invoiceData: InvoiceWithDetailResponse;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

// Helper function untuk format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function PDFTemplate({ invoiceData }: PDFTemplateProps) {
  const { invoice, invoice_details } = invoiceData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.companyHeader}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Mobile Data Indonesia</Text>
            <Text style={styles.companyAddress}>
              Ruko De Mansion Blok CD no. 6{"\n"}
              Kunciran, Pinang, Tangerang City, Banten{"\n"}
              Telp: +62 8131783862{"\n"}
              Email: info@mobiledata.co.id
            </Text>
          </View>
          <View style={styles.logoPlaceholder}>
            <Image
              src="http://localhost:3000/logo-default.png"
              style={styles.logo}
            />
          </View>
        </View>

        {/* Invoice Title */}
        <Text style={styles.title}>INVOICE</Text>

        {/* Invoice Information */}
        <View style={styles.invoiceInfo}>
          <View style={styles.invoiceInfoSection}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Invoice Number:</Text>
              <Text style={styles.value}>{invoice.invoice_number}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Issue Date:</Text>
              <Text style={styles.value}>{formatDate(invoice.issue_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.value}>{formatDate(invoice.due_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>
                {invoice.payment_status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.invoiceInfoSection}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tax Invoice No:</Text>
              <Text style={styles.value}>
                {invoice.tax_invoice_number || "-"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tax Rate:</Text>
              <Text style={styles.value}>{invoice.tax_rate}%</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Amount Paid:</Text>
              <Text style={styles.value}>
                {formatCurrency(invoice.amount_paid)}
              </Text>
            </View>
          </View>
        </View>

        {/* Invoice Details Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.tableCol1}>
              <Text style={styles.tableHeaderText}>Description</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableHeaderText}>Delivery Count</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text style={styles.tableHeaderText}>Price/Delivery</Text>
            </View>
            <View style={styles.tableCol4}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
          </View>

          {invoice_details.map((detail, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCellText}>
                  {detail.transaction_note || `Service Item ${index + 1}`}
                </Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCellText}>
                  {detail.delivery_count}
                </Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCellText}>
                  {formatCurrency(detail.price_per_delivery)}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCellText}>
                  {formatCurrency(detail.amount)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.sub_total)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax ({invoice.tax_rate}%):</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.tax_amount)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(invoice.total)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>Mobile Data Indonesia - Your Trusted Technology Partner</Text>
        </View>
      </Page>
    </Document>
  );
}
