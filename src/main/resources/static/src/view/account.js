import { alertConfirm, logout, menuButton, modalCancel, printCategory, printNameUser, updateListUser, user } from "../../assets/js/panel.js";
import { alertShow, completeInput, confirmPassword, textCurrency } from "../../assets/js/util.js";
import { getData, receiveData, sendData } from "../controller/api.js";
import Category from "../model/tag/Category.js";

// Variable global que indica si el usuario está en la página de la cuenta.
let page = document.location.href;
export let statusAccount = false;

// Este evento se ejecuta cuando el DOM ha sido completamente cargado.
document.addEventListener("DOMContentLoaded", function(){
    // Verifica si la URL contiene "account", lo que significa que estamos en la página de la cuenta.
    if(page.includes("account")){
        statusAccount = true;

        // Variables para los elementos DOM de la página de la cuenta.
        let tagTarget = ""; // Almacena el nombre de la categoría seleccionada para modificar o eliminar.
        let name = document.getElementById("name"); // Elemento para mostrar el nombre del usuario.
        let email = document.getElementById("email"); // Elemento para mostrar el correo del usuario.
        let password = document.getElementById("password"); // Elemento para mostrar la contraseña del usuario.

        // Variables para los campos de entrada donde el usuario puede actualizar sus datos.
        let nameUpdate = document.getElementById("nameUpdate");
        let emailUpdate = document.getElementById("emailUpdate");
        let passwordUpdate = document.getElementById("passwordUpdate");
        let passwordConfirm = document.getElementById("passwordConfirm");
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

        // Configura los valores por defecto de los campos de actualización con los datos del usuario.
        nameUpdate.placeholder = user.getName();
        emailUpdate.placeholder = user.getEmail();
        
        // Muestra las estadísticas de ingresos y gastos del usuario.
        document.getElementById("cantIngreso").textContent = user.getTransactions().getListIngreso().length;
        document.getElementById("cantGasto").textContent = user.getTransactions().getListGasto().length;
        document.getElementById("cantTransaccion").textContent = user.getTransactions().getListTransaction().length;
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
                        () => getData(receiveData("DELETE", `categories/${Category.getIdByTag(tagTarget)}`))
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

        // Evento para actualizar los datos del usuario.
        document.getElementById("updateUser").addEventListener("click", function(e){
            e.preventDefault(); // Evita que el formulario se envíe.

            let complete = false; // Variable para indicar si los cambios fueron exitosos.

            // Si se ingresó un nuevo nombre, actualiza el nombre del usuario.
            if(nameUpdate.value != ""){
                if(nameUpdate.value != user.getName()){
                    user.setName(nameUpdate.value);
                    alertShow("Hecho!", "Su nombre ha sido cambiado", "success");
                    complete = true;
                } else {
                    alertShow("Error!", "El nombre debe ser diferente al actual", "warning");
                    nameUpdate.value = "";
                    complete = false;
                }
            }

            // Si se ingresó un nuevo correo, actualiza el correo del usuario.
            if(emailUpdate.value != ""){
                if(emailUpdate.value != user.getEmail()){
                    user.setEmail(emailUpdate.value);
                    alertShow("Hecho!", "Su correo ha sido cambiado", "success");
                    complete = true;
                } else {
                    alertShow("Error!", "El correo debe ser diferente al actual", "warning");
                    emailUpdate.value = "";
                    complete = false;
                }
            }

            // Si se ingresó una nueva contraseña y su confirmación, valida que coincidan y actualiza la contraseña.
            if(passwordUpdate.value != "" && passwordConfirm.value != ""){
                if(confirmPassword(passwordUpdate.value, passwordConfirm.value)){ // Función que valida si las contraseñas coinciden.
                    user.setPassword(passwordUpdate.value);
                    alertShow("Hecho!", "La contraseña ha sido cambiada", "success");
                    complete = true;
                } else {
                    alertShow("Error!", "Las contraseñas no coinciden", "warning");
                    complete = false;
                }
            }
            
            // Si hubo cambios, cierra el modal de edición y actualiza los datos del usuario en pantalla.
            
            if(complete){
                getData(sendData("PUT", `users/${user.getId()}`, {
                    name: nameUpdate.value != "" ? nameUpdate.value : user.getName(),
                    email: emailUpdate.value != "" ? emailUpdate.value : user.getEmail(),
                    password: passwordUpdate.value != "" ? passwordUpdate.value : user.getPassword()
                    
                }));
                document.getElementById("editModal").style.display = "none";
                printDataUser();
            } 
        });

        // Evento para añadir una nueva categoría.
        document.getElementById("addTag").addEventListener("click", function(e){
            e.preventDefault(); // Evita que el formulario se envíe.
            // Verifica que el campo de entrada no esté vacío.
            if(completeInput([...document.getElementById("addTagModal").querySelectorAll("input")])){
                // Verifica si la categoría no existe ya en la lista.
                if(!user.getCategories().validateCategory(tagInput.value)){
                    getData(sendData("POST", "categories", {
                        user: { id: user.getId() },
                        tag: tagInput.value

                    })).then(response => {
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
                    console.log(Category.getIdByTag(tagTarget))
                    getData(sendData("PUT", `categories/${Category.getIdByTag(tagTarget)}`, {
                        user: { id: user.getId() },
                        tag: updateTagInput.value

                    })).then(response => {
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
            getData(receiveData("GET", `users/email/${user.getEmail()}`))
                .then(response => response.json())
                .then(data => user.setPassword(data.password))
        }
    }
});

//Variables de Usuario: 
//Variables como name, email, y password se utilizan para mostrar la información del usuario y actualizarlas cuando se cambian en el formulario de configuración.
//Eventos DOM: Se registran varios eventos que permiten la interacción del usuario con los modales para cambiar datos (como nombre, correo, etc.) y gestionar categorías.

//Funciones Dinámicas:
//alertShow: Muestra alertas informativas al usuario.
//printCategory, printNameUser: Imprimen el contenido dinámico de la página, como categorías y nombre de usuario para ello se utiliza updateListUser para actualizar las listas de datos del usuario.
//user.getTransactions(), user.getCategories(): Métodos para obtener los datos del usuario relacionados con transacciones y categorías.