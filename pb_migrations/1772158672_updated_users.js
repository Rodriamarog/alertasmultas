/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<!DOCTYPE html>\n<html lang=\"es\">\n<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"></head>\n<body style=\"margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f4f5;padding:40px 16px;\">\n    <tr><td align=\"center\">\n      <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:520px;\">\n\n        <!-- Logo -->\n        <tr><td style=\"padding-bottom:24px;text-align:center;\">\n          <span style=\"font-size:22px;font-weight:700;color:#111827;\">AlertasMultas</span>\n        </td></tr>\n\n        <!-- Card -->\n        <tr><td style=\"background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:40px 36px;\">\n          \n  <h1 style=\"margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;\">Restablece tu contraseña</h1>\n  <p style=\"margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;\">\n    Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para continuar.\n  </p>\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" style=\"padding-bottom:28px;\">\n    <a href=\"{APP_URL}/reset-password?token={TOKEN}\"\n       style=\"display:inline-block;background:#111827;color:#ffffff;font-size:15px;font-weight:600;\n              text-decoration:none;padding:14px 36px;border-radius:8px;\">\n      Restablecer contraseña\n    </a>\n  </td></tr></table>\n  <p style=\"margin:0;font-size:13px;color:#9ca3af;text-align:center;\">\n    El enlace expira en 30 minutos.\n  </p>\n\n        </td></tr>\n\n        <!-- Footer -->\n        <tr><td style=\"padding-top:24px;text-align:center;font-size:12px;color:#9ca3af;\">\n          © 2026 AlertasMultas · Tijuana, B.C.<br>\n          Si no solicitaste esto, puedes ignorar este mensaje.\n        </td></tr>\n\n      </table>\n    </td></tr>\n  </table>\n</body>\n</html>"
    },
    "verificationTemplate": {
      "body": "<!DOCTYPE html>\n<html lang=\"es\">\n<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"></head>\n<body style=\"margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f4f5;padding:40px 16px;\">\n    <tr><td align=\"center\">\n      <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:520px;\">\n\n        <!-- Logo -->\n        <tr><td style=\"padding-bottom:24px;text-align:center;\">\n          <span style=\"font-size:22px;font-weight:700;color:#111827;\">AlertasMultas</span>\n        </td></tr>\n\n        <!-- Card -->\n        <tr><td style=\"background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:40px 36px;\">\n          \n  <h1 style=\"margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;\">Confirma tu correo</h1>\n  <p style=\"margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;\">\n    Gracias por registrarte en AlertasMultas. Haz clic en el botón de abajo para activar tu cuenta.\n  </p>\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" style=\"padding-bottom:28px;\">\n    <a href=\"{APP_URL}/verify-email?token={TOKEN}\"\n       style=\"display:inline-block;background:#111827;color:#ffffff;font-size:15px;font-weight:600;\n              text-decoration:none;padding:14px 36px;border-radius:8px;\">\n      Confirmar correo\n    </a>\n  </td></tr></table>\n  <p style=\"margin:0;font-size:13px;color:#9ca3af;text-align:center;\">\n    El enlace expira en 72 horas.\n  </p>\n\n        </td></tr>\n\n        <!-- Footer -->\n        <tr><td style=\"padding-top:24px;text-align:center;font-size:12px;color:#9ca3af;\">\n          © 2026 AlertasMultas · Tijuana, B.C.<br>\n          Si no solicitaste esto, puedes ignorar este mensaje.\n        </td></tr>\n\n      </table>\n    </td></tr>\n  </table>\n</body>\n</html>"
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<p>Hola,</p>\n<p>Haz clic en el botón de abajo para restablecer tu contraseña.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/reset-password?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Restablecer contraseña</a>\n</p>\n<p><i>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</i></p>\n<p>\n  Gracias,<br/>\n  El equipo de AlertasMultas\n</p>"
    },
    "verificationTemplate": {
      "body": "<p>Hola,</p>\n<p>Gracias por registrarte en AlertasMultas.</p>\n<p>Haz clic en el botón de abajo para confirmar tu correo electrónico.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/verify-email?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirmar correo</a>\n</p>\n<p><i>Si no creaste esta cuenta, puedes ignorar este mensaje.</i></p>\n<p>\n  Gracias,<br/>\n  El equipo de AlertasMultas\n</p>"
    }
  }, collection)

  return app.save(collection)
})
