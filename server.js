import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// CONFIGURACIÓN SQL SERVER - GCS QUITO / LCS1
// =====================================================

const dbConfig = {
  user: "sa",
  password: "Jeimy13",
  server: "10.245.144.186",
  database: "Quito",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  port: 1433,
};

// =====================================================
// CONEXIÓN A SQL SERVER
// =====================================================

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }

  return pool;
}

// =====================================================
// CLIENTES
// =====================================================

app.get("/api/clientes", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db.request().query(`
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
    res.status(500).json({ error: err.message });
  }
});

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
      contacto,
    } = req.body;

    const db = await getPool();

    await db
      .request()
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
      mensaje: "Cliente creado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
      contacto,
    } = req.body;

    const db = await getPool();

    await db
      .request()
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
          Nombres = @nombres,
          Apellidos = @apellidos,
          Calle = @calle,
          Ciudad = @ciudad,
          Provincia = @provincia,
          Telefono = @telefono,
          Contacto_Alterno = @contacto
        WHERE Cedula_Cliente = @cedula
      `);

    res.json({
      mensaje: "Cliente actualizado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/clientes/:cedula", async (req, res) => {
  try {
    const db = await getPool();

    await db
      .request()
      .input("cedula", sql.VarChar(10), req.params.cedula)
      .query(`
        DELETE FROM dbo.Cliente
        WHERE Cedula_Cliente = @cedula
      `);

    res.json({
      mensaje: "Cliente eliminado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// ENVÍOS
// =====================================================

app.get("/api/envios", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db.request().query(`
      SELECT
        Codigo_Paquete AS codigoPaquete,
        Fecha_Recepcion AS fechaRecepcion,
        Estado AS estado,
        Destino AS destino,
        Cedula_Cliente AS cedulaCliente,
        Placa AS placa,
        Codigo_Unico AS codigoUnico,
        Codigo_IATA AS codigoIata
        FROM dbo.vw_Envio
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/envios", async (req, res) => {
  try {
    console.log("DATOS RECIBIDOS EN ENVIO:", req.body);
    const {
      codigoPaquete,
      fechaRecepcion,
      estado,
      destino,
      cedulaCliente,
      placa,
      codigoUnico,
      codigoIata,
    } = req.body;

    const db = await getPool();

    await db
      .request()
      .input("codigoPaquete", sql.Char(10), codigoPaquete)
      .input("fechaRecepcion", sql.Date, fechaRecepcion)
      .input("estado", sql.VarChar(30), estado)
      .input("destino", sql.VarChar(100), destino)
      .input("cedulaCliente", sql.VarChar(10), cedulaCliente)
      .input("placa", sql.Char(10), placa)
      .input("codigoUnico", sql.Char(10), codigoUnico)
      .input("codigoIata", sql.VarChar(5), codigoIata)
      .query(`
        SET XACT_ABORT ON;

        INSERT INTO dbo.vw_Envio
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
      mensaje: "Envío creado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      codigoIata,
    } = req.body;

    const db = await getPool();

    await db
      .request()
      .input("codigoPaquete", sql.Char(10), codigoPaquete)
      .input("fechaRecepcion", sql.Date, fechaRecepcion)
      .input("estado", sql.VarChar(30), estado)
      .input("destino", sql.VarChar(100), destino)
      .input("cedulaCliente", sql.VarChar(10), cedulaCliente)
      .input("placa", sql.Char(10), placa)
      .input("codigoUnico", sql.Char(10), codigoUnico)
      .input("codigoIata", sql.VarChar(5), codigoIata)
      .query(`
        SET XACT_ABORT ON;

        UPDATE dbo.vw_Envio
        SET
          Fecha_Recepcion = @fechaRecepcion,
          Estado = @estado,
          Destino = @destino,
          Cedula_Cliente = @cedulaCliente,
          Placa = @placa,
          Codigo_Unico = @codigoUnico,
          Codigo_IATA = @codigoIata
        WHERE
          Codigo_Paquete = @codigoPaquete
          AND Codigo_IATA = @codigoIata
      `);

    res.json({
      mensaje: "Envío actualizado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/envios/:codigoPaquete", async (req, res) => {
  try {
    const db = await getPool();

    await db
      .request()
      .input("codigoPaquete", sql.Char(10), req.params.codigoPaquete)
      .query(`
        SET XACT_ABORT ON;

        DELETE FROM dbo.vw_Envio
        WHERE Codigo_Paquete = @codigoPaquete
      `);

    res.json({
      mensaje: "Envío eliminado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// REPARTIDORES - VISTA PARTICIONADA
// =====================================================

app.get("/api/repartidores", async (req, res) => {
  try {
    //console.log("DATOS RECIBIDOS EN ENVIO:");
    const db = await getPool();

    const result = await db.request().query(`
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
      FROM dbo.vw_Repartidor
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/repartidores", async (req, res) => {
  try {
    //console.log("DATOS RECIBIDOS EN ENVIO:");
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
      codigoIata,
    } = req.body;

    const db = await getPool();

    await db
      .request()
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
        SET XACT_ABORT ON;

        INSERT INTO dbo.vw_Repartidor
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
      mensaje: "Repartidor creado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/repartidores/:codigoUnico", async (req, res) => {
  try {

    const codigoUnico = req.params.codigoUnico.trim();

    const {
      cedula,
      nombres,
      apellidos,
      fechaNacimiento,
      direccion,
      ciudad,
      provincia,
      telefono,
      codigoIata,
    } = req.body;

    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    const db = await getPool();

    const result = await db
      .request()
      .input("codigoUnico", sql.Char(10), codigoUnico)
      .input("cedula", sql.Char(10), cedula.trim())
      .input("nombres", sql.VarChar(50), nombres)
      .input("apellidos", sql.VarChar(50), apellidos)
      .input("fechaNacimiento", sql.Date, fechaNacimiento)
      .input("direccion", sql.VarChar(100), direccion)
      .input("ciudad", sql.VarChar(50), ciudad)
      .input("provincia", sql.VarChar(50), provincia)
      .input("telefono", sql.Char(10), telefono.trim())
      .input("codigoIata", sql.Char(3), codigoIata.trim())
      .query(`
        SET XACT_ABORT ON;

        UPDATE dbo.vw_Repartidor
        SET
          Cedula = @cedula,
          Nombres = @nombres,
          Apellidos = @apellidos,
          Fecha_Nacimiento = @fechaNacimiento,
          Direccion = @direccion,
          Ciudad = @ciudad,
          Provincia = @provincia,
          Telefono = @telefono
        WHERE
          Codigo_Unico = @codigoUnico
          AND Codigo_IATA = @codigoIata;
      `);

    console.log("Rows affected:", result.rowsAffected);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        mensaje: "No se encontró el repartidor para actualizar."
      });
    }

    res.json({
      mensaje: "Repartidor actualizado correctamente"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.delete("/api/repartidores/:codigoUnico", async (req, res) => {
  try {
    const db = await getPool();

    await db
      .request()
      .input("codigoUnico", sql.Char(10), req.params.codigoUnico)
      .query(`
        SET XACT_ABORT ON;

        DELETE FROM dbo.vw_Repartidor
        WHERE Codigo_Unico = @codigoUnico
      `);

    res.json({
      mensaje: "Repartidor eliminado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// SUCURSALES
// =====================================================

app.get("/api/sucursales", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db.request().query(`
      SELECT
        Codigo_IATA AS codigo_iata,
        Ciudad AS ciudad
      FROM dbo.Sucursal
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sucursales", async (req, res) => {
  try {
    const { codigo, ciudad } = req.body;

    const db = await getPool();

    await db
      .request()
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
      mensaje: "Sucursal creada correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/sucursales/:codigo", async (req, res) => {
  try {
    const { ciudad } = req.body;

    const db = await getPool();

    await db
      .request()
      .input("codigo", sql.Char(3), req.params.codigo)
      .input("ciudad", sql.VarChar(50), ciudad)
      .query(`
        UPDATE dbo.Sucursal
        SET Ciudad = @ciudad
        WHERE Codigo_IATA = @codigo
      `);

    res.json({
      mensaje: "Sucursal actualizada correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/sucursales/:codigo", async (req, res) => {
  try {
    const db = await getPool();

    await db
      .request()
      .input("codigo", sql.Char(3), req.params.codigo)
      .query(`
        DELETE FROM dbo.Sucursal
        WHERE Codigo_IATA = @codigo
      `);

    res.json({
      mensaje: "Sucursal eliminada correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// VEHÍCULO TÉCNICO - VISTA PARTICIONADA
// =====================================================

app.get("/api/vehiculos-tecnicos", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db.request().query(`
      SELECT
        Placa AS placa,
        Anio_Fabricacion AS anioFabricacion,
        Capacidad_Carga AS capacidadCarga,
        Codigo_IATA AS codigoIata
      FROM dbo.vw_Vehiculo_Tecnico
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
      codigoIata,
    } = req.body;

    const db = await getPool();

    await db
      .request()
      .input("placa", sql.Char(10), placa)
      .input("anioFabricacion", sql.SmallInt, anioFabricacion)
      .input("capacidadCarga", sql.Decimal(10, 2), capacidadCarga)
      .input("codigoIata", sql.VarChar(5), codigoIata)
      .query(`
        SET XACT_ABORT ON;

        INSERT INTO dbo.vw_Vehiculo_Tecnico
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
      mensaje: "Vehículo creado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/vehiculos-tecnicos/:placa", async (req, res) => {
  try {
    const { placa } = req.params;

    const {
      anioFabricacion,
      capacidadCarga,
      codigoIata,
    } = req.body;

    const db = await getPool();

    await db
      .request()
      .input("placa", sql.Char(10), placa)
      .input("anioFabricacion", sql.SmallInt, anioFabricacion)
      .input("capacidadCarga", sql.Decimal(10, 2), capacidadCarga)
      .input("codigoIata", sql.VarChar(5), codigoIata)
      .query(`
        SET XACT_ABORT ON;

        UPDATE dbo.vw_Vehiculo_Tecnico
        SET
          Anio_Fabricacion = @anioFabricacion,
          Capacidad_Carga = @capacidadCarga,
          Codigo_IATA = @codigoIata
        WHERE
          Placa = @placa
          AND Codigo_IATA = @codigoIata
      `);

    res.json({
      mensaje: "Vehículo actualizado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/vehiculos-tecnicos/:placa", async (req, res) => {
  try {
    const db = await getPool();

    await db
      .request()
      .input("placa", sql.Char(10), req.params.placa)
      .query(`
        SET XACT_ABORT ON;

        DELETE FROM dbo.vw_Vehiculo_Tecnico
        WHERE Placa = @placa
      `);

    res.json({
      mensaje: "Vehículo eliminado correctamente",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// Vehiculo Identificación
// =====================================================

app.get("/api/vehiculos-identificacion", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT
                Placa AS placa,
                Marca AS marca
            FROM dbo.Vehiculo_Identificacion
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/vehiculos-identificacion", async (req, res) => {
    try {
        const { placa, marca } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("placa", sql.Char(10), placa)
            .input("marca", sql.VarChar(50), marca)
            .query(`
                INSERT INTO dbo.Vehiculo_Identificacion
                (
                    Placa,
                    Marca
                )
                VALUES
                (
                    @placa,
                    @marca
                )
            `);
        res.status(201).json({
            mensaje: "Vehículo (identificación) creado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.put("/api/vehiculos-identificacion/:placa", async (req, res) => {
    try {
        const { placa } = req.params;
        const { marca } = req.body;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("placa", sql.Char(10), placa)
            .input("marca", sql.VarChar(50), marca)
            .query(`
                UPDATE dbo.Vehiculo_Identificacion
                SET Marca = @marca
                WHERE Placa = @placa
            `);
        res.json({
            mensaje: "Vehículo (identificación) actualizado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.delete("/api/vehiculos-identificacion/:placa", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("placa", sql.Char(10), req.params.placa)
            .query(`
                DELETE
                FROM dbo.Vehiculo_Identificacion
                WHERE Placa = @placa
            `);
        res.json({
            mensaje: "Vehículo (identificación) eliminado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// =====================================================
// SERVIDOR
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Servidor API ejecutándose en http://localhost:${PORT}`
  );
});