import { NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { slides } = await req.json();

    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { error: "Slides data is required." },
        { status: 400 }
      );
    }

    console.log("=== PowerPoint Generation ===");
    console.log("Processing", slides.length, "slides");

    // Create new presentation
    const pptx = new PptxGenJS();
    
    // Configure presentation
    pptx.author = "AI Pitch Deck Generator";
    pptx.company = "FIAB";
    pptx.title = slides[0]?.title || "Startup Pitch Deck";

    // Add slides with content
    slides.forEach((slideData: any, index: number) => {
      const slide = pptx.addSlide();
      
      // Add title
      slide.addText(slideData.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.75,
        fontSize: 36,
        bold: true,
        color: "363636",
        align: "center"
      });

      // Add headline
      slide.addText(slideData.headline, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 0.6,
        fontSize: 24,
        color: "0066CC",
        align: "center"
      });

      // Add bullet points
      const bulletText = slideData.bulletPoints.map((point: string) => ({
        text: point,
        options: { bullet: true, fontSize: 18, color: "444444" }
      }));

      slide.addText(bulletText, {
        x: 1,
        y: 2.5,
        w: 8,
        h: 3,
        fontSize: 18,
        color: "444444"
      });

      // Add description
      slide.addText(slideData.description, {
        x: 1,
        y: 5.75,
        w: 8,
        h: 1,
        fontSize: 14,
        color: "666666",
        italic: true
      });

      // Add slide number
      slide.addText(`${index + 1} / ${slides.length}`, {
        x: 9,
        y: 7,
        w: 0.5,
        h: 0.3,
        fontSize: 12,
        color: "999999",
        align: "right"
      });
    });

    // Save to buffer
    const pptxBuffer = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;

    // Save file to public directory
    const outputPath = path.join(process.cwd(), "public", "generated-pitch.pptx");
    fs.writeFileSync(outputPath, pptxBuffer);

    console.log("PowerPoint saved to:", outputPath);

    return NextResponse.json({
      success: true,
      message: "Presentation generated successfully",
      downloadUrl: "/generated-pitch.pptx",
      filename: "generated-pitch.pptx"
    });
  } catch (error: any) {
    console.error("=== Fatal Error in PowerPoint Generation ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    
    return NextResponse.json(
      { error: "Failed to generate pitch deck", details: error.message },
      { status: 500 }
    );
  }
}
