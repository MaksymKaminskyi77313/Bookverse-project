  // auth
const AUTH_API = "https://bookverse-project.onrender.com/users";
 
//const AUTH_API = "http://localhost:8080/users";
    const tabLogin    = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm   = document.getElementById('page-login-form');
    const registerForm = document.getElementById('page-register-form');
 
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
 
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email    = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            const res  = await fetch(`${AUTH_API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Login failed");
                return;
            }
 
            sessionStorage.setItem("currentUser", JSON.stringify(data));
            alert(`Welcome back, ${data.fullName}!`);
            window.location.href = 'index.html';

        } catch (err) {
            alert("Could not connect to server.");
        }
    });
 
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = registerForm.querySelector('input[type="text"]').value;
        const email    = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;
        const isAdmin  = document.getElementById('register-as-admin').checked;

        try {
            const res  = await fetch(`${AUTH_API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    role: isAdmin ? "admin" : "user"
                })
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Registration failed");
                return;
            }

            alert(`Account created! Welcome, ${data.fullName}!`);
            window.location.href = 'index.html';

        } catch (err) {
            alert("Could not connect to server.");
        }
    });
