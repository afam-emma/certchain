import { auth } from './app/api/auth/[...nextauth]/route'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  if (isLoggedIn && nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/dashboard', req.url))
  }

  if (!isLoggedIn && nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}