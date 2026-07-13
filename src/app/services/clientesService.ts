const API = "http://localhost:5000/api/clientes";

export async function obtenerClientes() {
    const respuesta = await fetch(API);

    if (!respuesta.ok)
        throw new Error("Error al obtener clientes");

    return await respuesta.json();
}

export async function crearCliente(cliente:any) {

    const respuesta = await fetch(API,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(cliente)
    });

    return await respuesta.json();
}

export async function actualizarCliente(cliente:any){

    const respuesta = await fetch(`${API}/${cliente.cedula}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(cliente)
    });

    return await respuesta.json();

}

export async function eliminarCliente(cedula:string){

    await fetch(`${API}/${cedula}`,{
        method:"DELETE"
    });

}