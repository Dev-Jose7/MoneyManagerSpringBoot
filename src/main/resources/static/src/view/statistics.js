import { dataByMonth, filterData, gastosByMonth, ingresosByMonth, logout, menuButton, modalCancel, monthLoad, orderTransaction, printCategory, printNameUser, transactionByMonth, updateListUser, updateValues, user } from "../../assets/js/panel.js"; // Importa varias funciones y variables para gestionar la interfaz y transacciones del panel.
import Transaccion from "../model/operation/Transaccion.js";
import Category from "../model/tag/Category.js";
import { generateChart } from "./charts.js"; // Importa la función para generar gráficos usando la librería Chart.js.

let page = document.location.href // Obtiene la URL de la página actual.
export let statusStatistics = false // Variable de estado que indica si estamos en la página de estadísticas.

document.addEventListener("DOMContentLoaded", function(){ // Se ejecuta cuando el contenido de la página se ha cargado completamente.
    if(page.includes("estadisticas")){ // Verifica si la URL contiene "estadisticas" para ejecutar el código relacionado con la vista de estadísticas.
        statusStatistics = true // Cambia el estado a verdadero si estamos en la página de estadísticas.

        let graphValue = ""; // Variable que almacenará el valor del tipo de gráfico seleccionado.

        // Llama a varias funciones para inicializar la vista del panel.
        menuButton();
        printNameUser();
        updateListUser();
        logout();
        modalCancel();
        monthLoad()
        dataByMonth(Transaccion.getTransactionsUser()); // Carga los datos de las transacciones del usuario por mes.

        // Organiza las transacciones por fecha de registro (de menor a mayor).
        orderTransaction("menor");
        
        // Escucha el cambio de mes en el selector de mes para actualizar los datos y gráficos.
        document.getElementById("month").addEventListener("change", function(){
            [...document.querySelectorAll("input")].forEach(radio => { // Desmarca todos los radios cuando el mes cambia.
                radio.checked = false;
            });

            dataByMonth(Transaccion.getTransactionsUser()); // Vuelve a cargar las transacciones por mes.
            document.getElementById("optionTag").checked = true; // Selecciona el radio de categoría por defecto.
            document.getElementById("chartBarra").checked = true; // Selecciona el gráfico de barras por defecto.
            
            orderTransaction("menor"); // Vuelve a ordenar las transacciones por fecha.
            readGraph(); // Actualiza el tipo de gráfico seleccionado.
            chartCategory(); // Muestra los gráficos de categorías.
        })

        readGraph(); // Revisa qué gráfico está seleccionado por el usuario al cargar la página.
        chartCategory(); // Muestra los gráficos de categoría (ingresos/gastos) por defecto.

        // Escucha los cambios en los radios de tipo de gráfico para generar los gráficos correspondientes.
        document.querySelector(".chart").addEventListener("input", function(){
            readGraph(); // Actualiza el tipo de gráfico seleccionado.

            // Dependiendo del tipo de gráfico seleccionado, genera el gráfico correspondiente.
            if(document.getElementById("optionType").checked){
                chartType();
            }

            if(document.getElementById("optionTag").checked){
                chartCategory();
            }

            if(document.getElementById("optionDate").checked){
                chartDate();
            }
        });

        function readGraph(){ // Lee el valor del gráfico seleccionado en los radios de tipo de gráfico.
            [...document.getElementsByName("chart")].forEach(chart => { // Itera sobre todos los radios de gráficos.
                if(chart.checked){ // Si el radio está seleccionado, guarda su valor en graphValue.
                    graphValue = chart.value
                }
            });
        }

        // Genera gráficos de tipo de transacción (Ingreso vs Gasto).
        function chartType(){
            // Llama a generateChart para crear gráficos de barras con los datos de ingresos y gastos.
            generateChart(document.querySelector(".container-cant"), graphValue, ["Ingreso", "Gasto"], [filterData("Ingreso").length, filterData("Gasto").length]);
            generateChart(document.querySelector(".container-value"), graphValue, ["Ingreso", "Gasto"], [user.getBalance(ingresosByMonth), user.getBalance(gastosByMonth)]);
        }

        // Genera gráficos por categorías (cada tipo de transacción, como alimentos, transporte, etc.).
        function chartCategory(){
            let label = []; // Arreglo para almacenar las etiquetas (categorías).
            let data = []; // Arreglo para almacenar los valores (total de cada categoría).
            Category.getCategoriesUser().forEach(category => { // Itera sobre las categorías del usuario.
                let array = filterData(category.tag) // Filtra las transacciones por categoría.
                label.push(array.length) // Almacena el número de transacciones por categoría en 'label'.
                
                let counter = 0
                array.forEach(transaction => { // Suma el valor de las transacciones para cada categoría.
                    counter += transaction.getValue()
                })

                data.push(counter); // Almacena la suma de los valores de transacciones por categoría en 'data'.
            });
            
            // Llama a generateChart para generar gráficos de categorías.
            generateChart(document.querySelector(".container-cant"), graphValue, Category.getTagUser(), label)
            generateChart(document.querySelector(".container-value"), graphValue, Category.getTagUser(), data)
        }

        // Genera gráficos por fecha (transacciones agrupadas por día).
        function chartDate(){
            let label = []; // Arreglo para almacenar las fechas (días del mes).
            let cant = []; // Arreglo para almacenar la cantidad de transacciones por día.
            let value = []; // Arreglo para almacenar el valor total de transacciones por día.

            for (let i = 0; i < transactionByMonth.length; i++) { // Itera sobre las transacciones del mes.
                const transaction = transactionByMonth[i];
                const fecha = transaction.getDate(); // Obtiene la fecha de la transacción.
                const monthDay =  fecha.substring(fecha.indexOf("-")+1) // Extrae el día del mes.

                if(label.includes(monthDay)){ // Si el día ya está en las etiquetas, lo omite.
                    continue;
                } else { // Si no, agrega el día y calcula el total de transacciones de ese día.
                    label.push(monthDay); // Agrega el día a las etiquetas.

                    let total = 0;
                    filterData(fecha).forEach(element => { // Filtra las transacciones por fecha y suma sus valores.
                        total += element.getValue()
                    })

                    value.push(total); // Almacena el total de las transacciones de ese día en 'value'.
                    cant.push(filterData(fecha).length); // Almacena la cantidad de transacciones de ese día en 'cant'.
                }
            }

            // Llama a generateChart para generar los gráficos de transacciones por fecha.
            generateChart(document.querySelector(".container-cant"), graphValue, label, cant)
            generateChart(document.querySelector(".container-value"), graphValue, label, value)
        }
    }
});


//Carga inicial de datos y configuraciones:
//Inicializa varias funciones del panel como el menú, el nombre del usuario, la lista de usuarios, y la cancelación de modales.
//Carga las transacciones del usuario por mes y ordena las transacciones por fecha.

//Interacción con el selector de mes:
//Al cambiar el mes, se actualizan los datos de las transacciones y los gráficos correspondientes.
//Se reordenan las transacciones y se vuelven a dibujar los gráficos.

//Gestión de gráficos:
//Se genera el gráfico correspondiente según el tipo seleccionado por el usuario (por transacción, por categoría o por fecha).
//Los gráficos se actualizan dinámicamente al cambiar los filtros de visualización (tipo de gráfico, categoría, etc.).

//Generación de gráficos:
//Por tipo de transacción: Se crea un gráfico de barras para mostrar los ingresos vs los gastos.
//Por categoría: Se genera un gráfico con las categorías de las transacciones y su total.
//Por fecha: Se crea un gráfico con transacciones agrupadas por día.

//Eventos dinámicos:
//Escucha los eventos de los radio buttons para actualizar los gráficos al cambiar el tipo de gráfico o el filtro de categoría.