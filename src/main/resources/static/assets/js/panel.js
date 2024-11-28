// Importación de módulos para manejar usuarios, transacciones, categorías, y vistas
import User from "../../src/model/account/User.js";
import Transaccion from "../../src/model/operation/Transaccion.js";
import Category from "../../src/model/tag/Category.js";
import { statusAccount } from "../../src/view/account.js";
import { statusDashboard } from "../../src/view/dashboard.js";
import { statusStatistics } from "../../src/view/statistics.js";
import { statusTransaction } from "../../src/view/transactions.js";
import { checkSession, closeloading, endSession, findUser, textCurrency } from "./util.js";

// Declaración de variables globales que se utilizan para interactuar con el DOM
export let user = {}; // Variable que guarda la instancia del usuario actual
export let tipo = document.getElementById("tipo"); // Elemento del DOM para el tipo de transacción
export let fecha = document.getElementById("fecha"); // Elemento del DOM para la fecha
export let valor = document.getElementById("valor"); // Elemento del DOM para el valor de la transacción
export let descripcion = document.getElementById("descripcion"); // Elemento del DOM para la descripción
export let categoria = document.getElementById("categoria"); // Elemento del DOM para la categoría

export let sizePage = document.getElementById("sizePage"); // Elemento para el tamaño de página
let pageCategoria = document.getElementById("pageCategoria"); // Elemento para las páginas de categorías

export let month = document.getElementById("month"); // Elemento para el selector de mes
export let transactionByMonth = []; // Array que guarda las transacciones filtradas por mes
export let ingresosByMonth = []; // Array para los ingresos del mes
export let gastosByMonth = []; // Array para los gastos del mes

// Llamadas iniciales para verificar la sesión y cargar datos persistentes
checkSession(); // Revisa si hay un usuario en el sessionStorage para continuar
User.loadDataSession(); // Carga datos de usuario si no existen ya en la sesión
Transaccion.loadDataSession(); // Carga las transacciones previas
Category.loadDataSession(); // Carga las categorías disponibles

user = findUser(); // Encuentra al usuario actual a partir de la sesión
// Función para mostrar el nombre del usuario en el encabezado

// Carga los datos de sesión (usuario, transacciones, etc.).
console.log("Usuario", User.getUserData()[0]);
console.log("DB Transacciones", Transaccion.getTransactionsUser());
console.log("DB Categorias", Category.getCategoriesUser());


export function printNameUser(){
    document.getElementById("nameUser").textContent = user.getName().split(" ")[0]; //Se generan subcadenas (palabras) al nombre del usuario por cada espacio en blanco (" ") que tenga esta cadena de caracteres y se obtiene la primer subcadena [0] la cuál será el primer nombre del usuario
}

// Función para cerrar sesión y redirigir al login
export function logout(){
    document.getElementById("logout").addEventListener("click", function() {
        let method = [
            () => endSession("./login.html") // Redirige al login tras cerrar sesión
        ]
        alertConfirm("Cerrar sesión", "Serás redirigido en breve", "exit", method); // Muestra confirmación antes de cerrar sesión
    });
}

// Función que maneja la apertura y cierre del menú lateral
export function menuButton(){
    document.getElementById("menuButton").addEventListener("click", function(){
        const sidebar = document.getElementById("sidebar");
        
        if(sidebar.style.display == ""){
            sidebar.style.display = "block";
    
            setTimeout(() => {
                sidebar.classList.add("effect"); // Agrega clase de animación al abrir
            }, 10);
        } else if(sidebar.style.display == "block"){
            sidebar.classList.remove("effect"); // Elimina la clase de animación al cerrar
    
            sidebar.addEventListener('transitionend', function() { // Al finalizar la animación, oculta el sidebar
                sidebar.style.display = ""; // Oculta completamente después de la transición
            }, { once: true }); // Solo ejecuta una vez
        }
    });
}

