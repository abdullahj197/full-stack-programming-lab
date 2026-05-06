import React from "react";
import Greeting from "./Greeting";

function App() {
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    padding: "50px",
  };

  return (
    <div style={pageStyle}>
      <Greeting name="Ali" timeOfDay="morning" bgColor="#fff8b0" />
      <Greeting name="Sara" timeOfDay="afternoon" bgColor="#b0e0ff" />
      <Greeting name="Bilal" timeOfDay="evening" bgColor="#d0ffd6" />
    </div>
  );
}

export default App;