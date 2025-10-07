import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Eye } from "lucide-react"

// Sample payment data
const payments = [
  {
    id: 1,
    paymentDate: "2024-01-15",
    paymentAmount: "$5,000.00",
    proofOfTransfer: "TRF-2024-001.pdf",
  },
  {
    id: 2,
    paymentDate: "2024-01-20",
    paymentAmount: "$3,500.00",
    proofOfTransfer: "TRF-2024-002.pdf",
  },
  {
    id: 3,
    paymentDate: "2024-01-25",
    paymentAmount: "$7,200.00",
    proofOfTransfer: "TRF-2024-003.pdf",
  },
  {
    id: 4,
    paymentDate: "2024-02-01",
    paymentAmount: "$4,800.00",
    proofOfTransfer: "TRF-2024-004.pdf",
  },
  {
    id: 5,
    paymentDate: "2024-02-10",
    paymentAmount: "$6,300.00",
    proofOfTransfer: "TRF-2024-005.pdf",
  },
]

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments</h1>
        <p className="mt-2 text-muted-foreground">View and manage all payment records</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">Payment Date</TableHead>
              <TableHead className="font-semibold text-foreground">Payment Amount</TableHead>
              <TableHead className="font-semibold text-foreground">Proof of Transfer</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{payment.paymentDate}</TableCell>
                <TableCell className="font-semibold">{payment.paymentAmount}</TableCell>
                <TableCell className="text-muted-foreground">{payment.proofOfTransfer}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
