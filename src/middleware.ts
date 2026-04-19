import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * 对页面类请求禁用强缓存，避免 CDN/浏览器长期保留旧版 HTML，部署后仍看到旧布局。
 * 静态资源（`/_next/static`、`/_next/image`、带后缀名的文件）不处理，保留默认长缓存。
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico" ||
    /\.(ico|png|jpe?g|gif|webp|svg|woff2?|txt|xml|json)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "private, no-cache, must-revalidate");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
