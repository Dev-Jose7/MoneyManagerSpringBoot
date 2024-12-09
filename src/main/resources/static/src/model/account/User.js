import { alertShow } from "../../../assets/js/util.js";
import { receiveData } from "../../controller/api.js";
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
    setId(id) { this.id = id; }
    setName(name) { this.name = name; }
    setEmail(email) { this.email = email; }
    setPassword(password) { this.password = password; }

    // Método estático para obtener los datos del usuario al servidor y cargarlos al sessionStorage.
    static loadDataSession() {
        return new Promise(resolve => {
            let user = JSON.parse(sessionStorage.getItem("user"))
            receiveData("GET", `users/${user[0].id}`)
                .then(response => {
                    if(response.ok){
                        response.json().then(account => {
                            // Guarda los datos a sessionStorage.
                            sessionStorage.setItem("user", JSON.stringify([{ id: account.id, name: account.name, email: account.email}]))
                            new User(account.id, account.name, account.email, "*"); // Crea instancias de usuario.
                            resolve();
                        })
                    }
                })
                .catch(error => error)
        })
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
