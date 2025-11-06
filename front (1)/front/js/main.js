// main.js - Script principal para manejo de la interfaz de usuario
document.addEventListener("DOMContentLoaded", () => {
    console.log("SkillForge - Inicializando aplicación");
    
    // Inicializar la interfaz de usuario
    inicializarInterfazUsuario();
    
    // Configurar event listeners globales
    configurarEventListeners();
    
    // Verificar estado de autenticación y actualizar UI
    verificarEstadoAutenticacion();
});

/**
 * Inicializa todos los componentes de la interfaz de usuario
 */
function inicializarInterfazUsuario() {
    console.log("Inicializando interfaz de usuario...");
    
    // Actualizar header con información del usuario
    actualizarHeader();
    
    // Configurar elementos protegidos
    configurarElementosProtegidos();
    
    // Configurar botones de certificaciones
    configurarBotonesCertificaciones();
    
    // Configurar formulario de contacto si existe
    configurarFormularioContacto();
    
    // Configurar navegación suave
    configurarNavegacionSuave();
}

/**
 * Configura event listeners globales
 */
function configurarEventListeners() {
    console.log("Configurando event listeners globales...");
    
    // Listener para cambios en el almacenamiento local (login/logout)
    window.addEventListener('storage', function(e) {
        if (e.key === 'token' || e.key === 'usuario') {
            console.log('Estado de autenticación cambiado, actualizando UI...');
            verificarEstadoAutenticacion();
        }
    });
    
    // Prevenir envío de formularios por defecto
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.id !== 'loginForm' && form.id !== 'form-examen' && !form.classList.contains('form-contacto')) {
            e.preventDefault();
            console.log('Formulario prevenido:', form.id);
        }
    });
}

/**
 * Verifica el estado de autenticación y actualiza la UI
 */
function verificarEstadoAutenticacion() {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    
    console.log("Verificando autenticación - Token:", !!token, "Usuario:", usuario);
    
    if (token && usuario) {
        // Usuario está logueado
        mostrarUsuarioLogueado(usuario);
        habilitarElementosProtegidos();
    } else {
        // Usuario NO está logueado
        mostrarUsuarioNoLogueado();
        deshabilitarElementosProtegidos();
    }
}

/**
 * Actualiza el header con la información del usuario
 */
function actualizarHeader() {
    const header = document.getElementById("main-header");
    if (!header) {
        console.log("Header no encontrado");
        return;
    }

    const navList = header.querySelector("nav ul");
    if (!navList) {
        console.log("Lista de navegación no encontrada");
        return;
    }

    const usuario = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    // Eliminar elementos de usuario previos para evitar duplicados
    const oldUserInfo = header.querySelector(".user-info");
    const oldLogout = header.querySelector("#logoutBtn");
    const oldLogin = header.querySelector("#loginBtn");
    
    if (oldUserInfo) oldUserInfo.remove();
    if (oldLogout) oldLogout.remove();
    if (oldLogin) oldLogin.remove();

    if (usuario && token) {
        // Usuario logueado - mostrar información y botón de logout
        const userInfo = document.createElement("li");
        userInfo.className = "user-info";
        userInfo.innerHTML = `<span>👤 Hola, ${usuario}</span>`;
        
        const logoutItem = document.createElement("li");
        logoutItem.innerHTML = `<a href="#" id="logoutBtn" class="logout-btn">Cerrar sesión</a>`;
        
        navList.appendChild(userInfo);
        navList.appendChild(logoutItem);

        // Configurar evento de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', manejarLogout);
        }
        
        console.log("Header actualizado - Usuario logueado:", usuario);
    } else {
        // Usuario NO logueado - mostrar botón de login
        const loginItem = document.createElement("li");
        loginItem.innerHTML = `<a href="login.html" id="loginBtn">Iniciar Sesión</a>`;
        navList.appendChild(loginItem);
        
        console.log("Header actualizado - Usuario no logueado");
    }
}

/**
 * Muestra la interfaz para usuario logueado
 */
function mostrarUsuarioLogueado(usuario) {
    console.log("Mostrando interfaz para usuario logueado:", usuario);
    
    // Actualizar todos los headers en la página
    document.querySelectorAll('#main-header').forEach(header => {
        const navList = header.querySelector("nav ul");
        if (navList) {
            // Limpiar elementos existentes
            const existingElements = header.querySelectorAll('.user-info, #logoutBtn, #loginBtn');
            existingElements.forEach(el => el.remove());
            
            // Agregar nuevos elementos
            const userInfo = document.createElement("li");
            userInfo.className = "user-info";
            userInfo.innerHTML = `<span>👤 Hola, ${usuario}</span>`;
            
            const logoutItem = document.createElement("li");
            logoutItem.innerHTML = `<a href="#" id="logoutBtn" class="logout-btn">Cerrar sesión</a>`;
            
            navList.appendChild(userInfo);
            navList.appendChild(logoutItem);
            
            // Configurar evento de logout
            const logoutBtn = header.querySelector('#logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', manejarLogout);
            }
        }
    });
}

