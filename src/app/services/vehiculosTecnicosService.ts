const API = "http://localhost:5000/api/vehiculos-tecnicos";

export async function obtenerVehiculosTecnicos() {
    const respuesta = await fetch(API);

    if (!respuesta.ok)
        throw new Error("Error al obtener vehículos");

    return await respuesta.json();
}

export async function crearVehiculoTecnico(vehiculo: any) {
    const respuesta = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehiculo)
    });

    return await respuesta.json();
}

export async function actualizarVehiculoTecnico(vehiculo: any) {
    const respuesta = await fetch(`${API}/${vehiculo.placa}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehiculo)
    });

    return await respuesta.json();
}

export async function eliminarVehiculoTecnico(placa: string) {
    await fetch(`${API}/${placa}`, {
        method: "DELETE"
    });
}