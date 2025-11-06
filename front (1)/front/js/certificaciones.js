// certificaciones.js - Manejo de certificados
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario aprobó recientemente
    const urlParams = new URLSearchParams(window.location.search);
    const aprobado = urlParams.get('aprobado');
    const intentoId = urlParams.get('intentoId');
    
    if (intentoId) {
        mostrarSeccionCertificado(intentoId, aprobado);
    }
    
    // Configurar botón de descarga
    const btnDescargar = document.getElementById('btn-descargar-certificado');
    if (btnDescargar) {
        btnDescargar.addEventListener('click', function() {
            const intentoId = this.getAttribute('data-intento-id');
            if (intentoId) {
                descargarCertificado(intentoId);
            }
        });
    }
});

function mostrarSeccionCertificado(intentoId, aprobado) {
    const seccionCertificado = document.getElementById('descargar-certificado');
    if (!seccionCertificado) return;

    seccionCertificado.style.display = 'block';
    seccionCertificado.scrollIntoView({ behavior: 'smooth' });

    const usuario = localStorage.getItem('usuario');
    const fecha = new Date().toLocaleDateString('es-MX');

    document.getElementById('certificado-usuario').textContent = usuario || 'Usuario desconocido';
    document.getElementById('certificado-fecha').textContent = fecha;

    // Mostrar estado real
    const estadoElem = document.getElementById('certificado-estado');
    if (estadoElem) {
        if (aprobado === 'true') {
            estadoElem.textContent = 'Aprobado';
            estadoElem.style.color = '#28a745';
        } else {
            estadoElem.textContent = 'No Aprobado';
            estadoElem.style.color = '#dc3545';
        }
    }

    // Mostrar u ocultar botón de descarga según el resultado
    const btnDescargar = document.getElementById('btn-descargar-certificado');
    if (aprobado === 'true') {
        btnDescargar.style.display = 'inline-block';
        btnDescargar.setAttribute('data-intento-id', intentoId);
    } else {
        btnDescargar.style.display = 'none';
    }

    localStorage.setItem('ultimoIntentoAprobado', intentoId);
}

async function descargarCertificado(intentoId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo malo paso",
        });
        window.location.href = 'login.html';
        return;
    }
    
    const btnDescargar = document.getElementById('btn-descargar-certificado');
    const textoOriginal = btnDescargar.textContent;
    
    try {
        btnDescargar.textContent = 'Generando certificado...';
        btnDescargar.disabled = true;
        
        console.log('Solicitando certificado para intento:', intentoId);
        
        const response = await fetch(`http://localhost:3000/api/cert/${intentoId}/pdf`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Respuesta del servidor:', response.status);
        
        if (response.ok) {
            // Crear blob y descargar
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `certificado-javascript-${intentoId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
            Swal.fire({
                title: "Certificado descargado con éxito",
                icon: "success",
                draggable: true
            });
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(errorData.message || `Error ${response.status}`);
        }
    } catch (error) {
        console.error('Error descargando certificado:', error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al descargar el certificado: " + error.message,
        });
    } finally {
        btnDescargar.textContent = textoOriginal;
        btnDescargar.disabled = false;
    }
}

// Función para verificar si el usuario tiene certificados pendientes
function verificarCertificadosPendientes() {
    const intentoId = localStorage.getItem('ultimoIntentoAprobado');
    const examenRealizado = localStorage.getItem('examenRealizado');
    
    if (examenRealizado === 'true' && intentoId) {
        mostrarSeccionCertificado(intentoId);
    }
}

// Verificar al cargar la página
verificarCertificadosPendientes();