// Función que establece el mes actual en el selector y agrega un listener para actualizar datos cuando cambie
export function monthLoad(){
    let date = new Date();
    month.value = date.getMonth() + 1; // Establece el mes actual como valor por defecto

    // Si estamos en las páginas de Dashboard, Transacciones o Cuenta, agregamos un listener para el cambio de mes
    if(statusDashboard || statusTransaction || statusAccount){
        month.addEventListener("change", function(){
            updateValues(); // Actualiza las transacciones y balance cuando se cambia el mes
        });
    }
} 

// Función que actualiza la lista de transacciones y categorías para el usuario actual
export function updateListUser(){
    user.getTransactions().updateListUser(); // Actualiza las transacciones del usuario
}

// Función que filtra las transacciones del mes en curso y calcula el balance entre ingresos y gastos
export function updateValues(){ 
    dataByMonth(Transaccion.getTransactionsUser()); // Filtra las transacciones por mes
    calculateBalance(ingresosByMonth, gastosByMonth); // Calcula el balance entre ingresos y gastos
}

// Función que filtra las transacciones del mes seleccionado
export function dataByMonth(data){
    transactionByMonth = data.filter(transaction => {
        const fecha = transaction.getDate(); // Obtiene la fecha de la transacción
        // Filtra las transacciones por el mes seleccionado
        if(fecha.substring(fecha.indexOf("-")+1, fecha.lastIndexOf("-")) == month.value){
            return true;
        }
    });

    // Ordena las transacciones por fecha (de mayor a menor)
    orderTransaction("mayor");

    // Filtra las transacciones en dos grupos: ingresos y gastos
    ingresosByMonth = transactionByMonth.filter(transaction => transaction.getType() == "Ingreso");
    gastosByMonth = transactionByMonth.filter(transaction => transaction.getType() == "Gasto");
}

// Función que calcula el balance total entre ingresos y gastos y actualiza la vista
export function calculateBalance(ingresos, gastos) {
    let ingresoTotal = document.getElementById("valorIngreso");
    let gastoTotal = document.getElementById("valorGasto");
    let saldoTotal = document.getElementById("saldo");

    ingresoTotal.textContent = user.getBalance(ingresos); // Muestra el total de ingresos
    gastoTotal.textContent = user.getBalance(gastos); // Muestra el total de gastos

    saldoTotal.textContent = Number(ingresoTotal.textContent) - Number(gastoTotal.textContent); // Calcula el saldo
    // Aplica el formato de moneda a los valores
    ingresoTotal.textContent = textCurrency(+ingresoTotal.textContent);
    gastoTotal.textContent = textCurrency(+gastoTotal.textContent);
    saldoTotal.textContent = textCurrency(+saldoTotal.textContent);
}

// Función que aplica el formato de moneda a los valores de transacciones en un contenedor
export function textFormat(container){
    [...container.children].forEach(page => { // Recorre las páginas dentro del contenedor
        [...page.children].forEach(transaction => { // Recorre las transacciones de cada página
            if(transaction.dataset.id){ // Solo aplica formato si la transacción tiene un ID
                let value = textCurrency(+transaction.querySelector(".titleValue").textContent);
                transaction.querySelector(".titleValue").textContent = value;

                if(container.id != "campoTransacciones" && window.innerWidth >= 768){
                    let category = transaction.querySelector(".titleCategory").textContent.slice(0, 9);
                    let date  = transaction.querySelector(".titleDate").textContent.slice(5);

                    transaction.querySelector(".titleCategory").textContent = category;
                    transaction.querySelector(".titleDate").textContent = date;

                    [...transaction.children].forEach(title => {
                        if(title.textContent.length >= 9 && (title.className == "titleCategory" || title.className == "titleDescription")){
                            title.textContent += "..."; // Agrega elipsis si el texto es largo
                            title.innerHTML += `<i class="fa-solid fa-circle-info" fa-lg></i>`; // Agrega un icono informativo
                        }
                    });
                }
            }
            
        });
    });
}

