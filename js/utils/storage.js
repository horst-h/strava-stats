// Storage Helper Functions for OAuth Configuration
function saveOAuthConfig(clientId, clientSecret, refreshToken) {
    localStorage.setItem('client_id', clientId);
    localStorage.setItem('client_secret', clientSecret);
    localStorage.setItem('refresh_token', refreshToken);
}

function loadClientId() {
    return localStorage.getItem('client_id');
}

function loadClientSecret() {
    return localStorage.getItem('client_secret');
}

function saveAccessToken(token, expiresAt) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('access_token_expires_at', expiresAt.toString());
}

function loadAccessToken() {
    return localStorage.getItem('access_token');
}

function loadAccessTokenExpiry() {
    return parseInt(localStorage.getItem('access_token_expires_at'), 10);
}

function saveRefreshToken(token) {
    localStorage.setItem('refresh_token', token);
}

function loadRefreshToken() {
    return localStorage.getItem('refresh_token');
}

function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_token_expires_at');
    localStorage.removeItem('client_id');
    localStorage.removeItem('client_secret');
    localStorage.removeItem('refresh_token');
}
