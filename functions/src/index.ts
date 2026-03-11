import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import axios from "axios";

admin.initializeApp();

/**
 * Envía un correo al cliente con el contrato adjunto.
 * Requiere configurar en Firebase: SMTP_USER, SMTP_PASS (y opcional SMTP_HOST, SMTP_PORT).
 * Ejemplo Gmail: SMTP_USER=tu@gmail.com, SMTP_PASS=contraseña de aplicación
 */
export const sendContractEmail = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Debe iniciar sesión.");
  }

  const { to, clientName, contractUrl, contractFileName } = request.data;
  if (!to || typeof to !== "string" || !to.trim()) {
    throw new functions.https.HttpsError("invalid-argument", "Falta el correo del destinatario.");
  }
  if (!contractUrl || typeof contractUrl !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "Falta la URL del contrato.");
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "No está configurado el envío de correo (SMTP_USER/SMTP_PASS). Contacte al administrador."
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  let attachment: { filename: string; content: Buffer } | undefined;
  try {
    const response = await axios.get(contractUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const name = contractFileName && typeof contractFileName === "string"
      ? contractFileName
      : `contrato_${clientName || "cliente"}.pdf`;
    attachment = { filename: name, content: buffer };
  } catch (err) {
    console.error("Error descargando contrato:", err);
    throw new functions.https.HttpsError(
      "internal",
      "No se pudo obtener el archivo del contrato para adjuntar."
    );
  }

  const mailOptions = {
    from: `"Epass Admin" <${smtpUser}>`,
    to: to.trim(),
    subject: `Contrato - ${clientName || "Cliente"}`,
    text: `Hola,\n\nAdjunto encontrará su contrato.\n\nSaludos.`,
    html: `<p>Hola,</p><p>Adjunto encontrará su contrato.</p><p>Saludos.</p>`,
    attachments: [attachment],
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Correo enviado correctamente." };
  } catch (err: any) {
    console.error("Error enviando correo:", err);
    throw new functions.https.HttpsError(
      "internal",
      err?.message || "Error al enviar el correo."
    );
  }
});
