let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
function renderizarCarrito() {
    const contenedor = document.getElementById("productosCarrito");
    const total = document.getElementById("totalCompra");
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        total.textContent = "Total: $0";
        return;
    }
    carrito.forEach(producto => {
        const { id, nombre, precio, cantidad } = producto;
        contenedor.innerHTML += `

            <div class="productoCarrito">
                <h5>${nombre}</h5>
                <p>Precio: $${precio}</p>

                <div class="controlesCantidad">
                    <button class="btn-disminuir" data-id="${id}">-</button>
                    <span class="cantidad">${cantidad}</span>
                    <button class="btn-aumentar" data-id="${id}">+</button>
                </div>

                <p>Subtotal: $${precio * cantidad}</p>
                <button class="btn-eliminar" data-id="${id}">
                    Eliminar
                </button>

            </div>
            <hr>
        `;
    });
    const totalCompra = carrito.reduce((acumulador, producto) => {
        return acumulador + producto.precio * producto.cantidad;
    }, 0);
    total.textContent = `Total: $${totalCompra}`;
    
    agregarEventosCarrito();
}

function agregarEventosCarrito() {
    document.querySelectorAll(".btn-aumentar").forEach(boton => {
        boton.addEventListener("click", () => {
            aumentarCantidad(Number(boton.dataset.id));
        });
    });
    document.querySelectorAll(".btn-disminuir").forEach(boton => {
        boton.addEventListener("click", () => {
            disminuirCantidad(Number(boton.dataset.id));
        });
    });
    document.querySelectorAll(".btn-eliminar").forEach(boton => {
        boton.addEventListener("click", () => {
            eliminarDelCarrito(Number(boton.dataset.id));
        });
    });
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(producto => producto.id === idProducto);
    
    if (!producto) return;

    if (producto.stock <= 0) {
        Toastify({
            text: "No hay stock disponible.",
            duration: 2000,
            gravity: "top",
            position: "right"
        }).showToast();
        return;
    }
    producto.stock--;
    const productoEnCarrito = carrito.find(item => item.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }
    guardarCarrito();
    renderizarProductos(productos);
    renderizarCarrito();
}

function eliminarDelCarrito(idProducto) {
    const productoCarrito = carrito.find(item => item.id === idProducto);
    const producto = productos.find(item => item.id === idProducto);

    producto.stock += productoCarrito.cantidad;
    carrito = carrito.filter(item => item.id !== idProducto);

    guardarCarrito();
    renderizarProductos(productos);
    renderizarCarrito();
}

function aumentarCantidad(idProducto) {
    const producto = productos.find(producto => producto.id === idProducto);

    if (producto.stock <= 0) {
        Toastify({
            text: "No hay más unidades disponibles.",
            duration: 2000,
            gravity: "top",
            position: "right"
        }).showToast();
        return;
    }
    producto.stock--;
    const productoCarrito = carrito.find(item => item.id === idProducto);
    productoCarrito.cantidad++;

    guardarCarrito();
    renderizarProductos(productos);
    renderizarCarrito();
}

function disminuirCantidad(idProducto) {
    const productoCarrito = carrito.find(item => item.id === idProducto);
    const producto = productos.find(item => item.id === idProducto);
    
    if (productoCarrito.cantidad > 1) {
        productoCarrito.cantidad--;
    } else {
        carrito = carrito.filter(item => item.id !== idProducto);
    }
    producto.stock++;

    guardarCarrito();
    renderizarProductos(productos);
    renderizarCarrito();
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        Toastify({
            text: "El carrito ya está vacío.",
            duration: 2000,
            gravity: "top",
            position: "right"
        }).showToast();
        return;
    }
    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los productos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then((resultado) => {

        if (resultado.isConfirmed) {
            carrito.forEach(item => {
                const producto = productos.find(producto => producto.id === item.id);
                
                if (producto) {
                    producto.stock += item.cantidad;
                }
            });
            carrito = [];

            guardarCarrito();
            renderizarProductos(productos);
            renderizarCarrito();

            Swal.fire({
                title: "Carrito vaciado",
                text: "Todos los productos fueron eliminados.",
                icon: "success"
            });
        }
    });
}

function finalizarCompra() {
    if (carrito.length === 0) {
        Toastify({
            text: "No hay productos en el carrito.",
            duration: 2000,
            gravity: "top",
            position: "right"
        }).showToast();
        return;
    }
    const total = carrito.reduce((acumulador, producto) => {
        return acumulador + producto.precio * producto.cantidad;
    }, 0);

    Swal.fire({
        title: "¿Confirmar compra?",
        html: `
            <p>Productos: <strong>${carrito.length}</strong></p>
            <p>Total a pagar: <strong>$${total}</strong></p>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Comprar",
        cancelButtonText: "Cancelar"
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            carrito = [];
            guardarCarrito();
            renderizarCarrito();

            Swal.fire({
                title: "¡Compra realizada!",
                text: "Gracias por tu compra.",
                icon: "success"
            });
        }
    });
}

const botonFinalizar = document.getElementById("finalizarCompra");

botonFinalizar.addEventListener("click", finalizarCompra);

const botonVaciar = document.getElementById("vaciarCarrito");

botonVaciar.addEventListener("click", vaciarCarrito);

renderizarCarrito();