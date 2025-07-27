import React, { useState, useEffect } from 'react';
import { 
  adminService, 
  reservationService, 
  newsletterService, 
  menuService, 
  galleryService, 
  aboutService 
} from '../services/index.js';
import { showSuccess, showError } from '../services/utils.js';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: 'Demoz1059',
    password: 'Face$mask01'
  });

  const runTest = async (testName, testFunction) => {
    try {
      setLoading(true);
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result }
      }));
      showSuccess(`${testName} test passed!`);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }));
      showError(`${testName} test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testHealth = () => runTest('Health Check', adminService.healthCheck);
  const testAdminLogin = () => runTest('Admin Login', () => adminService.login(adminCredentials.username, adminCredentials.password));
  const testReservations = () => runTest('Reservations', reservationService.testEndpoint);
  const testNewsletter = () => runTest('Newsletter', newsletterService.testEndpoint);
  const testMenu = () => runTest('Menu', menuService.testEndpoint);
  const testGallery = () => runTest('Gallery', galleryService.testEndpoint);
  const testAbout = () => runTest('About', aboutService.testEndpoint);

  const testAll = async () => {
    setLoading(true);
    await testHealth();
    await testReservations();
    await testNewsletter();
    await testMenu();
    await testGallery();
    await testAbout();
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>API Services Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Admin Credentials</h3>
        <input
          type="text"
          placeholder="Username"
          value={adminCredentials.username}
          onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={adminCredentials.password}
          onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
          style={{ marginRight: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAll} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test All Services'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <button onClick={testHealth} disabled={loading} style={{ padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}>
          Health Check
        </button>
        <button onClick={testAdminLogin} disabled={loading} style={{ padding: '8px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px' }}>
          Admin Login
        </button>
        <button onClick={testReservations} disabled={loading} style={{ padding: '8px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px' }}>
          Reservations
        </button>
        <button onClick={testNewsletter} disabled={loading} style={{ padding: '8px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '3px' }}>
          Newsletter
        </button>
        <button onClick={testMenu} disabled={loading} style={{ padding: '8px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '3px' }}>
          Menu
        </button>
        <button onClick={testGallery} disabled={loading} style={{ padding: '8px', backgroundColor: '#e83e8c', color: 'white', border: 'none', borderRadius: '3px' }}>
          Gallery
        </button>
        <button onClick={testAbout} disabled={loading} style={{ padding: '8px', backgroundColor: '#20c997', color: 'white', border: 'none', borderRadius: '3px' }}>
          About
        </button>
      </div>

      <div>
        <h3>Test Results</h3>
        {Object.entries(testResults).map(([testName, result]) => (
          <div 
            key={testName} 
            style={{ 
              padding: '10px', 
              margin: '5px 0', 
              backgroundColor: result.success ? '#d4edda' : '#f8d7da',
              border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '5px'
            }}
          >
            <strong>{testName}:</strong> {result.success ? '✅ PASSED' : '❌ FAILED'}
            {result.error && <div style={{ color: '#721c24', fontSize: '0.9em', marginTop: '5px' }}>Error: {result.error}</div>}
            {result.data && <div style={{ fontSize: '0.9em', marginTop: '5px' }}>Data: {JSON.stringify(result.data, null, 2)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest; 