type InvoiceDetailProps = {
  params: {
    uuid: string;
  };
};

export default function InvoiceDetail({ params }: InvoiceDetailProps) {
  return <div>Invoice {params.uuid}</div>;
}
