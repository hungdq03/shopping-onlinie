import { NextRequest, NextResponse } from 'next/server';

// Define your user roles here (replace with your actual roles)
export enum Role {
    ADMIN = 'admin',
    SELLER = 'seller',
    MARKETER = 'marketer',
}

// Interface for user object retrieved from JWT
interface User {
    role?: Role;
    // Add other relevant user properties
}

// Function to check if user has a specific role
const hasRole = (user: User, role: Role): boolean => {
    // Implement your logic to check user role based on your authentication system (e.g., JWT claims)
    return user.role === role;
};

export default async function middleware(req: NextRequest) {
    const nextUrl = req?.nextUrl;
    // Extract user information from JWT (replace with your logic)
    // Add JWT secret
    const user: User = {
        role: Role.MARKETER,
    };

    const isPublicPath = nextUrl.pathname === '/login';

    // If user is not authenticated, redirect to login

    if (isPublicPath && user) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (!isPublicPath && !user) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Define route access rules based on roles (replace with your specific rules)
    const protectedRoutes: Record<string, Role> = {
        '/admin': Role.ADMIN,
        '/seller': Role.SELLER,
        '/marketer': Role.MARKETER,
    };

    // Check if the current route requires a specific role
    const protectedRoute = Object.keys(protectedRoutes).find((path) =>
        nextUrl.pathname.startsWith(path)
    );

    if (protectedRoute && !hasRole(user, protectedRoutes[protectedRoute])) {
        // Redirect unauthorized users to a designated page (e.g., /unauthorized)
        return NextResponse.redirect(new URL('/404', nextUrl.origin));
    }

    // If no restrictions or user has the required role, continue to the page
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/seller/:path*',
        '/admin/:path*',
        '/marketer/:path*',
        '/login',
    ],
};
