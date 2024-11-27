import Transaccion from "../operation/Transaccion.js";
import Category from "../tag/Category.js";

// Clase que representa a un usuario en la aplicación.
export default class User {
    // Almacena los datos de todos los usuarios.
    static userData = []; 
    // Contador para asignar un ID único a cada usuario.
    static counterUser = 0; 

    // Constructor de la clase User.
    constructor(id, name, email, password) {
        this.id = id; // Asigna un ID único al usuario.
        this.name = name; // Asigna el nombre del usuario.
        this.email = email; // Asigna el correo del usuario.
        this.password = password; // Asigna la contraseña del usuario.
        this.transactions = new Transaccion(); // Crea una nueva instancia de transacciones.
        this.categories = new Category(null, this.id); // Crea una nueva instancia de categorías.
        User.userData.push(this); // Agrega el usuario a la lista de usuarios.
        User.saveDataSession(); // Guarda la sesión del usuario.
    }

    // Métodos para obtener los atributos del usuario.
    getId() { return this.id; }
    getName() { return this.name; }
    getEmail() { return this.email; }
    getPassword() { return this.password; }
    getTransactions() { return this.transactions; }
    getCategories() { return this.categories; }

    // Método estático para obtener todos los usuarios.
    static getUserData() { return User.userData; }

    // Métodos para establecer los atributos del usuario.
    setId(id) { this.id = id; User.saveDataSession()}
    setName(name) { this.name = name; User.saveDataSession()}
    setEmail(email) { this.email = email; User.saveDataSession()}
    setPassword(password) { this.password = password; User.saveDataSession()}

    // Método estático para guardar los datos del usuario en sessionStorage.
    static saveDataSession() {
        sessionStorage.setItem("user", JSON.stringify(User.getUserData()));
        //Guarda en sessionStorage la base de datos de los usuarios (userData) cuando haya modificaciones en esta (crear, modificar o eliminar un usuario). Esto con el fin de conservar los valores que se hayan almacenado en la base de datos para poder utilizarlos en una nueva página.
    }

    // Método estático para cargar los datos del usuario desde sessionStorage.
    static loadDataSession() {
        let data = JSON.parse(sessionStorage.getItem("user")); // Recupera los datos del sessionStorage.
        for (let i = 0; i < data.length; i++) {
            new User(data[i].id, data[i].name, data[i].email, "*"); // Crea instancias de usuario.
        }
        
        //Carga en la base de datos (userData) el elemento almacenado en sessionStorage (gestionado por saveDataSession). Esto con el fin de entregar a la base de datos todos los valores que fueron añadidos a la base antes de recargar la pagina, esto permite a la base de datos mantenerse actualizada constantemente
        //Función que reconstruye una instancia después de ser transformada nuevamente a su valor original (JSON.parse). Esto debido a que las instancias se encontraban almacenadas en formato JSON (JSON.stringify)
        //JSON transforma la base de datos en una cadena de caracteres para que sessionStorage pueda almacenarla y al transformarla nuevamente a su valor original (arreglo), los objetos no conservarán sus métodos de clase ya que se pierde la instancia del objeto al momento de la conversion al intentar almacenar la base de datos en sessionStorage
    }

    // Método estático para validar las credenciales del usuario.
    static validateUser(email, password) {
        for (let i = 0; i < User.userData.length; i++) {
            if (User.userData[i].email == email && User.userData[i].password == password) {
                return User.userData[i]; // Devuelve el usuario encontrado.
            }
        }
        return false; // Devuelve false si no se encontró el usuario.
    }

    // Método para imprimir los datos de todos los usuarios en la consola.
    static printUserData() {
        console.log("Lista de usuarios");
        for (let i = 0; i < User.userData.length; i++) {
            console.log(User.userData[i]);
        }
    }

    // Método para calcular el balance de las transacciones del usuario.
    getBalance(transacciones) {
        let contador = 0; // Reinicia el contador.
        for (const objeto of transacciones) {
            contador += +objeto.value; // Suma los valores de las transacciones.
        }
        return contador
    }
}
