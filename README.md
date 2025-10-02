# Sistema de Gestión Integral para Ciber-café


Este repositorio contiene la planificación técnica inicial y los primeros componentes implementados del sistema integral que gestiona la operación de un ciber-café, incluyendo la infraestructura de red, el control de acceso a los equipos, los pagos, la seguridad y una aplicación web de reservas.
=======



## Objetivo general

Diseñar e implementar una plataforma completa que permita administrar la red local del negocio, controlar el acceso de los clientes a las estaciones de trabajo con límites de tiempo y cobro automático, gestionar reservas en línea y garantizar la seguridad informática del entorno.

## Componentes principales

- **Infraestructura física y mantenimiento:** montaje de las estaciones de trabajo, servidores y periféricos, así como su mantenimiento preventivo y correctivo.
- **Sistemas operativos y cuentas de usuario:** despliegue de sistemas operativos en estaciones y servidores, configuración de cuentas, permisos y políticas de uso.
- **Redes y servicios asociados:** diseño de la topología LAN, aprovisionamiento de conectividad, servicios de direccionamiento (DHCP), nombres (DNS) y autenticación (RADIUS/LDAP).
- **Seguridad informática:** protección mediante firewall, antivirus, listas blancas de software y monitorización de eventos.
- **Aplicación web y base de datos:** desarrollo de la plataforma web para reservas, control de sesiones y generación de reportes, respaldada por una base de datos MySQL.

Para una descripción detallada de cada módulo, su relación con las asignaturas y el plan de trabajo, consulta `docs/plan_proyecto.md`.


## Backend (API REST)

El backend está construido en **Node.js (JavaScript)** con Express y expone endpoints iniciales para la gestión de reservas y sesiones de uso.
=======

=======

### Requisitos

- Node.js 20+
- MySQL 8+

### Configuración

1. Copia el archivo `.env.example` y crea un `.env` con tus credenciales de base de datos.
2. Ejecuta el script SQL `database/schema.sql` en tu servidor MySQL para crear las tablas base.
3. Instala las dependencias:
   ```bash
   cd backend
   npm install
   ```
4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

El servicio quedará disponible en `http://localhost:3000` con los siguientes endpoints iniciales:

- `GET /api/health`: Verifica el estado general y la conexión a la base de datos.
- `GET /api/reservas?date=YYYY-MM-DD`: Lista las reservas del día indicado.
- `POST /api/reservas`: Crea una reserva validando solapamientos.
- `GET /api/sesiones/activas`: Muestra las sesiones en curso.
- `POST /api/sesiones/iniciar`: Registra el inicio de una sesión.
- `POST /api/sesiones/cerrar`: Finaliza una sesión y calcula su costo.

Este backend incluye validaciones con Zod, middleware de errores y utilidades para cálculo automático de costos basado en tarifas por hora configurables.

Consulta `docs/api_overview.md` para ejemplos detallados de consumo de la API.


=======


## Pantalla de bloqueo para estaciones

Dentro de `tools/lockscreen.py` se incluye una aplicación de escritorio sencilla
escrita con Tkinter que ocupa toda la pantalla y solo se cierra al introducir el
código correcto. Es ideal para bloquear temporalmente una estación hasta que el
cliente realice el pago o el administrador la habilite.

```bash
python tools/lockscreen.py --code "CODIGO_SEGURO"
```

Opcionalmente, el código y el mensaje que se muestra en pantalla pueden
configurarse mediante las variables de entorno `CYBERCAFE_UNLOCK_CODE` y
`CYBERCAFE_LOCK_MESSAGE`. Use `--show-cursor` para dejar visible el ratón si es
necesario.

=======
=======
=======



