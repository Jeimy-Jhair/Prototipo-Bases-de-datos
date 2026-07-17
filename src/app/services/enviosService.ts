const API = "http://localhost:5000/api/envios";

export async function obtenerEnvios() {
    const respuesta = await fetch(API);

    if (!respuesta.ok)
        throw new Error("Error al obtener envíos");

    return await respuesta.json();
}

export async function crearEnvio(envio: any) {

    const respuesta = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(envio)
    });

    return await respuesta.json();
}

export async function actualizarEnvio(envio: any) {

    const respuesta = await fetch(`${API}/${envio.codigoPaquete}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(envio)
    });

    return await respuesta.json();
}

export async function eliminarEnvio(codigoPaquete: string) {

    await fetch(`${API}/${codigoPaquete}`, {
        method: "DELETE"
    });

}