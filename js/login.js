
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const mensaje = document.getElementById("loginMessage");

    function mostrarMensaje(texto, tipo) {
        mensaje.textContent = texto;
        mensaje.className = "login-message " + tipo;
    }

    // Mostrar contraseña
    const toggle = document.getElementById("togglePassword");

    toggle.addEventListener("click", () => {
        const campo = document.getElementById("loginPassword");
        const visible = campo.type === "password";

        campo.type = visible ? "text" : "password";
        toggle.textContent = visible ? "🙈" : "👁";
    });

    // Recordar solamente el correo
    const emailInput = document.getElementById("loginEmail");
    const recordar = document.getElementById("rememberMe");

    const correoGuardado = localStorage.getItem("rdca_correo");

    if (correoGuardado) {
        emailInput.value = correoGuardado;
        recordar.checked = true;
    }

    // Iniciar sesión
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = document.getElementById("loginPassword").value;

        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;

        try {
            const { data, error } =
                await rdcaSupabase.auth.signInWithPassword({
                    email,
                    password
                });

            if (error) throw error;

            if (recordar.checked) {
                localStorage.setItem("rdca_correo", email);
            } else {
                localStorage.removeItem("rdca_correo");
            }

            mostrarMensaje(
                "Inicio de sesión correcto. Redirigiendo...",
                "success"
            );

            window.location.href = "dashboard.html";

        } catch (error) {
            mostrarMensaje(
                "No se pudo iniciar sesión. Revisa tus credenciales y confirma tu correo.",
                "error"
            );
        } finally {
            boton.disabled = false;
        }
    });

    // Recuperar contraseña
    document.getElementById("forgotPassword")
        .addEventListener("click", async (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();

            if (!email) {
                mostrarMensaje(
                    "Primero escribe tu correo electrónico.",
                    "error"
                );
                return;
            }

            try {
                const { error } =
                    await rdcaSupabase.auth.resetPasswordForEmail(
                        email,
                        {
                            redirectTo: new URL(
                                "restablecer.html",
                                window.location.href
                            ).href
                        }
                    );

                if (error) throw error;

                mostrarMensaje(
                    "Si existe una cuenta asociada, recibirás instrucciones por correo.",
                    "success"
                );

       

} catch (error) {
    console.error("Error real de Supabase:", error);

    mostrarMensaje(
        "Error: " + (error.message || "Error desconocido"),
        "error"
    );
}


        });

    // Burbujas del login
    const contenedor = document.getElementById("loginBubbles");

    if (
        contenedor &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        for (let i = 0; i < 18; i++) {
            const burbuja = document.createElement("div");
            burbuja.className = "login-bubble";

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
