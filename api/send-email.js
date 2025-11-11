const sgMail = require('@sendgrid/mail');

// Configura SendGrid con tu API Key
// IMPORTANTE: Usa una variable de entorno para la API Key.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Solo se permiten solicitudes POST' });
    }

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'El nombre y el correo son obligatorios' });
    }

    const pdfUrl = "https://github.com/Gerard2167/Landing_Herramientas_Markwting_Digital/raw/main/Gu%C3%ADa%207%20herrmientas%20de%20Marketing%20Digital.pdf";

    // Opciones del correo
    const msg = {
        to: email,
        // IMPORTANTE: Este correo DEBE ser un "Sender verificado" en tu cuenta de SendGrid.
        from: process.env.SENDGRID_VERIFIED_SENDER, 
        subject: '🚀 Aquí está tu guía gratuita de Marketing Digital',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>¡Hola ${name}!</h2>
                <p>Gracias por tu interés en potenciar tus habilidades de marketing.</p>
                <p>Como lo prometimos, aquí tienes el acceso a la guía con las 7 herramientas de marketing digital que te ayudarán a crecer.</p>
                <p style="text-align: center;">
                    <a href="${pdfUrl}" style="background-color: #007bff; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Descargar la Guía Ahora</a>
                </p>
                <p>El enlace de descarga es: <a href="${pdfUrl}">${pdfUrl}</a></p>
                <br>
                <p>¡Mucho éxito!</p>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo con SendGrid:', error);
        // Si hay errores, a menudo se encuentran en los 'body' de la respuesta
        if (error.response) {
            console.error(error.response.body);
        }
        res.status(500).json({ message: 'Ocurrió un error al enviar el correo.' });
    }
};