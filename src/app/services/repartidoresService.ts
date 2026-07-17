const API = "http://localhost:5000/api/repartidores";

export async function obtenerRepartidores() {
    const respuesta = await fetch(API);

    if (!respuesta.ok)
        throw new Error("Error al obtener repartidores");

    return await respuesta.json();
}

export async function crearRepartidor(repartidor: any) {

    const respuesta = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(repartidor)
    });

    return await respuesta.json();
}

export async function actualizarRepartidor(repartidor: any) {

    const respuesta = await fetch(`${API}/${repartidor.codigoUnico}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(repartidor)
    });

    return await respuesta.json();
}

export async function eliminarRepartidor(codigoUnico: string) {

    await fetch(`${API}/${codigoUnico}`, {
        method: "DELETE"
    });

}