// Función que imprime las categorías disponibles para el usuario
export function printCategory() {
    if(statusDashboard){
        user.getCategories().printCategories(categoria); // Imprime las categorías en el dashboard
    }
    
    user.getCategories().printCategories(categoria); // En sección de añadir transacciones
    if(statusTransaction){
        user.getCategories().printCategories(document.getElementById("categoriaFilter")); // En sección de filtro de transacciones
    }

    if(statusAccount){
        // Ordena las categorías de mayor a menor según la cantidad de transacciones
        Category.getCategoriesUser().sort((a, b) => {return getTotalCategory(b.tag) - getTotalCategory(a.tag)});
        pagination(categoria, pageCategoria, Category.getTagUser(), 3, user.getCategories().printCategories); // Pagina las categorías
    }
}

// Función que maneja la paginación de categorías o transacciones
export function pagination(container, buttonContainer, vector, size, callback){
    container.innerHTML = ""; // Limpia el contenedor de páginas
    let counterTransaction = 0;

    // Crea la primera página de manera anticipada
    createPage();
    let section = container.children;

    if(vector.length != 0){ // Si hay elementos, comienza la impresión por páginas
        for (let page = 0; page < section.length; page++) { // Recorre las páginas
            for (let i = 0; i < size; i++) { // Imprime el número de objetos especificado en cada página
                let elemento = "";

                if(container.id == "categoria"){
                    let transaction = getTotalCategory(vector[counterTransaction]);
                    elemento = callback(container, vector, true, counterTransaction, transaction);
                } else {
                    elemento = callback(container, vector, true, counterTransaction); // Imprime la estructura de cada transacción
                }
                
                section[page].innerHTML += elemento;
                counterTransaction++;

                if(counterTransaction == vector.length){ // Si ya no hay más transacciones, termina el ciclo
                    break;
                }
            }

            createPage(); // Crea una nueva página si es necesario
        }
    }

    function createPage(){
        if(counterTransaction < vector.length || vector.length == 0){
            let page = document.createElement("div");
            page.className = "pagina"
            container.appendChild(page); // Añade una nueva página al contenedor
        }
    }

    paginationDefault(container, buttonContainer, size); // Llama a la lógica de paginación
}

// Función que maneja la lógica de los botones de paginación e imprime secciones vacias cuando una página no puede llenarse por completo o no haya transacciones
export function paginationDefault(container, buttonContainer, size){
    let lastPage = container.lastChild;
    
    if(lastPage.children.length < size){ 
        let diference = size - lastPage.children.length;
        for (let i = 0; i < diference; i++) {
            let elemento =`
                <div class="list">
                    <h4>${statusTransaction ? (transactionByMonth.length == 0 && i == 0 ? "Sin registro" : "") : statusAccount ? (Category.getCategoriesUser().length == 0 && i == 0 ? "Sin registro" : "") : ""}</h4>
                    <p></p>
                    <p></p>
                    <p></p>
                </div>`; //Si statusTransaction es true, entonces se valida no hay transacciones y si el iterador del ciclo es cero para entonces imprimir "Sin registro en el primer campo vacio de la primera página generada pero si statusAccount es true entonces validará si el usuario no tiene categorias para realizar el mismo proceso que con transaction"
            lastPage.innerHTML += elemento; // Llena los espacios vacíos con una estructura base
        }
    }

    if(lastPage.children.length == 0){
        lastPage.children[0].textContent = "Sin transacciones"; // Muestra un mensaje si no hay transacciones
    }
    
    container.firstChild.style.display = "unset"; // Muestra la primera página por defecto

    // Limpia los botones de paginación existentes antes de añadir nuevos
    buttonContainer.innerHTML = "";

    // Crea los botones de acuerdo al número de páginas
    for (let i = 0; i < container.children.length; i++) {
        let pageButton = document.createElement("button");
        pageButton.textContent = i + 1;

        buttonContainer.appendChild(pageButton); // Añade cada botón de página
        paginationButtons(container, buttonContainer); // Configura los botones
    }
}

