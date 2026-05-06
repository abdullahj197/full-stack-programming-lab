import React from "react";

function StudentCard({ name, rollNo, department, university, color }) {
  const cardStyle = {
    backgroundColor: color || "#fff",
    padding: "20px",
    margin: "15px",
    borderRadius: "15px",
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
    width: "250px",
    color: "#333",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "transform 0.3s, box-shadow 0.3s",
  };

  const hoverStyle = {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{ ...cardStyle, ...(isHovered ? hoverStyle : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2>{name}</h2>
      <p><strong>Roll No:</strong> {rollNo}</p>
      <p><strong>Department:</strong> {department}</p>
      <p><strong>University:</strong> {university}</p>
    </div>
  );
}

export default StudentCard;