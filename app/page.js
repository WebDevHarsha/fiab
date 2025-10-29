"use client";
import { useState } from "react";
import { extractText } from "@/lib/parseFile";

export default function FileParser() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError("");
      setText("Extracting text...");
      const content = await extractText(file);
      setText(content);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div className="p-6">
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFile}
        className="mb-4"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded">
        {text}
      </pre>
    </div>
  );
}
