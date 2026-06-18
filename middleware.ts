import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

// Protect /admin and /admin/jobs/* but NOT /admin/login
export const config = {
  matcher: ["/admin", "/admin/jobs/:path*"],
};
