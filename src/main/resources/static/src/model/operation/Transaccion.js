import TransactionManager from "./TransactionManager.js";
import TransactionFilter from "./TransactionFilter.js";

// Clase que representa una transacción financiera.
export default class Transaccion {
    // Contador para asignar un ID único a cada transacción.
    static contadorId = 0;
    // Almacena todas las transacciones creadas.
    static transactionData = [];

    // Constructor de la clase Transaccion.
    //Este constructor esta hecho en base a una condicioón, esto con el fin de poder declarar un contructor vacio.
    //El constructor define a los parametros con valores fijos, es decir cada parametro tiene un valor null
    //Bajo una condición se determina entonces si el valor de los parametros en realidad es null, si todos los parametros son verdaderos, es decir, tienen valores diferentes a null o también 0, "" ó false entonces se procederá a invocar el constructor con argumentos
    //En cambio si la condición es falsa, es decir alguno o todos los valores son null, se procederá a invocar el constructor sin argumentos (vacío).
    //Se crea una condición la cual hace que pasar argumentos a los parametros sea mas flexible ya que existe la posiblidad de que alguno de los parametros reciba valores con estados false, como 0 ó "" (cadena vacía), los cuales por funcionamiento son necesarios pasarlos como argumento.
    //Si la condición indica que todos los valores deben ser verdaderos: if(user && tipo && valor && descripcion && categoria && fecha), al pasar valores con estados false, como 0, "" ó false, hara que la condición no se cumpla, por que al menos uno de ellos es false cuando se requiere que todos sean true
    //Ejemplo, si se desea crear ó actualizar una transacción y su descripción se deja vacia (cadena vacia ""), entonces la transacción tendrá un comportamiento mal programado, haciendo que no se imprima al crearse o esta se borre al actualizar la página despues de actualizarla ya que no se pudo crear dicha instancia
    constructor(id = null, tipo = null, valor = null, descripcion = null, categoria = null, fecha = null) {
        const status = id !== null && tipo !== null && valor !== null && descripcion !== null && categoria !== null && fecha !== null;
        
        if (status) {
            this.id = id// Asigna un ID único a la transacción.
            this.type = tipo; // Asigna el tipo de transacción (Ingreso o Gasto).
            this.value = valor; // Asigna el valor de la transacción.
            this.description = descripcion; // Asigna la descripción de la transacción.
            this.category = categoria; // Asigna la categoría de la transacción.
            this.date = fecha; // Asigna la fecha de la transacción.
            Transaccion.transactionData.push(this); // Agrega la transacción al arreglo global.
            Transaccion.saveDataSession(); // Guarda la sesión de las transacciones.
        } else {
            this.listTransactions = []; // Lista de transacciones del usuario.
            this.listFilter = []; // Lista filtrada de transacciones.
            this.ingresos = []; // Lista de ingresos.
            this.gastos = []; // Lista de gastos.
            this.manager1 = new TransactionManager(); // Crea un gestor de transacciones.
            this.filter2 = new TransactionFilter(); // Crea un filtro de transacciones.
        }
    }

    // Método estático para guardar las transacciones en sessionStorage.
    static saveDataSession() {
        sessionStorage.setItem("transactions", JSON.stringify(Transaccion.getTransactionsUser()));
        //Guarda en sessionStorage la base de datos de las transacciones (transactionData) cuando haya modificaciones en esta (crear, modificar o eliminar una transacción). Esto con el fin de conservar los valores que se hayan almacenado en la base de datos para poder utilizarlos en una nueva página.
    }

    // Método estático para cargar las transacciones desde sessionStorage.
    static loadDataSession() {
        let data = JSON.parse(sessionStorage.getItem("transactions"));
        for (let i = 0; i < data.length; i++) {
            new Transaccion(data[i].id, data[i].type, data[i].value, data[i].description, data[i].category, data[i].date)
        }

        //Carga en la base de datos (transactionData) el elemento almacenado en sessionStorage (gestionado por saveDataSession). Esto con el fin de entregar a la base de datos todos los valores que fueron añadidos a la esta antes de recargar la pagina, esto permite a la base de datos mantenerse actualizada constantemente
        //Función que reconstruye una instancia después de ser transformada nuevamente a su valor original (JSON.parse). Esto debido a que las instancias se encontraban almacenadas en formato JSON (JSON.stringify)
        //JSON transforma la base de datos en una cadena de caracteres para que sessionStorage pueda almacenarla y al transformarla nuevamente a su valor original (arreglo de objetos), los objetos no conservarán sus métodos de clase ya que se pierde la instancia del objeto al momento de la conversion al intentar almacenar la base de datos en sessionStorage
    }

    // Métodos para obtener los atributos de la transacción.
    getId() { return this.id; }
    getType() { return this.type; }
    getValue() { return this.value; }
    getCategory() { return this.category; }
    getDescription() {return this.description}
    getDate() { return this.date; }
    getListTransaction() { return this.listTransactions; }
    getManager() { return this.manager1; }
    getFilter() { return this.filter2; }
    getListIngreso() { return this.ingresos; }
    getListGasto() { return this.gastos; }
    getListFilter() {return this.listFilter}

    // Método estático para obtener todas las transacciones.
    static getTransactionsUser() { return Transaccion.transactionData; }

    // Métodos para establecer los atributos de la transacción.
    setId(id) { this.id = id; }
    setDescripcion(descripcion) { this.descripcion = descripcion; }
    setValor(valor) { this.value = valor; }

    //Busca una transaccion por su id
    findTransaction(id){
        return Transaccion.transactionData.find(transaction => transaction.id == id);
    }

    // Método para calcular el total de ingresos.
    totalIngreso() {
        let contador = 0;
        this.ingresos.forEach(transaction => {
            contador += transaction.value;
        });
        return contador;
    }

    // Método para calcular el total de gastos.
    totalGasto() {
        let contador = 0;
        this.gastos.forEach(transaction => {
            contador += transaction.value;
        });
        return contador;
    }

    // Método para actualizar la lista de transacciones del usuario.
    updateListUser() {
        this.ingresos = Transaccion.transactionData.filter((transaction) => transaction.type == "Ingreso");
        this.gastos = Transaccion.transactionData.filter((transaction) => transaction.type == "Gasto");
    }

    // Método para actualizar la lista de transacciones filtradas.
    updateListFilter(dataFilter) {
        this.listFilter = dataFilter;
    }
}
