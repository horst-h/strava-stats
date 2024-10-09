async function refreshAccessToken() {
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

function isAccessTokenExpired() {
    const expiresAt = loadAccessTokenExpiry();
    const currentTime = Math.floor(Date.now() / 1000);
    return !expiresAt || currentTime >= expiresAt;
}
