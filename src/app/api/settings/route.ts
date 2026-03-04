import connectDB from "@/lib/db";
import Settings from "@/models/settings.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ownerId, businessName, supportEmail, knowledge } = await req.json();
    if (!ownerId) {
      return NextResponse.json(
        { message: "Owner Id is required" },
        { status: 400 },
      );
    }
    await connectDB();
    const settings = await Settings.findOneAndUpdate(
      { ownerId },
      { ownerId, businessName, supportEmail, knowledge },
      { new: true, upsert: true },
    );
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json(
      {
        message: `Settings error${err}`,
      },
      { status: 500 },
    );
  }
}
