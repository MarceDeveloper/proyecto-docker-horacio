# Sistema de Reservas con WhatsApp

Un sistema completo de reservas de espacios de trabajo construido con NestJS, PostgreSQL y notificaciones por WhatsApp usando Evolution API.

## 🚀 Características

- ✅ **API REST completa** para gestión de reservas
- ✅ **Base de datos PostgreSQL** con validación de conflictos horarios
- ✅ **Notificaciones automáticas por WhatsApp** al crear reservas
- ✅ **Arquitectura de microservicios** (reservas + WhatsApp)
- ✅ **Dockerización completa** con Docker Compose
- ✅ **Validación robusta** con class-validator
- ✅ **Manejo de errores** apropiado

## 🏗️ Arquitectura

```
simple_docker/
├── docker-compose.yml          # Orquesta todos los servicios
├── servicio_reservas/          # API de reservas (puerto 3000)
│   ├── src/
│   │   ├── reservations/       # CRUD de reservas con PostgreSQL
│   │   ├── whatsapp/           # Cliente HTTP para servicio WhatsApp
│   │   └── database/           # Conexión PostgreSQL con pg
│   └── Dockerfile
├── servicio_whatsapp/          # Servicio WhatsApp (puerto 3001)
│   ├── src/
│   │   └── whatsapp/           # Integración con Evolution API
│   └── Dockerfile
└── README.md
```

## 📋 Requisitos

- Docker y Docker Compose
- Node.js 20+ (para desarrollo local)
- Evolution API configurada (para WhatsApp)

## 🚀 Instalación y Ejecución

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd simple_docker

# Construir y ejecutar todos los servicios
docker-compose up --build -d

# Verificar que estén corriendo
docker-compose ps
```

### Opción 2: Desarrollo Local

```bash
# Instalar dependencias en ambos servicios
cd servicio_reservas && yarn install
cd ../servicio_whatsapp && yarn install

# Configurar variables de entorno (copiar .env.example)
cp .env.example .env

# Ejecutar PostgreSQL con Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Ejecutar servicios
cd servicio_reservas && yarn start:dev
cd servicio_whatsapp && yarn start:dev
```

## ⚙️ Configuración

### Variables de Entorno

#### servicio_reservas/.env
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=reservas_db
PORT=3000
WHATSAPP_SERVICE_URL=http://servicio_whatsapp:3001
WHATSAPP_RECIPIENT=+59165811806
```

#### servicio_whatsapp/.env
```env
EVOLUTION_API_URL=https://tu-api-evolution.com/message/sendText/Instance
EVOLUTION_API_TOKEN=tu_token_aqui
PORT=3001
```

## 📡 API Endpoints

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reservations` | Listar todas las reservas |
| GET | `/reservations/:id` | Obtener reserva por ID |
| POST | `/reservations` | Crear nueva reserva |
| PUT | `/reservations/:id` | Actualizar reserva |
| DELETE | `/reservations/:id` | Eliminar reserva |

### WhatsApp (Servicio Interno)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/whatsapp/send` | Enviar mensaje de WhatsApp |

## 🧪 Uso de la API

### Crear Reserva

```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "space_name": "Sala de Conferencias A",
    "user_name": "Juan Pérez",
    "start_time": "2025-11-25T10:00:00Z",
    "end_time": "2025-11-25T11:00:00Z"
  }'
```

**Respuesta exitosa:**
```json
{
  "id": 1,
  "space_name": "Sala de Conferencias A",
  "user_name": "Juan Pérez",
  "start_time": "2025-11-25T10:00:00.000Z",
  "end_time": "2025-11-25T11:00:00.000Z"
}
```

### Validación de Conflictos

Si intentas crear una reserva en un horario ocupado:

```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "space_name": "Sala de Conferencias A",
    "user_name": "María López",
    "start_time": "2025-11-25T10:30:00Z",
    "end_time": "2025-11-25T11:30:00Z"
  }'
```

**Respuesta de error:**
```json
{
  "message": "El espacio \"Sala de Conferencias A\" ya está reservado en el horario solicitado",
  "error": "Bad Request",
  "statusCode": 400
}
```

## 📱 Notificaciones WhatsApp

Cuando se crea una reserva exitosamente, automáticamente se envía un mensaje de WhatsApp con el formato:

```
Nueva reserva creada:
Espacio: Sala de Conferencias A
Usuario: Juan Pérez
Inicio: 2025-11-25T10:00:00.000Z
Fin: 2025-11-25T11:00:00.000Z
```

## 🛠️ Desarrollo

### Estructura del Proyecto

```
servicio_reservas/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── database/
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── reservations/
│   │   ├── dto/
│   │   ├── reservation.controller.ts
│   │   ├── reservation.module.ts
│   │   └── reservation.service.ts
│   └── whatsapp/
│       ├── whatsapp.module.ts
│       └── whatsapp.service.ts
├── Dockerfile
├── docker-compose.yml
└── package.json

servicio_whatsapp/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   └── whatsapp/
│       ├── whatsapp.controller.ts
│       ├── whatsapp.module.ts
│       └── whatsapp.service.ts
├── Dockerfile
└── package.json
```

### Scripts Disponibles

```bash
# Desarrollo
yarn start:dev          # Modo desarrollo con hot reload
yarn start:prod         # Modo producción

# Construcción
yarn build             # Compilar TypeScript
yarn format            # Formatear código
yarn lint              # Ejecutar ESLint

# Testing
yarn test              # Ejecutar tests
yarn test:cov          # Tests con cobertura
```

## 🔒 Validaciones

### Creación de Reservas
- `space_name`: Requerido, no vacío
- `user_name`: Requerido, no vacío
- `start_time`: Requerido, formato ISO 8601
- `end_time`: Requerido, formato ISO 8601, debe ser posterior a start_time
- **Validación de conflictos**: No permite reservas solapadas en el mismo espacio

### Actualización de Reservas
- Mismas validaciones que creación
- Verifica conflictos excluyendo la reserva actual

## 🐳 Docker

### Servicios

- **db**: PostgreSQL 15 con inicialización automática
- **servicio_reservas**: API REST de reservas (puerto 3000)
- **servicio_whatsapp**: Servicio de WhatsApp (puerto 3001)

### Comandos Útiles

```bash
# Ver logs
docker-compose logs servicio_reservas
docker-compose logs servicio_whatsapp

# Acceder a base de datos
docker-compose exec db psql -U postgres -d reservas_db

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down
```

## 📊 Base de Datos

### Esquema

```sql
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  space_name VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL
);
```

### Inicialización

La tabla se crea automáticamente al iniciar los contenedores desde `servicio_reservas/init.sql`.

## 🔧 Tecnologías

- **NestJS**: Framework Node.js para APIs
- **PostgreSQL**: Base de datos relacional
- **pg**: Cliente PostgreSQL para Node.js
- **Axios**: Cliente HTTP para llamadas a Evolution API
- **class-validator**: Validación de datos
- **Docker**: Contenedorización
- **Evolution API**: Integración WhatsApp

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte técnico o preguntas:
- Abre un issue en GitHub
- Revisa la documentación de NestJS
- Consulta la documentación de Evolution API

---

**¡El sistema está listo para usar!** 🚀