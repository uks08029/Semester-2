import React from 'react';
import RegistrationForm from './Form'; // Ensure the file name matches exactly

function App() {
  return (
    <div className="App">
      {/* 
          We wrap the form in a main container. 
          In a real-world project, you might also include a 
          Navbar or Footer here.
      */}
      <header style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Student Portal</h1>
        <p>CSE-27 Batch Registration</p>
      </header>

      <main>
        <RegistrationForm />
      </main>
    </div>
  );
}

export default App;