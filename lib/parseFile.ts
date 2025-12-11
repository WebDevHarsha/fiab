"use client"; // important: client-side only

import mammoth from "mammoth";
import JSZip from "jszip";
import { xml2js } from "xml-js";

export async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    if (typeof window === "undefined") {
      throw new Error("PDF parsing is only supported in the browser");
    }

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

    console.log("Extracted PDF Text:", textContent);
    return textContent;

  } else if (ext === "docx") {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    console.log("Extracted DOCX Text:", result.value);
    return result.value;

  } else if (ext === "pptx") {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    let fullText = "";

    // PowerPoint slide text files are in ppt/slides/slideX.xml
    const slideFiles = Object.keys(zip.files).filter((path) =>
      path.match(/^ppt\/slides\/slide\d+\.xml$/)
    );

    for (const fileName of slideFiles) {
      const xml = await zip.file(fileName)?.async("text");
      if (xml) {
        const slideJSON: any = xml2js(xml, { compact: true });
        // extract text from <a:t> elements
        const extractTexts = (obj: any): string[] => {
          let texts: string[] = [];
          for (const key in obj) {
            const value = obj[key];
            if (key === "a:t" && value._text) {
              texts.push(value._text);
            } else if (typeof value === "object") {
              texts = texts.concat(extractTexts(value));
            }
          }
          return texts;
        };

        const slideText = extractTexts(slideJSON).join(" ");
        fullText += slideText + "\n\n";
      }
    }

    console.log("Extracted PPTX Text:", fullText);
    return fullText;

  } else {
    throw new Error("Unsupported file type. Only PDF, DOCX, or PPTX allowed.");
  }
}
