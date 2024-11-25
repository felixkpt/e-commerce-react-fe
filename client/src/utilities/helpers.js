// client/src/utilities/helpers.js
export const app = {
    name: import.meta.env.VITE_APP_NAME || 'AppName',
    urls: {
        api: import.meta.env.VITE_API_URL,
    }
};
