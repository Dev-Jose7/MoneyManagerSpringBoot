import { closeloading, endSession, findUser } from "../../assets/js/util.js";
import User from "../model/account/User.js";



let user = {}; // Variable que almacenará el objeto de usuario.
let url = document.location.href; // Obtiene la URL actual de la página.
let page = url.substring(url.lastIndexOf('/') + 1); // Extrae el nombre de la página actual desde la URL.

if(sessionStorage.getItem("user")){
    await User.loadDataSession(); //Carga el usuario al arreglo estatico de la clase User si existe un usuario en sessionStorage
}

// Lógica específica para la página index.html o la página principal ("/").
if(page == "index.html" || window.location.pathname == "/"){
    menuSessionUser("./assets/html/dashboard.html"); // Verifica si hay un usuario logueado y ajusta el menú.
    backgroundImage(); // Función que genera imágenes de fondo en el encabezado de la página principal.

    // Función para cambiar el fondo del encabezado en intervalos.
    function backgroundImage(){
        let contador = 1; // Contador para ir cambiando las imágenes de fondo.
        setInterval(() => {
            contador++; // Incrementa el contador cada 6 segundos.

            const fondo = new Image(); // Crea una nueva imagen.
            fondo.src = `./assets/img/banner${contador}.jpg`; // Precarga la imagen de fondo según el contador.

            // Cuando la imagen se carga, se cambia el fondo del encabezado.
            fondo.addEventListener("load", function(){
                document.querySelector(".encabezado__banner").style.backgroundImage = `url('${fondo.src}')`;
            });

            // Vuelve al primer banner después de la imagen 3.
            if(contador == 4){
                contador = 0; // Resetea el contador para que vuelva a comenzar.
            }
            
        }, 6000); // Cambia la imagen cada 6 segundos.
    }
            
}

// Lógica específica para la página "nosotros.html" o "nosotros".
if(page == "nosotros.html" || page == "nosotros"){
    menuSessionUser("./dashboard.html", "./login.html"); // Muestra el menú con la opción de Dashboard o login dependiendo del estado de sesión.
}

// Función para manejar el estado del menú y la sesión del usuario.
function menuSessionUser(dashboard){
    // Verifica si hay un usuario logueado en sessionStorage.
    if(sessionStorage.getItem("user")){ 
        user = findUser(); // Busca el usuario en el sessionStorage.

        // Si hay un usuario logueado, ocultar la sección de "usuario no logeado" y mostrar el nombre de usuario.
        document.querySelector(".encabezado__usuario").style.display = "none"; // Oculta el área de usuario no logeado.
        if(window.innerWidth > 768){
            // Si el ancho de la ventana es mayor a 768px, oculta el botón del menú en el dispositivo de escritorio.
            document.querySelector(".btn-menu").style.display = "none";
        } 
        // Modifica el menú de la barra superior para mostrar el nombre del usuario y el acceso al dashboard.
        document.getElementById("barra").innerHTML += `
            <div class="header-right">
                <button class="btn-icon" title="Dashboard" id="dashboard">
                    <i class="fas fa-user-circle fa-lg"></i>
                    <p>${user.getName().split(" ")[0]}</p> <!-- Muestra el nombre del usuario logueado. -->
                </button>
            </div>`
    }

    // Agrega un evento al botón de "Dashboard" para redirigir a la página correspondiente.
    if(document.querySelector(".header-right")){
        document.getElementById("dashboard").addEventListener("click", function(){
            window.location.href = dashboard; // Redirige al Dashboard o al Login según el caso.
        });
    }
}

// Lógica para el menú móvil (desplegar el sidebar).
document.getElementById("menuButton").addEventListener("click", function(){ 
    const sidebar = document.getElementById("menu"); // Obtiene el sidebar del menú.

    // Si el sidebar está oculto o en estado de "none", se muestra y agrega una animación.
    if(sidebar.style.display == "" || sidebar.style.display == "none"){
        sidebar.style.display = "flex"; // Muestra el sidebar.

        // Agrega la clase "effect" después de un pequeño retraso para animar la transición.
        setTimeout(() => {
            sidebar.classList.add("effect");
        }, 10);
    } else if(sidebar.style.display == "flex"){
        // Si el sidebar ya está visible, se remueve la animación.
        sidebar.classList.remove("effect");

        // Al finalizar la animación, se oculta el sidebar.
        sidebar.addEventListener('transitionend', function() {
            sidebar.style.display = ""; // Oculta completamente después de la transición.
        }, { once: true }); // Solo ejecuta esta acción una vez.
    }
});

// Cierra la animación de loading después de que el contenido haya cargado.
closeloading();

//Variables Iniciales:
//user: Se inicializa como un objeto vacío, que más tarde se llenará con los datos del usuario si está logueado.
//url: La URL actual de la página, que se utiliza para determinar qué página está cargando.
//page: Obtiene el nombre de la página desde la URL para determinar la lógica a seguir.

//Manejo de Sesión:
//Si no hay datos de base de datos en el sessionStorage, se crean instancias de prueba (función instanceTest()).
//Si los datos existen, se cargan con User.loadDataSession().
//En las páginas específicas como index.html, nosotros.html, el menú de sesión de usuario se configura con diferentes comportamientos según el estado de la sesión.

//Lógica para el Fondo de la Página:
//En la página principal (index.html o /), la función backgroundImage() se encarga de cambiar el fondo del encabezado a intervalos de 6 segundos, utilizando imágenes precargadas.

//Menú de Usuario y Redirección:
//Si hay un usuario logueado en sessionStorage, se modifica el menú para mostrar el nombre del usuario y un botón de acceso al Dashboard.
//La redirección al Dashboard o login depende del estado de sesión y se maneja con menuSessionUser().

//Manejo del Menú Móvil:
//Se agrega una funcionalidad de apertura y cierre del sidebar (menú lateral) cuando el usuario hace clic en el botón del menú (menuButton).
//Se utiliza una transición para mostrar y ocultar el menú lateral con la clase effect.

//Cierre de la Animación de Carga:
//La función closeloading() es llamada al final para ocultar cualquier indicador de carga cuando la página ha terminado de cargarse.
//Este código se encarga principalmente de gestionar la interfaz de usuario dependiendo del estado de sesión (usuario logueado o no), proporcionar una experiencia visual dinámica con cambios de fondo, y facilitar la navegación en dispositivos móviles.