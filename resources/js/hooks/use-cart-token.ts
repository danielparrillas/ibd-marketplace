import { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Cookies from 'js-cookie';

interface AuthUser {
    id: number;
}

interface SharedProps {
    auth?: {
        user?: AuthUser | null;
    };
}

const COOKIE_NAME = 'cart_token';
const COOKIE_MAX_AGE_DAYS = 14;

function generateToken(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useCartToken(): string | null {
    const page = usePage();
    const props = page.props as SharedProps;
    const isAuthenticated = Boolean(props.auth?.user?.id);
    const [token, setToken] = useState<string | null>(() => {
        if (isAuthenticated) {
            return null;
        }

        return Cookies.get(COOKIE_NAME) ?? null;
    });

    useEffect(() => {
        if (isAuthenticated) {
            if (Cookies.get(COOKIE_NAME)) {
                Cookies.remove(COOKIE_NAME);
            }
            if (token) {
                setToken(null);
            }
            return;
        }

        if (token) {
            return;
        }

        const newToken = generateToken();
        Cookies.set(COOKIE_NAME, newToken, {
            expires: COOKIE_MAX_AGE_DAYS,
            sameSite: 'lax',
            secure: window.location.protocol === 'https:',
        });

        setToken(newToken);
    }, [isAuthenticated, token]);

    return useMemo(() => (isAuthenticated ? null : token), [isAuthenticated, token]);
}
