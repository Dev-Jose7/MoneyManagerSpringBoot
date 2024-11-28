import User from "../model/account/User.js";
import { closeloading, completeInput, initSession } from "../../assets/js/util.js";
import Transaccion from "../model/operation/Transaccion.js";
import { getData, sendData } from "../controller/api.js";

document.addEventListener("DOMContentLoaded", function(){
    // Carga los datos de usuario y transacciones almacenados en la sesión.
    // User.loadDataSession();  // Carga la sesión del usuario actual desde sessionStorage.
    // Transaccion.loadDataSession();  // Carga las transacciones almacenadas en la sesión.

    // Referencia a los campos de entrada (inputs) del formulario de login.
    const inputEmail = document.getElementById("email");  // Campo de correo electrónico.
    const inputPassword = document.getElementById("password");  // Campo de contraseña.
    const inputs = document.querySelectorAll("input[id]");  // Selecciona todos los campos de entrada con un id.
    const statusLogin = document.getElementById("statusLogin");  // Área donde se mostrará el estado del login (éxito o error).

    // Imprime en la consola los datos de todos los usuarios registrados.
    User.printUserData();  // Esto ayuda a depurar e inspeccionar los datos de los usuarios cargados.

    // Evento que ocurre cuando el usuario hace clic en el botón de "submit" del formulario de login.
    document.querySelector("input[type = 'submit']").addEventListener("click", function(e) {
        e.preventDefault();  // Evita que se recargue la página al hacer submit del formulario.

        let status = completeInput(inputs);  // Verifica si todos los campos requeridos están completos.

        if(status){
            getData(sendData("POST", "users/login", {email: inputEmail.value, password: inputPassword.value}))
                .then(response => {
                    if(response.ok){
                        statusLogin.textContent = "Acceso autorizado";
                        response.json().then(user => initSession(user))
                    } else {
                        statusLogin.textContent = "Credenciales incorrectas"
                    }
            })  
        } else {
            statusLogin.textContent = "Complete los campos faltantes";  // Si algún campo está vacío, muestra un mensaje de advertencia.
        }
        

        // Limpia el mensaje de estado (success, error, etc.) después de 3 segundos.
        setTimeout(() => {
            statusLogin.textContent = "";  // Elimina el mensaje de estado.
        }, 3000);
        
    });

    

    // Cierra el loading (pantalla de carga) cuando todo el contenido ha sido cargado.
    closeloading();
});

//Carga de Datos en la Sesión:
//User.loadDataSession() y Transaccion.loadDataSession() se encargan de cargar los datos de usuario y las transacciones almacenadas en la sesión.
//Estas funciones permiten acceder a los datos que se han guardado en el sessionStorage, que es donde se mantiene la información persistente durante la sesión del usuario.

//Selección de Elementos del Formulario:
//inputEmail, inputPassword: Variables que hacen referencia a los campos de entrada del correo electrónico y la contraseña.
//inputs: Selecciona todos los campos de entrada del formulario (<input>) para validarlos.
//statusLogin: Es el área de la interfaz donde se mostrará el estado de la autenticación (si el acceso fue autorizado o si hubo algún error).

//Evento de Autenticación (Submit):
//Se añade un "listener" al evento de clic en el botón de "submit" del formulario de login.
//e.preventDefault(): Previne la acción por defecto de enviar el formulario y recargar la página.
//completeInput(inputs): Verifica si todos los campos de entrada necesarios están completos.

//Validación de Usuario:
//Si los campos están completos, se procede a validar las credenciales con User.validateUser(inputEmail.value, inputPassword.value). Esto verifica si el correo electrónico y la contraseña coinciden con los datos de algún usuario registrado.
//Si la validación es exitosa, initSession(account) se encarga de iniciar la sesión, almacenando el estado de la sesión del usuario.

//Mensajes de Estado:
//Dependiendo de si la validación fue exitosa o no, se muestra un mensaje de estado en statusLogin.
//Si la sesión se inicia correctamente, se muestra "Acceso autorizado".
//Si las credenciales son incorrectas, se muestra "Credenciales incorrectas".
//Si los campos no están completos, se muestra un mensaje indicando que faltan campos por completar.

//Limpieza del Mensaje de Estado:
//Después de 3 segundos, con setTimeout(), el mensaje de estado se limpia automáticamente para que no permanezca en la pantalla.

//Cerrar la Pantalla de Carga:
//closeloading(): Al finalizar la carga de la página, se cierra cualquier pantalla o indicador de carga que pueda estar visible mientras se carga la información.

//Funcionalidades Importantes:
//Gestión de sesión: El código maneja el inicio de sesión, validando las credenciales del usuario y proporcionando mensajes claros sobre el estado del login.
//Interactividad: El sistema de validación en tiempo real y los mensajes de estado mejoran la experiencia del usuario al proporcionar retroalimentación inmediata.
//Seguridad: Aunque el sistema de validación y autenticación es básico, es importante que se complemente con medidas de seguridad en el backend (no visible en este código), como el cifrado de contraseñas.
//Este código tiene como objetivo proporcionar una forma sencilla de gestionar el login de usuarios en una aplicación web, validando las credenciales contra un conjunto de datos almacenados en la sesión del navegador.