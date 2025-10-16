import React, { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [verifyResult, setVerifyResult] = useState("");

  const getMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/message");
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error fetching message:", error);
      setMessage("Failed to load message");
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async () => {
    if (!name) {
      setVerifyResult("Please enter a name first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      setVerifyResult(data.result);
    } catch (error) {
      console.error("Error verifying user:", error);
      setVerifyResult("Error connecting to backend.");
    }
  };

  return (
    <div className="app-container">
      <h1>Frontend + MongoDB Backend Integration</h1>
      <p className="info-text">Click a button to communicate with the backend.</p>

      <button className="fetch-btn" onClick={getMessage}>
        {loading ? "Loading..." : "Get Backend Message"}
      </button>

      {message && <p className="backend-message">{message}</p>}

      <div className="verify-section">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="name-input"
        />
        <button className="verify-btn" onClick={verifyUser}>
          Verify
        </button>
      </div>

      {verifyResult && <p className="backend-message">{verifyResult}</p>}
    </div>
  );
}

export default App;
