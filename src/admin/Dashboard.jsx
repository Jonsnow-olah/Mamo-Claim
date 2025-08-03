import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className={styles.dashboard}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <button onClick={() => setCollapsed(!collapsed)} className={styles.toggleBtn}>
          {collapsed ? '→' : '←'}
        </button>
        {!collapsed && (
          <nav className={styles.nav}>
            <h2 className={styles.title}>Admin Panel</h2>
            <ul>
              <li>Dashboard</li>
              <li>Users</li>
              <li>Settings</li>
            </ul>
          </nav>
        )}
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </aside>
      <main className={styles.content}>
        <h1>Welcome to the Dashboard</h1>
        <p>This is a protected admin area.</p>
      </main>
    </div>
  );
};

export default Dashboard;
