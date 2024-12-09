import { alertConfirm, logout, menuButton, modalCancel, printCategory, printNameUser, updateListUser, user } from "../../assets/js/panel.js";
import { alertShow, completeInput, confirmPassword, textCurrency } from "../../assets/js/util.js";
import { receiveData, sendData } from "../controller/api.js";
import Transaccion from "../model/operation/Transaccion.js";
import Category from "../model/tag/Category.js";

// Variable global que indica si el usuario está en la página de la cuenta.
let page = document.location.href;
export let statusAccount = false;


// Verifica si la URL contiene "account", lo que significa que estamos en la página de la cuenta.
if(page.includes("account")){
    statusAccount = true;

    // Variables para los elementos DOM de la página de la cuenta.
    let tagTarget = ""; // Almacena el nombre de la categoría seleccionada para modificar o eliminar.
    let name = document.getElementById("name"); // Elemento para mostrar el nombre del usuario.
    let email = document.getElementById("email"); // Elemento para mostrar el correo del usuario.
    let password = document.getElementById("password"); // Elemento para mostrar la contraseña del usuario.

    // Variables para los campos de entrada donde el usuario puede actualizar sus datos.
    let buttonName = document.getElementById("buttonName");
    let buttonEmail = document.getElementById("buttonEmail");
    let buttonPassword = document.getElementById("buttonPassword");
    let tagInput = document.getElementById("tagInput");
    let updateTagInput = document.getElementById("updateTagInput");
    
    // Llama a las funciones principales del dashboard para mostrar los elementos del menú y las categorías.
    menuButton();
    printNameUser();
    updateListUser();
    printCategory();
    modalCancel();
    logout();
    
    // Inicializa el nombre y correo del usuario en el apartado de datos personales.
    printDataUser();
    printPassword();
    
    // Muestra las estadísticas de ingresos y gastos del usuario.
    document.getElementById("cantIngreso").textContent = user.getTransactions().getListIngreso().length;
    document.getElementById("cantGasto").textContent = user.getTransactions().getListGasto().length;
    document.getElementById("cantTransaccion").textContent = Transaccion.getTransactionsUser().length
    document.getElementById("totalIngreso").textContent = textCurrency(user.getTransactions().totalIngreso());
    document.getElementById("totalGasto").textContent = textCurrency(user.getTransactions().totalGasto());
    document.getElementById("saldoNeto").textContent = textCurrency(user.getTransactions().totalIngreso() - user.getTransactions().totalGasto());

    // Evento para mostrar u ocultar la contraseña del usuario.
    document.getElementById("showPassword").addEventListener("click", function(e) {
        if (e.target.textContent == "Ver contraseña") {
            password.textContent = user.getPassword() // Muestra la contraseña real.
            e.target.textContent = "Ocultar pass"; // Cambia el texto del botón.
        } else if (e.target.textContent == "Ocultar pass") {
            password.textContent = "********"; // Oculta la contraseña con asteriscos.
            e.target.textContent = "Ver contraseña"; // Cambia el texto del botón.
        }
    });

    // Evento para mostrar el modal de actualización de datos del usuario.
    document.getElementById("updateData").addEventListener("click", function(e) {
        document.getElementById("editModal").style.display = "flex"; // Muestra el modal de edición.
        firstInput();
    });

    // Evento para mostrar el modal para añadir una nueva categoría.
    document.getElementById("addCategory").addEventListener("click", function(){
        document.getElementById("addTagModal").style.display = "flex"; // Muestra el modal de añadir categoría.
    });

    // Evento para actualizar o eliminar una categoría.
    document.getElementById("categoria").addEventListener("click", function(e){
        if (e.target.tagName == "I") { // Verifica si el clic fue sobre un icono dentro de la categoría.
            let button = e.target; // Obtiene el botón que fue clickeado.
            tagTarget = button.closest(".list").querySelector("h4").textContent; // Obtiene el nombre de la categoría seleccionada.

            if (button.classList.contains("modificar")) { // Si el botón tiene la clase "modificar", actualiza la categoría.
                document.getElementById("editTagModal").style.display = "flex"; // Muestra el modal para editar categoría.
                updateTagInput.placeholder = tagTarget; // Preestablece el nombre de la categoría seleccionada como placeholder.
            }
        
            if (button.classList.contains("eliminar")) { // Si el botón tiene la clase "eliminar", elimina la categoría.
                let method = [
                    () => receiveData("DELETE", `categories/${Category.getIdByTag(tagTarget)}`)
                    .then(response => {
                        if(response.ok){
                            user.getCategories().deleteCategory(tagTarget), // Método para eliminar la categoría.
                            printCategory(), // Método para volver a renderizar la lista de categorías.
                            alertShow("Eliminada", "Categoria eliminada con exito", "success")
                        } else {
                            alertShow("Error", "Se ha producido un error, vuelve a intentarlo", "warning")
                        }
                    })
                ]
                // Muestra un alert de confirmación para eliminar la categoría.
                alertConfirm('Eliminar', ' ', 'deleteCategory', method);
            }
        }
    });

    // Agregamos el evento "click" al botón que se utiliza para actualizar el nombre del usuario.
    buttonName.addEventListener("click", function() {
        firstInput();  // Llamamos a la función para iniciar la actualización del nombre.
    });

    // Agregamos el evento "click" al botón para actualizar el correo del usuario.
    buttonEmail.addEventListener("click", function() {
        updateModalTitle(buttonEmail);  // Actualizamos el título del modal según el botón seleccionado.
        // Llamamos a la función inputUpdate con los parámetros necesarios para actualizar el correo electrónico.
        inputUpdate("inputEmail", "updateEmail", "email", user.getEmail, user.setEmail, "Su correo ha sido actualizado", "El correo debe ser diferente al actual");
    });

    // Agregamos el evento "click" al botón para actualizar la contraseña del usuario.
    buttonPassword.addEventListener("click", function() {
        updateModalTitle(buttonPassword);  // Actualizamos el título del modal según el botón seleccionado.
        // Llamamos a la función inputUpdate con los parámetros necesarios para actualizar la contraseña.
        inputUpdate("inputPassword", "updatePassword", "password", user.getPassword, user.setPassword, "Su contraseña ha sido actualizada", "La contraseña debe ser diferente a la actual");
    });

    // Evento para añadir una nueva categoría.
    document.getElementById("addTag").addEventListener("click", function(e){
        e.preventDefault(); // Evita que el formulario se envíe.
        // Verifica que el campo de entrada no esté vacío.
        if(completeInput([...document.getElementById("addTagModal").querySelectorAll("input")])){
            // Verifica si la categoría no existe ya en la lista.
            if(!user.getCategories().validateCategory(tagInput.value)){
                sendData("POST", "categories", {
                    user: { id: user.getId() },
                    tag: tagInput.value

                }).then(response => {
                    if(response.ok){
                        response.json().then(data => { 
                            // Añade la nueva categoría.
                            user.getCategories().addCategory(data.id, data.tag) 
                            printCategory(); // Vuelve a renderizar la lista de categorías.
                            alertShow("Hecho!", "La categoria ha sido añadida", "success");
                        }) 
                        
                    } else {
                        alertShow("Error", "Se ha producido un error, vuelve a intentarlo", "warning");
                    }
                })
                
            } else {
                alertShow("Error!", "Esta categoria ya se encuentra registrada", "warning");
            }
        } else {
            alertShow("Error!", "Debes darle un nombre a la categoria", "warning");
        }
    });

    // Evento para actualizar el nombre de una categoría existente.
    document.getElementById("updateTag").addEventListener("click", function(e){
        e.preventDefault(); // Evita que el formulario se envíe.
        // Verifica que el campo de entrada no esté vacío.
        if(completeInput([...document.getElementById("editTagModal").querySelectorAll("input")])){
            // Verifica si la nueva categoría no está registrada.
            if(!user.getCategories().validateCategory(updateTagInput.value)){
                sendData("PUT", `categories/${Category.getIdByTag(tagTarget)}`, {
                    user: { id: user.getId() },
                    tag: updateTagInput.value

                }).then(response => {
                    if(response.ok){
                        response.json().then(data => {
                            console.log(data)
                            user.getCategories().updateCategory(tagTarget, updateTagInput.value); // Actualiza el nombre de la categoría.
                            // Actualiza la lista de categorías del usuario y todas las transacciones asociadas.
                            user.getTransactions().getManager().updateTagTransaction(tagTarget, updateTagInput.value); // Actualiza las transacciones con la categoría antigua.
                            printCategory(); // Vuelve a renderizar la lista de categorías.
                            alertShow("Hecho!", "Categoria actualizada", "success");
                        })
                        
                    } else {
                        alertShow("Error", "Se ha producido un error, vuelve a intentarlo", "warning");
                    }
                })
                
            } else {
                alertShow("Error!", "Esta categoria ya se encuentra registrada", "warning");
            }

        } else {
            alertShow("Error!", "Debes darle un nombre a la categoria", "warning");
        }
    });
    
    //Función que imprime nombre de usuario y contraseña en el apartado de datos personales
    function printDataUser(){
        name.textContent = user.getName();
        email.textContent = user.getEmail();
    }

    // Función para obtener la contraseña del usuario
    function printPassword() {
        receiveData("GET", `users/email/${user.getEmail()}`)
            .then(response => response.json())
            .then(data => user.setPassword(data.password))
    }

    // Función principal que maneja la actualización de entradas en el modal.
    function inputUpdate(input, button, endpoint, getData, setData, success, error) {
        // Obtenemos el contenedor donde se insertará el nuevo HTML para la entrada.
        const container = document.getElementById("editModal").querySelector(".info-row");
        
        container.innerHTML = ""; // Limpiamos el contenido anterior del contenedor.

        // Generamos el HTML del formulario dependiendo si el input es de tipo contraseña o no.
        let elemento = 
        `<div class="info-group">
            <div class="info-group-input">
                ${input != "inputPassword" ? `<input id="${input}">` : `<input id="${input}" type="password" placeholder="Nueva contraseña"> <input id="passwordConfirm" type="password" placeholder="Confirmar contraseña">`}
                <button id="${button}" class="btn-add">Guardar</button>
            </div>
        </div>`;

        container.innerHTML = elemento; // Insertamos el HTML generado en el contenedor.

        // Obtenemos los elementos del botón y del campo de entrada.
        const update = document.getElementById(button);
        const data = document.getElementById(input);

        // Si el campo de entrada no es para una contraseña, se establece un valor por defecto.
        if (input != "inputPassword") {
            data.placeholder = getData.call(user);  // Asignamos el valor actual a "placeholder" usando el getter correspondiente.
        }

        // Añadimos un event listener al botón de guardar para manejar el evento click.
        update.addEventListener("click", function(e) {
            e.preventDefault();  // Prevenimos la acción predeterminada del botón (en este caso, el submit).

            // Verificamos que el campo no esté vacío y que el valor haya cambiado con respecto al valor actual.
            if (data.value != "" && data.value != getData.call(user)) {
                // Si el input es una contraseña, validamos las contraseñas y las actualizamos si coinciden.
                if (input == "inputPassword") {
                    if (confirmPassword(data.value, document.getElementById("passwordConfirm").value)) {
                        updateDataUser(endpoint, data.value, [() => setData.call(user, data.value)], success);
                    } else {
                        alertShow("Error!", "Las contraseñas no coinciden", "warning");  // Mostramos un mensaje de error si las contraseñas no coinciden.
                    }
                }

                // Si no es una contraseña, actualizamos directamente el valor usando el setter correspondiente.
                if (input != "inputPassword") {
                    updateDataUser(endpoint, data.value, [() => setData.call(user, data.value)], success);
                }
            } else if (data.value === getData.call(user)) {
                // Si el valor ingresado es el mismo que el actual, mostramos un mensaje de advertencia.
                alertShow("Error!", error, "warning");
            }
        });
    }

    // Función para actualizar el título del modal y destacar el botón seleccionado.
    function updateModalTitle(button) {
        // Removemos la clase "selection-title" de todos los elementos hijos del título del modal.
        [...document.querySelector(".modal-title").children].forEach(title => {
            title.classList.remove("selection-title");
        });

        // Añadimos la clase "selection-title" al botón que ha sido seleccionado.
        button.classList.add("selection-title");
    }

    // Función para manejar la actualización del nombre del usuario.
    function firstInput() {
        updateModalTitle(buttonName);  // Actualizamos el título del modal según el botón seleccionado.
        // Llamamos a la función inputUpdate con los parámetros necesarios para actualizar el nombre.
        inputUpdate("inputName", "updateName", "name", user.getName, user.setName, "Su nombre ha sido actualizado", "El nombre debe ser diferente al actual");
    }

    // Función para actualizar los datos del usuario
    function updateDataUser(url, input, method, message) {
        // Realiza una solicitud PATCH para actualizar parcialmente los datos del usuario
        sendData("PATCH", `users/${user.getId()}/${url}`, input)
            .then(response => {
                if (response.ok) {
                    method.forEach(func => func()); // Si la actualización fue exitosa, ejecuta el método correspondiente
                    printDataUser(); // Imprime los nuevos datos del usuario en el dashboard
                    alertShow("Hecho!", message, "success"); // Muestra un mensaje de éxito
                } else if (response.status == 406) {
                    // Si el correo ya está registrado, muestra un mensaje de error
                    alertShow("Error!", "Este correo ya se encuentra registrado, utilice uno válido.", "error");
                }
    
                // Asegúrate de que el modal se cierre solo después de que la actualización esté completada
                document.getElementById("editModal").style.display = "none";
            })
            .catch(err => {
                // Manejo de errores si la solicitud PATCH falla
                alertShow("Error!", "Hubo un problema al actualizar los datos. Intente nuevamente.", "error");
                console.error(err);
            });
    }
}

//Variables de Usuario: 
//Variables como name, email, y password se utilizan para mostrar la información del usuario y actualizarlas cuando se cambian en el formulario de configuración.
//Eventos DOM: Se registran varios eventos que permiten la interacción del usuario con los modales para cambiar datos (como nombre, correo, etc.) y gestionar categorías.

//Funciones Dinámicas:
//alertShow: Muestra alertas informativas al usuario.
//printCategory, printNameUser: Imprimen el contenido dinámico de la página, como categorías y nombre de usuario para ello se utiliza updateListUser para actualizar las listas de datos del usuario.
//user.getTransactions(), user.getCategories(): Métodos para obtener los datos del usuario relacionados con transacciones y categorías.