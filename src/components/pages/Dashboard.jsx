// src/components/pages/Dashboard.jsx
import { useUser } from '@civic/auth/react';

export function Dashboard() {
  const { user } = useUser();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome {user?.name}</p>
    </div>
  );
}