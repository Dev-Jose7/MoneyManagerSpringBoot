import User from "../model/account/User.js"; // Importa la clase User desde el controlador de cuenta.
import { alertShow, closeloading, completeInput, confirmPassword, initSession } from "../../assets/js/util.js"; // Importa funciones auxiliares desde un archivo util.js.
import Transaccion from "../model/operation/Transaccion.js"; // Importa la clase Transaccion desde el controlador de operaciones.
import { getData, sendData } from "../controller/api.js";
import Category from "../model/tag/Category.js";

const inputName = document.getElementById("name"); // Referencia al input de nombre en el formulario.
const inputEmail = document.getElementById("email"); // Referencia al input de email en el formulario.
const inputPassword = document.getElementById("password"); // Referencia al input de contraseña en el formulario.
const inputPasswordConfirm = document.getElementById("passwordConfirm"); // Referencia al input de confirmación de contraseña.
const statusRegister = document.getElementById("statusRegister"); // Referencia al elemento donde se mostrarán los mensajes de estado del registro.

const inputs = document.querySelectorAll("input[id]"); // Selecciona todos los elementos 'input' que tienen un atributo 'id'. Son todos los campos del formulario.

// Evento que se ejecuta cuando el usuario hace clic en el botón de enviar (submit).
document.querySelector("input[type = 'submit']").addEventListener("click", function(e) {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (evita la recarga de la página).

    let statusInput = completeInput(inputs); // Llama a la función completeInput para validar si todos los campos del formulario están completos.
    let statusPassword = confirmPassword(inputPassword.value, inputPasswordConfirm.value); // Llama a la función confirmPassword para validar si las contraseñas coinciden.

    if (statusInput && statusPassword) { // Si ambos validadores retornan 'true', significa que todo está correcto.
        
        getData(sendData("POST", "users/register", {
            name: inputName.value,
            email: inputEmail.value,
            password: inputPassword.value
        })).then(response => {
            if(response.ok){
                response.json().then(user => {
                    statusRegister.textContent = "Registro completado"; // Muestra un mensaje de éxito en el elemento 'statusRegister'.
                    new User(user.id, user.name, user.email, user.password); // Crea un nuevo objeto 'User' con los datos del obtenidos por el servidor.
                    initSession(user); //Inicia sesión con el usuario obtenido por el servidor tras crearlo
                })
            } else {
                alertShow("Error!", "Usuario no registrado, vuelva a validar los campos", "error");
            }
        })
        
        
    } else if (!statusInput) { // Si alguno de los campos del formulario está vacío.
        statusRegister.textContent = "Complete los campos señalados"; // Muestra un mensaje de error indicando que faltan campos por completar.
    } else if (!statusPassword) { // Si las contraseñas no coinciden.
        statusRegister.textContent = "Las contraseñas no coinciden"; // Muestra un mensaje de error indicando que las contraseñas no coinciden.
    }

    // Limpia el mensaje de estado después de 3 segundos para que no se quede visible.
    setTimeout(() => {
        statusRegister.textContent = "";
    }, 3000); // El mensaje de estado desaparece después de 3 segundos.

    function statusCategory(category){
        if(category == null || category == []){
            return true
        }

        return false
    }
});

// Llama a la función closeloading para cerrar el loading (posiblemente un spinner o mensaje de carga).
closeloading();


//Carga de datos de sesión:
//Carga los datos de usuario y transacciones almacenados en la sesión utilizando las funciones User.loadDataSession() y Transaccion.loadDataSession().
//Definición de variables:
//Se asignan a variables las referencias de los// inputs del formulario de registro (nombre, email, contraseña, y confirmación de contraseña).
//Se obtiene la referencia del elemento que mostrará los mensajes de estado del registro.

//Evento de envío del formulario:
//Se configura un evento click para el botón de "submit" del formulario.
//El evento previene el comportamiento por defecto de recargar la página.

//Validación de campos del formulario:
//Se valida si todos los campos del formulario están completos usando la función completeInput().
//Se valida si las contraseñas coinciden utilizando la función confirmPassword().

//Manejo de mensajes de estado:
//Si todos los campos están completos y las contraseñas coinciden, se muestra un mensaje de "Registro completado".
//Si faltan campos por completar o las contraseñas no coinciden, se muestra un mensaje de error correspondiente.

//Inicio de sesión:
//Si la validación es exitosa, se crea un nuevo objeto User con los datos del formulario y se llama a initSession() para iniciar la sesión del usuario.

//Limpieza de mensajes de estado:
//Después de 3 segundos, se limpia el mensaje de estado mostrando el contenido vacío en el elemento correspondiente.

//Cierre del loading:
//Se llama a la función closeloading() para cerrar o detener cualquier animación o mensaje de carga que se haya mostrado previamente.
