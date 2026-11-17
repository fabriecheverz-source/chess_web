class Producto {

    constructor(id, nombre, precio, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }
    tieneStock() {
        return this.stock > 0;
    }
}

let productos = [];

async function cargarProductos() {

    try {
        const contenedor = document.getElementById("contenedorProductos");
        contenedor.innerHTML = "<p>Cargando productos...</p>";
        const respuesta = await fetch("../productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo de productos.");
        }

        const datosProductos = await respuesta.json();
        productos = datosProductos.map(data => new Producto(
            data.id,
            data.nombre, 
            data.precio, 
            data.stock, 
            data.imagen));
            
        renderizarProductos(productos);
        Toastify({
            text: "Productos cargados correctamente",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "#28a745"
            }
        }).showToast();

    } catch (error) {

        document.getElementById("contenedorProductos").innerHTML =
            "<p>Error al cargar los productos.</p>";

        Toastify({
            text: "Error al cargar los productos",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "#dc3545"
            }
        }).showToast();

    } finally {
    }
}

function renderizarProductos(listaProductos) {
    const contenedor = document.getElementById("contenedorProductos");
    contenedor.innerHTML = "";

    listaProductos.forEach(producto => {
        const disponibilidad = producto.tieneStock()
            ? "Disponible"
            : "Sin stock";
        contenedor.innerHTML += `
            <div class="card col-md-4">

                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="card-body">

                    <h5>${producto.nombre}</h5>
                    <p>Precio: $${producto.precio}</p>
                    <p>${disponibilidad}</p>

                    <button
                        class="btn btn-success"
                        ${!producto.tieneStock() ? "disabled" : ""}
                        onclick="agregarAlCarrito(${producto.id})">
                        Agregar al carrito
                    </button>

                </div>
            </div>
        `;
    });
}

cargarProductos();