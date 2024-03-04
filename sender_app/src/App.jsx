import React, { useState } from "react";
import "./App.css";

function App() {
  const [content, setContent] = useState("");
  const [pseudo, setPseudo] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, pseudo }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setContent("");
      setPseudo("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="App">
      <h1>Sender</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Content:
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Pseudo:
          <input
            type="text"
            value={pseudo}
            onChange={(event) => setPseudo(event.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default App;
