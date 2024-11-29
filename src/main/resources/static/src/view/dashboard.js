import User from "../model/account/User.js";
import { alertShow, textCurrency } from "../../assets/js/util.js";
import Transaccion from "../model/operation/Transaccion.js";
import Category from "../model/tag/Category.js";
import { categoria, descripcion, fecha, menuButton, monthLoad, printCategory, printNameUser, updateValues, tipo, transactionByMonth, user, valor, updateListUser, modalCancel, logout, month } from "../../assets/js/panel.js";
import { getData, sendData } from "../controller/api.js";

let page = document.location.href; // Obtiene la URL actual de la página.
export let statusDashboard = false; // Variable de estado que indica si estamos en la página del dashboard.

document.addEventListener("DOMContentLoaded", function() {
    // Cuando el contenido del documento esté listo, se ejecutan las siguientes acciones.
    if(page.includes("dashboard")){
        statusDashboard = true; // Establece el estado del dashboard como verdadero si la URL contiene "dashboard".

        // Funciones básicas que se ejecutan al cargar el dashboard.
        menuButton(); // Configura los botones del menú.
        printNameUser(); // Muestra el nombre del usuario en el panel.
        updateListUser(); // Actualiza la lista de usuarios.
        modalCancel(); // Configura la función para cerrar modales.
        logout(); // Configura la función de cierre de sesión.

        // Funciones específicas del dashboard.
        printWelcome(); // Muestra un mensaje de bienvenida personalizado.
        monthLoad(); // Carga el mes actual al dashboard y le agrega un evento para cambiar de mes.
        updateValues(); // Filtra, calcula y actualiza las transacciones del usuario.
        printCategory(); // Imprime las categorías de transacciones del usuario.
        recentTransaction(); // Muestra las transacciones recientes en el dashboard.

        // Evento para cambiar el mes en el dashboard.
        month.addEventListener("change", function(){
            recentTransaction(); // Actualiza las transacciones al cambiar el mes.
        });

        // Evento para agregar una nueva transacción cuando se hace clic en el botón "Añadir".
        document.getElementById("añadir").addEventListener("click", function(e) {
            e.preventDefault();
            
            // Verifica si todos los campos del formulario son válidos antes de crear la transacción.
            if(tipo.value != "Tipo" && categoria.value != "Categoría" && valor.value != "" && fecha.value != ""){
                getData(sendData("POST", "transactions", {
                    user: {id: user.getId()},
                    type: tipo.value,
                    value: valor.value,
                    category: {id: categoria.value},
                    date: fecha.value,
                    description: descripcion.value

                })).then(response => {
                    if(response.ok){
                        response.json().then(data => {
                            // Crea una nueva transacción con los valores del formulario.
                            user.getTransactions().getManager().createTransaction(data.id, data.type, +data.value, data.description, data.category, data.date);
                            user.getTransactions().updateListUser(); // Actualiza la lista de transacciones del usuario.
                            updateValues(); // Recalcula el balance y actualiza la lista de transacciones.
                            recentTransaction(); // Actualiza las transacciones recientes.
                            formatearCampo(); // Limpia los campos del formulario.

                            // Muestra una alerta de éxito.
                            alertShow("Hecho!", "Transacción registrada", "success");
                            console.log(user); // Muestra el usuario actualizado en consola.
                        })
                    } else {
                        alertShow("Error!", "Ha ocurrido un error inespedarado, intentélo nuevamente", "warning");
                    }
                });
                
            } else {
                // Si algún campo falta, muestra una alerta de error.
                alertShow("Error!", "Ingrese todos los campos faltantes", "warning");
            }
        });

        // Función que actualiza y muestra las transacciones recientes del usuario.
        function recentTransaction(){
            document.getElementById("recentTransactions").innerHTML = ""; // Limpia la lista de transacciones previas.
            transactionByMonth.sort((a, b) => b.getId() - a.getId()); // Ordena las transacciones por ID (de mayor a menor).
            
            if(transactionByMonth.length != 0){ // Si hay transacciones en el mes.
                for (let i = 0; i < 5; i++) {
                    document.getElementById("recentTransactions").innerHTML += `<tr data-tipo="${transactionByMonth[i].getType()}">
                                    <td>${transactionByMonth[i].getType()}</td>
                                    <td>${textCurrency(transactionByMonth[i].getValue())}</td>
                                    <td>${transactionByMonth[i].getCategory().tag}</td>
                                    <td>${transactionByMonth[i].getDate()}</td>
                                </tr>`;
                                if(transactionByMonth.length == i+1){
                                    break; // Limita la visualización a las 5 transacciones más recientes.
                                }
                }
            } else {
                // Si no hay transacciones, muestra un mensaje indicando que no hay datos.
                document.getElementById("recentTransactions").style.color = "#000";
                document.getElementById("recentTransactions").innerHTML = `<tr class="nodata"> 
                        <td colspan="4" rowspan="5">Sin transacciones</td> 
                    </tr>`
            }
        }

        // Función que limpia los campos del formulario después de agregar una transacción.
        function formatearCampo() {
            document.getElementById("tipo").selectedIndex = 0; // Restablece el campo de tipo de transacción.
            valor.value = ""; // Limpia el campo de valor.
            descripcion.value = ""; // Limpia el campo de descripción.
            categoria.selectedIndex = 0; // Restablece el campo de categoría.
            fecha.value = ""; // Limpia el campo de fecha.
            document.getElementById("añadir").style.display = "inline"; // Muestra el botón de añadir.
        }

        // Función que muestra un mensaje de bienvenida al usuario la primera vez que entra al panel.
        function printWelcome(){
            if(!sessionStorage.getItem("welcome")){ // Verifica si es la primera vez que se accede al panel.
                document.getElementById("titleMain").innerHTML = `¡Bienvenido de nuevo, <span>${user.getName()}!</span>` // Muestra el nombre del usuario en el saludo.
    
                setTimeout(() => {
                    document.getElementById("titleMain").innerHTML = `Panel <span>principal</span>`; // Después de 3 segundos, cambia el mensaje a "Panel principal".
                }, 3000);
            } else {
                document.getElementById("titleMain").innerHTML = `Panel <span>principal</span>`; // Si ya se ha mostrado el mensaje, solo muestra "Panel principal".
            }

            sessionStorage.setItem("welcome", JSON.stringify("welcome")); // Marca en el sessionStorage que el mensaje ya ha sido mostrado.
        }
    }
});


