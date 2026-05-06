import { useState } from "react";
import "./Counter.css";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="main">
      <div className="card">
        <h2>Counter App</h2>

        <h1>{count}</h1>

        <button onClick={() => setCount(count + 1)}>Increment</button>

        <button onClick={() => count > 0 && setCount(count - 1)}>
          Decrement
        </button>

        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}

export default Counter;