import React, { useState } from "react";

const AdminPanel = ({ lang }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock auth: store email/code in localStorage
    localStorage.setItem("adminAuth", JSON.stringify({ email, code }));
    alert("Mock auth submitted");
  };

  return (
    <div className="admin-panel">
      <h2>{lang.admin}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminPanel;
