"use client"; // important: client-side only

import mammoth from "mammoth";

export async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    if (typeof window === "undefined") {
      throw new Error("PDF parsing is only supported in the browser");
    }

    // Dynamic import: only in browser
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let textContent = ""; 
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      textContent += strings.join(" ") + "\n\n";
    }

    console.log("Extracted PDF Text:", textContent); // for testing
    return textContent;

  } else if (ext === "docx") {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    console.log("Extracted DOCX Text:", result.value); // for testing
    return result.value;

  } else {
    throw new Error("Unsupported file type. Only PDF or DOCX allowed.");
  }
}
