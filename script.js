document.addEventListener('DOMContentLoaded', () => {
    // Lógica para la página de login (la misma que proporcionaste en l.js, pero renombrada)
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password-user");

        // Autocompleta los campos si hay datos de registro guardados
        const storedUser = localStorage.getItem('registeredUser');
        const storedPassword = localStorage.getItem('registeredPassword');

        if (storedUser && storedPassword) {
            usernameInput.value = storedUser;
            passwordInput.value = storedPassword;
            localStorage.removeItem('registeredUser'); // Limpia para no autocompletar en futuras visitas
            localStorage.removeItem('registeredPassword');
        }

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = usernameInput.value;
            const password = passwordInput.value;

            const users = getUsers();
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                setSession(username);
                alert("¡Login exitoso! Redirigiendo...");
                window.location.href = "index.html";
            } else {
                alert("❌ Usuario o contraseña incorrectos");
            }
        });
    }

    // Lógica para la página de registro
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputs = registerForm.querySelectorAll('input');
            const [fullName, email, password, confirmPassword] = inputs;
            const username = fullName.value;

            if (password.value !== confirmPassword.value) {
                alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
                return;
            }

            const users = getUsers();
            if (users.find(u => u.username === username)) {
                alert("❌ El usuario ya existe.");
                return;
            }

            users.push({ username, password: password.value });
            saveUsers(users);

            // Guardar credenciales para autocompletar en el login
            localStorage.setItem('registeredUser', username);
            localStorage.setItem('registeredPassword', password.value);
            
            alert("✅ Usuario registrado. Ahora serás redirigido para iniciar sesión.");
            window.location.href = "login.html";
        });
    }

    // Funciones de utilidad para localStorage
    function getUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    }

    function saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
    }

    function setSession(username) {
        localStorage.setItem("sessionUser", username);
    }
});