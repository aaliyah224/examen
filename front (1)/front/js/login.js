// Obtiene el formulario de login por su ID
const loginForm = document.getElementById('loginForm');

// Obtiene el elemento donde se mostrará el mensaje de login (éxito o error)
const message = document.getElementById('loginMessage');

// Escucha el evento 'submit' del formulario
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Obtiene los valores ingresados por el usuario
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;

    try {
        // Envía una solicitud POST al backend para iniciar sesión
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Indica que se envía JSON
            body: JSON.stringify({ user, password }) // Convierte los datos a JSON
        });

        // Convierte la respuesta del servidor a objeto JavaScript
        const data = await response.json();

        // Si el login fue exitoso (código 200)
        if (response.ok) {
            // Guarda el token en localStorage para futuras peticiones protegidas
            localStorage.setItem('token', data.token);

            // Guarda el nombre del usuario (extraído del mensaje o directamente del backend)
            localStorage.setItem('usuario', data.mensaje.split(' ')[1] || data.user || 'Usuario');

            // Muestra mensaje de éxito
            message.textContent = "Acceso permitido, redirigiendo...";
            message.style.color = "green";

            // Espera 1.5 segundos y redirige al inicio
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            // Si el login falla, muestra mensaje de error
            message.textContent = "Usuario o contraseña incorrectos.";
            message.style.color = "red";
        }

    } catch (error) {
        // Si ocurre un error de red o servidor, lo muestra en consola y en pantalla
        console.error(error);
        message.textContent = "Error al conectar con el servidor.";
        message.style.color = "red";
    }
});
