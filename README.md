# 🛍 Click&Go - Tienda Online 

Todo el diseño está en la carpeta análisis y diseño.

Este proyecto es una *tienda online interactiva* desarrollada en *HTML, CSS y JavaScript* que consume datos de la API [FakeStore](https://fakestoreapi.com/).  
Incluye sistema de *login/registro local, **carrito de compras por usuario*, filtros de búsqueda y ordenamiento, y un diseño moderno con animaciones.

---

## 🚀 Características

- *Login y Registro*  
  - Los usuarios pueden crear su propia cuenta (guardada en localStorage).  
  - Sistema de sesión: si el usuario no ha iniciado sesión, se redirige al login.html.  
  - Botón de cerrar sesión en la tienda.

- *Carrito por Usuario*  
  - Cada usuario tiene su propio carrito (clickngo_cart_usuario).  
  - Los productos en el carrito se guardan en localStorage.  
  - Carrito con contador, control de cantidades y checkout simulado.

- *Productos desde API*  
  - Se cargan productos desde [FakeStore API](https://fakestoreapi.com/products).  
  - Vista en tarjetas con imagen, título, descripción, precio y rating.

- *Filtros y Búsqueda*  
  - Búsqueda en tiempo real por nombre o descripción.  
  - Ordenamiento por precio, nombre o rating.  
  - Botones circulares para filtrar por categoría:
    - 🌐 Todas  
    - 💻 Electrónica  
    - 👗 Ropa Mujer  
    - 💍 Joyería  
    - 👕 Ropa Hombre  

- *Diseño Moderno*  
  - Animaciones en hover y transiciones suaves.  
  - Estilo responsive adaptado a dispositivos móviles.  
  - Notificaciones visuales al agregar/eliminar productos.

---

## 📂 Estructura del Proyecto
clickandgo/
│── index.html # Página principal de la tienda
│── login.html # Página de login y registro
│── styles.css # Estilos globales
│── main.js # Lógica de la tienda (productos, filtros, eventos)
│── login.js # Lógica de login y registro
│── cart.js # Clase Carrito (con almacenamiento por usuario)
│── productCard.js # Componente de tarjeta de producto
│── README.md # Documentación del proyecto

## ⚙ Instalación y Uso

1. Clona este repositorio o descarga los archivos.  
   ```bash
   git clone https://github.com/tuusuario/clickandgo-demo.git

## 🛠 Tecnologías

HTML5 → estructura del sitio

CSS3 → estilos modernos y responsive

JavaScript (ES6+) → lógica del login, filtros, carrito y consumo de API

FakeStore API → productos de prueba   

## 👨‍💻 Autor

Proyecto creado por Dubán, Justin, Ashly.
