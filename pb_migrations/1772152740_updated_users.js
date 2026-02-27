/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<p>Hola,</p>\n<p>Haz clic en el botón de abajo para restablecer tu contraseña.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/reset-password?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Restablecer contraseña</a>\n</p>\n<p><i>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</i></p>\n<p>\n  Gracias,<br/>\n  El equipo de AlertasMultas\n</p>",
      "subject": "Restablece tu contraseña – AlertasMultas"
    },
    "verificationTemplate": {
      "body": "<p>Hola,</p>\n<p>Gracias por registrarte en AlertasMultas.</p>\n<p>Haz clic en el botón de abajo para confirmar tu correo electrónico.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/verify-email?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirmar correo</a>\n</p>\n<p><i>Si no creaste esta cuenta, puedes ignorar este mensaje.</i></p>\n<p>\n  Gracias,<br/>\n  El equipo de AlertasMultas\n</p>",
      "subject": "Confirma tu correo – AlertasMultas"
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
      "subject": "Reset your {APP_NAME} password"
    },
    "verificationTemplate": {
      "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
      "subject": "Verify your {APP_NAME} email"
    }
  }, collection)

  return app.save(collection)
})
