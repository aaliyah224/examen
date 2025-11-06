// examen.js - Versión corregida
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (!token) {
        alert('Debes iniciar sesión para acceder al examen.');
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debes iniciar sesión para acceder al examen."
        });
        window.location.href = 'login.html';
        return;
    }

    // Mostrar información del usuario y fecha
    document.getElementById('nombre-usuario').textContent = usuario;
    document.getElementById('fecha-actual').textContent = new Date().toLocaleDateString('es-MX');

    let intentoId = null;
    let questions = [];
    let preguntaActual = 0;
    let respuestas = new Array(8).fill(null); // Array para 8 respuestas
    let tiempoRestante = 2 * 60 * 60; // 2 horas en segundos
    let temporizador;

    // Inicializar temporizador
    function iniciarTemporizador() {
        temporizador = setInterval(() => {
            tiempoRestante--;
            actualizarTemporizador();
            
            if (tiempoRestante <= 0) {
                clearInterval(temporizador);
                enviarExamenAutomaticamente();
            } else if (tiempoRestante <= 300) { // 5 minutos
                document.getElementById('temporizador').classList.add('urgente');
            }
        }, 1000);
    }

    function actualizarTemporizador() {
        const horas = Math.floor(tiempoRestante / 3600);
        const minutos = Math.floor((tiempoRestante % 3600) / 60);
        const segundos = tiempoRestante % 60;
        
        document.getElementById('temporizador').textContent = 
            `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    function enviarExamenAutomaticamente() {
        Swal.fire("El tiempo se agotó", "El examen se enviará automáticamente.");
        enviarRespuestas();
    }

    try {
        // Obtener las preguntas del examen
        const response = await fetch('http://localhost:3000/api/exam/start?idQuiz=1', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al cargar el examen');
        }

        const data = await response.json();
        questions = data.questions;
        intentoId = data.intentoId;

        console.log('Preguntas recibidas:', questions);

        // Iniciar temporizador
        iniciarTemporizador();

        // Renderizar primera pregunta
        renderizarPreguntaActual();
        actualizarBotonesNavegacion();
        actualizarProgreso();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al cargar el examen"
        });
        window.location.href = 'certificaciones.html';
    }

    function renderizarPreguntaActual() {
        const contenedor = document.getElementById('contenedor-preguntas');
        const pregunta = questions[preguntaActual];
        
        contenedor.innerHTML = `
            <div class="pregunta activa">
                <span class="indicador-pregunta">Pregunta ${preguntaActual + 1} de ${questions.length}</span>
                <h3>${pregunta.text}</h3>
                <div class="opciones" id="opciones-pregunta">
                    ${pregunta.options.map((opcion, i) => `
                        <label class="opcion ${respuestas[preguntaActual] === i ? 'seleccionada' : ''}">
                            <input type="radio" name="pregunta-${pregunta.id}" value="${i}" 
                                   ${respuestas[preguntaActual] === i ? 'checked' : ''}>
                            <span class="texto-opcion">${opcion}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        // Agregar event listeners a las opciones
        document.querySelectorAll('.opcion input').forEach((radio) => {
            radio.addEventListener('change', (e) => {
                const valorSeleccionado = parseInt(e.target.value);
                respuestas[preguntaActual] = valorSeleccionado;
                
                // Actualizar estilos visuales
                document.querySelectorAll('.opcion').forEach(op => {
                    op.classList.remove('seleccionada');
                });
                e.target.closest('.opcion').classList.add('seleccionada');
                
                actualizarProgreso();
                console.log(`Pregunta ${preguntaActual + 1} respondida:`, valorSeleccionado);
            });
        });
    }

    function actualizarBotonesNavegacion() {
        const btnAnterior = document.getElementById('btn-anterior');
        const btnSiguiente = document.getElementById('btn-siguiente');
        const btnEnviar = document.getElementById('btn-enviar');
        
        // Botón Anterior
        btnAnterior.disabled = preguntaActual === 0;
        
        // Botón Siguiente/Enviar
        if (preguntaActual < questions.length - 1) {
            btnSiguiente.style.display = 'block';
            btnEnviar.style.display = 'none';
        } else {
            btnSiguiente.style.display = 'none';
            btnEnviar.style.display = 'block';
        }
    }

    function actualizarProgreso() {
        const respondidas = respuestas.filter(r => r !== null).length;
        const porcentaje = (respondidas / questions.length) * 100;
        
        document.getElementById('barra-progreso').style.width = `${porcentaje}%`;
        document.getElementById('contador-preguntas').textContent = respondidas;
    }

    // Event listeners para navegación - CORREGIDOS
    document.getElementById('btn-siguiente').addEventListener('click', () => {
        if (preguntaActual < questions.length - 1) {
            preguntaActual++;
            renderizarPreguntaActual();
            actualizarBotonesNavegacion();
        }
    });

    document.getElementById('btn-anterior').addEventListener('click', () => {
        if (preguntaActual > 0) {
            preguntaActual--;
            renderizarPreguntaActual();
            actualizarBotonesNavegacion();
        }
    });

    // Manejar envío de respuestas
    const formExamen = document.getElementById('form-examen');
    formExamen.addEventListener('submit', async (e) => {
        e.preventDefault();
        await enviarRespuestas();
    });

    async function enviarRespuestas() {
        // Detener temporizador
        clearInterval(temporizador);

        const todasRespondidas = respuestas.every(r => r !== null);
        
        if (!todasRespondidas) {
            const confirmar = confirm('No has respondido todas las preguntas. ¿Estás seguro de que quieres enviar el examen?');
            if (!confirmar) return;
        }

        // Mostrar loading
        const btnEnviar = document.getElementById('btn-enviar');
        const textoOriginal = btnEnviar.textContent;
        btnEnviar.textContent = 'Enviando...';
        btnEnviar.disabled = true;

        try {
            console.log('Enviando respuestas:', respuestas);
            
            const response = await fetch('http://localhost:3000/api/exam/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    intentoId: intentoId,
                    respuestas: respuestas
                })
            });

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            if (response.ok) {
                const mensaje = result.pasado ? 
                    `¡Felicidades! Aprobaste el examen con ${result.score}/8 (${result.porcentaje}%)` :
                    `No aprobaste el examen. Obtuviste ${result.score}/8 (${result.porcentaje}%). Intenta nuevamente.`;

                Swal.fire({
                    icon: result.pasado ? "success" : "error",
                    title: result.pasado ? "¡Felicidades!" : "No aprobaste",
                    text: mensaje
                });

                if (result.pasado) {
                    // Marcar examen como realizado
                    localStorage.setItem('examenRealizado', 'true');
                    // Redirigir para descargar certificado
                    window.location.href = `certificaciones.html?aprobado=true&intentoId=${intentoId}`;
                } else {
                    window.location.href = 'certificaciones.html';
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: 'Error al enviar el examen: ' + result.message
                });
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al enviar el examen: ' + error.message
            });
            btnEnviar.textContent = textoOriginal;
            btnEnviar.disabled = false;
        }
    }

    // Permitir navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (preguntaActual < questions.length - 1) {
                document.getElementById('btn-siguiente').click();
            }
        } else if (e.key === 'ArrowLeft') {
            document.getElementById('btn-anterior').click();
        }
    });

    // Debug: mostrar estado actual
    console.log('Examen inicializado correctamente');
    console.log('Total preguntas:', questions.length);
    console.log('Respuestas array:', respuestas);
});
