# API del Sistema de Gestión Integral para Ciber-café

Este documento describe los endpoints iniciales disponibles en el backend y el comportamiento esperado de cada recurso. La API está construida con Express y retorna respuestas en formato JSON.

## Convenciones generales

- Todas las rutas están bajo el prefijo `/api`.
- Las respuestas exitosas incluyen la propiedad `data` con el recurso solicitado.
- Los errores devuelven un objeto `{ message, details }` con el código HTTP apropiado.
- Los horarios se manejan en formato ISO 8601 (UTC).

## Endpoints

### `GET /api/health`

Verifica que la API esté operativa y comprueba la conexión a la base de datos.

**Respuesta 200**
```json
{
  "ok": true,
  "database": "up"
}
```

### `GET /api/reservas`

Lista las reservas registradas para un día específico.

**Parámetros de consulta**
- `date` (opcional): Fecha en formato `YYYY-MM-DD`. Si se omite, se usa la fecha actual.

**Respuesta 200**
```json
{
  "data": [
    {
      "id": 10,
      "usuarioId": 4,
      "estacionId": 2,
      "inicio": "2024-05-01 10:00:00",
      "fin": "2024-05-01 11:00:00",
      "estado": "confirmada"
    }
  ]
}
```

### `POST /api/reservas`

Crea una nueva reserva siempre que no existan solapamientos.

**Body JSON**
```json
{
  "usuarioId": 4,
  "estacionId": 2,
  "inicio": "2024-05-01T10:00:00Z",
  "fin": "2024-05-01T11:00:00Z"
}
```

**Errores comunes**
- `400 Datos inválidos`: formato incorrecto o `fin <= inicio`.
- `409 La estación ya está reservada`: conflicto de horarios.

### `GET /api/sesiones/activas`

Devuelve las sesiones en curso, útiles para el monitoreo en tiempo real.

**Respuesta 200**
```json
{
  "data": [
    {
      "id": 33,
      "usuarioId": 4,
      "estacionId": 2,
      "inicio": "2024-05-01 10:05:00",
      "fin": null,
      "estado": "activa",
      "minutosConsumidos": 0,
      "costoTotal": 1.5
    }
  ]
}
```

### `POST /api/sesiones/iniciar`

Registra el inicio de una sesión en una estación.

**Body JSON**
```json
{
  "usuarioId": 4,
  "estacionId": 2,
  "reservaId": 10,
  "tarifaPorHora": 2.5
}
```

**Respuesta 201**
```json
{
  "data": {
    "id": 55,
    "usuarioId": 4,
    "estacionId": 2,
    "inicio": "2024-05-01 10:05:00",
    "fin": null,
    "estado": "activa",
    "minutosConsumidos": 0,
    "costoTotal": 2.5
  }
}
```

### `POST /api/sesiones/cerrar`

Finaliza una sesión existente y calcula el costo en función del tiempo transcurrido.

**Body JSON**
```json
{
  "sesionId": 55,
  "minutosConsumidos": 70,
  "tarifaPorHora": 2.5
}
```

Si `minutosConsumidos` no se envía, el sistema calcula la diferencia entre la hora de inicio y el momento del cierre.

**Respuesta 200**
```json
{
  "data": {
    "id": 55,
    "usuarioId": 4,
    "estacionId": 2,
    "inicio": "2024-05-01 10:05:00",
    "fin": "2024-05-01 11:15:00",
    "estado": "finalizada",
    "minutosConsumidos": 70,
    "costoTotal": 2.92
  }
}
```
