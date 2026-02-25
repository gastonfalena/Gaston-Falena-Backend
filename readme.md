# 📦 InventarList - Backend API

API RESTful desarrollada para el sistema **InventarList**, una aplicación de gestión de inventarios jerárquica que permite a los usuarios administrar sus pertenencias organizadas en casas, contenedores e ítems.

## 🚀 Tecnologías Utilizadas

Este proyecto está construido con un enfoque en la escalabilidad, el tipado estricto y las buenas prácticas de desarrollo backend:

- **Entorno de ejecución:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** MongoDB (Mongoose)
- **Autenticación:** JSON Web Tokens (JWT) mediante HttpOnly Cookies y Google OAuth2
- **Seguridad:** Bcrypt (Hasheo de contraseñas)
- **Validación de Datos:** `class-validator` y `class-transformer` mediante DTOs.

## 🏗️ Arquitectura del Proyecto

El código sigue una **Arquitectura por Capas** (Layered Architecture) junto con el **Patrón Repositorio**, lo que garantiza la separación de responsabilidades, facilita el mantenimiento y permite una excelente escalabilidad:

1. **Routes (`/src/routes`):** Definen los endpoints de la API y delegan la petición al controlador correspondiente.
2. **Controllers (`/src/controllers`):** Manejan los objetos de petición (`req`) y respuesta (`res`), orquestando la información.
3. **Services (`/src/services`):** Contienen toda la lógica de negocio y las validaciones de permisos (ej. asegurar que un usuario solo edite su propia casa).
4. **Repositories (`/src/repositories`):** Abstraen la capa de persistencia. Se encargan exclusivamente de la interacción directa con la base de datos (consultas a Mongoose).
5. **DTOs (`/src/dto`):** Objetos de Transferencia de Datos que validan y tipan estrictamente la información que ingresa a la API antes de ser procesada.
6. **Interfaces (`/src/interfaces`):** Tipos estrictos compartidos para mantener la consistencia entre capas.
7. **Middlewares (`/src/middlewares`):** Controlan la autorización (validación de JWT), renovación de tokens y validación automatizada de DTOs.

## 🔐 Características Principales

- **Autenticación Segura:** Registro tradicional con email/password y login integrado con Google OAuth2. Uso de _Access Tokens_ y _Refresh Tokens_ almacenados en cookies `HttpOnly` para mayor seguridad.
- **Gestión de Jerarquías:**
  - `Casas` (Houses): Nivel superior de organización.
  - `Contenedores` (Containers): Ubicaciones físicas dentro de una casa (ej. "Cajonera", "Heladera").
  - `Ítems` (Items): Los objetos individuales con sus cantidades, alojados en contenedores.
- **Control de Acceso (RBAC):** Verificación estricta de pertenencia. Un usuario solo puede ver, crear, editar o eliminar el inventario que le pertenece directamente o a través de sus contenedores/casas.

## ⚙️ Configuración Local

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB (Local o Atlas)

### Instalación

1. Clonar el repositorio e instalar las dependencias:
   ```bash
   git clone [https://github.com/gastonfalena/Gaston-Falena-Backend.git](https://github.com/gastonfalena/Gaston-Falena-Backend.git)
   cd Gaston-Falena-Backend
   npm install
   ```

###

PORT=3000
MONGO_URI=tu_string_de_conexion_a_mongodb
JWT_SECRET=tu_secreto_super_seguro
JWT_REFRESH_SECRET=tu_secreto_para_refresh_token
JWT_EXPIRES_IN=15m
GOOGLE_CLIENT_ID=tu_client_id_de_google
NODE_ENV=development

###

npm run build
npm run dev
