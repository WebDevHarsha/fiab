import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { slides } = await req.json();

    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { error: "Slides data is required." },
        { status: 400 }
      );
    }

    const PLUSLIDE_API_KEY = process.env.PLUSLIDE_API_KEY;
    const PLUSLIDE_PROJECT_ID = process.env.PLUSLIDE_PROJECT_ID;

    if (!PLUSLIDE_API_KEY) {
      return NextResponse.json(
        { error: "Pluslide API key not configured. Please add PLUSLIDE_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    if (!PLUSLIDE_PROJECT_ID) {
      return NextResponse.json(
        { error: "Pluslide Project ID not configured. Please add PLUSLIDE_PROJECT_ID to .env.local" },
        { status: 500 }
      );
    }

    console.log("=== Pluslide PDF Generation ===");
    console.log("Generating presentation for", slides.length, "slides");

    const slideList = slides.map((slide: any) => {
      const slideContent = `${slide.title}\n\n${slide.headline}\n\n${slide.bulletPoints.join('\n')}\n\n${slide.description}`;
      
      return {
        templateKey: "template-1",
        content: {
          text_1: slideContent
        }
      };
    });

    const requestBody = {
      projectId: PLUSLIDE_PROJECT_ID,
      presentation: {
        slideList: slideList,
        attributes: {
          title: slides[0]?.title || "Pitch Deck",
          author: "AI Generated",
          subject: "Startup Pitch Deck"
        }
      }
    };

    console.log("Sending request to Pluslide API...");
    console.log("Project ID:", PLUSLIDE_PROJECT_ID);
    console.log("Number of slides:", slideList.length);

    const pluslideResponse = await fetch(
      "https://app.pluslide.com/api/v1/project/export",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PLUSLIDE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!pluslideResponse.ok) {
      const errorText = await pluslideResponse.text();
      console.error("Pluslide API Error:", errorText);
      console.error("Status:", pluslideResponse.status);
      console.error("Status Text:", pluslideResponse.statusText);
      
      return NextResponse.json(
        {
          error: "Failed to generate presentation with Pluslide",
          details: errorText,
          status: pluslideResponse.status
        },
        { status: pluslideResponse.status }
      );
    }

    const responseData = await pluslideResponse.json();
    console.log("Pluslide Response:", responseData);

    return NextResponse.json({
      success: true,
      taskId: responseData.taskId,
      message: "Presentation generation started. Task ID: " + responseData.taskId,
      data: responseData,
    });
  } catch (error: any) {
    console.error("=== Fatal Error in PDF Generation ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    
    return NextResponse.json(
      { error: "Failed to generate pitch deck", details: error.message },
      { status: 500 }
    );
  }
}
