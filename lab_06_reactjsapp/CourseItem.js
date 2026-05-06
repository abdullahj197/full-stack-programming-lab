import React from "react";

function CourseItem({ courseName, instructor, duration, type }) {
  const bgColor = type === "Online" ? "#d0f0fd" : "#ffe0b2";

  const cardStyle = {
    backgroundColor: bgColor,
    padding: "15px",
    margin: "15px",
    borderRadius: "12px",
    width: "250px",
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
      <h3>{courseName}</h3>
      <p><strong>Instructor:</strong> {instructor}</p>
      <p><strong>Duration:</strong> {duration}</p>
      <p><strong>Type:</strong> {type}</p>
    </div>
  );
}

export default CourseItem;