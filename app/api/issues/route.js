import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Issue from "@/models/Issue";

export async function GET(req) {
  await dbConnect();

  const token = req.cookies.get("token")?.value;

  let decoded = null;
  if (token) {
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      decoded = null; // invalid token, become logged out
    }
  }

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope"); // issue can be now fetched by "all" or "mine"

  /* without login */
  if (!decoded) {
    const issues = await Issue.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(issues);
  }

  /* admin */
  if (decoded.role === "admin") {
    const issues = await Issue.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(issues);
  }

  /* student */
  if (scope === "all") {
    const issues = await Issue.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(issues);
  }

  // default is - my issues
  const issues = await Issue.find({ createdBy: decoded.id }).sort({
    createdAt: -1,
  });

  return NextResponse.json(issues);
}

export async function POST(req) {
  await dbConnect();

  const token = req.cookies.get("token")?.value;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const body = await req.json();

  const issue = await Issue.create({
    ...body,
    createdBy: decoded.id,
  });

  return NextResponse.json(issue, { status: 201 });
}
