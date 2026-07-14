const API = "http://localhost:5000/api/vehiculos-identificacion";

export async function obtenerVehiculosIdentificacion() {

    const res = await fetch(API);

    if (!res.ok) {

        throw new Error("Error al obtener los vehículos.");

    }

    return await res.json();

}

export async function crearVehiculoIdentificacion(vehiculo: any) {

    const res = await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(vehiculo)

    });

    if (!res.ok) {

        throw new Error("Error al crear el vehículo.");

    }

}

export async function actualizarVehiculoIdentificacion(vehiculo: any) {

    const res = await fetch(

        `${API}/${vehiculo.placa}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(vehiculo)

        }

    );

    if (!res.ok) {

        throw new Error("Error al actualizar el vehículo.");

    }

}

export async function eliminarVehiculoIdentificacion(placa: string) {

    const res = await fetch(

        `${API}/${placa}`,

        {

            method: "DELETE"

        }

    );

    if (!res.ok) {

        throw new Error("Error al eliminar el vehículo.");

    }

}