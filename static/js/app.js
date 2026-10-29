/* 
   este archivo contiene la logica principal de la aplicacion.
   aqui se manejan los eventos de los botones, el renderizado de las tablas,
   el formulario de nueva decision, el calculo de las puntuaciones y la 
   vista de resultados. es el archivo que conecta todo con el html.
*/

let decisions = [...decisionesIniciales];
let nextId = 4;
let lastResult = null;
let optionCount = 0;
let criteria = [...criteriosBase];

document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => cambiarVista(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => cambiarVista(b.dataset.go)));

document.querySelector("#menuToggle").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector("#logout").addEventListener("click", () => mostrarToast("La sesión es simulada en esta maqueta; no hay una cuenta real que cerrar."));
document.querySelector("#notifications").addEventListener("click", () => mostrarToast("No tienes notificaciones nuevas."));

function renderDashboard() {
    document.querySelector("#statTotal").textContent = decisions.length;
    document.querySelector("#statDone").textContent = decisions.filter(d => d.status === "completed").length;
    document.querySelector("#statProgress").textContent = decisions.filter(d => d.status === "draft").length;
    document.querySelector("#navCount").textContent = decisions.length;
    
    const rows = decisions.slice().sort((a, b) => b.id - a.id).slice(0, 4);
    document.querySelector("#recentRows").innerHTML = rows.map(d => `
        <tr>
            <td>
                <div class="row-title">${escaparTexto(d.title)}</div>
                <div class="row-sub">${escaparTexto(d.category)}</div>
            </td>
            <td>${escaparTexto(d.date)}</td>
            <td><span class="tag ${d.status === "completed" ? "green" : "amber"}">${d.status === "completed" ? "Completada" : "En progreso"}</span></td>
            <td><button class="link-btn" data-open="${d.id}">Ver →</button></td>
        </tr>
    `).join("");
    
    document.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openDecision(+b.dataset.open)));
}

function renderHistory() {
    const q = (document.querySelector("#historySearch").value || "").toLowerCase();
    const filter = document.querySelector("#historyFilter").value;
    
    const list = decisions.filter(d => 
        (d.title + " " + d.desc + " " + d.category).toLowerCase().includes(q) && 
        (filter === "all" || d.status === filter)
    ).sort((a, b) => b.id - a.id);
    
    document.querySelector("#historyRows").innerHTML = list.map(d => `
        <tr>
            <td>
                <div class="row-title">${escaparTexto(d.title)}</div>
                <div class="row-sub">${escaparTexto(d.desc)}</div>
            </td>
            <td>${escaparTexto(d.category)}</td>
            <td>${escaparTexto(d.date)}</td>
            <td><span class="tag ${d.status === "completed" ? "green" : "amber"}">${d.status === "completed" ? "Completada" : "En progreso"}</span></td>
            <td>${d.score == null ? "—" : `<strong>${d.score.toFixed(1)}/10</strong>`}</td>
            <td><button class="btn small" data-open="${d.id}">${d.status === "completed" ? "Ver resultado" : "Continuar"}</button></td>
        </tr>
    `).join("");
    
    document.querySelector("#historyEmpty").style.display = list.length ? "none" : "block";
    document.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openDecision(+b.dataset.open)));
}

document.querySelector("#historySearch").addEventListener("input", renderHistory);
document.querySelector("#historyFilter").addEventListener("change", renderHistory);

function openDecision(id) {
    const d = decisions.find(x => x.id === id);
    if (!d) return;
    
    if (d.status === "completed" && d.result) {
        lastResult = d.result;
        renderResult(lastResult);
        cambiarVista("results");
    } else {
        cambiarVista("new");
        document.querySelector("#decisionTitle").value = d.title;
        document.querySelector("#decisionDesc").value = d.desc;
        document.querySelector("#decisionType").value = d.category;
        mostrarToast("Borrador cargado. Revisa las alternativas y continúa el análisis.");
    }
}

function renderOptions(inicial = alternativasPorDefecto) {
    document.querySelector("#optionList").innerHTML = "";
    optionCount = 0;
    inicial.forEach(o => addOption(o));
}

