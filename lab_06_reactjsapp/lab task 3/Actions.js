import { useState } from "react";
import "./Actions.css";

function Actions() {
  const [message, setMessage] = useState("");
  const [bgColor, setBgColor] = useState("white");
  const [textColor, setTextColor] = useState("black");

  function showMessage() {
    setMessage("Hello! You clicked Show Message button 🎉");
  }

  function changeColor() {
    setBgColor(bgColor === "white" ? "#a29bfe" : "white");
  }

  function showAlert() {
    alert("This is an Alert 🚨");
  }

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      <h2
        style={{ color: textColor }}
        onMouseOver={() => setTextColor("red")}
        onMouseOut={() => setTextColor("black")}
      >
        Interactive Buttons App
      </h2>

      <div className="btn-group">
        <button onClick={showMessage}>Show Message</button>
        <button onClick={changeColor}>Change Background</button>
        <button onClick={showAlert}>Show Alert</button>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}

export default Actions;