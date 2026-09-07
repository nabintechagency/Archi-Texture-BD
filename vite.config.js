import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function updateIndexHtmlPlugin() {
    return {
        name: 'update-index-html',
        closeBundle() {
            try {
                const manifestPath = path.resolve(__dirname, 'public/build/manifest.json');
                const indexPath = path.resolve(__dirname, 'public/index.html');
                if (fs.existsSync(manifestPath) && fs.existsSync(indexPath)) {
                    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    const entry = manifest['resources/js/app.jsx'];
                    if (entry) {
                        let html = fs.readFileSync(indexPath, 'utf8');
                        const jsFile = `/build/${entry.file}`;
                        const cssFile = entry.css && entry.css[0] ? `/build/${entry.css[0]}` : null;

                        // Replace stylesheet link
                        html = html.replace(/<!-- Bundled Stylesheets -->[\s\S]*?<\/head>/, `<!-- Bundled Stylesheets -->\n        ${cssFile ? `<link rel="stylesheet" href="${cssFile}" />` : ''}\n    </head>`);

                        // Replace JS script tag
                        html = html.replace(/<!-- App Bundles -->[\s\S]*?<\/body>/, `<!-- App Bundles -->\n        <script type="module" src="${jsFile}"></script>\n    </body>`);

                        fs.writeFileSync(indexPath, html, 'utf8');
                        console.log(`[Auto-Sync] Updated public/index.html -> JS: ${jsFile}, CSS: ${cssFile}`);
                    }
                }
            } catch (err) {
                console.error('[Auto-Sync] Error updating public/index.html:', err);
            }
        }
    };
}

export default defineConfig({
    base: '/',
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        updateIndexHtmlPlugin(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
});