// Función que asigna la lógica de los botones de paginación
export function paginationButtons(container, buttonContainer){
    buttonContainer.addEventListener("click", function(e){
        if(e.target.tagName == "BUTTON"){ // Solo responde a los clics en botones
            [...container.children].forEach(page => { // Oculta todas las páginas antes de mostrar la seleccionada
                page.style.display = "none";
            });

            [...buttonContainer.children].forEach(button => { // Resetea el estilo de los botones
                button.style.transform = "none";
                button.style.fontWeight = "unset";
                button.style.boxShadow = "none";
            });

            container.children[e.target.textContent-1].style.display = "unset"; // Muestra la página seleccionada
            buttonContainer.children[e.target.textContent-1].style.transform = "scale(1.05)";
            buttonContainer.children[e.target.textContent-1].style.fontWeight = "bold"; // Resalta el botón seleccionado
            buttonContainer.children[e.target.textContent-1].style.boxShadow = "inset 0 4px 12px rgba(0, 0, 0, 0.3)";
        }   
    });
}

// Función que ordena las transacciones por fecha (de mayor a menor)
export function orderTransaction(order){
    if(order == "mayor"){
        transactionByMonth.sort((a, b) => b.getDate().substring(b.getDate().lastIndexOf("-")+1) - a.getDate().substring(a.getDate().lastIndexOf("-")+1));
    } 
    
    if(order == "menor"){
        transactionByMonth.sort((a, b) => a.getDate().substring(b.getDate().lastIndexOf("-")+1) - b.getDate().substring(a.getDate().lastIndexOf("-")+1));
    }
}

// Función que muestra la descripción de una transacción en un modal
export function noteAction(id){
    let transaction = user.getTransactions().findTransaction(id);
    document.getElementById("modalDescription").innerHTML = `<p>${transaction.getDescription()}</p> <h5>${transaction.getCategory().tag}</h5>`;
    document.getElementById("noteModal").style.display = "flex";
}

// Función que obtiene el total de transacciones de una categoría
export function getTotalCategory(tag){
    let filter = user.getTransactions().getFilter().filter("", "", "Tipo", tag, "", Transaccion.transactionData);
    return filter.length; // Devuelve la cantidad de transacciones en esa categoría
}

// Función que filtra los datos según el tipo o la categoría
export function filterData(data){
    let filter = [];

    if(data == "Ingreso" || data == "Gasto"){
        filter = user.getTransactions().getFilter().filter("", "", data, "Categoría", "", transactionByMonth);
    }

    if(Category.getCategoriesUser().find(category => category.tag == data)){
        filter = user.getTransactions().getFilter().filter("", "", "Tipo", data, "", transactionByMonth);
    } 

    if(data.includes("-")){
        filter = user.getTransactions().getFilter().filter("", "", "Tipo", "Categoría", data, transactionByMonth);
    }

    return filter;
}

// Función que cierra los modales al hacer click en el botón de cancelar
export function modalCancel(){
    [...document.querySelectorAll(".cancelar")].forEach(element => {
        element.addEventListener("click", function(e){
            console.log("click");
            e.target.closest(".modal").style.display = "none"; // Cierra el modal
        });
    });
}

// Función que muestra una alerta de confirmación con una acción posterior
export async function alertConfirm(title, text, id, functions){
    await confirmShow(title, text, id); // Crea el alert de confirmación

    // Ejecuta las funciones asociadas al botón de confirmación
    document.getElementById(id).addEventListener("click", function(){ 
        functions.forEach(method => method()); // Ejecuta todas las funciones almacenadas en el array
        if(title == "Cerrar sesión"){
            document.getElementById("titleMain").innerHTML = `Hasta luego, <span>${user.getName()}</span>`; // Mensaje personalizado de despedida
            user = null; // Elimina al usuario tras cerrar sesión
        }
    });
}

