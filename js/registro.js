
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registroForm");
    const mensaje = document.getElementById("registroMensaje");

    function mostrarMensaje(texto, tipo) {
        mensaje.textContent = texto;
        mensaje.className = "form-message " + tipo;
    }

    // Mostrar u ocultar contraseñas
    document.querySelectorAll(".show-password").forEach(boton => {
        boton.addEventListener("click", () => {
            const campo = document.getElementById(
                boton.dataset.target
            );

            if (!campo) return;

            const visible = campo.type === "password";
            campo.type = visible ? "text" : "password";
            boton.textContent = visible ? "🙈" : "👁";
        });
    });

    // Registro real
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmar = document.getElementById("confirmPassword").value;
        const terminos = document.getElementById("terminos").checked;

        if (nombre.length < 2) {
            mostrarMensaje("Ingresa un nombre válido.", "error");
            return;
        }

        if (password.length < 8) {
            mostrarMensaje("La contraseña necesita al menos 8 caracteres.", "error");
            return;
        }

        if (password !== confirmar) {
            mostrarMensaje("Las contraseñas no coinciden.", "error");
            return;
        }

        if (!terminos) {
            mostrarMensaje("Debes aceptar los términos y la privacidad.", "error");
            return;
        }

        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.textContent = "Creando cuenta...";

        try {
            const { data, error } = await rdcaSupabase.auth.signUp({
                email,
                password,
                options: {
                    data: { nombre },
                    emailRedirectTo: new URL(
                        "login.html",
                        window.location.href
                    ).href
                }
            });

            if (error) throw error;

            if (data.session) {
                mostrarMensaje(
                    "Cuenta creada. Ya puedes acceder a tu espacio.",
                    "success"
                );
            } else {
                mostrarMensaje(
                    "Solicitud recibida. Revisa tu correo para confirmar tu cuenta.",
                    "success"
                );
            }

            form.reset();

        } catch (error) {
            mostrarMensaje(
                "No se pudo completar el registro: " + error.message,
                "error"
            );
        } finally {
            boton.disabled = false;
            boton.textContent = "Crear mi cuenta →";
        }
    });

    // Burbujas decorativas
    const contenedor = document.getElementById("registroBubbles");

    if (
        contenedor &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        for (let i = 0; i < 18; i++) {
            const burbuja = document.createElement("div");
            burbuja.className = "registro-bubble";

            const tamano = 20 + Math.random() * 100;

            burbuja.style.width = tamano + "px";
            burbuja.style.height = tamano + "px";
            burbuja.style.left = Math.random() * 100 + "%";
            burbuja.style.animationDuration =
                (12 + Math.random() * 18) + "s";
            burbuja.style.animationDelay =
                (-Math.random() * 25) + "s";

            contenedor.appendChild(burbuja);
        }
    }
});
