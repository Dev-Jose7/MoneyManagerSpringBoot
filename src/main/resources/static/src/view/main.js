
document.addEventListener("DOMContentLoaded", function(){
    const buttonOffline = document.getElementById("buttonOffline");
    const buttonOnline = document.getElementById("buttonOnline");
    const tableContainer = document.querySelector(".table-container");
    const btnModal = document.querySelector(".btn-add");
    const btnCancel = document.querySelector(".btn-cancel");
    const modal = document.querySelector(".modal");

    firstTable();

    btnCancel.addEventListener("click", function(){
        modal.style.display = "none";
    });

    btnModal.addEventListener("click", function(){
        modal.style.display = "flex";
    })

    buttonOffline.addEventListener("click", function(){
        firstTable();
    });

    buttonOnline.addEventListener("click", function(){
        buttonOnline.classList.add("selection-title");
        buttonOffline.classList.remove("selection-title");
        const table = 
            `<table id="tableOnline">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Contraseña</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>usuario1@mail.com</td>
                        <td>password1234</td>
                    </tr>
                    <tr>
                        <td>usuario2@mail.com</td>
                        <td>password4321</td>
                    </tr>
                </tbody>
            </table>`
        addTable(table);
    });

    function firstTable(){
        buttonOffline.classList.add("selection-title");
        buttonOnline.classList.remove("selection-title");
        const tabla = 
            `<table id="tableOffline">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Contraseña</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>usuario1</td>
                        <td>1234</td>
                    </tr>
                    <tr>
                        <td>usuario2</td>
                        <td>4321</td>
                    </tr>
                </tbody>
            </table>`

        addTable(tabla);
    }

    function addTable(table){
        tableContainer.innerHTML = table
    }
});