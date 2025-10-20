import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { success, warning, info, message, error } = usePage().props || {};

    useEffect(() => {
        if (success) toast.success(success as string);
    }, [success]);

    useEffect(() => {
        if (warning) toast.warning(warning as string);
    }, [warning]);

    useEffect(() => {
        if (info) toast.info(info as string);
    }, [info]);

    useEffect(() => {
        if (message) toast.message(message as string);
    }, [message]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};
