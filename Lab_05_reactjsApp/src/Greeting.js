import React from "react";

function Greeting({ name, timeOfDay, bgColor }) {
  let greetingText = "Hello";

  if (timeOfDay === "morning") greetingText = "Good Morning";
  else if (timeOfDay === "afternoon") greetingText = "Good Afternoon";
  else if (timeOfDay === "evening") greetingText = "Good Evening";

  const style = {
    backgroundColor: bgColor || "#f0f0f0",
    padding: "20px",
    margin: "15px",
    borderRadius: "15px",
    textAlign: "center",
    width: "220px",
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const hoverStyle = {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{ ...style, ...(isHovered ? hoverStyle : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2>{greetingText}, {name}!</h2>
    </div>
  );
}

export default Greeting;