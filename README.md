# DecideIA

## Descripción del Proyecto

DecideIA es una aplicación web diseñada para apoyar la toma de decisiones mediante la comparación estructurada de alternativas. El sistema permite a los usuarios registrar un problema, definir opciones, establecer criterios de evaluación con diferentes niveles de importancia y obtener una puntuación calculada que facilite el análisis.

A largo plazo, el proyecto contempla la integración de modelos de inteligencia artificial (redes neuronales) para complementar los resultados del motor matemático tradicional, ofreciendo estimaciones basadas en datos históricos.

Actualmente, el repositorio contiene el desarrollo del frontend de la aplicación, construido con HTML, CSS y JavaScript puro, preparado para ser integrado posteriormente con un servidor en Python (Flask).

## Estructura de Carpetas

El proyecto sigue una arquitectura modular para separar responsabilidades y facilitar su mantenimiento. A continuación se describe la función de cada carpeta y archivo.
```
DecideIA/
├── datos/
│   └── datos_entrenamiento.csv
├── ia/
│   ├── entrenar.py
│   ├── evaluar.py
│   └── modelo_decisiones.keras
├── static/
│   ├── css/
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── responsive.css
│   │   └── style.css
│   ├── img/
│   └── js/
│       ├── data.js
│       ├── utils.js
│       └── app.js
├── templates/
│   ├── dashboard.html
│   └── resultados.html
├── app.py
├── README.md
└── requirements.txt
```

### Detalle de Carpetas y Archivos

#### Carpeta datos/
Contiene los conjuntos de datos necesarios para entrenar los modelos de inteligencia artificial.
* datos_entrenamiento.csv: Archivo en formato CSV que almacena las características de los ejemplos y sus resultados esperados. Se utilizará para que la red neuronal aprenda patrones.

#### Carpeta ia/
Agrupa todo el código relacionado con el desarrollo, entrenamiento y evaluación de los modelos de inteligencia artificial.
* entrenar.py: Script de Python que lee los datos de entrenamiento y ajusta los parámetros del modelo neuronal.
* evaluar.py: Script que mide el rendimiento del modelo utilizando datos de prueba no vistos durante el entrenamiento.
* modelo_decisiones.keras: Archivo donde se guarda el modelo neuronal ya entrenado, listo para ser cargado por el servidor.

#### Carpeta static/
Almacena todos los recursos estáticos (archivos que no cambian) que el navegador necesita para renderizar la página web.

* Subcarpeta css/: Contiene los estilos visuales de la aplicación, divididos en módulos para mantener el código limpio:
    * variables.css: Define los colores, sombras y tamaños globales del diseño.
    * base.css: Aplica el reset de estilos, tipografías generales, botones y tablas básicas.
    * layout.css: Define la estructura principal, la barra lateral y la barra superior.
    * components.css: Contiene los estilos específicos de cada vista (dashboard, formularios, resultados).
    * responsive.css: Ajusta el diseño para que se vea correctamente en pantallas de celulares y tablets.
    * style.css: Archivo principal que importa y agrupa todos los módulos CSS anteriores.
* Subcarpeta img/: Reservada para almacenar logotipos, íconos e imágenes del proyecto.
* Subcarpeta js/: Contiene la lógica de programación del lado del cliente (navegador):
    * data.js: Almacena los datos iniciales de prueba, como el historial de decisiones y los criterios base.
    * utils.js: Contiene funciones de utilidad compartidas, como el control de cambio de vistas y la creación de notificaciones.
    * app.js: Archivo principal que maneja los eventos de los botones, el procesamiento de formularios y el cálculo de las puntuaciones.

#### Carpeta templates/
Almacena las páginas HTML que conforman la interfaz de usuario.
* dashboard.html: Pantalla principal que contiene el panel de control, el formulario para crear nuevas decisiones, el historial y la vista de configuración.
* resultados.html: Plantilla destinada a mostrar de forma exclusiva los resultados y comparaciones del análisis.

#### Archivos de la Raíz
* app.py: Archivo principal del servidor backend. Se encargará de coordinar las peticiones web, validar los datos y conectar la interfaz con el motor matemático y los modelos de IA.
* requirements.txt: Archivo que lista todas las librerías y dependencias de Python necesarias para que el proyecto funcione (por ejemplo, Flask o TensorFlow).
* README.md: Documento actual que explica la estructura, funcionamiento e instalación del proyecto.

## Tecnologías Propuestas

* Frontend: HTML5, CSS3 y JavaScript (Vanilla).
* Backend: Python con Flask.
* Inteligencia Artificial: TensorFlow / Keras.
* Control de Versiones: Git y GitHub.

## Estado del Proyecto

Actualmente, la interfaz visual (frontend) está implementada y funcional. El motor de cálculo matemático realiza las operaciones de comparación ponderada localmente en el navegador. La integración con el backend en Flask y la red neuronal se encuentran en fase de planificación.
