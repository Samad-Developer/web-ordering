import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ur'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // The `pathnames` object holds pairs of internal and
  // external paths
  pathnames: {
    '/': '/',
    '/category': '/category',
    '/order-sucess': '/order-sucess',
    '/checkout': '/checkout',
    '/product': '/product',
    '/profile': '/profile'
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);