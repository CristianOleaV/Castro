<?php
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length');
    header('Access-Control-Allow-Origin: *');    
    date_default_timezone_set('America/Santiago');
    require ('conexion.php');
    $metodo = $_SERVER["REQUEST_METHOD"];   
    $ruta = implode("/", array_slice(explode("/", $_SERVER["REQUEST_URI"]), 3));
    $datosPUT = fopen("php://input", "r");

    if($metodo == "POST"){
        $type = $_POST['type'];
        switch ($type) {
            case 'guardar':
                $nombre = $_POST["nombre"];
                $precio = $_POST["precio"];
                $cantidad = $_POST["cantidad"];
                $despacho = $_POST["despacho"];
                $valorEnvio = $_POST["valorEnvio"];
                $falloInsert = ['estado' => 'error', 'mensaje' => 'No se pudo insertar el producto'];
                $falloInsertJson = json_encode($falloInsert);
                $consulta = "INSERT INTO productos (nombre, precio, cantidad, despacho, valorEnvio) VALUES ('$nombre', '$precio', '$cantidad', '$despacho', '$valorEnvio')";
                $mostrar = mysqli_query($conexion, $consulta)
                or die($falloInsertJson);
                $exitoInsert = ['estado' => 'ok', 'mensaje' => 'Producto insertado'];
                $exitoInsertJson = json_encode($exitoInsert);
                echo $exitoInsertJson;
                break;
            case 'actualizar':
                $id = $_POST["id"];
                $nombre = $_POST["nombre"];
                $precio = $_POST["precio"];
                $cantidad = $_POST["cantidad"];
                $despacho = $_POST["despacho"];
                $valorEnvio = $_POST["valorEnvio"];
                $falloUpdate = ['estado' => 'error', 'mensaje' => 'No se pudo actualizar el producto'];
                $falloUpdateJson = json_encode($falloUpdate);
                $consulta = "UPDATE productos SET nombre = '$nombre', precio = '$precio', cantidad = '$cantidad', despacho = '$despacho', valorEnvio = '$valorEnvio' WHERE id = '$id'";
                $mostrar = mysqli_query($conexion, $consulta)
                or die($falloUpdateJson);
                $exitoUpdate = ['estado' => 'ok', 'mensaje' => 'Producto actualizado'];
                $exitoUpdateJson = json_encode($exitoUpdate);
                echo $exitoUpdateJson;
                break;
            case 'eliminar':
                $id = $_POST["id"];
                $falloDelete = ['estado' => 'error', 'mensaje' => 'No se pudo eliminar el producto'];
                $falloDeleteJson = json_encode($falloDelete);
                $consulta = "DELETE FROM productos WHERE id = '$id'";
                $mostrar = mysqli_query($conexion, $consulta)
                or die($falloDeleteJson);
                $exitoDelete = ['estado' => 'ok', 'mensaje' => 'Producto eliminado'];
                $exitoDeleteJson = json_encode($exitoDelete);
                echo $exitoDeleteJson;
                break;
            
            default:
                # code...
                break;
        }

    }

    if($metodo == "GET"){
        $type = $_GET["type"];
        switch ($type) {
            case 'listar':
                $page = $_GET["page"];
                $limit = $_GET["limit"];
                $offset = ($page - 1) * $limit;
                // total paginas
                $consultaTotal = "SELECT COUNT(*) AS total FROM productos";
                $mostrarTotal = mysqli_query($conexion, $consultaTotal);
                $total = mysqli_fetch_assoc($mostrarTotal);
                $totalPaginas = ceil($total['total'] / $limit);
                // productos
                $consulta = "SELECT * FROM productos LIMIT $limit OFFSET $offset";
                $mostrar = mysqli_query($conexion, $consulta);
                $productos = [];
                while($fila = mysqli_fetch_assoc($mostrar)){
                    $productos[] = $fila;
                }
                $respuesta = ['productos' => $productos, 'totalPaginas' => $totalPaginas];
                $respuestaJson = json_encode($respuesta);
                echo $respuestaJson;
                break;



                /* $falloSelect = ['estado' => 'error', 'mensaje' => 'No se pudo obtener los productos'];
                $falloSelectJson = json_encode($falloSelect);
                $consulta = "SELECT * FROM productos";
                $mostrar = mysqli_query($conexion, $consulta)
                or die($falloSelectJson);
                $productos = [];
                while($fila = mysqli_fetch_assoc($mostrar)){
                    $productos[] = $fila;
                }
                $productosJson = json_encode($productos);
                echo $productosJson; */
                # code...
            case 'obtenerProducto':
                $id = $_GET["id"];
                $falloSelect = ['estado' => 'error', 'mensaje' => 'No se pudo obtener el producto'];
                $falloSelectJson = json_encode($falloSelect);
                $consulta = "SELECT * FROM productos WHERE id = '$id'";
                $mostrar = mysqli_query($conexion, $consulta)
                or die($falloSelectJson);
                $producto = mysqli_fetch_assoc($mostrar);
                $productoJson = json_encode($producto);
                echo $productoJson;
                break;
            
            default:
                # code...
                break;
        }
    }
    
?>