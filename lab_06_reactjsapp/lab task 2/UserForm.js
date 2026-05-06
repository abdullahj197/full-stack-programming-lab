import { useState } from "react";
import "./UserForm.css";

function UserForm() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [submittedData, setSubmittedData] = useState(null);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmittedData(user);
    setUser({ name: "", email: "" });
  }

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>User Form</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={user.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={user.email}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {submittedData && (
        <div className="result">
          <h3>Submitted Data</h3>
          <p><b>Name:</b> {submittedData.name}</p>
          <p><b>Email:</b> {submittedData.email}</p>
        </div>
      )}
    </div>
  );
}

export default UserForm;