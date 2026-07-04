import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync } from 'fs';

const htmlPages = [
    'index',
    'review',
    'csse2010',
    'csse1001',
    'csse2310',
    'csse3010',
    'course_boilerplate',
];

function copyStaticAssets() {
    return {
        name: 'copy-static-assets',
        closeBundle() {
            cpSync(resolve(__dirname, 'public/assets'), resolve(__dirname, 'dist/assets'), { recursive: true });
        },
    };
}

export default defineConfig({
    root: 'public',
    publicDir: false,
    base: '/',
    plugins: [copyStaticAssets()],
    build: {
        outDir: '../dist',
        assetsDir: 'bundled',
        rollupOptions: {
            input: Object.fromEntries(
                htmlPages.map((name) => [name, resolve(__dirname, `public/${name}.html`)])
            ),
        },
    },
});
