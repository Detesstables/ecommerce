# 📄 E-commerce "Creativamente Papelería"

Este es un proyecto full-stack de una plataforma de e-commerce básica, creado como ejercicio de roles y seguridad avanzada. Incluye un backend modular con NestJS y un frontend reactivo con Angular.

## ✨ Características Principales

* **Autenticación JWT:** Sistema de registro y login con JSON Web Tokens.
* **Gestión de Roles:** Dos roles de usuario (`ADMIN`, `CLIENTE`) con permisos distintos.
* **Rutas Protegidas:** Uso de Guardias en el backend (NestJS) y frontend (Angular) para proteger rutas.
* **CRUD de Administrador:** Panel de admin para Crear, Leer, Actualizar y Eliminar productos (CRUD).
* **Lógica de Negocio:** Sistema de "Compra" que simula un pago, verifica el stock y crea un pedido, todo en una transacción de base de datos.
* **Frontend Modular:** Interfaz construida con componentes `standalone` y módulos de Angular.
* **Filtros Dinámicos:** Búsqueda de productos en tiempo real por nombre y precio.
* **Notificaciones (Toasts):** Mensajes de error y éxito no intrusivos.

---

## 🛠️ Stack Tecnológico

| Área | Tecnología |
| :--- | :--- |
| **Backend** | NestJS (TypeScript) |
| **Frontend** | Angular 20 (Standalone) |
| **Base de Datos** | SQLite (con Prisma ORM) |
| **Estilos** | Tailwind CSS v4 |
| **Autenticación** | JWT (jsonwebtoken) + bcryptjs |
| **Validación** | class-validator (Backend) / Reactive Forms (Frontend) |
| **Notificaciones** | ngx-toastr |

---

## 🚀 Guía de Instalación y Ejecución

Para ejecutar este proyecto, necesitas tener **dos terminales abiertas** simultáneamente (una para el backend y otra para el frontend).

### 1. Backend (NestJS)

1.  Abre una terminal y navega a la carpeta del backend:
    ```bash
    cd backend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  **¡Importante!** Crea y aplica la base de datos (SQLite) con Prisma:
    ```bash
    npx prisma migrate dev --name "init"
    ```

4.  Inicia el servidor de backend (se ejecutará en `http://localhost:3000`):
    ```bash
    npm run start:dev
    ```

### 2. Frontend (Angular)

1.  Abre una **segunda terminal** y navega a la carpeta del frontend:
    ```bash
    cd frontend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Inicia el servidor de desarrollo de Angular (se ejecutará en `http://localhost:4200`):
    ```bash
    ng serve
    ```

¡Y listo! Abre `http://localhost:4200` en tu navegador para ver la aplicación.

---

## 🔑 Creación de Usuarios (Poblar la Base de Datos)

La base de datos se crea **vacía**. Para poder probar la aplicación, debes crear un usuario **Admin** y un usuario **Cliente**.

Usa un cliente de API (como Thunder Client o Postman) para enviar las siguientes peticiones a tu backend (que corre en `http://localhost:3000`).

#### 1. Crear Usuario ADMIN

* **Método:** `POST`
* **URL:** `http://localhost:3000/users/register`
* **Body (JSON):**
    ```json
    {
      "nombre": "Jorge Admin",
      "email": "admin@papeleria.com",
      "contraseña": "password123",
      "direccion": "Mi Casa 123, Santiago",
      "rol": "ADMIN"
    }
    ```

#### 2. Crear Usuario CLIENTE

* **Método:** `POST`
* **URL:** `http://localhost:3000/users/register`
* **Body (JSON):**
    ```json
    {
      "nombre": "Juan Cliente",
      "email": "cliente@gmail.com",
      "contraseña": "password123",
      "direccion": "Otra Calle 456, Santiago",
      "rol": "CLIENTE"
    }
    ```

#### 3. (Opcional) Poblar Categorías

Para que el Admin pueda crear productos, primero debe crear las categorías.

1.  Haz login con el `ADMIN` (`POST /auth/login`) para obtener un token.
2.  Añade ese token como `Bearer Token` a tu petición.
3.  Envía una petición `POST` a `http://localhost:3000/categories` con:
    ```json
    {
      "nombre": "Cuadernos",
      "imagenUrl": "/assets/img/banner-cuadernos.jpg",
      "descripcion": "Descripción larga de cuadernos..."
    }
    ```
4.  Repite para las otras categorías (Planners, etc.).