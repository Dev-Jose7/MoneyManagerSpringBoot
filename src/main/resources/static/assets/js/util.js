import { getData, receiveData } from "../../src/controller/api.js";
import User from "../../src/model/account/User.js";

// Función para verificar si todos los campos de un array tienen algún valor.
// Si hay campos vacíos, se resalta el borde con color rojo y se restaura después de 3 segundos.
export function completeInput(array){
    let counter = 0; // Contador de campos vacíos
    for (let i = 0; i < array.length; i++) {
        if(array[i].value == ""){
            counter++; // Se incrementa el contador si el campo está vacío
            array[i].style.borderColor = "red"; // Resalta el borde del campo vacío

            // Restaura el estilo del borde después de 3 segundos
            setTimeout(() => {
                array[i].style.borderStyle = "solid";
                array[i].style.borderColor = "unset"; // Se remueve el borde rojo
            }, 3000);
        }
    }

    // Si no hay campos vacíos, retorna true; de lo contrario, retorna false
    return counter == 0;
}

// Función para confirmar si dos contraseñas coinciden
export function confirmPassword(password, passwordConfirm){
    // Compara las contraseñas y devuelve true si son iguales, de lo contrario false
    return password == passwordConfirm;
}

// Función para iniciar sesión y almacenar la información del usuario en sessionStorage
export function initSession(account){
    //Almacena la información del usuario
    sessionStorage.setItem("user", JSON.stringify([{ id: account.id, name: account.name, email: account.email}]))
    sessionStorage.setItem("transactions", JSON.stringify(account.transactions));
    sessionStorage.setItem("categories", JSON.stringify(account.categories));

    // Después de 2 segundos, redirige al usuario a la página del dashboard
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 2000);
}

// Función para cerrar la sesión del usuario
export function endSession(url){
    // Elimina la información del usuario y bienvenida del sessionStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("transactions");
    sessionStorage.removeItem("categories");
    sessionStorage.removeItem("welcome");

    // Redirige a la URL especificada después de un tiempo de espera
    setTimeout(() => {
        window.location.href = url;
    }, 2000); // 2 segundos
}

// Función para obtener el usuario de sessionStorage y buscar sus datos
export function findUser (){
    let account = JSON.parse(sessionStorage.getItem("user")); // Obtiene los datos del usuario almacenados en sessionStorage
    return User.getUserData().find(user => user.id == account[0].id); // Busca al usuario correspondiente
}

// Función que verifica si la sesión está activa
export function checkSession(){
    if(!sessionStorage.getItem("user")){
        alertShow("Error!", "Debes iniciar sesión para continuar", "warning"); // Muestra una alerta si no hay sesión activa

        // Redirige al registro después de 5 segundos
        setTimeout(() => {
            window.location.href = "./registro.html";
        }, 5000);

        // Maneja el evento click en los botones de la alerta para redirigir al registro
        document.querySelector(".swalBtnColor").addEventListener("click", function(){
            window.location.href = "./registro.html";
        });

        document.querySelector(".swal2-container").addEventListener("click", function(){
            window.location.href = "./registro.html";
        });

        window.stop(); // Detiene la ejecución de la página
    }
}

// Función para formatear un valor como moneda en COP (pesos colombianos)
export function textCurrency(value) {
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// Función para mostrar una alerta con un mensaje específico
export function alertShow(heading, message, type){
    Swal.fire({
        customClass: {
            confirmButton: 'swalBtnColor'
        },
        title: heading, // Título de la alerta
        text: message, // Mensaje de la alerta
        icon: type, // Tipo de alerta (ej. 'warning', 'success')
        confirmButtonText: 'Ok', // Texto del botón de confirmación
        timer: 5000 // Duración de la alerta (5 segundos)
    });
}

// Función para cerrar una animación de carga y eliminar el elemento del DOM
export function closeloading(){
    const loading = document.getElementById("loading"); // Obtiene el elemento de carga
    loading.classList.add("effectLoading"); // Aplica una clase de animación

    // Elimina el elemento de carga después de que la transición finalice
    loading.addEventListener('transitionend', function() {
        loading.remove(); // Elimina completamente el elemento del DOM
    }, { once: true }); // Solo se ejecuta una vez

    document.querySelector("body").style.overflow = "unset"; // Permite hacer scroll nuevamente
}

//1. Validación de Formularios
//completeInput(array): Verifica si todos los campos de un formulario están completos. Si hay campos vacíos, resalta el borde de esos campos en rojo y luego lo restaura después de 3 segundos.
//confirmPassword(password, passwordConfirm): Verifica si las contraseñas introducidas coinciden. Devuelve true si son iguales, y false en caso contrario.

//2. Gestión de Sesiones
//initSession(account): Inicia sesión y almacena los datos de la cuenta del usuario en sessionStorage. Luego, redirige al usuario al dashboard después de 2 segundos.
//endSession(url): Cierra la sesión eliminando la información de la cuenta del sessionStorage y redirige a una URL específica después de 2 segundos.
//findUser(): Obtiene el usuario desde el sessionStorage y busca sus datos en una base de datos simulada (probablemente un array de usuarios).
//checkSession(): Verifica si hay una sesión activa en sessionStorage. Si no es así, muestra una alerta y redirige al usuario a la página de registro después de 5 segundos.

//3. Manejo de Alertas y Mensajes
//alertShow(heading, message, type): Muestra una alerta personalizada utilizando la librería Swal (SweetAlert2). Permite personalizar el título, el mensaje y el tipo de alerta (ej. éxito, advertencia).
//textCurrency(value): Formatea un número como una cantidad monetaria en pesos colombianos (COP).

//4. Interacción con Elementos del DOM
//closeloading(): Cierra una animación de carga (spinner) y elimina el elemento del DOM después de una animación.

//5. Transacciones Financieras
//A través de las instancias de los usuarios (admin y admin1), se crean varias transacciones que incluyen ingresos (por salarios, comisiones, ventas, etc.) y gastos (como alquileres, servicios públicos, compras, transporte, etc.).
//Las transacciones son gestionadas mediante un objeto Transaccion y almacenadas para cada usuario.

//El script maneja una serie de funcionalidades típicas en un sistema web de gestión de cuentas o 
//usuarios. Incluye validaciones de formularios, manejo de sesiones, alertas, formato de moneda y 
//la generación de datos de prueba (transacciones financieras) para simular un sistema de finanzas. 
//Además, implementa interacciones con el DOM para mostrar mensajes y cerrar animaciones de carga, 
//todo ello en un contexto donde se requiere autenticar usuarios y registrar operaciones financieras de forma segura.