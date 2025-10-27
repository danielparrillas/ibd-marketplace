import axios from 'axios';
import Cookies from 'js-cookie';

const CSRF_COOKIE = 'XSRF-TOKEN';
let pending: Promise<void> | null = null;

export async function ensureCsrfToken(force = false): Promise<void> {
    if (!force && Cookies.get(CSRF_COOKIE)) {
        return;
    }

    if (!pending) {
        pending = axios
            .get('/sanctum/csrf-cookie')
            .then(() => undefined)
            .catch((error) => {
                if (error?.response?.status === 404) {
                    return undefined;
                }

                throw error;
            })
            .finally(() => {
                pending = null;
            });
    }

    await pending;
}
