
"use strict";

/* ==========================================
   RDCA - PREMIUM
   ANIMACIONES E INTERACCIONES
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // BURBUJAS ANIMADAS

    const contenedor =
        document.getElementById("premiumBubbles");

    if (
        contenedor &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        contenedor.replaceChildren();

        for (let i = 0; i < 25; i++) {

            const burbuja = document.createElement("div");
            burbuja.className = "premium-bubble";

            const tamano = 20 + Math.random() * 100;
            const duracion = 12 + Math.random() * 18;
            const desplazamiento = Math.random() * 200 - 100;

            burbuja.style.width = tamano + "px";
            burbuja.style.height = tamano + "px";

            burbuja.style.left =
                Math.random() * 100 + "%";

            burbuja.style.animationDuration =
                duracion + "s";

            burbuja.style.animationDelay =
                (-Math.random() * duracion) + "s";

            burbuja.style.setProperty(
                "--bubble-drift",
                desplazamiento + "px"
            );

            contenedor.appendChild(burbuja);
        }
    }

    // BOTONES PREMIUM

    const mensaje =
        document.getElementById("premiumMessage");

    document.querySelectorAll("[data-plan]")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const plan = boton.dataset.plan;

                if (mensaje) {
                    mensaje.textContent =
                        "El plan RDCA " + plan +
                        " estará disponible próximamente. " +
                        "Por ahora puedes continuar utilizando RDCA Gratis.";
                }

                mensaje?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            });
        });

    console.log("RDCA Premium cargado correctamente");

});