/**
 * Muestra la interfaz para usuario no logueado
 */
function mostrarUsuarioNoLogueado() {
    console.log("Mostrando interfaz para usuario no logueado");
    
    // Actualizar todos los headers en la página
    document.querySelectorAll('#main-header').forEach(header => {
        const navList = header.querySelector("nav ul");
        if (navList) {
            // Limpiar elementos existentes
            const existingElements = header.querySelectorAll('.user-info, #logoutBtn, #loginBtn');
            existingElements.forEach(el => el.remove());
            
            // Agregar botón de login
            const loginItem = document.createElement("li");
            loginItem.innerHTML = `<a href="login.html" id="loginBtn">Iniciar Sesión</a>`;
            navList.appendChild(loginItem);
        }
    });
}

/**
 * Maneja el proceso de logout
 */
function manejarLogout(e) {
    e.preventDefault();
    console.log("Ejecutando logout...");

    // Mostrar confirmación con SweetAlert2
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás segura de que quieres cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('pagoRealizado');

            console.log("Datos de sesión eliminados");

            // Mostrar mensaje de confirmación con SweetAlert2
            Swal.fire({
                title: 'Sesión cerrada',
                text: 'Has salido correctamente',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                // Redirigir a la página principal
                window.location.href = "index.html";
            });
        }
    });
}


/**
 * Configura elementos protegidos que requieren autenticación
 */
function configurarElementosProtegidos() {
    const elementosProtegidos = document.querySelectorAll('.protegido');
    console.log(`Configurando ${elementosProtegidos.length} elementos protegidos`);
    
    elementosProtegidos.forEach(elemento => {
        // Solo configurar si no tiene un listener previo
        if (!elemento.hasAttribute('data-protected-configured')) {
            elemento.setAttribute('data-protected-configured', 'true');
            
            elemento.addEventListener('click', function(e) {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Acceso denegado a elemento protegido:', elemento.href || elemento.textContent);
                    
                    // Usar SweetAlert o similar si está disponible, sino alert nativo
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Acceso restringido',
                            text: 'Debes iniciar sesión para acceder a esta sección.',
                            icon: 'warning',
                            confirmButtonText: 'Iniciar sesión'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "login.html";
                            }
                        });
                    } else {
                        if (confirm('Debes iniciar sesión para acceder a esta sección. ¿Quieres ir a la página de login?')) {
                            window.location.href = "login.html";
                        }
                    }
                }
            });
        }
    });
}

/**
 * Habilita elementos protegidos cuando el usuario está autenticado
 */
function habilitarElementosProtegidos() {
    const elementosProtegidos = document.querySelectorAll('.protegido');
    console.log(`Habilitando ${elementosProtegidos.length} elementos protegidos`);
    
    elementosProtegidos.forEach(elemento => {
        elemento.style.opacity = "1";
        elemento.style.pointerEvents = "auto";
        elemento.title = ""; // Limpiar tooltip
    });
}

/**
 * Deshabilita elementos protegidos cuando el usuario NO está autenticado
 */
function deshabilitarElementosProtegidos() {
    const elementosProtegidos = document.querySelectorAll('.protegido');
    console.log(`Deshabilitando ${elementosProtegidos.length} elementos protegidos`);
    
    elementosProtegidos.forEach(elemento => {
        elemento.style.opacity = "0.6";
        elemento.style.pointerEvents = "none";
        elemento.title = "Inicia sesión para acceder";
    });
}

/**
 * Configura los botones de certificaciones
 */
function configurarBotonesCertificaciones() {
    console.log("Configurando botones de certificaciones...");
    
    // Configurar botones de pago
    const botonesPago = document.querySelectorAll('.boton-primario');
    botonesPago.forEach(boton => {
        if (!boton.hasAttribute('data-click-configured')) {
            boton.setAttribute('data-click-configured', 'true');
            
            boton.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                    manejarPagoCertificacion(this);
                }
            });
        }
    });
    
    // Configurar botones de examen
    const botonesExamen = document.querySelectorAll('.boton-secundario');
    botonesExamen.forEach(boton => {
        if (!boton.hasAttribute('data-click-configured')) {
            boton.setAttribute('data-click-configured', 'true');
            
            boton.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                    manejarInicioExamen(this);
                }
            });
        }
    });
}

