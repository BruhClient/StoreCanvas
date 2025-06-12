// emails/VerificationCodeEmail.tsx
import { Html, Head, Body, Container, Text, Hr } from "@react-email/components";
import * as React from "react";

type Props = {
  code: string;
};

export const PasswordResetEmail = ({ code }: Props) => (
  <Html>
    <Head />
    <Body
      style={{
        fontFamily: "Arial",
        backgroundColor: "#f9fafb",
        padding: "20px",
      }}
    >
      <Container
        style={{
          backgroundColor: "#ffffff",
          padding: "32px",
          borderRadius: "8px",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <Text
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Your Verification Code
        </Text>
        <Text style={{ fontSize: "16px", marginBottom: "8px" }}>
          Use the code below to verify your email address:
        </Text>

        <Text
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: "6px",
            backgroundColor: "#f0f4f8",
            padding: "16px",
            borderRadius: "6px",
            margin: "24px 0",
            color: "#111827",
          }}
        >
          {code}
        </Text>

        <Text style={{ fontSize: "14px", color: "#6b7280" }}>
          This code will expire in 10 minutes. If you didn’t request this, you
          can safely ignore it.
        </Text>

        <Hr style={{ margin: "32px 0" }} />

        <Text style={{ fontSize: "12px", color: "#9ca3af" }}>
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);
