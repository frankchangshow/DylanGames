import { NextResponse, type NextRequest } from "next/server";

const domainRedirects: Record<string, string> = {
  "braydengames.com": "/brayden",
  "www.braydengames.com": "/brayden",
  "dylan-games.com": "/dylan",
  "www.dylan-games.com": "/dylan"
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  const redirectPath = host ? domainRedirects[host] : null;

  if (!redirectPath || request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = redirectPath;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/"
};