function addOption(data = { name: "Alternativa nueva", values: [5, 5, 5, 5] }) {
    if (optionCount >= 6) {
        mostrarToast("La demostración permite hasta 6 alternativas.");
        return;
    }
    
    optionCount++;
    const letra = String.fromCharCode(64 + optionCount);
    const el = document.createElement("div");
    el.className = "option-item";
    el.dataset.option = "1";
    
    el.innerHTML = `
        <div class="option-top">
            <span class="option-letter">${letra}</span>
            <input class="option-name" aria-label="Nombre de alternativa ${letra}" value="${escaparTexto(data.name)}" maxlength="70">
            <button type="button" class="remove-option" title="Eliminar alternativa" aria-label="Eliminar alternativa">×</button>
        </div>
        <div class="option-fields">
            ${criteria.slice(0, 3).map((c, i) => `
                <div>
                    <label>${escaparTexto(c.name)}</label>
                    <input class="opt-val" type="number" min="1" max="10" step=".5" value="${data.values[i] ?? 5}" aria-label="${escaparTexto(c.name)}">
                </div>
            `).join("")}
        </div>
        <div class="option-fields" style="margin-top:9px">
            <div>
                <label>${escaparTexto(criteria[3].name)}</label>
                <input class="opt-val" type="number" min="1" max="10" step=".5" value="${data.values[3] ?? 5}" aria-label="${escaparTexto(criteria[3].name)}">
            </div>
            <div style="grid-column:span 2;display:flex;align-items:end;color:#98a2b3;font-size:10px">Escala de demostración: 1 = bajo · 10 = alto</div>
        </div>
    `;
    
    el.querySelector(".remove-option").addEventListener("click", () => {
        if (document.querySelectorAll("#optionList .option-item").length <= 2) {
            mostrarToast("Necesitas al menos dos alternativas.");
            return;
        }
        el.remove();
        renumberOptions();
    });
    
    document.querySelector("#optionList").appendChild(el);
}

function renumberOptions() {
    optionCount = 0;
    document.querySelectorAll("#optionList .option-item").forEach(el => {
        optionCount++;
        el.querySelector(".option-letter").textContent = String.fromCharCode(64 + optionCount);
    });
}

document.querySelector("#addOption").addEventListener("click", () => addOption());

function renderCriteria() {
    document.querySelector("#criteriaList").innerHTML = criteria.map((c, i) => `
        <div class="criterion">
            <div>
                <strong>${escaparTexto(c.name)}</strong>
                <small>${escaparTexto(c.desc)}</small>
            </div>
            <input type="range" min="0" max="100" step="5" value="${c.weight}" data-weight="${i}" aria-label="Importancia de ${escaparTexto(c.name)}">
            <div class="weight-num" id="weightLabel${i}">${c.weight} pts</div>
        </div>
    `).join("");
    
    document.querySelectorAll("[data-weight]").forEach(el => {
        el.addEventListener("input", () => {
            criteria[+el.dataset.weight].weight = +el.value;
            document.querySelector("#weightLabel" + el.dataset.weight).textContent = el.value + " pts";
            updateWeightTotal();
        });
    });
    
    updateWeightTotal();
}

function updateWeightTotal() {
    let total = criteria.reduce((s, c) => s + c.weight, 0);
    document.querySelector("#weightTotal").textContent = total + " puntos";
    document.querySelector("#weightTotal").style.color = total === 0 ? "var(--red)" : "var(--primary)";
}

