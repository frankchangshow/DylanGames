import { NextResponse, type NextRequest } from "next/server";

const domainHomePages: Record<string, string> = {
  "braydengames.com": "/brayden",
  "www.braydengames.com": "/brayden",
  "dylan-games.com": "/dylan",
  "www.dylan-games.com": "/dylan"
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  const homePage = host ? domainHomePages[host] : null;

  if (!homePage) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  if (request.nextUrl.pathname === "/") {
    url.pathname = homePage;
    return NextResponse.rewrite(url);
  }

  if (request.nextUrl.pathname === homePage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/brayden", "/dylan"]
};
