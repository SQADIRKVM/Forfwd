import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/',
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/questionnaire/:path*',
    '/settings/:path*',
  ],
};
