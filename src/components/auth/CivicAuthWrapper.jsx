// src/components/auth/CivicAuthWrapper.jsx
import { CivicAuthProvider } from "@civic/auth/react";

export function CivicAuthWrapper({ children }) {
  return (
    <CivicAuthProvider clientId="2e6b95b3-361d-41fc-a63d-b523da2c3856">
      {children}
    </CivicAuthProvider>
  );
}