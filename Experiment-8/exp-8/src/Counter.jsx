import React, { useState } from 'react';
import './Counter.css';

const Counter = () => {
  // Initialize state with 0
  const [count, setCount] = useState(0);

  // Event Handlers
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    // Optional: prevent negative numbers
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="counter-container">
      <h1>React Counter</h1>
      <div className="display">
        {count}
      </div>
      <div className="button-group">
        <button className="btn inc" onClick={handleIncrement}>Increment (+)</button>
        <button className="btn dec" onClick={handleDecrement}>Decrement (-)</button>
        <button className="btn reset" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default Counter;