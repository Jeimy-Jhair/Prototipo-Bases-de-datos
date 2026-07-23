---Quito
USE Quito;
GO


------Ejecutar el check
ALTER TABLE dbo.Envio_UIO
ADD CONSTRAINT CK_Envio_UIO_IATA
CHECK (Codigo_IATA = 'UIO');
GO

ALTER TABLE dbo.Repartidor_UIO
ADD CONSTRAINT CK_Repartidor_UIO_IATA
CHECK (Codigo_IATA = 'UIO');
GO

ALTER TABLE dbo.Vehiculo_Tecnico_UIO
ADD CONSTRAINT CK_Vehiculo_Tecnico_UIO_IATA
CHECK (Codigo_IATA = 'UIO');
GO


---------Crear la vista Para Envio
CREATE VIEW dbo.vw_Envio
AS

SELECT
    Codigo_Paquete,
    Fecha_Recepcion,
    Estado,
    Destino,
    Cedula_Cliente,
    Placa,
    Codigo_Unico,
    Codigo_IATA
FROM dbo.Envio_UIO

UNION ALL

SELECT
    Codigo_Paquete,
    Fecha_Recepcion,
    Estado,
    Destino,
    Cedula_Cliente,
    Placa,
    Codigo_Unico,
    Codigo_IATA
FROM [10.245.144.186].Guayaquil.dbo.Envio_GYE;
GO

---------Comprobar
SELECT * FROM dbo.vw_Envio;



---------Crear vista para Repartidor
CREATE VIEW dbo.vw_Repartidor
AS

SELECT
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
FROM dbo.Repartidor_UIO

UNION ALL

SELECT
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
FROM [10.245.144.186].Guayaquil.dbo.Repartidor_GYE;
GO

---------Comprobar
Select * from vw_Repartidor

--------------Crear la vista para Vehiculo_Tecnico
CREATE VIEW dbo.vw_Vehiculo_Tecnico
AS

SELECT
    Placa,
    Anio_Fabricacion,
    Capacidad_Carga,
    Codigo_IATA
FROM dbo.Vehiculo_Tecnico_UIO

UNION ALL

SELECT
    Placa,
    Anio_Fabricacion,
    Capacidad_Carga,
    Codigo_IATA
FROM [10.245.144.186].Guayaquil.dbo.Envio_GYE;
GO

---drop view vw_Vehiculo_Tecnico
---------Comprobar
select * from vw_Vehiculo_Tecnico

------------------ Store Procedure 
DROP PROCEDURE IF EXISTS sp_Insertar_Vehiculo_Identificacion;
