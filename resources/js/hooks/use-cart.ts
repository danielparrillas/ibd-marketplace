import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { usePage } from '@inertiajs/react';
import { useCartToken } from './use-cart-token';
import { ensureCsrfToken } from '@/lib/csrf';

type UnknownRecord = Record<string, unknown>;

interface AuthUser {
    id: number;
}

interface SharedProps {
    auth?: {
        user?: AuthUser | null;
    };
}

export interface CartDish {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string | null;
    preparation_time: number;
    calories: number;
    allergens: string | null;
}

export interface CartRestaurant {
    id: number;
    business_name: string;
}

export interface CartItem {
    id: number;
    dish: CartDish;
    restaurant: CartRestaurant;
    quantity: number;
    options: UnknownRecord;
}

interface CartResponse {
    data?: CartItem[];
}

export interface UseCartResult {
    items: CartItem[];
    restaurant: CartRestaurant | null;
    isLoading: boolean;
    isMutating: boolean;
    error: string | null;
    lastStatus: number | null;
    refresh: () => Promise<void>;
    setItemQuantity: (dishId: number, quantity: number, options?: UnknownRecord) => Promise<void>;
    clearCart: () => Promise<void>;
    resetError: () => void;
}

const DEFAULT_ERROR_MESSAGES = {
    load: 'No se pudo cargar el carrito. Intenta nuevamente.',
    update: 'No se pudo actualizar el carrito. Intenta nuevamente.',
    clear: 'No se pudo vaciar el carrito. Intenta nuevamente.',
};

export function useCart(): UseCartResult {
    const page = usePage();
    const props = page.props as SharedProps;
    const token = useCartToken();
    const isAuthenticated = Boolean(props.auth?.user?.id);

    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastStatus, setLastStatus] = useState<number | null>(null);

    const isMountedRef = useRef(true);
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const ownerReady = isAuthenticated || Boolean(token);

    const getOwnerParams = useCallback((): UnknownRecord | undefined => {
        if (!isAuthenticated && token) {
            return { session_token: token };
        }

        return undefined;
    }, [isAuthenticated, token]);

    const fetchCart = useCallback(async () => {
        if (!ownerReady) {
            if (isMountedRef.current) {
                setItems([]);
            }
            return;
        }

        if (isMountedRef.current) {
            setIsLoading(true);
            setLastStatus(null);
        }

        try {
            const response = await axios.get<CartResponse>('/cart', {
                params: getOwnerParams(),
            });

            if (!isMountedRef.current) {
                return;
            }

            setItems(response.data?.data ?? []);
            setError(null);
            setLastStatus(response.status ?? null);
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;

            if (!isMountedRef.current) {
                return;
            }

            setError(axiosError.response?.data?.message ?? DEFAULT_ERROR_MESSAGES.load);
            setLastStatus(axiosError.response?.status ?? null);
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [getOwnerParams, ownerReady]);

    useEffect(() => {
        if (!ownerReady) {
            if (isMountedRef.current) {
                setItems([]);
            }
            return;
        }

        void fetchCart();
    }, [fetchCart, ownerReady]);

    const setItemQuantity = useCallback(async (dishId: number, quantity: number, options?: UnknownRecord) => {
        if (!ownerReady) {
            return;
        }

        if (isMountedRef.current) {
            setIsMutating(true);
            setLastStatus(null);
        }

        let lastError: AxiosError<{ message?: string }> | null = null;

        try {
            for (const forceRefresh of [false, true]) {
                try {
                    await ensureCsrfToken(forceRefresh);

                    const response = await axios.post<CartResponse>('/cart/add', {
                        dish_id: dishId,
                        quantity,
                        options,
                        ...(getOwnerParams() ?? {}),
                    });

                    if (!isMountedRef.current) {
                        return;
                    }

                    setItems(response.data?.data ?? []);
                    setError(null);
                    setLastStatus(response.status ?? null);
                    return;
                } catch (err) {
                    const axiosError = err as AxiosError<{ message?: string }>;
                    lastError = axiosError;

                    if (axiosError.response?.status === 419 && !forceRefresh) {
                        continue;
                    }

                    if (isMountedRef.current) {
                        setError(axiosError.response?.data?.message ?? DEFAULT_ERROR_MESSAGES.update);
                        setLastStatus(axiosError.response?.status ?? null);
                    }

                    throw err;
                }
            }

            if (lastError) {
                if (isMountedRef.current) {
                    setError(lastError.response?.data?.message ?? DEFAULT_ERROR_MESSAGES.update);
                    setLastStatus(lastError.response?.status ?? null);
                }

                throw lastError;
            }
        } finally {
            if (isMountedRef.current) {
                setIsMutating(false);
            }
        }
    }, [getOwnerParams, ownerReady]);

    const clearCart = useCallback(async () => {
        if (!ownerReady) {
            if (isMountedRef.current) {
                setItems([]);
            }
            return;
        }

        if (isMountedRef.current) {
            setIsMutating(true);
            setLastStatus(null);
        }

        let lastError: AxiosError<{ message?: string }> | null = null;

        try {
            for (const forceRefresh of [false, true]) {
                try {
                    await ensureCsrfToken(forceRefresh);

                    const ownerPayload = getOwnerParams();
                    const response = await axios.post<CartResponse>('/cart/clear', ownerPayload ?? {});

                    if (isMountedRef.current) {
                        setItems([]);
                        setError(null);
                        setLastStatus(response.status ?? null);
                    }

                    return;
                } catch (err) {
                    const axiosError = err as AxiosError<{ message?: string }>;
                    lastError = axiosError;

                    if (axiosError.response?.status === 419 && !forceRefresh) {
                        continue;
                    }

                    if (isMountedRef.current) {
                        setError(axiosError.response?.data?.message ?? DEFAULT_ERROR_MESSAGES.clear);
                        setLastStatus(axiosError.response?.status ?? null);
                    }

                    throw err;
                }
            }

            if (lastError) {
                if (isMountedRef.current) {
                    setError(lastError.response?.data?.message ?? DEFAULT_ERROR_MESSAGES.clear);
                    setLastStatus(lastError.response?.status ?? null);
                }

                throw lastError;
            }
        } finally {
            if (isMountedRef.current) {
                setIsMutating(false);
            }
        }
    }, [getOwnerParams, ownerReady]);

    const refresh = useCallback(async () => {
        await fetchCart();
    }, [fetchCart]);

    const resetError = useCallback(() => {
        if (!isMountedRef.current) {
            return;
        }

        setError(null);
        setLastStatus(null);
    }, []);

    const restaurant = useMemo(() => {
        return items.length > 0 ? items[0].restaurant : null;
    }, [items]);

    return {
        items,
        restaurant,
        isLoading,
        isMutating,
        error,
        lastStatus,
        refresh,
        setItemQuantity,
        clearCart,
        resetError,
    };
}
