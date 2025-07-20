// Fungsi request API dengan JWT
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('jwt');

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    const response = await fetch(url, options);

    // Jika token expired/unauthorized
    if (response.status === 401) {
        logout();  // Kembali ke halaman login
    }

    return response;
}