// ocultar id formContainer al cargar la pagina jquery
$(document).ready(function () {
    $('#formContainer').addClass('d-none');
});

const mostrarFormularioGuardar = () => {
    $('#nombre').val('');
    $('#precio').val('');
    $('#cantidad').val('');
    $('#valorEnvio').val('');
    $('#id').val('');
    $('#formContainer').removeClass('d-none');
    $('#formContainer').addClass('w-100 fixed-top vh-100 d-flex flex-column bg-light');
    $('#btnGuardar').removeClass('d-none');
    $('#btnActualizar').addClass('d-none');
}
const mostrarFormularioEditar = () => {
    $('#formContainer').removeClass('d-none');
    $('#formContainer').addClass('w-100 fixed-top vh-100 d-flex flex-column bg-light');
    $('#btnGuardar').addClass('d-none');
    $('#btnActualizar').removeClass('d-none');
}
const mostrarFormularioVer = () => {
    $('#formContainer').removeClass('d-none');
    $('#formContainer').addClass('w-100 fixed-top vh-100 d-flex flex-column bg-light');
    $('#btnGuardar').addClass('d-none');
    $('#btnActualizar').addClass('d-none');
}
const ocultarFormulario = () => {
    $('#formContainer').addClass('d-none');
}



const guardar = () => {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const cantidad = document.getElementById('cantidad').value;
    const despacho = document.getElementById('despacho').value;
    const valorEnvio = document.getElementById('valorEnvio').value;

    if (nombre === '' || precio === '' || cantidad === '' || valorEnvio === '') {
        nombre === '' ? document.getElementById('nombre').classList.add('is-invalid') : document.getElementById('nombre').classList.remove('is-invalid');
        precio === '' ? document.getElementById('precio').classList.add('is-invalid') : document.getElementById('precio').classList.remove('is-invalid');
        cantidad === '' ? document.getElementById('cantidad').classList.add('is-invalid') : document.getElementById('cantidad').classList.remove('is-invalid');
        valorEnvio === '' ? document.getElementById('valorEnvio').classList.add('is-invalid') : document.getElementById('valorEnvio').classList.remove('is-invalid');
        return;
    }
    const type = 'guardar';
    const datos = {
        nombre,
        precio,
        cantidad,
        despacho,
        valorEnvio,
        type
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost/CRISTIANOLEA_EV03/php/server.php',
        data: datos,
        beforeSend: function () {
            $('#btnGuardar').attr('disabled', true);
        },
    })
        .done(function (data) {
            $('#nombre').val('');
            $('#precio').val('');
            $('#cantidad').val('');
            $('#valorEnvio').val('');
            const datos = JSON.parse(data);
            const estado = datos.estado;
            const mensaje = datos.mensaje;

            $('#btnGuardar').attr('disabled', false);
            $('#formulario').append(`
            <div class="alert ${estado === 'ok' ? "alert-success" : "alert-danger"} alert-dismissible fade show col-6 mx-auto" role="alert">
                <strong>${mensaje}!</strong>
                <button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
            setTimeout(() => {
                $('.alert').remove();
            }, 2000);
        })
        .fail(function () {
            $('#nombre').val('');
            $('#precio').val('');
            $('#cantidad').val('');
            $('#valorEnvio').val('');

            $('#fotmulario').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Producto no guardado!</strong> El producto no se ha guardado correctamente.
                <button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
            setTimeout(() => {
                $('.alert').remove();
            }, 2000);
        })
}
$(document).ready(function () {    
        listar(1);
});
const listar = (page) => {
    $.ajax({
        type: 'GET',
        url: `http://localhost/CRISTIANOLEA_EV03/php/server.php?type=listar&page=${page}&limit=5`,
        beforeSend: function () {
            
        },
    })
    .done(function (data) {
        const respuesta = JSON.parse(data);
        const listaDatos = respuesta.productos;
        const total = respuesta.totalPaginas;
        $('#datosTabla').html(
            listaDatos.map((dato) => {
                return `<tr>
                    <td>${dato.nombre}</td>
                    <td>${dato.precio}</td>
                    <td>${dato.cantidad}</td>
                    <td>${dato.despacho}</td>
                    <td>${dato.valorEnvio}</td>
                    <td>                        
                        <img class="img img-fluid" src="img/eliminarIMG.JPG" type="button" onclick="eliminar(${dato.id})"></img>
                        <img class="img img-fluid" src="img/buscarIMG.JPG" type="button" onclick="ver(${dato.id})"></img>
                        <img class="img img-fluid" src="img/editarIMG.JPG" type="button" onclick="llenarFormularioEditar(${dato.id})"></img>
                    </td>
                </tr>`;                
            })
        );           
        /* paginado */
        
        $('#paginado').html(
            // paginado hasta const total
            Array.from({length: total}, (_, i) => i + 1).map((numero) => {
                return `<li class="page-item ${numero === page ? 'active' : ''}">
                    <button class="btn ${numero === page ? 'btn-success' : 'btn-outline-success'} ${numero === page ? 'disabled' : ''}" href="#" onclick="listar(${numero})">${numero}</button>
                </li>`;
            })
        )            
    })
    .fail(function () {
        console.log('error');
    })
}

