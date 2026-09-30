import { NextResponse } from 'next/server';
import { consultFashionStylist } from '@/services/fashionStylist';

export async function POST(request) {
  try {
    const { userMessage, skinTone, gender, isCustomPhoto, excludeProductIds } = await request.json();

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const stylistResponse = await consultFashionStylist({
      userMessage,
      skinTone: skinTone || "wheatish",
      gender: gender || "men",
      isCustomPhoto: !!isCustomPhoto,
      excludeProductIds: Array.isArray(excludeProductIds) ? excludeProductIds : []
    });

    return NextResponse.json(stylistResponse);
  } catch (err) {
    console.error("Fashion Stylist API error:", err);
    return NextResponse.json({
      intent: "ERROR",
      assistantMessage: `Stylist Error: ${err.message}`,
      errorStack: err.stack,
      recommendedProducts: [],
      suggestedQuestions: []
    }, { status: 500 });
  }
}