// Función que muestra el modal de confirmación con botones de Sí y No
export function confirmShow(heading, message, id){
    let caution = "¿Deseas continuar? Esta acción no se puede deshacer";
    if(heading == "Cerrar sesión"){
        caution = "¿Deseas salir de tu cuenta?"; // Mensaje especial para cierre de sesión
    }
    return new Promise((resolve) => { // Retorna una promesa para manejar eventos asíncronos
        Swal.fire({
            customClass: {
                confirmButton: 'swalBtnColor'
            },
            title: heading,
            text: caution,
            icon: "warning",
            showDenyButton: true,
            confirmButtonColor: "#4CAF50",
            denyButtonColor: "#d33",
            confirmButtonText: "Si",
            didOpen: () => { 
                Swal.getConfirmButton().id = id; // Asigna un ID al botón de confirmación
                resolve(true);
            }
        }).then((result) => {
            if (result.isConfirmed && heading != "Eliminar") {
                Swal.fire({
                    customClass: {
                        confirmButton: 'swalBtnColor'
                    },
                    title: heading,
                    text: message,
                    icon: "success",
                    timer: 5000 // Muestra un mensaje de éxito por 5 segundos
                });
            } 
        });
    });
}

closeloading(); // Cierra la barra de carga cuando todos los scripts y el DOM estén cargados

//1. Manejo de la sesión del usuario
//checkSession(): Verifica si hay un usuario logueado en el sessionStorage y, si no, lo redirige al login.
//endSession(): Cierra la sesión del usuario y lo redirige a la página de login después de una confirmación.

//2. Interacciones con el DOM
//menuButton(): Maneja la apertura y cierre de un menú lateral de navegación, mostrando u ocultando el sidebar con animaciones.
//logout(): Permite al usuario cerrar sesión con una confirmación antes de redirigirlo al login.
//monthLoad(): Establece el mes actual en un selector y actualiza los datos de transacciones y balance cuando se cambia el mes.

//3. Gestión de transacciones y categorías
//updateValues(): Actualiza las transacciones y calcula el balance entre ingresos y gastos para el mes seleccionado.
//updateListUser(): Actualiza la lista de transacciones y categorías del usuario.
//printCategory(): Muestra las categorías disponibles para el usuario en el dashboard y otras secciones de la interfaz.
//pagination(): Maneja la paginación de categorías o transacciones, permitiendo ver los datos en múltiples páginas si es necesario.

//4. Visualización de datos
//calculateBalance(): Calcula y muestra el total de ingresos, gastos y el saldo neto del usuario.
//textFormat(): Aplica formato de moneda a los valores de las transacciones, con una opción para recortar el texto y agregar iconos informativos si es necesario.
//noteAction(): Muestra la descripción completa de una transacción en un modal al hacer clic sobre ella.

//5. Filtros y ordenación
//filterData(): Filtra las transacciones basadas en el tipo, la categoría o el mes.
//orderTransaction(): Ordena las transacciones por fecha (de mayor a menor o viceversa).
//getTotalCategory(): Obtiene el total de transacciones relacionadas con una categoría específica.

//6. Confirmaciones y modales
//alertConfirm(): Muestra una alerta de confirmación que ejecuta una serie de funciones al hacer clic en "Sí". Se utiliza, por ejemplo, para confirmar el cierre de sesión.
//confirmShow(): Muestra una alerta de confirmación con botones de "Sí" y "No", y ejecuta acciones según la decisión del usuario.
//modalCancel(): Permite cerrar cualquier modal de la interfaz al hacer clic en el botón de cancelar.

//7. Paginación
//paginationDefault(): Configura los botones de paginación, asegurándose de que se muestren las páginas correctamente.
//paginationButtons(): Maneja la lógica de interacciones con los botones de paginación, permitiendo al usuario navegar entre páginas de transacciones o categorías.

//8. Carga y cierre de animaciones
//closeloading(): Cierra la animación de carga de la página una vez que el contenido está completamente cargado.

//9. Otros métodos
//printNameUser(): Muestra el nombre del usuario en el encabezado de la interfaz.
//textCurrency(): Aplica el formato de moneda a un valor (por ejemplo, convierte un número en formato de pesos colombianos).
//dataByMonth(): Filtra las transacciones por el mes seleccionado y las divide en ingresos y gastos.