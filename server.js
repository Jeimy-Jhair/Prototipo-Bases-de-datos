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

// Ruta de ejemplo para probar que funciona
app.get('/api/clientes', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        // Aquí puedes hacer consultas normales o consultas distribuidas usando Linked Servers
        const result = await pool.request().query('SELECT * FROM Clientes');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor API corriendo localmente en http://localhost:${PORT}`);
});
