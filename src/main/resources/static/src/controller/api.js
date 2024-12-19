import { alertShow } from "../../assets/js/util.js";

export function sendData(action, url, body) {
    checkServer().then(response => {
        if(response){
            return fetch(`https://adequate-art-production-2380.up.railway.app/api/${url}`, {
                method: action,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            .catch(error => {
                alertShow("Error", "Inconveniente al enviar los datos, se actualizará en breve", "error");
                setTimeout(() =>{
                    window.location.reload();
                }, 3000)
            });
        }
    })
}

export function receiveData(action, url){
    checkServer().then(response => {
        if(response){
            return fetch(`https://adequate-art-production-2380.up.railway.app/api/${url}` ,{
                method: action,
                headers: { 'Content-Type': 'application/json' },
            })
            .catch(error => {
                alertShow("Error!", "Inconveniente al obtener los datos, se actualizará en breve", "error");
                setTimeout(() =>{
                    window.location.reload();
                }, 3000)
            });
        }
    });
}

function checkServer() {
    return fetch("https://adequate-art-production-2380.up.railway.app/api/check")
        .then(response => response.status === 200)
        .catch(() => {
            alertShow("Error!", "Lo sentimos, el servidor no se encuentra disponible", "error")
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 3000);
            return false
        });
}