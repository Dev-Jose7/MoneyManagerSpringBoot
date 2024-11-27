import { monthLoad, printCategory, updateValues, user, tipo, valor, categoria, fecha, descripcion, sizePage, menuButton, printNameUser, alertConfirm, pagination, ingresosByMonth, gastosByMonth, transactionByMonth, textFormat, dataByMonth, calculateBalance, modalCancel, updateListUser, month, noteAction, logout} from "../../assets/js/panel.js"; // Importa funciones y variables del panel y utilidades.
import { alertShow } from "../../assets/js/util.js"; // Importa una función para mostrar alertas.
import { sendData, getData, receiveData } from "../controller/api.js";
import Category from "../model/tag/Category.js";

let page = document.location.href; // Obtiene la URL de la página actual.
export let statusTransaction = false; // Variable de estado que indica si estamos en la página de transacciones.

document.addEventListener("DOMContentLoaded", function(){ // Se ejecuta cuando el contenido de la página ha sido completamente cargado.
    if(page.includes("transaction")){ // Verifica si la URL contiene "transaction" para ejecutar el código relacionado con las transacciones.
        statusTransaction = true; // Cambia el estado a verdadero si estamos en la página de transacciones.

        let id = 0; // Variable para almacenar el ID de una transacción.
        let dataFilter = []; // Arreglo para almacenar las transacciones filtradas.
        let statusFilter = false; // Indica si el filtro está activo.

        // Elementos de la interfaz relacionados con las transacciones.
        let campoIngresos = document.getElementById("campoIngresos");
        let campoGastos = document.getElementById("campoGastos");
        let campoTransacciones = document.getElementById("campoTransacciones");

        let pageIngresos = document.getElementById("pageIngresos");
        let pageGastos = document.getElementById("pageGastos");
        let pageTransacciones = document.getElementById("pageTransacciones");

        // Elementos de filtro.
        let minimoFilter = document.getElementById("minimoFilter");
        let maximoFilter = document.getElementById("maximoFilter");
        let tipoFilter = document.getElementById("tipoFilter");
        let categoriaFilter = document.getElementById("categoriaFilter");
        let fechaFilter = document.getElementById("fechaFilter");

        // Inicializa funciones de interfaz.
        menuButton();
        printNameUser();
        updateListUser();
        logout();
        monthLoad(); // Carga el mes actual al dashboard y asigna un evento para cambiar el mes.
        updateValues(); // Filtra, calcula e imprime las transacciones del usuario.
        printCategory(); // Imprime las categorías de transacciones.
        printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); // Imprime las transacciones de ingresos, gastos y todas las transacciones.
        modalCancel(); // Inicializa la función para cancelar modales.

        // Evento para cambiar el mes y actualizar las transacciones.
        month.addEventListener("change", function(){
            printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth);
        });

        // Evento para modificar o eliminar una transacción al hacer clic en los botones de acción (editar/eliminar).
        document.querySelector(".transacciones").addEventListener("click", function(e) {
            if (e.target.tagName == "I") { // Verifica si el clic fue en un ícono de acción.
                let button = e.target;
                id = button.closest(".transaccion").dataset.id; // Captura el ID de la transacción.

                // Acción para agregar una nota a la transacción.
                if(button.classList.contains("nota")){
                    noteAction(id);
                }

                // Acción para modificar una transacción.
                if (button.classList.contains("modificar")) {
                    document.getElementById("editModal").style.display = "flex"; // Muestra el modal de edición.
                    editTransaction(button); // Llama a la función para editar la transacción.
                }

                // Acción para eliminar una transacción.
                if (button.classList.contains("eliminar")) {
                    let method = [
                        () => getData(receiveData("DELETE", `transactions/${id}`))
                        .then(response => {
                            if(response.ok){
                                user.getTransactions().getManager().deleteTransaction(id, button.closest(".transaccion")), // Elimina la transacción.
                                user.getTransactions().updateListUser(), // Actualiza la lista de transacciones del usuario.
                                updateValues(), // Actualiza las transacciones filtradas.
                                printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth), // Vuelve a imprimir las transacciones actualizadas.
                                alertShow("Eliminada", "Transacción eliminada con exito", "success")
                            } else {
                                alertShow("Error", "Se ha producido un error, vuelve a intentarlo", "warning")
                            }
                        })
                    ];
                    alertConfirm("Eliminar", " ", "deleteTransaction", method); // Muestra una alerta de confirmación.

                    if (!statusFilter) {
                        updateValues();
                        printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); // Si no hay filtro activo, recarga las transacciones.
                    } else {
                        resultFilter(); // Si hay filtro, aplica el filtro a las transacciones.
                    }
                }
            }
        });

        // Confirma la modificación de una transacción.
        document.getElementById("confirmar").addEventListener("click", function(e) {
            e.preventDefault();

            // Verifica si los campos de la transacción editada son diferentes a los valores originales y procede a actualizarla.
            if(tipo.value != user.getTransactions().findTransaction(id).getType() || categoria.value != user.getTransactions().findTransaction(id).getCategory() || valor.value != user.getTransactions().findTransaction(id).getValue() || descripcion.value != user.getTransactions().findTransaction(id).getDescription() || fecha.value != user.getTransactions().findTransaction(id).getDate()){
                getData(sendData("PUT", `transactions/${id}`, {
                    user: { id: user.getId() },
                    type: tipo.value,
                    value: valor.value,
                    category: { id: categoria.value },
                    date: fecha.value,
                    description: descripcion.value
                })).then(response => {
                    if(response.ok){
                        response.json().then(data => {
                            console.log(data.category)
                            user.getTransactions().getManager().updateTransaction(data.id); // Actualiza la transacción.
                            user.getTransactions().updateListUser(); // Actualiza la lista de transacciones del usuario.
                            alertShow("Hecho!", "Transacción actualizada", "success"); // Muestra un mensaje de éxito.

                            document.getElementById("editModal").style.display = "none"; // Cierra el modal de edición.

                            if (!statusFilter) {
                                updateValues();
                                printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); // Si no hay filtro, recarga las transacciones.
                            } else {
                                resultFilter(); // Si hay filtro, aplica el filtro a las transacciones.
                            }
                        })
                    } else if(!response.ok){
                        alertShow("Error!", "Ha ocurrido un error inespedarado, intentélo nuevamente", "warning");
                    }
                });
            }
        });

        // Aplica el filtro cuando el usuario hace clic en el botón de filtro.
        document.getElementById("filter").addEventListener("click", function(e) {
            updateValues(); // Refresca las transacciones antes de aplicar el filtro.
            statusFilter = true;

            // Aplica el filtro de acuerdo a los valores de los campos de mínimo y máximo.
            if (minimoFilter.value == "" && maximoFilter.value == "" || minimoFilter.value != "" && maximoFilter.value != "") {
                e.preventDefault();
                resultFilter(); // Aplica el filtro.
            }

            // Si no hay valor mínimo, establece el valor mínimo a 0.
            if (minimoFilter.value == "" && maximoFilter.value != "") {
                e.preventDefault();
                minimoFilter.value = 0;
                resultFilter(); // Aplica el filtro.
            }

            // Si solo hay un valor mínimo, se requiere un valor máximo.
            if (minimoFilter.value != "" && maximoFilter.value == "") {
                maximoFilter.required = true;
            }
        });

        // Limpia el filtro y restaura la lista original de transacciones.
        document.getElementById("cleanFilter").addEventListener("click", function(e) {
            e.preventDefault();
            user.getTransactions().updateListUser(user.getId()); // Restaura la lista de transacciones.
            updateValues(); // Refresca las transacciones.
            printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); // Vuelve a imprimir las transacciones.

            // Limpia los campos de filtro.
            minimoFilter.value = "";
            maximoFilter.value = "";
            tipoFilter.value = "Tipo";
            categoriaFilter.value = "Categoría";
            fechaFilter.value = "";
        });

        // Cambia la visualización de ingresos, gastos y transacciones.
        document.getElementById("viewAll").addEventListener("click", function(e){
            if(e.target.textContent == "Ver todas"){
                campoIngresos.closest(".section-container").style.display = "none";
                campoGastos.closest(".section-container").style.display = "none";
                campoTransacciones.closest(".section-container").style.display = "unset";
                e.target.style.background = "linear-gradient(135deg, #4CAF50 50%, #FF4D4D 50%)";
                e.target.textContent = "Ingreso/Gasto";
            } else if (e.target.textContent == "Ingreso/Gasto"){
                campoIngresos.closest(".section-container").style.display = "unset";
                campoGastos.closest(".section-container").style.display = "unset";
                campoTransacciones.closest(".section-container").style.display = "none";
                e.target.style.background = "#333";
                e.target.textContent = "Ver todas";
            }
        });

        // Cambia el tamaño de página al seleccionar una nueva cantidad de elementos por página.
        sizePage.addEventListener("change", function(){
            if(!statusFilter){
                updateValues();
                printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); // Si no hay filtro, recarga las transacciones.
            } else {
                resultFilter(); // Aplica el filtro.
            }
        });

        // Imprime las transacciones de ingresos, gastos y todas las transacciones.
        function printTransactions(ingresos, gastos, transacciones) {
            pagination(campoIngresos, pageIngresos, ingresos, sizePage.value, user.getTransactions().getManager().printTransaction); // Paginación de ingresos.
            pagination(campoGastos, pageGastos, gastos, sizePage.value, user.getTransactions().getManager().printTransaction); // Paginación de gastos.
            pagination(campoTransacciones, pageTransacciones, transacciones, sizePage.value, user.getTransactions().getManager().printTransaction); // Paginación de todas las transacciones.

            textFormat(campoIngresos);
            textFormat(campoGastos);
            textFormat(campoTransacciones);
        }

        // Establece los valores para editar una transacción.
        function editTransaction(button) {
            let transactionNode = document.querySelectorAll(".transaccion");
            let transactionList = [...transactionNode];
            transactionList.forEach(transaction => transaction.style.color = "#000");

            if (button.closest(".transaccion").dataset.tipo == "Ingreso") {
                document.getElementById("tipo").selectedIndex = 1;
            } else if (button.closest(".transaccion").dataset.tipo == "Gasto") {
                document.getElementById("tipo").selectedIndex = 2;
            }

            categoria.value = user.getTransactions().findTransaction(id).getCategory().id
            valor.value = user.getTransactions().findTransaction(id).getValue();
            descripcion.value = user.getTransactions().findTransaction(id).getDescription();
            fecha.value = user.getTransactions().findTransaction(id).getDate();
        }

        // Aplica el filtro de las transacciones.
        function resultFilter() {
            dataFilter = user.getTransactions().getFilter().filter(minimoFilter.value, maximoFilter.value, tipoFilter.value, Category.getTagById(categoriaFilter.value), fechaFilter.value, transactionByMonth);
            user.getTransactions().updateListFilter(dataFilter); // Actualiza el arreglo de transacciones filtradas.
            dataByMonth(user.getTransactions().getListFilter()); // Obtiene las transacciones filtradas por mes.
            calculateBalance(ingresosByMonth, gastosByMonth); // Calcula el balance de ingresos y gastos.
            printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); // Imprime las transacciones filtradas.
        }
    }
});

//Gestión de transacciones: 
//Permite ver, modificar y eliminar transacciones (ingresos y gastos) de un usuario.

//Filtros: 
//Permite aplicar filtros para visualizar transacciones según monto, tipo, categoría o fecha.

//Paginación: 
//Las transacciones se muestran en páginas, y se puede configurar cuántas transacciones se muestran por página.

//Modales: 
//Tiene modales para editar y confirmar la eliminación de las transacciones.

//Cada sección del código es modular, y está bien estructurada para que cada funcionalidad se ejecute al momento adecuado, ya sea al cargar la página, interactuar con los botones o aplicar filtros.