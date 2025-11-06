import QUESTIONS from '../data/questions.js';
import { randomUUID } from 'crypto';

// Creamos lugar para almacenar el numero de intentos de un examen
export const intentosExamen = new Map();  // ✅ Exportar para usar en certController

// Enviar examen con preguntas aleatorias al frontend  
const startQuiz = (req, res) => {
    const idUsuario = req.user.id;
    console.log(`Acceso al /api/exam/start - ${idUsuario}`);
    
    const idQuiz = parseInt(req.query.idQuiz);
    console.log(`Iniciando cuestionario con ID: ${idQuiz}`);

    // Verificar si el usuario tiene un intento activo o completado
    const intentosUsuario = Array.from(intentosExamen.values()).filter(
        intento => intento.idUsuario === idUsuario && intento.idQuiz === idQuiz
    );
    if (intentosUsuario.some(intento => intento.completado)) {
        return res.status(400).json({
            message: "Ya completaste el examen. Solo se permite un intento"
        });
    }

    // Buscamos el cuestionario mediante el id
    const QuizSeleccionado = QUESTIONS.find(q => q.id === idQuiz);
    if (!QuizSeleccionado) {
        return res.status(404).json({
            message: "Cuestionario no encontrado."
        });
    }

    // Seleccionar las 8 preguntas aleatorias del cuestionario sin repetirlas
    const todoElQuiz = [...QuizSeleccionado.questions];
    const preguntasAleatorias = [];
    
    while (preguntasAleatorias.length < 8 && todoElQuiz.length > 0) {
        const banderaAleatoria = Math.floor(Math.random() * todoElQuiz.length);
        const preguntaSeleccionada = todoElQuiz.splice(banderaAleatoria, 1)[0];

        // Revolver las opciones de la pregunta
        const opcionesRevueltas = arregloRev([...preguntaSeleccionada.options]);

        // Encontrar el índice de la respuesta correcta en las opciones revueltas
        const indiceCorrecto = opcionesRevueltas.indexOf(preguntaSeleccionada.correct);

        preguntasAleatorias.push({
            id: preguntaSeleccionada.id,
            text: preguntaSeleccionada.text,
            options: opcionesRevueltas,
            indiceCorrecto: indiceCorrecto
        });
    }

    // Crear el intento del examen
    const intentoId = randomUUID();
    
    // Guardar el intento
    intentosExamen.set(intentoId, {
        intentoId,
        idUsuario,
        idQuiz,
        questions: preguntasAleatorias,
        completado: false,
        score: 0,
        fecha: new Date()
    });

    // Crea una copia de todas las preguntas SIN el campo 'indiceCorrecto'
    const publicQuestions = preguntasAleatorias.map(({ id, text, options }) => ({
        id, text, options
    }));

    // Enviamos las preguntas al cliente
    res.status(200).json({
        message: `Preguntas de "${QuizSeleccionado.title}". ¡Éxito!`,
        intentoId,
        quizId: QuizSeleccionado.id,
        questions: publicQuestions,
        totalPreguntas: publicQuestions.length
    });
};

// Recibir y evaluar respuestas
const submitAnswers = (req, res) => {
    const { intentoId, respuestas } = req.body;
    const idUsuario = req.user.id;
    console.log(`Acceso al /api/exam/submit - ${req.user.name}`);
    console.log(`Respuestas recibidas para intento: ${intentoId}`);

    // Validar intento
    const intento = intentosExamen.get(intentoId);
    if (!intento) {
        return res.status(404).json({
            message: "Intento no encontrado."
        });
    }
    
    if (intento.idUsuario !== idUsuario) {
        return res.status(403).json({
            message: "No puede realizar el intento."
        });
    }
    
    if (intento.completado) {
        return res.status(400).json({
            message: "El examen ya se califico"
        });
    }

    // Inicializa puntaje y arreglo de detalles
    let score = 0;
    const details = [];

    intento.questions.forEach((question, bandera) => {
        const respuestaUsuario = respuestas[bandera];
        const esCorrecto = respuestaUsuario === question.indiceCorrecto;

        if (esCorrecto) score++;

        details.push({
            questionId: question.id,
            text: question.text,
            yourAnswer: respuestaUsuario !== undefined ? question.options[respuestaUsuario] : "No respondido",
            correctAnswer: question.options[question.indiceCorrecto],
            correct: esCorrecto
        });
    });

    const porcentaje = (score / intento.questions.length) * 100;
    const pasado = porcentaje >= 80;

    // Actualizar estado del intento
    intento.completado = true;
    intento.score = score;
    intento.porcentaje = porcentaje;
    intento.pasado = pasado;
    intento.fechaEnvio = new Date();

    // Preparar respuesta
    const response = {
        message: pasado ? "¡Felicidades. aprobaste el examen!" : "No aprobaste el examen. Intenta nuevamente.",
        score,
        total: intento.questions.length,
        porcentaje: porcentaje.toFixed(2),
        pasado,
        details,
        idIntento: intento.intentoId
    };

    // Pasar información si aprobó
    if (pasado) {
        response.infoCertificado = {
            userName: req.user.nombreCompleto,
            quizTitle: QUESTIONS.find(q => q.id === intento.idQuiz)?.title,
            score: porcentaje.toFixed(2),
            fecha: new Date().toISOString().split('T')[0]
        };
    }
    res.status(200).json(response);
};

// Auxiliar para revolver los arreglos o preguntas
function arregloRev(arreglo) {
    const revorujar = [...arreglo];
    for (let i = revorujar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [revorujar[i], revorujar[j]] = [revorujar[j], revorujar[i]];
    }
    return revorujar;
}

// Revisar el estado del intento
const estadoIntento = (req, res) => {
    const { idIntento } = req.params;
    const idUsuario = req.user.id;

    const intento = intentosExamen.get(idIntento);
    if (!intento || intento.idUsuario !== idUsuario) {
        return res.status(404).json({
            message: "No hay intento."
        });
    }

    res.status(200).json({
        idIntento: intento.intentoId,
        completado: intento.completado,
        score: intento.score,
        pasado: intento.pasado,
        fecha: intento.fecha
    });
};

export { startQuiz, submitAnswers, estadoIntento };
