import React from 'react';
import './Student.css';

const Student = (props) => {
  return (
    <div className="student-card">
      <h2>Student Profile</h2>
      <p><strong>Name:</strong> {props.name}</p>
      <p><strong>Course:</strong> {props.course}</p>
      <p><strong>Marks:</strong> {props.marks}%</p>
    </div>
  );
};

export default Student;