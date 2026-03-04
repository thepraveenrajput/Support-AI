import connectDB from "@/lib/db";
import Settings from "@/models/settings.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const ownerId = await req.json();
    if (!ownerId) {
      return NextResponse.json(
        { message: "Owner Id is required" },
        { status: 400 },
      );
    }
    await connectDB();
    const setting = await Settings.findOne({ ownerId });
    return NextResponse.json(setting);
  } catch (err) {
    return NextResponse.json(
      {
        message: `get Settings error ${err}`,
      },
      { status: 500 },
    );
  }
}
