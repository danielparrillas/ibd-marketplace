import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from './components/ui/sonner';
import { initializeTheme } from './hooks/use-appearance';
import Cookies from 'js-cookie';
import axios from 'axios'; // 1. Importa Axios

declare global {
    interface Window {
        axios: typeof axios;
        __APP_AXIOS_CSRF_INTERCEPTOR__?: number;
    }
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// --- INICIO DE LA CONFIGURACIÓN CSRF Y AXIOS (FIX 419) ---
// 2. Añadir Axios a la ventana global, usando 'as any' para evitar el error de tipado de TS.
window.axios = axios;

const readMetaCsrfToken = () => {
    const current = document.head.querySelector('meta[name="csrf-token"]');

    return current instanceof HTMLMetaElement ? current.content : null;
};

const readXsrfToken = () => Cookies.get('XSRF-TOKEN');

// 4. Header estándar para peticiones AJAX
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// 5. Interceptor global para adjuntar el token CSRF cuando haga falta.
if (!window.__APP_AXIOS_CSRF_INTERCEPTOR__) {
    const protectedMethods = ['post', 'put', 'patch', 'delete'];

    window.__APP_AXIOS_CSRF_INTERCEPTOR__ = axios.interceptors.request.use(
        (config) => {
            const method = (config.method ?? 'get').toLowerCase();
            const xsrfToken = readXsrfToken();
            const csrfToken = readMetaCsrfToken();

            config.headers = config.headers ?? {};

            if (xsrfToken) {
                config.headers['X-XSRF-TOKEN'] = xsrfToken;
                delete config.headers['X-CSRF-TOKEN'];
            } else if (csrfToken) {
                config.headers['X-CSRF-TOKEN'] = csrfToken;
            }

            if (!protectedMethods.includes(method)) {
                return config;
            }

            if (xsrfToken) {
                return config;
            }

            if (!csrfToken) {
                return config;
            }

            if (config.data instanceof FormData && !config.data.has('_token')) {
                config.data.append('_token', csrfToken);
            } else if (config.data instanceof URLSearchParams && !config.data.has('_token')) {
                config.data.append('_token', csrfToken);
            } else if (config.data && typeof config.data === 'object' && !('_token' in config.data)) {
                config.data = { ...config.data, _token: csrfToken };
            } else if (!config.data) {
                const fallbackPayload = new FormData();
                fallbackPayload.append('_token', csrfToken);
                config.data = fallbackPayload;
            }

            return config;
        },
    );
}
// --- FIN DE LA CONFIGURACIÓN CSRF Y AXIOS ---


createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster richColors />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
