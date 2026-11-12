    
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    console.log("RDCA - Renacer Digital iniciado correctamente");

    const enlacesInternos =
        document.querySelectorAll('a[href^="#"]');

    enlacesInternos.forEach(function (enlace) {

        enlace.addEventListener("click", function (event) {

            const destinoId = this.getAttribute("href");

            if (!destinoId || destinoId === "#") {
                return;
            }

            const destino = document.getElementById(
                destinoId.substring(1)
            );

            if (destino) {

                event.preventDefault();

                destino.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });

            }

        });

    });


    const navbar = document.querySelector(".navbar");

    function actualizarNavbar() {

        if (!navbar) return;

        if (window.scrollY > 25) {

            navbar.style.boxShadow =
                "0 8px 30px rgba(65, 42, 120, 0.10)";

            navbar.style.background =
                "rgba(255, 255, 255, 0.94)";

            navbar.style.backdropFilter = "blur(18px)";

        } else {

            navbar.style.boxShadow = "none";

            navbar.style.background =
                "rgba(255, 255, 255, 0.96)";

        }

    }

    if (navbar) {

        window.addEventListener(
            "scroll",
            actualizarNavbar,
            { passive: true }
        );

        actualizarNavbar();

    }


    const hero = document.querySelector(".hero");

    if (!hero) {
        return;
    }

    // Evitar duplicar los efectos

    let contenedor =
        hero.querySelector(".bubbles-container");

    if (!contenedor) {

        contenedor = document.createElement("div");

        contenedor.className = "bubbles-container";

        contenedor.setAttribute(
            "aria-hidden",
            "true"
        );

        hero.prepend(contenedor);

    }


    const movimientoReducido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (movimientoReducido) {
        return;
    }


    const cantidadBurbujas = 22;

    for (let i = 0; i < cantidadBurbujas; i++) {

        const burbuja = document.createElement("div");

        burbuja.className = "bubble";

        // Tamaño aleatorio

        const tamano = 20 + Math.random() * 110;

        burbuja.style.width = tamano + "px";
        burbuja.style.height = tamano + "px";

        // Posición horizontal

        burbuja.style.left =
            Math.random() * 100 + "%";

        // Duración del movimiento

        const duracion = 12 + Math.random() * 20;

        burbuja.style.animationDuration =
            duracion + "s";

        // Iniciar en distintas posiciones del ciclo

        burbuja.style.animationDelay =
            (-Math.random() * duracion) + "s";

        // Desplazamiento lateral

        const desplazamiento =
            Math.random() * 220 - 110;

        burbuja.style.setProperty(
            "--desplazamiento",
            desplazamiento + "px"
        );

        // Transparencia

        burbuja.style.opacity =
            0.3 + Math.random() * 0.4;

        contenedor.appendChild(burbuja);

    }



    const cantidadParticulas = 35;

    const coloresParticulas = [
        "#8b5cf6",
        "#10b981",
        "#38bdf8",
        "#a78bfa",
        "#34d399"
    ];

    for (let i = 0; i < cantidadParticulas; i++) {

        const particula = document.createElement("div");

        particula.className = "particle";

        // Tamaño pequeño

        const tamano = 2 + Math.random() * 5;

        particula.style.width = tamano + "px";
        particula.style.height = tamano + "px";

        // Posiciones aleatorias

        particula.style.left =
            Math.random() * 100 + "%";

        particula.style.top =
            Math.random() * 100 + "%";

        // Color aleatorio

        const color = coloresParticulas[
            Math.floor(
                Math.random() * coloresParticulas.length
            )
        ];

        particula.style.backgroundColor = color;
        particula.style.color = color;

        // Animación

        particula.style.animationDuration =
            (3 + Math.random() * 6) + "s";

        particula.style.animationDelay =
            (-Math.random() * 6) + "s";

        contenedor.appendChild(particula);

    }


    const tarjetas = document.querySelectorAll(
        ".feature-card"
    );

    if ("IntersectionObserver" in window) {

        const observador = new IntersectionObserver(
            function (entradas, observer) {

                entradas.forEach(function (entrada) {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entrada.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        tarjetas.forEach(function (tarjeta) {

            tarjeta.classList.add("reveal-card");

            observador.observe(tarjeta);

        });

    }



    const tarjetaProgreso =
        document.querySelector(".hero-card");

    if (tarjetaProgreso) {

        tarjetaProgreso.addEventListener(
            "mousemove",
            function (event) {

                if (window.innerWidth <= 900) {
                    return;
                }

                const rect =
                    tarjetaProgreso.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) / rect.width;

                const y =
                    (event.clientY - rect.top) / rect.height;

                const rotacionY = (x - 0.5) * 5;
                const rotacionX = (0.5 - y) * 5;

                tarjetaProgreso.style.transform =
                    `perspective(1000px)
                     rotateX(${rotacionX}deg)
                     rotateY(${rotacionY}deg)
                     translateY(-5px)`;

            }
        );

        tarjetaProgreso.addEventListener(
            "mouseleave",
            function () {

                tarjetaProgreso.style.transform = "";

            }
        );

    }



    console.log("Animaciones RDCA cargadas correctamente");
    console.log("Burbujas creadas:", cantidadBurbujas);
    console.log("Partículas creadas:", cantidadParticulas);

});
