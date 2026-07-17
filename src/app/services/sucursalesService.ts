const API = "http://localhost:5000/api/sucursales";

export async function obtenerSucursales() {

    const respuesta = await fetch(API);

    return await respuesta.json();

}

export async function crearSucursal(sucursal:any){

    const respuesta = await fetch(API,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(sucursal)

    });

    return await respuesta.json();

}

export async function actualizarSucursal(sucursal:any){

    const respuesta = await fetch(`${API}/${sucursal.codigo}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(sucursal)

    });

    return await respuesta.json();

}

export async function eliminarSucursal(codigo:string){

    await fetch(`${API}/${codigo}`,{

        method:"DELETE"

    });

}