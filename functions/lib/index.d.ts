import * as functions from "firebase-functions";
/**
 * Envía un correo al cliente con el contrato adjunto.
 * Requiere configurar en Firebase: SMTP_USER, SMTP_PASS (y opcional SMTP_HOST, SMTP_PORT).
 * Ejemplo Gmail: SMTP_USER=tu@gmail.com, SMTP_PASS=contraseña de aplicación
 */
export declare const sendContractEmail: functions.https.CallableFunction<any, Promise<{
    success: boolean;
    message: string;
}>, unknown>;