function analyze() {
    const title = document.querySelector("#decisionTitle").value.trim();
    const desc = document.querySelector("#decisionDesc").value.trim();
    const category = document.querySelector("#decisionType").value;
    const constraint = document.querySelector("#constraint").value.trim();
    
    const opts = document.querySelectorAll("#optionList .option-item");
    const opcionesLimpia = Array.from(opts).map((el, i) => ({
        name: el.querySelector(".option-name").value.trim() || `Alternativa ${i + 1}`,
        values: Array.from(el.querySelectorAll(".opt-val")).map(inp => Math.min(10, Math.max(1, Number(inp.value) || 1)))
    }));
    
    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);
    
    if (!title || !desc) {
        mostrarToast("Completa el nombre y la descripción de la decisión.");
        (!title ? document.querySelector("#decisionTitle") : document.querySelector("#decisionDesc")).focus();
        return;
    }
    if (opcionesLimpia.length < 2) {
        mostrarToast("Agrega al menos dos alternativas.");
        return;
    }
    if (totalWeight <= 0) {
        mostrarToast("Asigna importancia a por lo menos un criterio.");
        return;
    }
    
    const results = opcionesLimpia.map(o => ({
        ...o,
        score: o.values.reduce((sum, v, i) => sum + v * (criteria[i].weight / totalWeight), 0)
    })).sort((a, b) => b.score - a.score);
    
    const best = results[0];
    const second = results[1];
    const gap = best.score - second.score;
    
    const result = {
        title,
        desc,
        category,
        constraint,
        criteria: criteria.map(c => ({ ...c, normalized: c.weight / totalWeight })),
        results,
        best,
        confidence: Math.min(95, Math.max(52, Math.round(60 + gap * 10))),
        date: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
        model: {
            status: "demo",
            note: "Esta maqueta calcula una puntuación ponderada. La neurona artificial todavía no está conectada ni entrenada."
        }
    };
    
    const existing = decisions.find(d => d.title === title && d.status === "draft");
    const item = {
        id: existing ? existing.id : nextId++,
        title, desc, category, date: result.date,
        status: "completed", score: best.score, options: opcionesLimpia.length, result
    };
    
    if (existing) Object.assign(existing, item);
    else decisions.unshift(item);
    
    lastResult = result;
    renderResult(result);
    renderDashboard();
    cambiarVista("results");
    mostrarToast("Análisis completado. Revisa cómo se calcularon las puntuaciones.");
}

document.querySelector("#analyzeBtn").addEventListener("click", analyze);

