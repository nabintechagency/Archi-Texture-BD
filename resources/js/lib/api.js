import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export function setApiToken(token) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        return;
    }

    delete api.defaults.headers.common.Authorization;
}

export default api;
