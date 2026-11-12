
"use strict";

/* ==========================================
   RDCA - RESTABLECER CONTRASEÑA
   SUPABASE AUTH
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const db = window.rdcaSupabase;
    const form = document.getElementById("resetForm");
    const boton = document.getElementById("resetButton");
    const mensaje = document.getElementById("resetMessage");

    let recuperacionAutorizada = false;

    function mostrarMensaje(texto, tipo) {
        mensaje.textContent = texto;
        mensaje.className = "reset-message " + tipo;
    }

    function habilitarFormulario(habilitar) {
        boton.disabled = !habilitar;

        form.querySelectorAll("input").forEach(input => {
            input.disabled = !habilitar;
        });
    }

    habilitarFormulario(false);

    if (!db) {
        mostrarMensaje(
            "No se pudo cargar la conexión con Supabase.",
            "error"
        );
        return;
    }

    // El enlace de recuperación genera una sesión
    // temporal autorizada por Supabase.

    db.auth.onAuthStateChange((evento) => {
        if (evento === "PASSWORD_RECOVERY") {
            recuperacionAutorizada = true;
            habilitarFormulario(true);

            mostrarMensaje(
                "Enlace verificado. Puedes crear tu nueva contraseña.",
                "success"
            );
        }
    });

    try {
        // Procesar el enlace de recuperación.
        const url = new URL(window.location.href);
        const codigo = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const tipo = url.searchParams.get("type");

        if (tokenHash && tipo === "recovery") {
            const { error } = await db.auth.verifyOtp({
                token_hash: tokenHash,
                type: "recovery"
            });

            if (error) throw error;

            recuperacionAutorizada = true;
        } else if (codigo) {
            const { error } =
                await db.auth.exchangeCodeForSession(codigo);

            if (error) throw error;

            recuperacionAutorizada = true;
        }

        if (recuperacionAutorizada) {
            habilitarFormulario(true);

            mostrarMensaje(
                "Enlace verificado. Introduce tu nueva contraseña.",
                "success"
            );
        } else {
            mostrarMensaje(
                "Abre esta página desde el enlace de recuperación enviado a tu correo.",
                "error"
            );
        }

    } catch (error) {
        console.error("Error de recuperación:", error);

        mostrarMensaje(
            "El enlace es inválido o ha caducado. Solicita uno nuevo.",
            "error"
        );
    }

    // Guardar contraseña nueva

    form.addEventListener("submit", async event => {

        event.preventDefault();

        if (!recuperacionAutorizada) {
            mostrarMensaje(
                "Necesitas un enlace de recuperación válido.",
                "error"
            );
            return;
        }

        const password =
            document.getElementById("newPassword").value;

        const confirmar =
            document.getElementById("confirmPassword").value;

        if (password.length < 8) {
            mostrarMensaje(
                "La contraseña debe tener al menos 8 caracteres.",
                "error"
            );
            return;
        }

        if (password !== confirmar) {
            mostrarMensaje(
                "Las contraseñas no coinciden.",
                "error"
            );
            return;
        }

        boton.disabled = true;
        boton.textContent = "Guardando contraseña...";

        try {
            const { error } = await db.auth.updateUser({
                password: password
            });

            if (error) throw error;

            mostrarMensaje(
                "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
                "success"
            );

            form.reset();
            recuperacionAutorizada = false;
            habilitarFormulario(false);

            // Cerrar la sesión temporal de recuperación
            await db.auth.signOut();

        } catch (error) {
            console.error("Error al actualizar contraseña:", error);

            mostrarMensaje(
                "No se pudo actualizar la contraseña. Solicita un nuevo enlace e inténtalo otra vez.",
                "error"
            );

            boton.disabled = false;
        } finally {
            boton.textContent = "Guardar nueva contraseña →";
        }
    });

});