const llenarFormularioEditar = (id) => {
    console.log(id);
    $.ajax({
        type: 'GET',
        url: `http://localhost/CRISTIANOLEA_EV03/php/server.php?id=${id}&type=obtenerProducto`,
        beforeSend: function () {
            console.log('enviando');
        },
    })
    .done(function (data) {
        const producto = JSON.parse(data);
        console.log(producto);
        $('#nombre').val(producto.nombre);
        $('#precio').val(producto.precio);
        $('#cantidad').val(producto.cantidad);
        $('#despacho').val(producto.despacho);
        $('#valorEnvio').val(producto.valorEnvio);
        $('#id').val(producto.id);
        mostrarFormularioEditar();           
    })
    .fail(function () {
        console.log('error');
    })
}
const actualizar = () => {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const cantidad = document.getElementById('cantidad').value;
    const despacho = document.getElementById('despacho').value;
    const valorEnvio = document.getElementById('valorEnvio').value;
    const id = document.getElementById('id').value;
    if(nombre === '' || precio === '' || cantidad === '' || valorEnvio === ''){
        nombre === '' ? document.getElementById('nombre').classList.add('is-invalid') : document.getElementById('nombre').classList.remove('is-invalid');
        precio === '' ? document.getElementById('precio').classList.add('is-invalid') : document.getElementById('precio').classList.remove('is-invalid');
        cantidad === '' ? document.getElementById('cantidad').classList.add('is-invalid') : document.getElementById('cantidad').classList.remove('is-invalid');
        valorEnvio === '' ? document.getElementById('valorEnvio').classList.add('is-invalid') : document.getElementById('valorEnvio').classList.remove('is-invalid');
        return;
    }
    const type = 'actualizar';
    const datos = {
        nombre,
        precio,
        cantidad,
        despacho,
        valorEnvio,
        id,
        type
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost/CRISTIANOLEA_EV03/php/server.php',
        data: datos,
        beforeSend: function () {
            $('#btnActualizar').attr('disabled', true);
        },
    })
        .done(function (data) {
            const datos = JSON.parse(data);
            const estado = datos.estado;
            const mensaje = datos.mensaje;
            $('#btnActualizar').attr('disabled', false);
            $('#formulario').append(`
            <div class="alert ${estado === 'ok' ? "alert-success" : "alert-danger"} alert-dismissible fade show col-6 mx-auto" role="alert">
                <strong>${mensaje}!</strong>
                <button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
            listar(1);

        })
        .fail(function () {
            $('#btnActualizar').attr('disabled', false);
            $('#formulario').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Producto no actualizado!</strong> El producto no se ha actualizado correctamente.
                <button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        })
}
const eliminar = (id) => {
    $.ajax({
        type: 'POST',
        url: 'http://localhost/CRISTIANOLEA_EV03/php/server.php',
        data: {
            id,
            type: 'eliminar'
        },
        beforeSend: function () {
            console.log('enviando');
        }
    })
    .done(function (data) {
        const datos = JSON.parse(data);
        const estado = datos.estado;
        const mensaje = datos.mensaje;
        $('#listado').append(`
            <div class="alert ${estado === 'ok' ? "alert-success" : "alert-danger"} alert-dismissible fade show col-6 mx-auto" role="alert">
                <strong>${mensaje}!</strong>
                <button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        listar(1);
    })
    .fail(function () {
        console.log('error');
    })
}
const ver = (id) => {
    console.log(id);
    $.ajax({
        type: 'GET',
        url: `http://localhost/CRISTIANOLEA_EV03/php/server.php?id=${id}&type=obtenerProducto`,
        beforeSend: function () {
            console.log('enviando');
        },
    })
    .done(function (data) {
        const producto = JSON.parse(data);
        console.log(producto);
        $('#nombre').val(producto.nombre);
        $('#precio').val(producto.precio);
        $('#cantidad').val(producto.cantidad);
        $('#despacho').val(producto.despacho);
        $('#valorEnvio').val(producto.valorEnvio);
        $('#id').val(producto.id);
        mostrarFormularioVer();           
    })
    .fail(function () {
        console.log('error');
    })
}



// funcion solo numeros para el input precio
function soloNumeros(evt) {
    // code is the decimal ASCII representation of the pressed key.
    let code = (evt.which) ? evt.which : evt.keyCode;
    if (code == 8) { // backspace.
        return true;
    } else if (code >= 48 && code <= 57) { // is a number.
        return true;
    } else { // other keys.
        return false;
    }
}



