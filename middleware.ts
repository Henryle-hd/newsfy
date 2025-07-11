import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // req
    // Add any additional logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/protected/:path*']
}