function renderResult(r) {
    const max = 10;
    document.querySelector("#resultContent").innerHTML = `
        <div class="card result-hero">
            <div>
                <div class="eyebrow">ANÁLISIS COMPLETADO · ${escaparTexto(r.date)}</div>
                <h2>Alternativa mejor puntuada: ${escaparTexto(r.best.name)}</h2>
                <p>Según los valores de ejemplo y la importancia que asignaste a los criterios, esta opción obtuvo la puntuación ponderada más alta. Revisa también sus desventajas antes de decidir.</p>
                ${r.constraint ? `<p style="font-size:12px;margin-top:8px"><strong>Restricción registrada:</strong> ${escaparTexto(r.constraint)}</p>` : ""}
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
                    <button class="btn primary" id="feedbackGood">✓ Me resulta útil</button>
                    <button class="btn" id="changePrefs">Editar prioridades</button>
                </div>
            </div>
            <div class="score-ring">
                <div class="score-inner">
                    <div><strong>${r.best.score.toFixed(1)}</strong><br><small>de 10 puntos</small></div>
                </div>
            </div>
        </div>
        
        <div class="grid result-grid">
            <div class="card card-pad">
                <div class="section-title">
                    <div><h2>Comparación de puntuaciones</h2><p>Resultados calculados con los pesos elegidos.</p></div>
                    <span class="tag">Ponderado</span>
                </div>
                ${r.results.map((o, i) => `
                    <div class="bar-row">
                        <div style="font-weight:700;overflow:hidden;text-overflow:ellipsis">${escaparTexto(o.name)}</div>
                        <div class="bar-track"><div class="bar-fill ${i === 1 ? "alt" : i === 2 ? "third" : ""}" style="width:${o.score / max * 100}%"></div></div>
                        <strong style="text-align:right">${o.score.toFixed(1)}</strong>
                    </div>
                `).join("")}
                <div class="helper">Las puntuaciones dependen de los valores ingresados. Comprueba que las escalas sean comparables y que los datos sean correctos.</div>
            </div>
            
            <div class="card card-pad">
                <div class="section-title">
                    <div><h2>¿Qué influyó en el resultado?</h2><p>Contribución de cada criterio a la alternativa principal.</p></div>
                </div>
                ${r.criteria.map((c, i) => `
                    <div class="explain-item">
                        <div class="explain-dot">${i + 1}</div>
                        <div style="flex:1">
                            <strong>${escaparTexto(c.name)} <span style="color:var(--primary);float:right">${Math.round(c.normalized * 100)}%</span></strong>
                            <p>Valor asignado: ${r.best.values[i]}/10 · Peso normalizado: ${Math.round(c.normalized * 100)}%</p>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
        
        <div class="grid two-col">
            <div class="card card-pad">
                <div class="section-title">
                    <div><h2>Detalle de alternativas</h2><p>Revisa las fortalezas y puntuaciones por criterio.</p></div>
                </div>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Alternativa</th>
                                ${r.criteria.map(c => `<th>${escaparTexto(c.name)}</th>`).join("")}
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${r.results.map(o => `
                                <tr>
                                    <td><strong>${escaparTexto(o.name)}</strong>${o === r.best ? ' <span class="tag green">Mayor puntuación</span>' : ""}</td>
                                    ${o.values.map(v => `<td>${v}/10</td>`).join("")}
                                    <td><strong>${o.score.toFixed(1)}</strong></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="card card-pad">
                <div class="section-title">
                    <div><h2>Estado del componente inteligente</h2><p>Transparencia del análisis.</p></div>
                </div>
                <div class="model-box">
                    <div class="model-title"><strong>Comparación ponderada</strong><span class="tag green">Activa</span></div>
                    <p>El resultado actual se calculó usando los valores y los pesos proporcionados. Es reproducible y permite revisar cómo se obtuvo la puntuación.</p>
                </div>
                <div class="model-box" style="margin-top:10px">
                    <div class="model-title"><strong>Neurona artificial</strong><span class="tag amber">Pendiente de integrar</span></div>
                    <p>${escaparTexto(r.model.note)} No se debe interpretar esta puntuación como una predicción neuronal ni como una probabilidad de éxito.</p>
                </div>
                <div class="notice" style="margin-top:12px">
                    <strong>Antes de decidir</strong>Verifica los datos, considera factores no incluidos y revisa si la diferencia entre alternativas realmente importa para tu situación.
                </div>
            </div>
        </div>
        
        <div class="card card-pad" style="margin-top:18px">
            <div class="section-title">
                <div><h2>¿Te ayudó este análisis?</h2><p>Tu respuesta sirve para evaluar la utilidad de la herramienta.</p></div>
            </div>
            <div class="feedback-row">
                <button class="btn" data-feedback="yes">Sí, me ayudó</button>
                <button class="btn" data-feedback="partial">Parcialmente</button>
                <button class="btn" data-feedback="no">Necesito más información</button>
            </div>
            <div class="helper" id="feedbackMessage">El feedback se muestra solo en esta demostración y no reentrena ningún modelo.</div>
        </div>
    `;
    
    document.querySelector("#feedbackGood").addEventListener("click", () => mostrarToast("Gracias. En la versión real esta valoración podría guardarse como feedback."));
    document.querySelector("#changePrefs").addEventListener("click", () => cambiarVista("new"));
    
    document.querySelectorAll("[data-feedback]").forEach(b => {
        b.addEventListener("click", () => {
            document.querySelectorAll("[data-feedback]").forEach(x => x.classList.remove("selected"));
            b.classList.add("selected");
            document.querySelector("#feedbackMessage").textContent = "Respuesta registrada solo en la demostración: " + ({
                yes: "Sí, me ayudó",
                partial: "Parcialmente",
                no: "Necesito más información"
            }[b.dataset.feedback]) + ".";
        });
    });
}

function showHelp() {
    document.querySelector("#modalBody").innerHTML = `
        <p><strong>DecideIA</strong> organiza una decisión en cuatro etapas. No elige automáticamente por ti; ayuda a comparar opciones.</p>
        <div class="checkline"><span class="check-icon">1</span><div><strong>Describe</strong><small>Explica qué quieres resolver y qué límites tienes.</small></div></div>
        <div class="checkline"><span class="check-icon">2</span><div><strong>Agrega alternativas</strong><small>Incluye las opciones y registra sus características con una escala comparable.</small></div></div>
        <div class="checkline"><span class="check-icon">3</span><div><strong>Asigna prioridades</strong><small>Indica qué criterios importan más. El sistema pondera las puntuaciones.</small></div></div>
        <div class="checkline"><span class="check-icon">4</span><div><strong>Revisa y decide</strong><small>Lee la comparación, verifica los datos y toma tu propia decisión.</small></div></div>
        <div class="notice" style="margin-top:14px"><strong>Nota de esta maqueta</strong>El login, los datos de ejemplo y el motor ponderado son demostrativos. La autenticación real, la base de datos y una neurona entrenada requieren backend e integración adicionales.</div>
    `;
    document.querySelector("#modalBackdrop").classList.add("show");
}

document.querySelector("#helpButton").addEventListener("click", showHelp);
document.querySelector("#helpNav").addEventListener("click", showHelp);
document.querySelector("#quickGuide").addEventListener("click", showHelp);
document.querySelector("#closeModal").addEventListener("click", () => document.querySelector("#modalBackdrop").classList.remove("show"));
document.querySelector("#modalCancel").addEventListener("click", () => document.querySelector("#modalBackdrop").classList.remove("show"));
document.querySelector("#modalContinue").addEventListener("click", () => {
    document.querySelector("#modalBackdrop").classList.remove("show");
    cambiarVista("new");
});
document.querySelector("#modalBackdrop").addEventListener("click", e => {
    if (e.target === document.querySelector("#modalBackdrop")) document.querySelector("#modalBackdrop").classList.remove("show");
});

document.querySelector("#printResult").addEventListener("click", () => {
    if (!lastResult) {
        mostrarToast("Primero crea un análisis.");
        return;
    }
    window.print();
});

document.querySelector("#saveProfile").addEventListener("click", () => {
    const nombre = document.querySelector("#profileName").value.trim();
    if (nombre) {
        document.querySelectorAll(".profile-mini strong").forEach(el => el.textContent = nombre);
        document.querySelectorAll(".top-user strong").forEach(el => el.textContent = nombre);
        mostrarToast("Preferencias actualizadas en esta demostración.");
    } else {
        mostrarToast("Escribe un nombre visible.");
    }
});

document.querySelector("#privacySetting").addEventListener("click", () => {
    document.querySelector("#settingsContent").innerHTML = `
        <div class="section-title">
            <div><h2>Privacidad y datos</h2><p>Qué ocurre con la información en esta maqueta.</p></div>
        </div>
        <div class="notice">
            <strong>Demostración local</strong>Esta página no envía los datos a un servidor ni implementa autenticación real. Los análisis se mantienen en la memoria de la página y pueden perderse al recargarla.
        </div>
        <p style="font-size:12px;color:var(--muted);margin-top:15px">En una versión de producción, se necesitaría un backend seguro, autenticación, control de acceso por usuario, validación de datos y almacenamiento protegido.</p>
        <button class="btn" id="backProfile">Volver al perfil</button>
    `;
    document.querySelector("#backProfile").addEventListener("click", () => location.reload());
});

document.querySelector("#modelSetting").addEventListener("click", () => {
    document.querySelector("#settingsContent").innerHTML = `
        <div class="section-title">
            <div><h2>Información del modelo</h2><p>Cómo se genera una recomendación en la versión actual.</p></div>
        </div>
        <div class="model-box">
            <div class="model-title"><strong>Motor matemático</strong><span class="tag green">Disponible</span></div>
            <p>Calcula la suma de los valores de cada alternativa multiplicados por los pesos normalizados de los criterios.</p>
        </div>
        <div class="model-box" style="margin-top:12px">
            <div class="model-title"><strong>Neurona artificial</strong><span class="tag amber">No integrada</span></div>
            <p>Para activarla se requiere definir una tarea de predicción, reunir ejemplos etiquetados, entrenar y evaluar un modelo y conectarlo al backend. La interfaz por sí sola no entrena una neurona.</p>
        </div>
        <button class="btn" id="backProfile" style="margin-top:15px">Volver al perfil</button>
    `;
    document.querySelector("#backProfile").addEventListener("click", () => location.reload());
});

renderOptions();
renderCriteria();
renderDashboard();