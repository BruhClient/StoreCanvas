import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

type Props = {
  verificationUrl: string;
};

export const VerificationEmail = ({ verificationUrl }: Props) => (
  <Html>
    <Head />
    <Body
      style={{
        fontFamily: "Arial",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <Container
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
          Verify your email address
        </Text>
        <Text>Click the link below to verify your email:</Text>
        <Link href={verificationUrl} style={{ color: "#0070f3" }}>
          {verificationUrl}
        </Link>
        <Text>If you did not request this, you can safely ignore it.</Text>
      </Container>
    </Body>
  </Html>
);
