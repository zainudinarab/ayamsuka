// Fungsi Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Simpan JWT di localStorage
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect berdasarkan role
            if (data.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user.html';
            }
        } else {
            alert(data.error || 'Login gagal');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Terjadi kesalahan saat login');
    }
});

// Fungsi Logout
function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}