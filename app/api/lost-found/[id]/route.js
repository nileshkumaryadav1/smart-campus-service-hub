import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import LostFound from "@/models/LostFound";
import jwt from "jsonwebtoken";

export async function PUT(req, context) {
  await dbConnect();
  const { id } = await context.params;

  const token = req.cookies.get("token")?.value;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const updated = await LostFound.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, context) {
  await dbConnect();
  const { id } = await context.params;

  const token = req.cookies.get("token")?.value;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await LostFound.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
