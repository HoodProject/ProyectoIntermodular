# Plan del Sistema de Gestión Integral para Ciber-café

## 1. Objetivos

- **Objetivo general:** Desarrollar un sistema integral que administre la red del ciber-café, controle el acceso a las estaciones de trabajo, gestione los pagos y reservas, y garantice la seguridad informática.
- **Objetivos específicos:**
  - Automatizar el control de tiempo y facturación por uso de estaciones.
  - Proporcionar un portal web para reservas anticipadas y administración de clientes.
  - Implementar servicios de red centralizados para autenticación y monitorización.
  - Definir políticas de seguridad y procedimientos de mantenimiento que reduzcan incidencias.

## 2. Alcance funcional

| Módulo | Funcionalidades | Asignaturas relacionadas |
| ------ | ---------------- | ------------------------- |
| Montaje y mantenimiento de equipo | Inventario de hardware, bitácoras de mantenimiento, guías de sustitución de componentes. | Montaje y mantenimiento de equipo |
| Sistemas operativos monopuesto y en red | Imágenes de SO, despliegue automatizado, perfiles de usuario y políticas de grupo, scripts de inicio/cierre de sesión. | Sistemas operativos monopuesto y en red |
| Redes locales | Diseño de topología estrella con VLAN por zona, QoS básico, monitorización SNMP. | Redes locales |
| Seguridad informática | Firewall perimetral, IDS/IPS, antivirus centralizado, políticas de listas blancas y bloqueo de USB. | Seguridad informática |
| Servicios en red | DHCP, DNS, servidor RADIUS/LDAP, servidor de archivos y copias de seguridad. | Servicios en red |
| Aplicaciones web | Portal de reservas, panel administrativo, control de sesiones, notificaciones por correo/SMS. | Aplicaciones web |
| Fundamentos de base de datos | Diseño lógico/ físico de la BD, modelos entidad-relación, procedimientos almacenados, generación de reportes. | Fundamentos de base de datos |

## 3. Arquitectura propuesta

- **Infraestructura física:**
  - Estaciones cliente con Linux Mint o Windows 11 según preferencia del negocio.
  - Servidor central con Linux (Ubuntu Server) encargado de servicios de red, autenticación y base de datos.
  - Switch gestionable con soporte VLAN y QoS.
  - Router/firewall dedicado (pfSense o similar) conectado a Internet.

- **Servicios de red:**
  - DHCP para asignación dinámica de direcciones IP segmentadas por VLAN.
  - DNS interno para resolución de nombres de servicios.
  - RADIUS (FreeRADIUS) para autenticación centralizada de estaciones.
  - Servidor de archivos para perfiles itinerantes y almacenamiento de reportes.
  - Monitorización con Zabbix o Nagios, integrando alertas por correo.

- **Aplicación web:**
  - **Backend:** Node.js (Express) con arquitectura modular en JavaScript, API REST, autenticación JWT para panel administrativo y tokens temporales para usuarios.

  - **Frontend:** Interfaz en React con JavaScript (usando componentes generados con asistencia de Claude AI) y diseño responsivo.

  - **Base de datos:** MySQL 8 con réplicas y respaldo automatizado, tablas para usuarios, estaciones, reservas, sesiones, pagos y logs.
  - **Integraciones:** Pasarela de pago local (ej. PayU, Stripe) y servicios de correo (SMTP).

- **Seguridad:**
  - Firewall perimetral con reglas para segmentación de tráfico entre VLAN de clientes, administración y servidores.
  - Antivirus centralizado (por ejemplo, ESET Endpoint o ClamAV) con actualizaciones programadas.
  - Sistema de detección de intrusiones (Suricata/Snort) y alertas en tiempo real.
  - Políticas de endurecimiento en estaciones: desactivación de USB, listas blancas de software, restauración automática de imagen.

## 4. Diseño de base de datos

| Entidad | Atributos principales | Descripción |
| ------- | -------------------- | ----------- |
| Usuarios | id_usuario, nombre, email, rol, contraseña_hash, estado | Clientes y personal del ciber-café. |
| Estaciones | id_estacion, identificador_fisico, estado, ubicacion, especificaciones | Equipos disponibles en la sala. |
| Sesiones | id_sesion, id_usuario, id_estacion, hora_inicio, hora_fin, costo_total, estado | Control del tiempo y facturación. |
| Reservas | id_reserva, id_usuario, id_estacion, fecha_reserva, hora_inicio, hora_fin, estado | Gestión de reservas anticipadas. |
| Pagos | id_pago, id_usuario, id_sesion, monto, metodo, referencia | Registro de pagos y comprobantes. |
| Logs_seguridad | id_log, fecha, tipo_evento, descripcion, criticidad | Eventos de seguridad y auditoría. |

## 5. Cronograma sugerido

| Fase | Duración | Actividades |
| ---- | -------- | ----------- |
| Planificación | 1 semana | Levantamiento de requerimientos, análisis de riesgos, diseño de arquitectura y DB. |
| Montaje y configuración | 2 semanas | Instalación de hardware, cableado, configuración de switch/router, despliegue de SO en estaciones y servidor. |
| Desarrollo del software | 3 semanas | Implementación del backend (API), frontend (panel y portal), integración con servicios de red y pasarela de pagos. |
| Pruebas | 1 semana | Pruebas unitarias, de integración, de rendimiento y seguridad; hardening final. |
| Documentación | 1 semana | Manuales de usuario y administrador, procedimientos de mantenimiento, plan de continuidad. |

## 6. Estrategia de pruebas

- **Pruebas unitarias:** Cobertura de control de sesiones, cálculo de costos y generación de reportes.
- **Pruebas de integración:** Validación de flujos completos (reserva → inicio de sesión → cobro → cierre).
- **Pruebas de seguridad:** Escaneo de vulnerabilidades (OpenVAS), pruebas de penetración controladas.
- **Pruebas de rendimiento:** Simulación de usuarios concurrentes usando herramientas como JMeter o k6.

## 7. Documentación y formación

- Manuales de instalación y despliegue automatizado.
- Manual de usuario (clientes) y manual de operador (administradores).
- Plan de formación para el personal sobre el uso del sistema y procedimientos de seguridad.

## 8. Mantenimiento y soporte

- Monitorización continua con alertas.
- Copias de seguridad diarias con retención semanal/mensual.
- Calendario de mantenimiento preventivo (limpieza de hardware, actualización de software).
- Acuerdos de nivel de servicio (SLA) internos para tiempo de resolución de incidencias.

## 9. Próximos pasos

1. Validar requerimientos con el cliente y ajustar prioridades.
2. Elaborar diagramas detallados (ERD, UML, topología de red).
3. Configurar entorno de desarrollo y automatizar despliegues (CI/CD básico con GitHub Actions).
4. Definir matriz de riesgos y plan de mitigación.

## 10. Implementación en curso

- Se creó la base de datos inicial en MySQL con tablas para usuarios, estaciones, reservas, sesiones, pagos y logs de seguridad.
- Se implementó un backend en Node.js (JavaScript) con endpoints REST para reservas y sesiones, incluyendo validaciones y manejo de errores.
- Próximos incrementos: autenticación de usuarios (JWT), módulo de pagos e integración con el portal web de reservas.
