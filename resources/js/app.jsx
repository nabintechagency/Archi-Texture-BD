import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import queryClient from './lib/query-client';

const appName = import.meta.env.VITE_APP_NAME || 'Archi Texture';

// Prevent Inertia from popping up an empty/white modal on non-JSON navigation responses
router.on('invalid', (event) => {
    event.preventDefault();
    if (event.detail?.response?.url) {
        window.location.href = event.detail.response.url;
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />
            </QueryClientProvider>,
        );
    },
    progress: {
        color: '#A98952',
    },
});

