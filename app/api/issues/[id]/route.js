import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Issue from "@/models/Issue";

export async function PUT(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can update issue" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updated = await Issue.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const token = req.cookies.get("token")?.value;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const deleted = await Issue.findByIdAndDelete(params.id);

  return NextResponse.json(deleted);
}

export async function GET(req, { params }) {
  await dbConnect();

  const token = req.cookies.get("token")?.value;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const issue = await Issue.findById(params.id).populate("createdBy", "name");

  return NextResponse.json(issue);
}