//Estructura General:
//El script se ejecuta cuando el DOM está completamente cargado, verificando si la página es un "dashboard" y realizando diversas inicializaciones si es el caso.

//Funciones de Interfaz:
//menuButton(), logout(), modalCancel(): Configuran las funcionalidades de botones del menú, cierre de sesión y cancelación de modales.
//printWelcome(): Muestra un mensaje de bienvenida al usuario cuando accede al panel por primera vez, y luego cambia a un mensaje estándar.

//Gestión de Transacciones:
//Se verifica si todos los campos del formulario están completos antes de crear una nueva transacción con user.getTransactions().getManager().createTransaction.
//La función recentTransaction() organiza y muestra las transacciones más recientes (hasta 5) del usuario.
//Si no hay transacciones recientes, se muestra un mensaje indicándolo.

//Formulario de Transacciones:
//formatearCampo() limpia los campos del formulario después de agregar una transacción, dejando el formulario listo para una nueva entrada.

//Interacción con Datos:
//La función updateValues() recalcula y actualiza el balance y las transacciones filtradas por mes.
//monthLoad() ajusta el mes mostrado en el dashboard y permite cambiarlo, actualizando las //transacciones según el mes seleccionado.

//Este código proporciona una interfaz funcional para gestionar las transacciones de un usuario, mostrar información dinámica sobre el estado del panel y actualizar las vistas de acuerdo con los cambios de mes o de transacciones.