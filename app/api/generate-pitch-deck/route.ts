import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { slides, templateId } = await req.json();

    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { error: "Slides data is required." },
        { status: 400 }
      );
    }

    const DYNAPICTURES_API_KEY = process.env.DYNAPICTURES_API_KEY;
    const DYNAPICTURES_TEMPLATE_ID = templateId || process.env.DYNAPICTURES_TEMPLATE_ID;

    if (!DYNAPICTURES_API_KEY) {
      return NextResponse.json(
        { error: "DynaPictures API key not configured." },
        { status: 500 }
      );
    }

    if (!DYNAPICTURES_TEMPLATE_ID) {
      return NextResponse.json(
        { error: "DynaPictures Template ID not configured." },
        { status: 500 }
      );
    }

    // Format pages for DynaPictures API
    const pages = slides.map((slide: any) => ({
      index: slide.index,
      layers: [
        {
          name: "title",
          text: slide.title || "",
        },
        {
          name: "headline",
          text: slide.headline || "",
        },
        {
          name: "bullet1",
          text: slide.bulletPoints?.[0] || "",
        },
        {
          name: "bullet2",
          text: slide.bulletPoints?.[1] || "",
        },
        {
          name: "bullet3",
          text: slide.bulletPoints?.[2] || "",
        },
        {
          name: "description",
          text: slide.description || "",
        },
      ],
    }));

    // Call DynaPictures API for PDF generation
    const dynapicturesResponse = await fetch(
      `https://api.dynapictures.com/designs/${DYNAPICTURES_TEMPLATE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DYNAPICTURES_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: "pdf",
          metadata: "Pitch Deck",
          pages,
        }),
      }
    );

    if (!dynapicturesResponse.ok) {
      const errorText = await dynapicturesResponse.text();
      console.error("DynaPictures API Error:", errorText);
      return NextResponse.json(
        {
          error: "Failed to generate PDF with DynaPictures",
          details: errorText,
        },
        { status: dynapicturesResponse.status }
      );
    }

    const pdfData = await dynapicturesResponse.json();

    return NextResponse.json({
      success: true,
      pdfUrl: pdfData.pdfUrl || pdfData.imageUrl,
      thumbnailUrl: pdfData.thumbnailUrl,
      data: pdfData,
    });
  } catch (error: any) {
    console.error("Error generating pitch deck PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate pitch deck", details: error.message },
      { status: 500 }
    );
  }
}
