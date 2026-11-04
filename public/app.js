const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");

const startCamera = document.getElementById("startCamera");
const takePhoto = document.getElementById("takePhoto");
const retakePhoto = document.getElementById("retakePhoto");
const sendEmail = document.getElementById("sendEmail");

const email = document.getElementById("email");
const message = document.getElementById("message");

let stream = null;
let photoData = null;


// ACTIVAR CÁMARA
startCamera.addEventListener("click", async () => {

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        video.srcObject = stream;

        message.textContent = "Cámara activada.";

    } catch (error) {

        console.error(error);

        message.textContent =
            "No se pudo acceder a la cámara.";

    }

});


// TOMAR FOTO
takePhoto.addEventListener("click", () => {

    if (!stream) {

        message.textContent =
            "Primero activa la cámara.";

        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    photoData = canvas.toDataURL("image/jpeg", 0.9);

    photo.src = photoData;

    message.textContent =
        "Fotografía capturada correctamente.";

});


// REPETIR FOTO
retakePhoto.addEventListener("click", () => {

    photoData = null;

    photo.src = "";

    message.textContent =
        "Puedes tomar una nueva fotografía.";

});


// ENVIAR FOTO
sendEmail.addEventListener("click", async () => {

    if (!photoData) {

        message.textContent =
            "Primero debes tomar una fotografía.";

        return;
    }

    if (!email.value) {

        message.textContent =
            "Escribe el correo destinatario.";

        return;
    }

    message.textContent =
        "Enviando fotografía...";

    try {

        const response = await fetch("/send-email", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email.value,
                image: photoData
            })

        });

        const result = await response.json();

        if (result.success) {

            message.textContent =
                "✅ Fotografía enviada correctamente.";

        } else {

            message.textContent =
                "❌ No se pudo enviar la fotografía.";

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "❌ Error al comunicarse con el servidor.";

    }

});
