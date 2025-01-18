// src/components/auth/LoginPage.jsx
import { CivicAuthIframeContainer, UserButton } from "@civic/auth/react";

export function LoginPage() {
  return (
    <div className="login-page">
      <h1>Welcome to Our App</h1>
      <UserButton />
      <CivicAuthIframeContainer />
    </div>
  );
}