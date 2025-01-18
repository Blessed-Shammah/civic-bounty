import React from 'react';
import { CivicAuthProvider, UserButton } from "@civic/auth/react";

function App() {
  console.log('App is rendering'); // Debug log

  return (
    <div>
      <h1>Before Auth Provider</h1>
      <CivicAuthProvider 
        clientId="2e6b95b3-361d-41fc-a63d-b523da2c3856"
        onSignIn={(error) => {
          if (error) {
            console.error('Sign in error:', error);
          } else {
            console.log('Successfully signed in');
          }
        }}
      >
        <div style={{ padding: '20px' }}>
          <h2>Inside Auth Provider</h2>
          <UserButton />
        </div>
      </CivicAuthProvider>
    </div>
  );
}

export default App;