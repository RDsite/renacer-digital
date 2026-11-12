
"use strict";

/* RDCA - ASISTENTE DE RESPUESTAS GUIADAS */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("iaForm");
    const input = document.getElementById("iaInput");
    const mensajes = document.getElementById("iaMessages");

    function agregarMensaje(texto, tipo) {
        const div = document.createElement("div");

        div.className = "ia-message " + tipo;
        div.textContent = texto;

        mensajes.appendChild(div);
        mensajes.scrollTop = mensajes.scrollHeight;
    }

    function normalizar(texto) {
        return texto.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function obtenerRespuesta(texto) {
        const t = normalizar(texto);

        // Situaciones de riesgo inmediato
        if (
            /suicid|quitarme la vida|matarme|hacerme dano|autolesion|no quiero vivir/.test(t)
        ) {
            return "Lamento que estés pasando por un momento tan difícil. Tu seguridad es lo más importante. Busca ahora a una persona de confianza que pueda acompañarte y procura no quedarte solo. Si hay peligro inmediato, llama al 911 en Costa Rica o a emergencias de tu país. ¿Estás en un lugar seguro en este momento?";
        }

        // Posibles síntomas de abstinencia grave
        if (
            /convulsion|alucinacion|confusion intensa|abstinencia grave|delirium/.test(t)
        ) {
            return "Algunos síntomas de abstinencia pueden ser peligrosos. Si estás experimentando convulsiones, confusión intensa o alucinaciones, busca atención médica de emergencia. No intentes manejar estos síntomas únicamente con esta herramienta.";
        }

        // Recaídas
        if (
            /recaida|recai|volvi a consumir|volvi a apostar/.test(t)
        ) {
            return "Una recaída no borra los avances que has conseguido. Puede ser útil identificar qué ocurrió antes, cómo te sentías y qué apoyo necesitas ahora. Si consumiste alguna sustancia y tienes síntomas preocupantes, busca atención médica. ¿Quieres contarme qué situación desencadenó este momento?";
        }

        // Impulsos
        if (
            /ganas de consumir|ganas de recaer|impulso|tentacion|necesito consumir/.test(t)
        ) {
            return "Los impulsos pueden ser intensos, pero también pueden cambiar con el tiempo. Si es seguro hacerlo, aléjate del desencadenante, contacta a alguien de confianza y busca una actividad breve que te ayude a atravesar este momento. ¿Qué estaba ocurriendo cuando comenzó el impulso?";
        }

        // Ansiedad
        if (
            /ansiedad|ansioso|ansiosa|nervioso|nerviosa|panico/.test(t)
        ) {
            return "Siento que estés experimentando ansiedad. Si te resulta cómodo, prueba respirar lentamente, con una exhalación suave, y observa cinco cosas a tu alrededor. También puedes contactar a alguien de confianza. ¿Hay alguna situación específica que esté aumentando tu ansiedad?";
        }

        // Tristeza
        if (
            /triste|deprimido|deprimida|solo|sola|llorar/.test(t)
        ) {
            return "Gracias por compartir cómo te sientes. No necesitas resolverlo todo ahora. Puede ayudarte hablar con alguien de confianza o realizar una actividad pequeña que te resulte reconfortante. ¿Quieres contarme qué ha sido lo más difícil de tu día?";
        }

        // Enojo
        if (
            /enojo|enojado|enojada|ira|furioso|frustrado/.test(t)
        ) {
            return "El enojo puede resultar agotador. Si puedes, toma distancia unos minutos de la situación y trata de identificar qué necesitas en este momento. ¿Qué ocurrió para que te sintieras así?";
        }

        // Avances
        if (
            /me siento bien|estoy feliz|logre|avance|llevo.*dias|orgulloso|orgullosa/.test(t)
        ) {
            return "Me alegra que puedas reconocer este avance. Los pequeños logros también merecen atención. ¿Qué hiciste hoy que te gustaría repetir o mantener durante tu proceso?";
        }

        // Ayuda
        if (
            /ayuda|no se que hacer|necesito hablar/.test(t)
        ) {
            return "Estoy aquí para ofrecerte orientación guiada. Podemos hablar sobre cómo te sientes, identificar un desencadenante o pensar en un pequeño paso para hoy. ¿Qué es lo que más te preocupa ahora?";
        }

        return "Gracias por compartirlo conmigo. Quiero comprender mejor lo que estás viviendo. ¿Cómo te hizo sentir esa situación y qué tipo de apoyo crees que necesitas en este momento?";
    }

    function enviar(texto) {
        const mensaje = texto.trim();

        if (!mensaje) return;

        agregarMensaje(mensaje, "user");

        const respuesta = obtenerRespuesta(mensaje);

        agregarMensaje(respuesta, "bot");
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        enviar(input.value);

        input.value = "";
        input.focus();
    });

    document.querySelectorAll("[data-message]")
        .forEach(boton => {
            boton.addEventListener("click", () => {
                enviar(boton.dataset.message);
            });
        });

});
