import React, { useState } from 'react';

const EmployeeForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    status: 'Active',
    isVerified: 'No'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    if (onCancel) onCancel(); // Cierra el modal tras enviar
  };

  const styles = {
    formContainer: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
      color: '#4a4a4a',
    },
    title: {
      color: '#e97386',
      textAlign: 'center',
      fontSize: '32px',
      marginBottom: '30px',
      fontWeight: '400',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontWeight: '600',
      fontSize: '16px',
    },
    input: {
      backgroundColor: '#f9e1e5',
      border: '1px solid #f2cbd2',
      borderRadius: '12px',
      padding: '12px',
      fontSize: '16px',
      outline: 'none',
    },
    toggleContainer: {
      display: 'flex',
      gap: '10px',
    },
    toggleBtn: (isActive) => ({
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid ${isActive ? '#e97386' : '#f2cbd2'}`,
      backgroundColor: isActive ? '#e97386' : '#f9e1e5',
      color: isActive ? 'white' : '#888',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    }),
    submitRow: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px',
    },
    submitBtn: {
      backgroundColor: '#fdf2d5',
      border: '1px solid #f5e1b5',
      padding: '12px 60px',
      borderRadius: '12px',
      fontWeight: 'bold',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#4a4a4a',
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>Administrator</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              style={styles.input}
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange} 
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              style={styles.input}
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
            <label style={styles.label}>Password</label>
            <input 
              style={styles.input}
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Status</label>
            <div style={styles.toggleContainer}>
              <button 
                type="button"
                style={styles.toggleBtn(formData.status === 'Active')}
                onClick={() => handleToggle('status', 'Active')}
              >
                Active
              </button>
              <button 
                type="button"
                style={styles.toggleBtn(formData.status === 'Inactive')}
                onClick={() => handleToggle('status', 'Inactive')}
              >
                Inactive
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Is Verified?</label>
            <div style={styles.toggleContainer}>
              <button 
                type="button"
                style={styles.toggleBtn(formData.isVerified === 'Si')}
                onClick={() => handleToggle('isVerified', 'Si')}
              >
                Si
              </button>
              <button 
                type="button"
                style={styles.toggleBtn(formData.isVerified === 'No')}
                onClick={() => handleToggle('isVerified', 'No')}
              >
                No
              </button>
            </div>
          </div>
        </div>

        <div style={styles.submitRow}>
          <button type="submit" style={styles.submitBtn}>Enviar</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;