// components/PaymentConfirmationEmail.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Heading,
} from "@react-email/components";

interface PaymentConfirmationEmailProps {
  customerName: string;
  invoiceNumber: string;
  amountPaid: number;
  paymentDate: string;
  receiptUrl: string;
  planType: string; // <-- Added planType
}

export function PaymentConfirmationEmail({
  customerName,
  invoiceNumber,
  amountPaid,
  paymentDate,
  receiptUrl,
  planType,
}: PaymentConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment Confirmation for Invoice {invoiceNumber}</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
          margin: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            margin: "20px auto",
            maxWidth: "600px",
          }}
        >
          <Section>
            <Heading style={{ color: "#333" }}>Payment Confirmation</Heading>
            <Text style={{ fontSize: "16px", color: "#555" }}>
              Hi {customerName},
            </Text>
            <Text style={{ fontSize: "16px", color: "#555" }}>
              Thank you for subscribing to the <strong>{planType}</strong> plan.
            </Text>
            <Text style={{ fontSize: "16px", color: "#555" }}>
              We have received your payment for invoice{" "}
              <strong>{invoiceNumber}</strong>.
            </Text>
            <Text style={{ fontSize: "16px", color: "#555" }}>
              Amount Paid: <strong>${amountPaid}</strong>
              <br />
              Payment Date: <strong>{paymentDate}</strong>
            </Text>
            <Text style={{ fontSize: "16px", color: "#555" }}>
              You can view your receipt here:
            </Text>
            <Link
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#346df1",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              View Receipt
            </Link>
            <Text
              style={{ fontSize: "16px", color: "#555", marginTop: "20px" }}
            >
              Thank you for your business!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
