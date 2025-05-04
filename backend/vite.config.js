import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    server: {
        cors: {
            origin: [
                'http://localhost:3000',
                'https://backend.laravel',  
                'http://admin.laravel:8566',
            ]
        }
    }
});
