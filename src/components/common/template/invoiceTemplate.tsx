// app/components/PDFTemplate.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// PENTING: Ini adalah React component KHUSUS untuk @react-pdf/renderer
// Bukan React biasa! Tidak bisa pakai div, span, dll
// Hanya bisa pakai: Document, Page, View, Text, Image, Link

// Define styles menggunakan StyleSheet (mirip React Native)
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    width: "40%",
  },
  value: {
    width: "60%",
    textAlign: "right",
  },
  table: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #eee",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  tableCol: {
    width: "25%",
    paddingHorizontal: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#999",
    borderTop: "1 solid #eee",
    paddingTop: 10,
  },
});

interface PDFTemplateProps {
  title: string;
  date: string;
  // Tambahkan props sesuai kebutuhan
}

export default function PDFTemplate({ title, date }: PDFTemplateProps) {
  return (
    <Document>
      {/* Page = 1 halaman PDF, size A4 */}
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Generated on: {new Date(date).toLocaleDateString("id-ID")}
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Name:</Text>
            <Text style={styles.value}>John Doe</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>Jl. Sudirman No. 123, Jakarta</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>+62 812-3456-7890</Text>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Item</Text>
            <Text style={styles.tableCol}>Qty</Text>
            <Text style={styles.tableCol}>Price</Text>
            <Text style={styles.tableCol}>Total</Text>
          </View>

          {/* Table Rows */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Product A</Text>
            <Text style={styles.tableCol}>2</Text>
            <Text style={styles.tableCol}>Rp 100,000</Text>
            <Text style={styles.tableCol}>Rp 200,000</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Product B</Text>
            <Text style={styles.tableCol}>1</Text>
            <Text style={styles.tableCol}>Rp 150,000</Text>
            <Text style={styles.tableCol}>Rp 150,000</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>www.yourcompany.com | contact@yourcompany.com</Text>
        </View>
      </Page>
    </Document>
  );
}

// TECHNICAL NOTE:
// - Document: Root component, wajib ada
// - Page: Satu halaman PDF, bisa multiple pages
// - View: Container seperti div (flex container by default)
// - Text: Untuk render text, WAJIB wrap text dengan ini
// - StyleSheet: Untuk define styles, mirip inline styles tapi lebih optimal
// - Flexbox: Default layout engine, support flexDirection, justifyContent, dll
// - Size A4: 595 x 842 points (8.27 x 11.69 inches)
