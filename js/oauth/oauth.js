import { oauthConfig } from './config.js';

export async function refreshAccessToken() {
    const clientId = loadClientId();
    const clientSecret = loadClientSecret();
    const refreshToken = loadRefreshToken();

    if (!clientId || !clientSecret || !refreshToken) {
        console.log('OAuth configuration is missing. Please set the client ID, client secret, and refresh token.');
        document.getElementById('token-info').innerText = 'OAuth configuration is missing. Please enter the required information.';
        return null;
    }

    try {
        // Request a new access token using the refresh token
        const response = await fetch(oauthConfig.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': clientId,
                'client_secret': clientSecret,
                'grant_type': 'refresh_token',
                'refresh_token': refreshToken
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to refresh access token: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract and store the new access and refresh tokens
        const accessToken = data.access_token;
        const expiresAt = data.expires_at;
        const newRefreshToken = data.refresh_token;

        saveAccessToken(accessToken, expiresAt);
        saveRefreshToken(newRefreshToken);

        document.getElementById('token-info').innerText = `New Access Token: ${accessToken} (expires at: ${new Date(expiresAt * 1000).toLocaleString()})`;
        return accessToken;

    } catch (error) {
        console.error('Error during access token refresh:', error);
        document.getElementById('token-info').innerText = 'Failed to refresh access token. Check the console for details.';
        return null;
    }
}

export function isAccessTokenExpired() {
    const expiresAt = loadAccessTokenExpiry();
    const currentTime = Math.floor(Date.now() / 1000);
    return !expiresAt || currentTime >= expiresAt;
}

// Storage Helper Functions for OAuth Configuration
export function saveOAuthConfig(clientId, clientSecret, refreshToken) {
    localStorage.setItem('client_id', clientId);
    localStorage.setItem('client_secret', clientSecret);
    localStorage.setItem('refresh_token', refreshToken);
}

export function loadClientId() {
    return localStorage.getItem('client_id');
}

export function loadClientSecret() {
    return localStorage.getItem('client_secret');
}

export function saveAccessToken(token, expiresAt) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('access_token_expires_at', expiresAt.toString());
}

export function loadAccessToken() {
    return localStorage.getItem('access_token');
}

export function loadAccessTokenExpiry() {
    return parseInt(localStorage.getItem('access_token_expires_at'), 10);
}

export function saveRefreshToken(token) {
    localStorage.setItem('refresh_token', token);
}

export function loadRefreshToken() {
    return localStorage.getItem('refresh_token');
}

export function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_token_expires_at');
    localStorage.removeItem('client_id');
    localStorage.removeItem('client_secret');
    localStorage.removeItem('refresh_token');
}