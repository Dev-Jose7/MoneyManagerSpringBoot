import { receiveData } from "../../controller/api.js";

// Clase que gestiona las categorías de transacciones.
export default class Category {
    static contadorId = 0; //Sirve para asignar id a las instancias
    static categoriesData = []; // Almacena todas las categorías.

    // Constructor de la clase Category.
    constructor(id = null, tag = null) {
        if (id && tag) { // Si se instancian con un tag y un usuario, se crea una categoría.
            this.id = id; //Crea id a la categoria de acuerdo al orden en el que se vayan creando
            this.tag = tag; // Asigna la etiqueta de la categoría.
            Category.categoriesData.push(this); // Agrega la categoría a la lista.
        } else if(!id && tag){}
    }

    // Método estático para obtener las categorías al servidor.
    static loadDataSession() {
        let user = JSON.parse(sessionStorage.getItem("user"));
        return new Promise(resolve => {
            receiveData("GET", `categories/user/${user[0].id}`)
                .then(response => {
                    if(response.ok){
                        response.json().then(categories => {
                            for (let i = 0; i < categories.length; i++) {
                                new Category(categories[i].id, categories[i].tag); // Crea instancias de categorías.
                            }
                            resolve();
                        })
                    }
                });
        });

    }

    static getCategoriesUser(){
        return Category.categoriesData
    }

    // Métodos para obtener los atributos de la categoría.
    getTag() { return this.tag; }
    getId() { return this.id; }
    getUserId() { return this.user; }

    static getTagById(id){
        if(id != "Categoría"){
            let tagName = "";
            Category.categoriesData.find(category => {
                if(category.id == id ){
                    tagName = category.tag;
                }
            })
            return tagName
        }
        return "Categoría"
        
    }

    static getIdByTag(tag){
        let tagId = 0
        Category.categoriesData.find(category => {
            if(category.tag == tag){
                tagId = category.id
            }
        })
        return tagId
    }

    static getTagUser(){
        let tagName = []
        Category.categoriesData.forEach(category => {
            tagName.push(category.tag);
        })
        return tagName;
    }

    // Método para imprimir categorías en un elemento select.
    printCategories(container, vector, pagination, counter, transaction) {
        if(pagination){
            let elemento = `
            <div class="category list">
                <h4>${vector[counter]}</h4>
                <p>${transaction} registros</p>
                <div>
                    <i class="fas fa-edit fa-lg modificar" title="Editar"></i>
                    <i class="fas fa-trash fa-lg eliminar" title="Eliminar"></i>
                </div>
            </div>`;

            return elemento;
        } else {
            container.innerHTML = `<option disabled selected>Categoría</option>`;
            Category.categoriesData.forEach((category) => {
                container.innerHTML += `<option value="${category.id}">${category.tag}</option>`;
            });
        }
    }

    // Método para validar si una categoría existe.
    validateCategory(newCategory) {
        let status = false;
        Category.categoriesData.find(category => {
            console.log(this.categoriesUser)
            if (category == newCategory) {
                console.log("Encontrado");
                status = true; // La categoría fue encontrada.
            }
        });
        return status; // Retorna el estado de validación.
    }

    // Método para agregar una nueva categoría.
    addCategory(category, user) {
        new Category(category, user); // Crea una nueva categoría.
    }

    // Método para actualizar una categoría existente.
    updateCategory(tagOld, tagNew) {
        Category.categoriesData.find(category => {
            if (category.tag == tagOld) {
                category.tag = tagNew; // Actualiza la etiqueta de la categoría.
            }
        });
    }

    // Método para eliminar una categoría.
    deleteCategory(tag) {
        let index = Category.categoriesData.findIndex(category => {
            return category.tag == tag
        });

        Category.categoriesData.splice(index, 1); // Elimina la categoría del arreglo.
    }
}
