/* 
   este archivo contiene los datos iniciales y la configuracion de la aplicacion.
   aqui se guarda el historial de decisiones de prueba, las alternativas por defecto
   y los criterios base. si en el futuro conectas una base de datos, solo tendrias
   que cambiar la informacion que esta en este archivo.
*/

// historial de decisiones de prueba
const decisionesIniciales = [
    {
        id: 1,
        title: "Elegir una laptop para la universidad",
        desc: "Comparar opciones para estudiar y programar.",
        category: "Compras y productos",
        date: "28 oct 2026",
        status: "completed",
        score: 8.1,
        options: 3
    },
    {
        id: 2,
        title: "Organizar el proyecto semestral",
        desc: "Priorizar tareas y entregas del equipo.",
        category: "Estudios y proyectos",
        date: "27 oct 2026",
        status: "completed",
        score: 8.7,
        options: 3
    },
    {
        id: 3,
        title: "Elegir un curso complementario",
        desc: "Encontrar un curso útil para mejorar habilidades.",
        category: "Estudios y proyectos",
        date: "26 oct 2026",
        status: "draft",
        score: null,
        options: 2
    }
];

// alternativas de ejemplo para el formulario
const alternativasPorDefecto = [
    { 
        name: "Alternativa A", 
        values: [9, 6, 6, 8] 
    },
    { 
        name: "Alternativa B", 
        values: [7, 9, 9, 7] 
    },
    { 
        name: "Alternativa C", 
        values: [6, 8, 8, 9] 
    }
];

// criterios de evaluacion predeterminados
const criteriosBase = [
    {
        name: "Precio / costo",
        desc: "¿Qué tan conveniente es el costo? Una puntuación alta significa más accesible.",
        weight: 35,
        direction: "benefit"
    },
    {
        name: "Rendimiento / beneficio",
        desc: "¿Qué tan bien satisface tu necesidad principal?",
        weight: 30,
        direction: "benefit"
    },
    {
        name: "Calidad / capacidad",
        desc: "¿Qué tan bien cumple con las características requeridas?",
        weight: 20,
        direction: "benefit"
    },
    {
        name: "Duración / conveniencia",
        desc: "¿Qué tan conveniente resulta a largo plazo?",
        weight: 15,
        direction: "benefit"
    }
];