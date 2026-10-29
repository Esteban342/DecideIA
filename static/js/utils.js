/* 
   este archivo contiene las funciones de utilidad y la logica compartida.
   aqui estan las herramientas que se usan en varias partes de la aplicacion,
   como limpiar el texto para evitar errores de seguridad, mostrar las 
   notificaciones flotantes y controlar el cambio entre las diferentes vistas.
*/

// evita inyecciones de codigo en el html
function escaparTexto(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, function(c) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c];
    });
}

// muestra la notificacion flotante en la esquina
function mostrarToast(mensaje) {
    const toast = document.querySelector("#toast");
    toast.textContent = mensaje;
    toast.classList.add("show");
    
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// controla el cambio entre las vistas (dashboard, nueva decision, etc.)
function cambiarVista(nombreVista) {
    const vistas = document.querySelectorAll(".view");
    const botonesNav = document.querySelectorAll("[data-view]");
    
    vistas.forEach(v => v.classList.toggle("active", v.id === "view-" + nombreVista));
    botonesNav.forEach(b => b.classList.toggle("active", b.dataset.view === nombreVista));
    
    const titulos = {
        dashboard: "Panel principal",
        new: "Nueva decisión",
        history: "Mis decisiones",
        results: "Último análisis",
        settings: "Configuración"
    };
    
    document.querySelector("#crumbCurrent").textContent = titulos[nombreVista] || "Panel principal";
    document.querySelector("#sidebar").classList.remove("open");
    
    // acciones especificas al entrar a ciertas vistas
    if (nombreVista === "history") renderHistory();
    if (nombreVista === "dashboard") renderDashboard();
    
    window.scrollTo({ top: 0, behavior: "smooth" });
}