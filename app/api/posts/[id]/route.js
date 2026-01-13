import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(_, { params }) {
  await dbConnect();

  // Unwrap params
  const { id } = await params;

  try {
    const post = await Post.findById(id);
    if (!post)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch", error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  // unwrap params
  const { id } = await params;

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (decoded.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const updated = await Post.findByIdAndUpdate(id, data, { new: true });

    if (!updated)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  // unwrap params
  const { id } = await params; // <-- important fix

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (decoded.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const deleted = await Post.findByIdAndDelete(id); // use unwrapped id
    if (!deleted)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to delete", error: err.message },
      { status: 500 }
    );
  }
}
