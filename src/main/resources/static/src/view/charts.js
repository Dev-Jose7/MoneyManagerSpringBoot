import { filterData, month, noteAction, pagination, textFormat, transactionByMonth, user } from "../../assets/js/panel.js";
import { textCurrency } from "../../assets/js/util.js";

// Función para generar un gráfico dinámico en un contenedor dado.
export function generateChart(container, graph, label, value) {
    let side = ""; // Almacena la posición de la leyenda
    let info = ""; // Almacena el texto de la leyenda del gráfico.
    let colorLabel = []; // Almacena los colores personalizados de las barras del gráfico.
    let windowWidth = window.innerWidth < 768 ? "80vh" : "60vh"; // Ajusta la altura del gráfico dependiendo del tamaño de la pantalla (más alto en móviles).
    let borderLine = 0; //Almacena el borde de linea y lo aplica cuando el gráfico sea de este tipo
    let colorBorder = 0;
    container.innerHTML = ""; // Limpia el contenido del contenedor antes de generar el gráfico.

    // Crear el canvas donde se dibujará el gráfico y aplicar estilo responsivo.
    let canvas = document.createElement("canvas");
    canvas.classList.add("chart-element"); // Agrega la clase 'chart-element' al canvas.
    canvas.style.width = "100%"; // Ajusta el ancho al 100% del contenedor.
    canvas.style.height = windowWidth //Ajusta altura al contenedor del gráfico mediante la variable
    container.overflow = "scroll"; // Asegura que el contenedor permita hacer scroll si el contenido es más grande.
    container.appendChild(canvas); // Agrega el canvas al contenedor.

    // Configuración del texto de la leyenda, dependiendo de si el valor es mayor que 1000.
    info = (value[0] > 1000) ? "Valor por transacciones" : "Cantidad de transacciones";

    // Determina los colores de las barras, en función de si es un gráfico de ingreso o gasto, o selecciona colores aleatorios.
    if (label.includes("Ingreso")) {
        colorLabel = ['rgba(76, 175, 80, 0.7)', 'rgba(255, 0, 0, 0.8)']; // Verde para ingreso, rojo para gasto.
    } else {
        colorLabel = selectColor(label.length); // Si no es ingreso, selecciona colores aleatorios.
    }

    //Ajusta el ancho de la linea cuando el gráfico sea de línea
    graph == "line" ? borderLine = 3 : borderLine = 0;
    

    // Inicialización del gráfico utilizando la librería Chart.js.
    //Si hay transacciones del mes seleccionado se procede con la creacion del gráfico
    if(transactionByMonth.length > 0){
        const chart = new Chart(canvas, {
            type: graph, // Tipo de gráfico (por ejemplo, "pie", "bar").
            data: {
                labels: label, // Etiquetas para el eje X.
                datasets: [{
                    label: info, // Texto de la leyenda.
                    data: value, // Valores para las barras o segmentos del gráfico.
                    borderWidth: 1, // Ancho del borde de las barras.
                    backgroundColor: colorLabel, // Colores de fondo de las barras o segmentos.
                    fill: false,
                    tension: 0.5, // Esta propiedad controla la suavidad de la curva
                    borderWidth: borderLine,  
                    borderColor: colorLabel
                }]
            },
            options: {
                responsive: true, // Hace que el gráfico sea responsivo.
                maintainAspectRatio: false, // Permite que el gráfico cambie de œtamaño dinámicamente.
                aspectRatio: 2, // Desactiva un ratio fijo para el gráfico, permitiendo que se ajuste en altura y ancho.
                plugins: {
                    legend: {
                        position: "bottom", // Posición de la leyenda (debajo del gráfico).
                        labels: {
                            padding: 30, // Espaciado alrededor de las etiquetas de la leyenda.
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10 // Espaciado superior para el gráfico.
                    }
                },
                // Manejo de clics sobre los elementos del gráfico para mostrar detalles adicionales.
                onClick: (event, elements) => {
                    if (elements.length > 0) { // Si se hace clic en un elemento del gráfico.
                        const elementIndex = elements[0].index; // Obtiene el índice del elemento clickeado en el gráfico.
                        let labelData = chart.data.labels[elementIndex]; // Obtiene la etiqueta asociada con el índice.
                        const ValueData = chart.data.datasets[0].data[elementIndex]; // Obtiene el valor asociado con el índice.
    
                        // Muestra un modal con los detalles de la transacción o categoría clickeada.
                        const modal = document.getElementById("editModal");
                        modal.style.display = "flex"; // Muestra el modal.
                        
                        // Muestra la información en el modal (ajustando la etiqueta si es necesario).
                        modal.querySelector("h3").textContent = `${labelData.includes("-") ? labelData.substring(labelData.indexOf("-")+1) + " de " + [...month.options].find(option => option.value == month.value)?.textContent : labelData}`
                        modal.querySelector("h4").textContent = `${+ValueData > 10000 ? textCurrency(+ValueData) : ValueData} total`
                        
                        console.log(filterData(labelData)); // Filtra los datos para mostrar transacciones relevantes.
    
                        // Si la etiqueta contiene un mes, actualiza la fecha con el año.
                        if(labelData.includes("-") && labelData.includes("" + month.value)){
                            const date = new Date();
                            labelData = date.getFullYear() + "-" + labelData;
                        }
    
                        // Paginación de los datos filtrados en el modal.
                        pagination(document.getElementById("modal-section"), document.getElementById("modal-button"), filterData(labelData), window.innerWidth < 768 ? 3 : 5, user.getTransactions().getManager().printTransaction);
                        textFormat(document.getElementById("modal-section")); // Aplica formato al texto dentro del modal.
    
                        // Añade evento a los botones de notas dentro del modal.
                        [...document.querySelectorAll(".nota")].forEach(note => {
                            note.addEventListener("click", function(e){
                                let id = e.target.closest(".transaccion").dataset.id; // Obtiene el ID de la transacción de la nota.
                                
                                noteAction(id); // Ejecuta la acción de la nota (probablemente muestra más detalles o permite editar).
                            });
                        });
                    }
                }
            }
        });
    } else if (transactionByMonth.length == 0){ //Si no hay transacciones, no se genera el grafico
        container.innerHTML = `<p style="display:flex; justify-content:center; align-items:center; height:${windowWidth}; font-weight:bold">Sin datos por graficar</p>`
    }
}

// Objeto que define los colores preestablecidos para las categorías.
let objectColor = {
    blue: "rgba(53,161,235,0.7)",
    pink: "rgba(254,100,131,0.7)",
    orange: "rgba(255,159,64,0.7)",
    yellow: "rgba(255,205,86,0.7)",
    green: "rgba(76,193,192,0.7)",
    purple: "rgba(154,102,255,0.7)",
    brown: "rgba(165, 42, 42, 0.7)",
    gray: "rgba(201,203,206,0.7)",
    black: "rgba(0, 0, 0, 0.7)"
};

// Función que selecciona los colores para el gráfico. Si la cantidad de colores necesarios es mayor que los disponibles, genera colores aleatorios.
function selectColor(num) {
    let array = [];
    for (let color in objectColor) {
        array.push(objectColor[color]); // Añade los colores predefinidos al array.
    }

    // Si se requieren más colores que los predefinidos, genera colores aleatorios.
    return num > Object.keys(objectColor).length ? ramdomRGB(num - Object.keys(objectColor).length, array) : array;
}

// Función que genera colores RGB aleatorios.
function ramdomRGB(num, array) {
    for (let i = 0; i < num; i++) {
        array.push(`rgba(${ramdom(256)}, ${ramdom(256)}, ${ramdom(256)}, 1)`); // Genera un color RGB aleatorio y lo agrega al array.
    }
    return array; // Devuelve el array de colores (predefinidos y aleatorios).
}

// Función que genera un número aleatorio entre 0 y el valor máximo.
function ramdom(max) {
    return Math.floor(Math.random() * max).toString(); // Devuelve un número entero aleatorio entre 0 y max-1.
}


//Generación del Gráfico:
//La función generateChart crea un gráfico con la biblioteca Chart.js. El gráfico se renderiza en un canvas dentro de un contenedor dado, y el tipo de gráfico y sus datos son dinámicos.
//La altura del gráfico es ajustable dependiendo del tamaño de la pantalla, y el color de las barras se determina según el tipo de datos (por ejemplo, "Ingreso" o "Gasto").
//La función también maneja eventos de clic sobre los elementos del gráfico, mostrando un modal con detalles adicionales y paginando los datos filtrados.

//Selección de Colores:
//selectColor y ramdomRGB se utilizan para gestionar la paleta de colores de las barras del gráfico. Si se necesitan más colores de los disponibles, se generan colores RGB aleatorios.
//Los colores predefinidos se definen en el objeto objectColor.

//Filtrado y Paginación:
//Cuando el usuario hace clic en una sección del gráfico, se filtran los datos correspondientes y se muestran en el modal, con soporte para paginación y formato de texto.
//El modal muestra información detallada sobre el gráfico (como el valor de las transacciones) y permite interactuar con las notas asociadas a cada transacción.
//Este código es una implementación que combina gráficos dinámicos, interacción con el usuario y manejo eficiente de datos.