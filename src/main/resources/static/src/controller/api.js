import { alertShow } from "../../assets/js/util.js";

export function sendData(action, url, body) {
    return new Promise((resolve, reject) => {
        fetch(`https://adequate-art-production-2380.up.railway.app/api/${url}`, {
            method: action,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        .then(response => resolve(response))
        .catch(error => reject(error))
    });
}

export function receiveData(action, url){
    return new Promise((resolve) => {
        fetch(`https://adequate-art-production-2380.up.railway.app/api/${url}` ,{
            method: action,
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => resolve(response))
        .catch(error => reject(error))
    });
}

export async function getData(callback) {
    try {
        return await callback;
        statusData = true
    } catch (error) {
        alertShow("Error", "Inconveniente al obtener los datos, se actualizará en breve", "error");
        setTimeout(() =>{
            window.location.reload();
        }, 3000)
    }
}
