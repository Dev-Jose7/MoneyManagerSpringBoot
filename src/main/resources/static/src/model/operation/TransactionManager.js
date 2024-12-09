import Category from "../tag/Category.js";
import Transaccion from "./Transaccion.js";

// Clase que gestiona las transacciones.
export default class TransactionManager {

    // Método para crear una nueva transacción.
    createTransaction(user, tipo, valor, descripcion, categoria, fecha) {
        new Transaccion(user, tipo, valor, descripcion, categoria, fecha); // Crea una nueva transacción.
        console.log("Base de datos: ", Transaccion.getTransactionsUser()); // Muestra las transacciones almacenadas.
    }

    // Método para imprimir transacciones en el contenedor y modo indicado.
    printTransaction(container, vector, pagination, counter) {
        // Agrega cada transacción al contenedor de acuerdo a la cantidad de transacciones que se desean imprimir.
        if(pagination){
            let elemento = `
            <div class="transaccion list" data-tipo="${vector[counter].type}" data-id="${vector[counter].id}">
            ${container.id == "campoTransacciones" ? `<h4>${vector[counter].type}</h4>` : ""}
                <h4 class="titleCategory" title="${vector[counter].category.tag}">${vector[counter].category.tag}</h4>
                <p class="titleValue">${vector[counter].value}</p>
                <p class="titleDate">${vector[counter].date}</p>
                <div>
                ${vector[counter].getDescription() != "" ? `<i class="fas fa-sticky-note fa-lg nota" title="Descripción"></i>` : ""}
                ${container.id != "modal-section" ? `<i class="fas fa-edit fa-lg modificar" title="Editar"></i> <i class="fas fa-trash fa-lg eliminar" title="Eliminar"></i>` : ""}
                </div>
                
            </div>`;
            return elemento;
        } 
        
        if(!pagination){
            container.innerHTML = "";
            for (let i = 0; i < vector.length; i++) {
                let elemento = `
                    <div class="transaccion" data-tipo="${vector[i].tipo}" data-id="${vector[i].id}">
                    ${container.id == "campoTransacciones" ? `<h4>${vector[i].tipo}</h4>` : ""}
                        <h4 class="titleCategory" title="${vector[i].categoria}">${vector[i].categoria}</h4>
                        <p class="titleValue">${vector[i].valor}</p>
                        <p class="titleDate">${vector[i].fecha}</p>
                        <div>
                            <i class="fas fa-sticky-note fa-lg nota" title="Descripción"></i>
                            <i class="fas fa-edit fa-lg modificar" title="Editar"></i>
                            <i class="fas fa-trash fa-lg eliminar" title="Eliminar"></i>
                        </div>
                    </div>`;
                container.innerHTML += elemento;
            }
        }
    }

    // Método para eliminar una transacción.
    deleteTransaction(id, transaction) {
        transaction.remove(); // Elimina el elemento del DOM.
        let indice = Transaccion.getTransactionsUser().findIndex(transaccion => transaccion.id == id); // Busca el índice de la transacción.

        if (indice !== -1) {
            Transaccion.getTransactionsUser().splice(indice, 1); // Elimina la transacción del arreglo.
            console.log("Eliminada");
        }
    }

    // Método para actualizar una transacción existente.
    updateTransaction(id) {
        let targetTransaction = Transaccion.getTransactionsUser().find(transaction => transaction.id == id);
        // Actualiza los valores de la transacción existente en el arreglo.
        targetTransaction.type = tipo.value;
        targetTransaction.value = +valor.value;
        targetTransaction.description = descripcion.value;
        targetTransaction.date = fecha.value;
        console.log(targetTransaction.category)
        targetTransaction.category.id = document.getElementById("categoria").value;
        targetTransaction.category.tag = Category.getTagById(targetTransaction.category.id)

        console.log(document.getElementById("categoria").value)

        console.log(tipo.value, +valor.value, descripcion.value, fecha.value, categoria.value)
        
        console.log(Transaccion.getTransactionsUser())
    }

    //Método que se utiliza para actualizar una categoria que fue modificada de la lista de categorias a todas las transacciones que la usan
    updateTagTransaction(oldTag, newTag){
        Transaccion.getTransactionsUser().forEach((transaction, index) => {
            if(transaction.category.tag == oldTag){
                transaction.category.tag = newTag;
            }
        });
    }
}
