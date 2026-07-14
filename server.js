// server.js
import express from 'express';
import sql from 'mssql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión a SQL Server
const dbConfig = {
    user: 'sa',
    password: 'Jeimy13', // Reemplaza con la contraseña que le pusiste al sa
    server: '10.245.144.186', // O el nombre/IP de tu máquina
    database: 'Guayaquil', // Reemplaza con tu base de datos de Guayaquil
    options: {
        encrypt: false, // Ponlo en true si usas Azure o certificados de seguridad SSL
        trustServerCertificate: true, // Crucial para entornos locales
    },
    port: 1433
};

// Intentar conectar a la base de datos al iniciar
sql.connect(dbConfig)
    .then(pool => {
        if (pool.connecting) {
            console.log('Conectando a SQL Server...');
        } else {
            console.log('¡Conectado exitosamente a SQL Server (Nodo Guayaquil)!');
        }
    })
    .catch(err => {
        console.error('Error al conectar a SQL Server:', err);
    });
//--------------------------------------------------------------------------Clientes
// Ruta de ejemplo para probar que funciona --Cambio
app.get("/api/clientes", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT
                Cedula_Cliente AS cedula,
                Nombres AS nombres,
                Apellidos AS apellidos,
                Calle AS calle,
                Ciudad AS ciudad,
                Provincia AS provincia,
                Telefono AS telefono,
                Contacto_Alterno AS contacto
            FROM dbo.Cliente
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

//Cambio y agrego
app.post("/api/clientes", async (req, res) => {
    try {
        const {
            cedula,
            nombres,
            apellidos,
            calle,
            ciudad,
            provincia,
            telefono,
            contacto
        } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("cedula", sql.VarChar(10), cedula)
            .input("nombres", sql.VarChar(50), nombres)
            .input("apellidos", sql.VarChar(50), apellidos)
            .input("calle", sql.VarChar(100), calle)
            .input("ciudad", sql.VarChar(50), ciudad)
            .input("provincia", sql.VarChar(50), provincia)
            .input("telefono", sql.VarChar(15), telefono)
            .input("contacto", sql.VarChar(15), contacto)
            .query(`
                INSERT INTO dbo.Cliente
                (
                    Cedula_Cliente,
                    Nombres,
                    Apellidos,
                    Calle,
                    Ciudad,
                    Provincia,
                    Telefono,
                    Contacto_Alterno
                )
                VALUES
                (
                    @cedula,
                    @nombres,
                    @apellidos,
                    @calle,
                    @ciudad,
                    @provincia,
                    @telefono,
                    @contacto
                )
            `);
        res.status(201).json({
            mensaje: "Cliente creado correctamente."
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
//CAmbio
app.put("/api/clientes/:cedula", async (req, res) => {
    try {
        const { cedula } = req.params;
        const {
            nombres,
            apellidos,
            calle,
            ciudad,
            provincia,
            telefono,
            contacto
        } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("cedula", sql.VarChar(10), cedula)
            .input("nombres", sql.VarChar(50), nombres)
            .input("apellidos", sql.VarChar(50), apellidos)
            .input("calle", sql.VarChar(100), calle)
            .input("ciudad", sql.VarChar(50), ciudad)
            .input("provincia", sql.VarChar(50), provincia)
            .input("telefono", sql.VarChar(15), telefono)
            .input("contacto", sql.VarChar(15), contacto)
            .query(`
                UPDATE dbo.Cliente
                SET
                    Nombres=@nombres,
                    Apellidos=@apellidos,
                    Calle=@calle,
                    Ciudad=@ciudad,
                    Provincia=@provincia,
                    Telefono=@telefono,
                    Contacto_Alterno=@contacto

                WHERE Cedula_Cliente=@cedula
            `);
        res.json({
            mensaje: "Cliente actualizado correctamente."
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
//Añado
app.delete("/api/clientes/:cedula", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("cedula", sql.VarChar(10), req.params.cedula)
            .query(`
                DELETE
                FROM dbo.Cliente
                WHERE Cedula_Cliente=@cedula
            `);
        res.json({
            mensaje: "Cliente eliminado correctamente."
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.post("/api/clientes", async (req,res)=>{

    try{

        const {
            cedula,
            nombres,
            apellidos,
            ciudad,
            provincia,
            telefono,
            contacto
        } = req.body;

        const pool = await sql.connect(dbConfig);

        await pool.request()
            .input("cedula",sql.VarChar,cedula)
            .input("nombres",sql.VarChar,nombres)
            .input("apellidos",sql.VarChar,apellidos)
            .input("ciudad",sql.VarChar,ciudad)
            .input("provincia",sql.VarChar,provincia)
            .input("telefono",sql.VarChar,telefono)
            .input("contacto",sql.VarChar,contacto)
            .query(`
                INSERT INTO Clientes
                VALUES
                (
                    @cedula,
                    @nombres,
                    @apellidos,
                    @ciudad,
                    @provincia,
                    @telefono,
                    @contacto
                )
            `);

        res.json({
            mensaje:"Cliente agregado"
        });

    }
    catch(err){

        res.status(500).send(err.message);

    }

});

app.put("/api/clientes/:cedula",async(req,res)=>{

    try{

        const {cedula}=req.params;

        const {
            nombres,
            apellidos,
            ciudad,
            provincia,
            telefono,
            contacto
        }=req.body;

        const pool=await sql.connect(dbConfig);

        await pool.request()

            .input("cedula",sql.VarChar,cedula)
            .input("nombres",sql.VarChar,nombres)
            .input("apellidos",sql.VarChar,apellidos)
            .input("ciudad",sql.VarChar,ciudad)
            .input("provincia",sql.VarChar,provincia)
            .input("telefono",sql.VarChar,telefono)
            .input("contacto",sql.VarChar,contacto)

            .query(`
                UPDATE Clientes
                SET

                nombres=@nombres,
                apellidos=@apellidos,
                ciudad=@ciudad,
                provincia=@provincia,
                telefono=@telefono,
                contacto=@contacto

                WHERE cedula=@cedula
            `);

        res.json({
            mensaje:"Actualizado"
        });

    }catch(err){

        res.status(500).send(err.message);

    }

});

app.delete("/api/clientes/:cedula",async(req,res)=>{

    try{

        const pool=await sql.connect(dbConfig);

        await pool.request()

        .input("cedula",sql.VarChar,req.params.cedula)

        .query("DELETE FROM dbo.Cliente WHERE cedula=@cedula");

        res.json({
            mensaje:"Eliminado"
        });

    }

    catch(err){

        res.status(500).send(err.message);

    }

});

//-----------------------------------------------------------Envio_GYE

app.get("/api/envios", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT
                Codigo_Paquete AS codigoPaquete,
                Fecha_Recepcion AS fechaRecepcion,
                Estado AS estado,
                Destino AS destino,
                Cedula_Cliente AS cedulaCliente,
                Placa AS placa,
                Codigo_Unico AS codigoUnico,
                Codigo_IATA AS codigoIata
            FROM dbo.Envio_GYE
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


app.post("/api/envios", async (req, res) => {
    try {
        const {
            codigoPaquete,
            fechaRecepcion,
            estado,
            destino,
            cedulaCliente,
            placa,
            codigoUnico,
            codigoIata
        } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("codigoPaquete", sql.Char(10), codigoPaquete)
            .input("fechaRecepcion", sql.Date, fechaRecepcion)
            .input("estado", sql.VarChar(30), estado)
            .input("destino", sql.VarChar(100), destino)
            .input("cedulaCliente", sql.VarChar(10), cedulaCliente)
            .input("placa", sql.Char(10), placa)
            .input("codigoUnico", sql.Char(10), codigoUnico)
            .input("codigoIata", sql.VarChar(5), codigoIata)
            .query(`
                INSERT INTO dbo.Envio_GYE
                (
                    Codigo_Paquete,
                    Fecha_Recepcion,
                    Estado,
                    Destino,
                    Cedula_Cliente,
                    Placa,
                    Codigo_Unico,
                    Codigo_IATA
                )
                VALUES
                (
                    @codigoPaquete,
                    @fechaRecepcion,
                    @estado,
                    @destino,
                    @cedulaCliente,
                    @placa,
                    @codigoUnico,
                    @codigoIata
                )
            `);
        res.status(201).json({
            mensaje: "Envío creado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.put("/api/envios/:codigoPaquete", async (req, res) => {
    try {
        const { codigoPaquete } = req.params;
        const {
            fechaRecepcion,
            estado,
            destino,
            cedulaCliente,
            placa,
            codigoUnico,
            codigoIata
        } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("codigoPaquete", sql.Char(10), codigoPaquete)
            .input("fechaRecepcion", sql.Date, fechaRecepcion)
            .input("estado", sql.VarChar(30), estado)
            .input("destino", sql.VarChar(100), destino)
            .input("cedulaCliente", sql.VarChar(10), cedulaCliente)
            .input("placa", sql.Char(10), placa)
            .input("codigoUnico", sql.Char(10), codigoUnico)
            .input("codigoIata", sql.VarChar(5), codigoIata)
            .query(`
                UPDATE dbo.Envio_GYE
                SET
                    Fecha_Recepcion = @fechaRecepcion,
                    Estado = @estado,
                    Destino = @destino,
                    Cedula_Cliente = @cedulaCliente,
                    Placa = @placa,
                    Codigo_Unico = @codigoUnico,
                    Codigo_IATA = @codigoIata
                WHERE Codigo_Paquete = @codigoPaquete
            `);
        res.json({
            mensaje: "Envío actualizado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.delete("/api/envios/:codigoPaquete", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("codigoPaquete", sql.Char(10), req.params.codigoPaquete)
            .query(`
                DELETE FROM dbo.Envio_GYE
                WHERE Codigo_Paquete = @codigoPaquete
            `);
        res.json({
            mensaje: "Envío eliminado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

//----------------------------------------------------------Sucursal_GYE
app.get("/api/repartidores", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT
                Codigo_Unico AS codigoUnico,
                Cedula AS cedula,
                Nombres AS nombres,
                Apellidos AS apellidos,
                Fecha_Nacimiento AS fechaNacimiento,
                Direccion AS direccion,
                Ciudad AS ciudad,
                Provincia AS provincia,
                Telefono AS telefono,
                Codigo_IATA AS codigoIata
            FROM dbo.Repartidor_GYE
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.post("/api/repartidores", async (req, res) => {
    try {
        const {
            codigoUnico,
            cedula,
            nombres,
            apellidos,
            fechaNacimiento,
            direccion,
            ciudad,
            provincia,
            telefono,
            codigoIata
        } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("codigoUnico", sql.Char(10), codigoUnico)
            .input("cedula", sql.Char(10), cedula)
            .input("nombres", sql.VarChar(50), nombres)
            .input("apellidos", sql.VarChar(50), apellidos)
            .input("fechaNacimiento", sql.Date, fechaNacimiento)
            .input("direccion", sql.VarChar(100), direccion)
            .input("ciudad", sql.VarChar(50), ciudad)
            .input("provincia", sql.VarChar(50), provincia)
            .input("telefono", sql.Char(10), telefono)
            .input("codigoIata", sql.VarChar(5), codigoIata)
            .query(`
                INSERT INTO dbo.Repartidor_GYE
                (
                    Codigo_Unico,
                    Cedula,
                    Nombres,
                    Apellidos,
                    Fecha_Nacimiento,
                    Direccion,
                    Ciudad,
                    Provincia,
                    Telefono,
                    Codigo_IATA
                )
                VALUES
                (
                    @codigoUnico,
                    @cedula,
                    @nombres,
                    @apellidos,
                    @fechaNacimiento,
                    @direccion,
                    @ciudad,
                    @provincia,
                    @telefono,
                    @codigoIata
                )
            `);
        res.status(201).json({
            mensaje: "Repartidor creado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.put("/api/repartidores/:codigoUnico", async (req, res) => {
    try {
        const { codigoUnico } = req.params;
        const {
            cedula,
            nombres,
            apellidos,
            fechaNacimiento,
            direccion,
            ciudad,
            provincia,
            telefono,
            codigoIata
        } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("codigoUnico", sql.Char(10), codigoUnico)
            .input("cedula", sql.Char(10), cedula)
            .input("nombres", sql.VarChar(50), nombres)
            .input("apellidos", sql.VarChar(50), apellidos)
            .input("fechaNacimiento", sql.Date, fechaNacimiento)
            .input("direccion", sql.VarChar(100), direccion)
            .input("ciudad", sql.VarChar(50), ciudad)
            .input("provincia", sql.VarChar(50), provincia)
            .input("telefono", sql.Char(10), telefono)
            .input("codigoIata", sql.VarChar(5), codigoIata)
            .query(`
                UPDATE dbo.Repartidor_GYE
                SET
                    Cedula = @cedula,
                    Nombres = @nombres,
                    Apellidos = @apellidos,
                    Fecha_Nacimiento = @fechaNacimiento,
                    Direccion = @direccion,
                    Ciudad = @ciudad,
                    Provincia = @provincia,
                    Telefono = @telefono,
                    Codigo_IATA = @codigoIata
                WHERE Codigo_Unico = @codigoUnico
            `);
        res.json({
            mensaje: "Repartidor actualizado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.delete("/api/repartidores/:codigoUnico", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("codigoUnico", sql.Char(10), req.params.codigoUnico)
            .query(`
                DELETE FROM dbo.Repartidor_GYE
                WHERE Codigo_Unico = @codigoUnico
            `);
        res.json({
            mensaje: "Repartidor eliminado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.get("/api/sucursales", async (req, res) => {

    try {

        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
            SELECT
                Codigo_IATA AS codigo_iata,
                Ciudad AS ciudad
            FROM dbo.Sucursal
        `);

        res.json(result.recordset);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/api/sucursales", async (req, res) => {

    try {

        const { codigo, ciudad } = req.body;

        const pool = await sql.connect(dbConfig);

        await pool.request()

            .input("codigo", sql.Char(3), codigo)
            .input("ciudad", sql.VarChar(50), ciudad)

            .query(`
                INSERT INTO dbo.Sucursal
                (
                    Codigo_IATA,
                    Ciudad
                )

                VALUES
                (
                    @codigo,
                    @ciudad
                )
            `);

        res.json({
            mensaje: "Sucursal creada."
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.put("/api/sucursales/:codigo", async (req, res) => {

    try {

        const { ciudad } = req.body;

        const pool = await sql.connect(dbConfig);

        await pool.request()

            .input("codigo", sql.Char(3), req.params.codigo)
            .input("ciudad", sql.VarChar(50), ciudad)

            .query(`
                UPDATE dbo.Sucursal

                SET Ciudad=@ciudad

                WHERE Codigo_IATA=@codigo
            `);

        res.json({
            mensaje: "Sucursal actualizada."
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});



app.delete("/api/sucursales/:codigo", async (req, res) => {

    try {

        const pool = await sql.connect(dbConfig);

        await pool.request()

            .input("codigo", sql.Char(3), req.params.codigo)

            .query(`
                DELETE
                FROM dbo.Sucursal
                WHERE Codigo_IATA=@codigo
            `);

        res.json({
            mensaje: "Sucursal eliminada."
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

//-------------------------------------Vehículo Tecnico
app.get("/api/vehiculos-tecnicos", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT
                Placa AS placa,
                Anio_Fabricacion AS anioFabricacion,
                Capacidad_Carga AS capacidadCarga,
                Codigo_IATA AS codigoIata
            FROM dbo.Vehiculo_Tecnico_GYE
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/vehiculos-tecnicos", async (req, res) => {
    try {
        const {
            placa,
            anioFabricacion,
            capacidadCarga,
            codigoIata
        } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("placa", sql.Char(10), placa)
            .input("anioFabricacion", sql.SmallInt, anioFabricacion)
            .input("capacidadCarga", sql.Decimal(10,2), capacidadCarga)
            .input("codigoIata", sql.VarChar(5), codigoIata)
            .query(`
                INSERT INTO dbo.Vehiculo_Tecnico_GYE
                (
                    Placa,
                    Anio_Fabricacion,
                    Capacidad_Carga,
                    Codigo_IATA
                )
                VALUES
                (
                    @placa,
                    @anioFabricacion,
                    @capacidadCarga,
                    @codigoIata
                )
            `);
        res.status(201).json({
            mensaje: "Vehículo creado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.put("/api/vehiculos-tecnicos/:placa", async (req, res) => {
    try {
        const { placa } = req.params;
        const {
            anioFabricacion,
            capacidadCarga,
            codigoIata
        } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("placa", sql.Char(10), placa)
            .input("anioFabricacion", sql.SmallInt, anioFabricacion)
            .input("capacidadCarga", sql.Decimal(10,2), capacidadCarga)
            .input("codigoIata", sql.VarChar(5), codigoIata)
            .query(`
                UPDATE dbo.Vehiculo_Tecnico_GYE
                SET
                    Anio_Fabricacion = @anioFabricacion,
                    Capacidad_Carga = @capacidadCarga,
                    Codigo_IATA = @codigoIata
                WHERE Placa = @placa
            `);
        res.json({
            mensaje: "Vehículo actualizado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.delete("/api/vehiculos-tecnicos/:placa", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("placa", sql.Char(10), req.params.placa)
            .query(`
                DELETE
                FROM dbo.Vehiculo_Tecnico_GYE
                WHERE Placa = @placa
            `);
        res.json({
            mensaje: "Vehículo eliminado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

//-----------------------Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor API corriendo localmente en http://localhost:${PORT}`);
});

