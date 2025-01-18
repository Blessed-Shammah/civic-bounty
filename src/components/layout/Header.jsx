// src/components/layout/Header.jsx
import { UserButton } from '@civic/auth/react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="header">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <UserButton />
    </header>
  );
}