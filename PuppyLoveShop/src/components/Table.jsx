import React from 'react';

const Table = ({ headers, data, renderRow }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--pink-light)', color: 'var(--pink-dark)' }}>
            {headers.map((header, index) => (
              <th key={index} style={{ padding: '12px' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={{ textAlign: 'center', borderBottom: '1px solid #f1f1f1' }}>
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;