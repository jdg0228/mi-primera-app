require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(express.json({
    limit: "10mb"
}));

app.use(express.static(
    path.join(__dirname, "public")
));

// CONFIGURACIÓN DEL CORREO
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// ENDPOINT PARA ENVIAR LA FOTO
app.post("/send-email", async (req, res) => {
    try {

        const { email, image } = req.body;

        if (!email || !image) {
            return res.status(400).json({
                success: false,
                message: "Faltan datos."
            });
        }

        // Convertir Base64 a Buffer
        const base64Data = image.replace(
            /^data:image\/jpeg;base64,/,
            ""
        );

        const imageBuffer = Buffer.from(
            base64Data,
            "base64"
        );

        // Enviar correo
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Fotografía tomada desde la webcam",
            text: "Se adjunta la fotografía tomada desde la aplicación web.",
            attachments: [
                {
                    filename: "fotografia.jpg",
                    content: imageBuffer,
                    contentType: "image/jpeg"
                }
            ]
        });

        res.json({
            success: true,
            message: "Correo enviado correctamente."
        });

    } catch (error) {

        console.error("Error enviando correo:", error);

        res.status(500).json({
            success: false,
            message: "Error enviando el correo."
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});