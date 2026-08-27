import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/auth";
import { getAuthStore } from "./lib/authStore";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Check if target is a dashboard page or restricted API
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
  const isOrdersPage = pathname.startsWith("/orders");
  const isOrdersApi = pathname === "/api/orders" && method === "GET";
  const isProductApi = pathname === "/api/product" && method !== "GET";
  const isUploadApi = pathname.startsWith("/api/upload");

  const shouldProtect = isAdminPage || isAdminApi || isOrdersPage || isOrdersApi || isProductApi || isUploadApi;

  if (shouldProtect) {
    const sessionToken = request.cookies.get("pulsecare_admin_session")?.value;
    const authStore = await getAuthStore();
    const password = authStore.adminPassword;
    const isValid = await verifySession(sessionToken || "", password);

    if (!isValid) {
      // Return 401 Unauthorized for API endpoints
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access" },
          { status: 401 }
        );
      }

      // Redirect browser page requests to login screen
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/orders/:path*",
    "/api/:path*",
  ],
};
