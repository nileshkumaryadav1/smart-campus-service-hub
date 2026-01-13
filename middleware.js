import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // allowing public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // if no token → login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // admin page protection
    if (
      pathname.startsWith("/admin") &&
      !["admin", "superadmin"].includes(payload.role)
    ) {
      return NextResponse.redirect(new URL("/me", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid / expired token
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/me"],
};
