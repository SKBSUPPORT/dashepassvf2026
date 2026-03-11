# Cloud Functions - Envío de contrato por correo

## Configuración del correo (SMTP)

Para que el botón **Enviar** envíe el correo con el contrato adjunto, debes configurar el servidor de correo.

### Opción 1: Gmail

1. En tu cuenta de Google activa **Verificación en 2 pasos**.
2. Crea una **Contraseña de aplicación**: Cuenta de Google → Seguridad → Contraseñas de aplicaciones → Generar (elige “Correo” y “Otro”).
3. Configura las variables en Firebase:
   ```bash
   firebase functions:config:set smtp.user="tu-correo@gmail.com" smtp.pass="contraseña-de-16-digitos" smtp.host="smtp.gmail.com" smtp.port="587"
   ```
   O en la consola de Firebase: Proyecto → Functions → Configuración → Variables de entorno: `SMTP_USER`, `SMTP_PASS` (y opcionalmente `SMTP_HOST`, `SMTP_PORT`).

### Opción 2: Variables de entorno (Firebase Console)

En Firebase Console → Functions → tu función → Configuración → Variables de entorno, añade:

- `SMTP_USER`: correo que envía
- `SMTP_PASS`: contraseña o contraseña de aplicación
- `SMTP_HOST`: (opcional) p. ej. `smtp.gmail.com`
- `SMTP_PORT`: (opcional) p. ej. `587`

## Despliegue

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

Requiere tener instalado Firebase CLI (`npm i -g firebase-tools`) y haber hecho `firebase login` y `firebase use epassdev-ae8ff` (o tu projectId).
