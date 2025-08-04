'use client';

import React, { useState } from 'react';
import styles from './ImportCSV.module.css';
import { FaUpload } from 'react-icons/fa';
import Papa from 'papaparse';
import { toast } from 'react-toastify';

const ImportCSV = () => {
  const [uploaded, setUploaded] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setUploaded(true);
        console.log('Parsed CSV:', results.data);
        toast.success('CSV file imported successfully!');
      },
    });
  };

  const handlePublish = async () => {
    if (!csvData.length) return;
    const projectSlug = csvData[0]?.projectSlug;
    const codes = csvData.map((row) => row.code).filter(Boolean);

    if (!projectSlug || !codes.length) {
      toast.error('CSV must contain projectSlug and code columns.');
      return;
    }
    setLoading(true);
    try {
      const token = import.meta.env.VITE_APP_UPLOAD_TOKEN;
      if (!token) {
        throw new Error('Missing upload token in VITE_UPLOAD_TOKEN');
      }
      const res = await fetch('http://localhost:3001/api/admin/upload-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectSlug, codes }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to upload to server');
      }
      const response = await res.json();
      console.log('Upload success:', response);
      toast.success(`Uploaded ${codes.length} codes`);
    } catch (err) {
      console.error(err);
      toast.error('Error uploading CSV: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <label htmlFor="csv-upload" className={`${styles.uploadBtn} ${uploaded ? styles.uploaded : ''}`}>
        <FaUpload className={styles.icon} />
        {uploaded ? 'Uploaded ✅' : 'Import your CSV'}
      </label>
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className={styles.hiddenInput}
      />
      {uploaded && (
        <button className={styles.publishBtn} onClick={handlePublish} disabled={loading}>
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      )}
    </div>
  );
};


export default ImportCSV;








