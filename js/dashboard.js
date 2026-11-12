
"use strict";

/* ==========================================
   RDCA - RENACER DIGITAL
   DASHBOARD CONECTADO A SUPABASE
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const db = window.rdcaSupabase;

    if (!db) {
        console.error("No se encontró la conexión con Supabase.");
        alert("Error de conexión con Supabase.");
        return;
    }

    let usuarioActual = null;

    /* ======================================
       FUNCIONES GENERALES
    ====================================== */

    function elemento(id) {
        return document.getElementById(id);
    }

    function mostrarTexto(id, texto) {
        const el = elemento(id);

        if (el) {
            el.textContent = texto;
        }
    }

    function mostrarMensaje(id, texto, tipo = "success") {
        const el = elemento(id);

        if (!el) return;

        el.textContent = texto;
        el.className = "form-message " + tipo;
    }

    function mensajeError(error) {
        console.error("RDCA:", error);
        return "No se pudo completar la operación. Inténtalo nuevamente.";
    }

    /* ======================================
       VERIFICAR SESIÓN
    ====================================== */

    try {

        const { data, error } = await db.auth.getUser();

        if (error || !data.user) {
            window.location.replace("login.html");
            return;
        }

        usuarioActual = data.user;

        const nombre =
            usuarioActual.user_metadata?.nombre ||
            usuarioActual.email?.split("@")[0] ||
            "Usuario";

        const hora = new Date().getHours();

        let saludo = "Buenas noches";

        if (hora >= 5 && hora < 12) {
            saludo = "Buenos días";
        } else if (hora >= 12 && hora < 18) {
            saludo = "Buenas tardes";
        }

        mostrarTexto("nombreUsuario", nombre);
        mostrarTexto("correoUsuario", usuarioActual.email);
        mostrarTexto("saludoUsuario", saludo + ", " + nombre);

        await Promise.all([
            cargarPerfil(),
            cargarProceso(),
            cargarMetas(),
            cargarEmociones(),
            cargarRecaidas()
        ]);

    } catch (error) {
        console.error("Error de sesión:", error);
        mostrarTexto("saludoUsuario", "No se pudo cargar tu sesión");
        return;
    }

    /* ======================================
       CARGAR PERFIL
    ====================================== */

    async function cargarPerfil() {

        const { data, error } = await db
            .from("perfiles")
            .select("nombre, plan")
            .eq("id", usuarioActual.id)
            .maybeSingle();

        if (error) {
            console.error("Error al cargar perfil:", error);
            mostrarTexto("planUsuario", "No disponible");
            return;
        }

        mostrarTexto(
            "planUsuario",
            data?.plan || "Gratis"
        );
    }

    /* ======================================
       PROCESO PERSONAL
    ====================================== */

    async function cargarProceso() {

        const { data, error } = await db
            .from("procesos")
            .select("id, objetivo, fecha_inicio, estado")
            .eq("usuario_id", usuarioActual.id)
            .eq("estado", "activo")
            .order("fecha_inicio", { ascending: false })
            .limit(1);

        if (error) {
            console.error("Error al cargar proceso:", error);
            mostrarTexto("diasProgreso", "—");
            return;
        }

        if (!data || data.length === 0) {
            mostrarTexto("diasProgreso", "—");
            return;
        }

        const fechaInicio = new Date(
            data[0].fecha_inicio + "T00:00:00"
        );

        const hoy = new Date();

        fechaInicio.setHours(0, 0, 0, 0);
        hoy.setHours(0, 0, 0, 0);

        const dias = Math.max(
            0,
            Math.floor(
                (hoy - fechaInicio) / 86400000
            )
        );

        mostrarTexto("diasProgreso", dias);
    }

    /* ======================================
       CREAR PROCESO PERSONAL
    ====================================== */

    const formProceso = elemento("formProceso");

    if (formProceso) {

        formProceso.addEventListener("submit", async event => {

            event.preventDefault();

            const objetivo =
                elemento("objetivoProceso").value.trim();

            const fecha =
                elemento("fechaInicioProceso").value;

            if (!objetivo || !fecha) {
                mostrarMensaje(
                    "mensajeProceso",
                    "Completa todos los campos.",
                    "error"
                );
                return;
            }

            const { error } = await db
                .from("procesos")
                .insert({
                    usuario_id: usuarioActual.id,
                    objetivo: objetivo,
                    fecha_inicio: fecha,
                    estado: "activo"
                });

            if (error) {
                mostrarMensaje(
                    "mensajeProceso",
                    mensajeError(error),
                    "error"
                );
                return;
            }

            mostrarMensaje(
                "mensajeProceso",
                "Proceso registrado correctamente."
            );

            formProceso.reset();
            await cargarProceso();
        });
    }

    /* ======================================
       CARGAR METAS
    ====================================== */

    async function cargarMetas() {

        const { data, error } = await db
            .from("metas")
            .select("id, descripcion, completada, fecha_objetivo")
            .eq("usuario_id", usuarioActual.id)
            .order("fecha_creacion", { ascending: false });

        if (error) {
            console.error("Error al cargar metas:", error);
            mostrarTexto("totalMetas", "—");
            mostrarTexto("metasCumplidas", "—");
            mostrarTexto("totalMetasResumen", "—");
            return;
        }

        const metas = data || [];

        mostrarTexto("totalMetas", metas.length);
        mostrarTexto("totalMetasResumen", metas.length);

        mostrarTexto(
            "metasCumplidas",
            metas.filter(meta => meta.completada).length
        );

        const lista = elemento("listaMetas");

        if (!lista) return;

        lista.replaceChildren();

        if (metas.length === 0) {
            const vacio = document.createElement("p");
            vacio.textContent = "Todavía no tienes metas registradas.";
            lista.appendChild(vacio);
            return;
        }

        metas.forEach(meta => {

            const fila = document.createElement("div");
            fila.className = "meta-item";

            const texto = document.createElement("span");
            texto.textContent = meta.descripcion;

            if (meta.completada) {
                texto.style.textDecoration = "line-through";
                texto.style.opacity = "0.6";
            }

            const boton = document.createElement("button");
            boton.type = "button";

            boton.textContent = meta.completada
                ? "Reabrir"
                : "Completar";

            boton.addEventListener("click", async () => {

                boton.disabled = true;

                const { error } = await db
                    .from("metas")
                    .update({
                        completada: !meta.completada
                    })
                    .eq("id", meta.id)
                    .eq("usuario_id", usuarioActual.id);

                if (error) {
                    console.error("Error al actualizar meta:", error);
                    boton.disabled = false;
                    return;
                }

                await cargarMetas();
            });

            fila.append(texto, boton);
            lista.appendChild(fila);
        });
    }

    /* ======================================
       GUARDAR META
    ====================================== */

    const formMeta = elemento("formMeta");

    if (formMeta) {

        formMeta.addEventListener("submit", async event => {

            event.preventDefault();

            const descripcion =
                elemento("descripcionMeta").value.trim();

            const fecha =
                elemento("fechaObjetivoMeta").value;

            if (!descripcion) {
                mostrarMensaje(
                    "mensajeMeta",
                    "Escribe una meta.",
                    "error"
                );
                return;
            }

            const { error } = await db
                .from("metas")
                .insert({
                    usuario_id: usuarioActual.id,
                    descripcion: descripcion,
                    fecha_objetivo: fecha || null,
                    completada: false
                });

            if (error) {
                mostrarMensaje(
                    "mensajeMeta",
                    mensajeError(error),
                    "error"
                );
                return;
            }

            formMeta.reset();

            mostrarMensaje(
                "mensajeMeta",
                "Meta guardada correctamente."
            );

            await cargarMetas();
        });
    }

    /* ======================================
       CARGAR EMOCIONES
    ====================================== */

    async function cargarEmociones() {

        const { data, error } = await db
            .from("registros_emocionales")
            .select("estado_animo, ansiedad, nivel_impulso, fecha")
            .eq("usuario_id", usuarioActual.id)
            .order("fecha", { ascending: false })
            .limit(1);

        if (error) {
            console.error("Error al cargar emociones:", error);
            mostrarTexto("estadoAnimo", "—");
            return;
        }

        if (!data || data.length === 0) {
            mostrarTexto("estadoAnimo", "Sin registros");
            return;
        }

        mostrarTexto(
            "estadoAnimo",
            data[0].estado_animo + "/10"
        );
    }

    /* ======================================
       GUARDAR EMOCIÓN
    ====================================== */

    const formEmocion = elemento("formEmocion");

    if (formEmocion) {

        formEmocion.addEventListener("submit", async event => {

            event.preventDefault();

            const estado = Number(
                elemento("estadoAnimoInput").value
            );

            const ansiedad = Number(
                elemento("ansiedadInput").value
            );

            const impulso = Number(
                elemento("impulsoInput").value
            );

            const comentario =
                elemento("comentarioEmocion").value.trim();

            const valido = [estado, ansiedad, impulso]
                .every(valor =>
                    Number.isInteger(valor) &&
                    valor >= 1 &&
                    valor <= 10
                );

            if (!valido) {
                mostrarMensaje(
                    "mensajeEmocion",
                    "Selecciona valores entre 1 y 10.",
                    "error"
                );
                return;
            }

            const { error } = await db
                .from("registros_emocionales")
                .insert({
                    usuario_id: usuarioActual.id,
                    estado_animo: estado,
                    ansiedad: ansiedad,
                    nivel_impulso: impulso,
                    comentario: comentario
                });

            if (error) {
                mostrarMensaje(
                    "mensajeEmocion",
                    mensajeError(error),
                    "error"
                );
                return;
            }

            formEmocion.reset();

            mostrarMensaje(
                "mensajeEmocion",
                "Estado emocional guardado."
            );

            await cargarEmociones();
        });
    }

    /* ======================================
       CARGAR RECAÍDAS
    ====================================== */

    async function cargarRecaidas() {

        const { data, error } = await db
            .from("recaidas")
            .select("id")
            .eq("usuario_id", usuarioActual.id);

        if (error) {
            console.error("Error al cargar recaídas:", error);
            mostrarTexto("totalRecaidas", "—");
            return;
        }

        mostrarTexto("totalRecaidas", (data || []).length);
    }

    /* ======================================
       GUARDAR RECAÍDA
    ====================================== */

    const formRecaida = elemento("formRecaida");

    if (formRecaida) {

        formRecaida.addEventListener("submit", async event => {

            event.preventDefault();

            const descripcion =
                elemento("descripcionRecaida").value.trim();

            const desencadenante =
                elemento("desencadenanteRecaida").value.trim();

            if (!descripcion) {
                mostrarMensaje(
                    "mensajeRecaida",
                    "Escribe una descripción.",
                    "error"
                );
                return;
            }

            const { error } = await db
                .from("recaidas")
                .insert({
                    usuario_id: usuarioActual.id,
                    descripcion: descripcion,
                    desencadenante: desencadenante
                });

            if (error) {
                mostrarMensaje(
                    "mensajeRecaida",
                    mensajeError(error),
                    "error"
                );
                return;
            }

            formRecaida.reset();

            mostrarMensaje(
                "mensajeRecaida",
                "Registro guardado de forma privada."
            );

            await cargarRecaidas();
        });
    }

    /* ======================================
       CERRAR SESIÓN
    ====================================== */

    const cerrarSesion = elemento("cerrarSesion");

    if (cerrarSesion) {

        cerrarSesion.addEventListener("click", async () => {

            cerrarSesion.disabled = true;

            const { error } = await db.auth.signOut();

            if (error) {
                console.error("Error al cerrar sesión:", error);
                cerrarSesion.disabled = false;
                alert("No se pudo cerrar la sesión.");
                return;
            }

            window.location.replace("login.html");
        });
    }

    console.log("Dashboard RDCA inicializado correctamente.");

});
