import React from 'react';
import Student from './Student';

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Batch CSE-27 Student List</h1>
      <div className="container">
        {/* Passing data via props */}
        <Student name="Roshan Singh" course="B.Tech CSE" marks="85" />
        <Student name="Anjali Sharma" course="B.Tech IT" marks="92" />
        <Student name="Amit Verma" course="B.Tech CSE" marks="78" />
      </div>
    </div>
  );
}

export default App;