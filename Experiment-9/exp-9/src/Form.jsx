import React, { useState, useEffect } from 'react';
import './Form.css';

const RegistrationForm = () => {
  // 1. State for Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // 2. State for Errors and Success
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Validation Logic
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.includes('@')) tempErrors.email = "Email must contain @";
    if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      console.log("Form Data Submitted:", formData);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Registration Form</h2>
      {submitted && <p className="success">Registration Successful!</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="field">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="field">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;