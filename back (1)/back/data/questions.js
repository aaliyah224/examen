export default [
    {
        id: 1,
        title: "JavaScript Certification",
        questions: [
            {
                id: 1,
                text: "¿Cómo se escribe la función correctamente?",
                options: [
                    "function myFunction() {}", 
                    "def myFunction() {}", 
                    "function = myFunction() {}", 
                    "function:myFunction() {}"
                ],
                correct: "function myFunction() {}"
            },
            {
                id: 2,
                text: "¿Cómo accede a propiedad name de un objeto person?",
                options: [
                    "person[name]", 
                    "person.name", 
                    "person->name", 
                    "Todas son correctas"
                ],
                correct: "person.name"
            },
            {
                id: 3,
                text: "¿Cuál no es un tipo de dato primitivo en JavaScript?",
                options: [
                    "String", 
                    "Number", 
                    "Boolean", 
                    "Array"
                ],
                correct: "Array"
            },
            {
                id: 4,
                text: "Método para agregar un elemento al final:",
                options: [
                    "pop()", 
                    "push()", 
                    "shift()", 
                    "unshift()"
                ],
                correct: "push()"
            },
            {
                id: 5,
                text: "¿Con qué signo se comenta en JavaScript?",
                options: [
                    "//", 
                    "/**/", 
                    "#", 
                    "<!-- -->"
                ],
                correct: "//"
            },
            {
                id: 6,
                text: "¿Qué devuelve 'hello'.toUpperCase()?",
                options: [
                    "HELLO", 
                    "Hello", 
                    "hello", 
                    "Error"
                ],
                correct: "HELLO"
            },
            {
                id: 7,
                text: "¿Qué hace el método Array.isArray()?",
                options: [
                    "Convierte un objeto en arreglo", 
                    "Verifica si es un arreglo", 
                    "Ordena elementos de un arreglo", 
                    "Une dos arreglos"
                ],
                correct: "Verifica si es un arreglo"
            },
            {
                id: 8,
                text: "¿Qué devuelve la expresión !true?",
                options: [
                    "true", 
                    "false", 
                    "undefined", 
                    "NaN"
                ],
                correct: "false"
            },
            {
                id: 9,
                text: "Método para imprimir en la consola del navegador:",
                options: [
                    "print()", 
                    "console.log()", 
                    "document.write()", 
                    "alert()"
                ],
                correct: "console.log()"
            },
            {
                id: 10,
                text: "Palabra para declarar una variable que no puede ser resignada:",
                options: [
                    "val", 
                    "let", 
                    "const", 
                    "static"
                ],
                correct: "const"
            },
            {
                id: 11,
                text: "¿Cuál es el resultado de '5' + 3?",
                options: [
                    "8", 
                    "53", 
                    "Error", 
                    "35"
                ],
                correct: "53"
            },
            {
                id: 12,
                text: "Operador para comparar el valor y el tipo de dato:",
                options: [
                    "=", 
                    "==", 
                    "===", 
                    "!="
                ],
                correct: "==="
            },
            {
                id: 13,
                text: "¿Cuál es el valor de 'typeof null'?",
                options: [
                    "null", 
                    "undefined", 
                    "object", 
                    "NaN"
                ],
                correct: "object"
            },
            {
                id: 14,
                text: "¿Cuál es el resultado de 2 == '2'?",
                options: [
                    "true", 
                    "false", 
                    "undefined", 
                    "NaN"
                ],
                correct: "true"
            },
            {
                id: 15,
                text: "¿Qué palabra clave detiene la ejecución de un bucle?",
                options: [
                    "stop", 
                    "break", 
                    "exit", 
                    "return"
                ],
                correct: "break"
            },
            {
                id: 16,
                text: "Propósito de la función parseInt()",
                options: [
                    "Analizar string y devolver un número entero", 
                    "Convertir número a string", 
                    "Redondear un número decimal", 
                    "Verificar si un valor es un número"
                ],
                correct: "Analizar string y devolver un número entero"
            }
        ]
    }
];
