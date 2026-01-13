import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import LostFound from "@/models/LostFound";
import jwt from "jsonwebtoken";

export async function GET() {
  await dbConnect();
  const items = await LostFound.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req) {
  await dbConnect();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const body = await req.json();

  const item = await LostFound.create({
    ...body,
    createdBy: decoded.id,
  });

  return NextResponse.json(item);
}