/**
 * Maneja el proceso de pago de certificación
 */
function manejarPagoCertificacion(boton) {
    const token = localStorage.getItem('token');
    const pagoRealizado = localStorage.getItem('pagoRealizado');
    
    if (!token) {
        alert('⚠️ Debes iniciar sesión para realizar el pago.');
        window.location.href = 'login.html';
        return;
    }
    
    if (pagoRealizado === 'true') {
        alert('⚠️ Ya has realizado el pago. No puedes pagar dos veces.');
        return;
    }
    
    // Simular proceso de pago
    if (confirm('¿Estás seguro de que quieres realizar el pago de $3500 por la certificación JavaScript?')) {
        localStorage.setItem('pagoRealizado', 'true');
        alert('✅ Pago realizado con éxito. ¡Ahora puedes presentar tu examen!');
        
        // Actualizar UI
        boton.style.opacity = '0.6';
        boton.style.pointerEvents = 'none';
        boton.textContent = '✅ Pagado';
        
        console.log('Pago simulado exitosamente');
    }
}

/**
 * Maneja el inicio del examen
 */
function manejarInicioExamen(boton) {
    const token = localStorage.getItem('token');
    const pagoRealizado = localStorage.getItem('pagoRealizado');
    const usuario = localStorage.getItem('usuario');
    
    console.log("Verificando acceso al examen:", { token: !!token, pagoRealizado, usuario });
    
    if (!token) {
        alert('⚠️ Debes iniciar sesión para acceder al examen.');
        window.location.href = 'login.html';
        return;
    }
    
    if (pagoRealizado !== 'true') {
        alert('⚠️ Debes realizar el pago antes de iniciar el examen.');
        return;
    }
    
    // Verificar si ya presentó el examen (podrías agregar esta verificación)
    const examenRealizado = localStorage.getItem('examenRealizado');
    if (examenRealizado === 'true') {
        alert('⚠️ Ya realizaste el examen. Solo se permite un intento por usuario.');
        return;
    }
    
    // Redirigir al examen
    console.log('Acceso al examen permitido, redirigiendo...');
    window.location.href = 'examen.html';
}

/**
 * Configura el formulario de contacto
 */
function configurarFormularioContacto() {
    const formContacto = document.querySelector('.form-contacto');
    if (!formContacto) return;
    
    console.log("Configurando formulario de contacto...");
    
    formContacto.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const datos = {
            nombre: formData.get('nombre') || this.querySelector('input[type="text"]')?.value,
            email: formData.get('email') || this.querySelector('input[type="email"]')?.value,
            asunto: formData.get('asunto') || this.querySelector('input[type="text"]:nth-child(5)')?.value,
            mensaje: formData.get('mensaje') || this.querySelector('textarea')?.value
        };
        
        // Validación básica
        if (!datos.nombre || !datos.email || !datos.mensaje) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }
        
        try {
            // Enviar datos al backend
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos) //convertimos el objeto datos a una cadena json
            });
            
            if (response.ok) {
                alert('✅ Mensaje enviado correctamente. Te contactaremos pronto.');
                this.reset();
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            alert('✅ Mensaje enviado correctamente (simulado). Te contactaremos pronto.');
            this.reset();
        }
    });
}

/**
 * Configura navegación suave para anchors
 */
function configurarNavegacionSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Utilidad para mostrar notificaciones (puede extenderse con SweetAlert)
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    console.log(`Notificación [${tipo}]: ${mensaje}`);
    
    // Si SweetAlert está disponible, usarlo
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            text: mensaje,
            icon: tipo,
            confirmButtonText: 'OK',
            timer: 3000
        });
    } else {
        // Usar alert nativo como fallback
        alert(mensaje);
    }
}

/**
 * Verifica la conexión con el backend
 */
async function verificarConexionBackend() {
    try {
        const response = await fetch('http://localhost:3000/api/health', {
            method: 'GET',
            timeout: 5000
        });
        
        if (response.ok) {
            console.log('✅ Conexión con el backend establecida');
            return true;
        }
    } catch (error) {
        console.warn('⚠️ No se pudo conectar con el backend:', error.message);
        return false;
    }
}

// Exportar funciones para uso global (si es necesario)
window.SkillForge = {
    verificarEstadoAutenticacion,
    manejarLogout,
    mostrarNotificacion,
    verificarConexionBackend
};

console.log("main.js cargado correctamente");
