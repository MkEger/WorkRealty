document.addEventListener('DOMContentLoaded', function() {
    function updateUIBasedOnAuthStatus(isLoggedIn, user) {
        const loginLink = document.querySelector('nav ul li a[href="/login"]');
        const adminLink = document.querySelector('nav ul li a[href="/admin"]');

        if (isLoggedIn) {
            
            if (loginLink) {
                loginLink.textContent = `${user.firstname} ${user.lastname}`;
                loginLink.href = "/profile"; 
            }

            
            if (adminLink) {
                
                adminLink.style.display = (user.role === 'admin') ? 'block' : 'none';
            }
        } else {
            
            if (loginLink) {
                loginLink.textContent = "Авторизація";
                loginLink.href = "/login";
            }

            
            if (adminLink) {
                adminLink.style.display = 'none';
            }
        }
    }

    
    fetch('/auth-status')
        .then(response => response.json())
        .then(data => {
            updateUIBasedOnAuthStatus(data.isLoggedIn, data.user);
        })
        .catch(error => {
            console.error('Помилка перевірки статусу:', error);
        });
});