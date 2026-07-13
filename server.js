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
    server: 'DESKTOP-F7TUL80', // O el nombre/IP de tu máquina
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
            FROM Clientes
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
                INSERT INTO Clientes
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
                UPDATE Clientes
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
                FROM Clientes
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor API corriendo localmente en http://localhost:${PORT}`);
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

        .query("DELETE FROM Clientes WHERE cedula=@cedula");

        res.json({
            mensaje:"Eliminado"
        });

    }

    catch(err){

        res.status(500).send(err.message);

    }

});

