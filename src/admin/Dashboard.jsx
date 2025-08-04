import React, { useState } from 'react';
import { FaSignOutAlt, FaUpload, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import ImportCSV from './ImportCSV';


const Dashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('import');


  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };


  return (
    <div className={styles.dashboard}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <button className={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
        <ul className={styles.nav}>
          <li onClick={() => setActivePage('import')}>
            <FaUpload className={styles.icon} /> {!collapsed && 'Import CSV File'}
          </li>
        </ul>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt className={styles.icon} /> {!collapsed && 'Logout'}
        </button>
      </aside>


      <main className={styles.content}>
        {activePage === 'import' && <ImportCSV />}
      </main>
    </div>
  );
};


export default Dashboard;
