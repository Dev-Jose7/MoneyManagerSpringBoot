import { alertShow } from "../../assets/js/util.js";

export function sendData(action, url, body) {
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

export function receiveData(action, url){
    return fetch(`https://adequate-art-production-2380.up.railway.app/api/${url}` ,{
            method: action,
            headers: { 'Content-Type': 'application/json' },
        })
        .catch(error => {
            alertShow("Error", "Inconveniente al obtener los datos, se actualizará en breve", "error");
            setTimeout(() =>{
                window.location.reload();
            }, 3000)
        });
}