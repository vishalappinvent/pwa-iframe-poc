"use client";

import { useState } from "react";

export default function HomePage() {
  const [magicLink, setMagicLink] = useState("");
  const [validatedLink, setValidatedLink] = useState("");

  const validateAndSetLink = () => {
    try {
      const url = new URL(magicLink);
      const allowedDomains = [
        "demo3.staging.ravin-ai.com",
        "localhost:3000",
        "localhost",
      ];
      if (!allowedDomains.includes(url.hostname)) {
        alert("Domain not allowed!");
        return;
      }
      setValidatedLink(url.toString());
    } catch (error) {
      console.log(error, "error");
      alert("Invalid URL");
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Magic Link PWA</h1>
      <input
        type="text"
        placeholder="Enter magic link"
        value={magicLink}
        onChange={(e) => setMagicLink(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <button onClick={validateAndSetLink} style={{ padding: "8px 16px" }}>
        Open in IFrame
      </button>

      {validatedLink && (
        <iframe
          src={validatedLink}
          title="Magic Link Viewer"
          style={{
            width: "100%",
            height: "500px",
            marginTop: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
          sandbox="allow-scripts allow-forms allow-same-origin"
        />
      )}
    </main>
  );
}
