$(document).ready(function () {

    // crear un saldo inicial si la pagina no lo tiene
    if (!localStorage.getItem("saldo")) {
        localStorage.setItem("saldo", "150000");
    }

    // mostrar el saldo cargado
    var miSaldo = localStorage.getItem("saldo");
    $("#verSaldo").text("$" + miSaldo);
    $(".verSaldo").text("$" + miSaldo);

    // lista simple de contactos para probar
    var contactos = ["Juan Perez", "Maria Gomez", "Carlos Soto", "Ana Rivas"];

    // 1. Validar el Login
    $("#loginForm").submit(function (e) {
        e.preventDefault();
        var correo = $("#email").val();
        var clave = $("#password").val();

        if (correo == "user@alkewallet.com" && clave == "123456") {
            window.location.href = "menu.html";
        } else {
            $("#error").removeClass("d-none");
        }
    });

    // 2. Boton salir
    $("#btnSalir").click(function () {
        window.location.href = "index.html";
    });

    // 3. Depositar dinero
    $("#formDeposito").submit(function (e) {
        e.preventDefault();
        var suma = parseInt($("#monto").val());
        var actual = parseInt(localStorage.getItem("saldo"));

        var total = actual + suma;
        localStorage.setItem("saldo", total);

        guardarMovimiento("Depósito", "Carga de dinero", "+$" + suma);

        $("#mensaje").removeClass("d-none");
        setTimeout(function () {
            window.location.href = "menu.html";
        }, 1500);
    });

    // 4. Buscar contactos sencillos
    $("#buscar").keyup(function () {
        var texto = $(this).val().toLowerCase();
        $("#lista").empty();

        if (texto != "") {
            for (var i = 0; i < contactos.length; i++) {
                if (contactos[i].toLowerCase().indexOf(texto) != -1) {
                    $("#lista").append('<button type="button" class="list-group-item item-c">' + contactos[i] + '</button>');
                }
            }
        }
    });

    // Seleccionar contacto
    $(document).on("click", ".item-c", function () {
        var nombre = $(this).text();
        $("#contacto").val(nombre);
        $("#lista").empty();
        $("#buscar").val("");
    });

    // 5. Transferir
    $("#formTransferir").submit(function (e) {
        e.preventDefault();
        var monto = parseInt($("#montoEnvio").val());
        var persona = $("#contacto").val();
        var actual = parseInt(localStorage.getItem("saldo"));

        if (monto > actual) {
            alert("No tienes suficiente saldo.");
        } else {
            var resta = actual - monto;
            localStorage.setItem("saldo", resta);

            guardarMovimiento("Envío", "Transferencia a " + persona, "-$" + monto);

            $("#msgOk").removeClass("d-none");
            setTimeout(function () {
                window.location.href = "menu.html";
            }, 1500);
        }
    });

    // Guardar en el historial del navegador
    function guardarMovimiento(tipo, detalle, monto) {
        var movs = JSON.parse(localStorage.getItem("movimientos")) || [];
        movs.unshift({
            tipo: tipo,
            detalle: detalle,
            monto: monto
        });
        localStorage.setItem("movimientos", JSON.stringify(movs));
    }

    // 6. Cargar la lista en la pantalla de historial
    if ($("#listaMovimientos").length > 0) {
        var movs = JSON.parse(localStorage.getItem("movimientos")) || [
            { tipo: "Depósito", detalle: "Carga inicial", monto: "+$50000" }
        ];

        for (var i = 0; i < movs.length; i++) {
            $("#listaMovimientos").append(
                '<li class="list-group-item d-flex justify-content-between">' +
                    '<div><strong>' + movs[i].tipo + '</strong> - ' + movs[i].detalle + '</div>' +
                    '<span>' + movs[i].monto + '</span>' +
                '</li>'
            );
        }
    }

});
