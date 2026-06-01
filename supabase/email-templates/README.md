# Plantillas de correo — Mi Mundial

Pega cada archivo en **Supabase → Authentication → Email Templates** (en el
campo *Message body*) y usa el asunto sugerido (campo *Subject*).
Todas son responsivas (se ven bien en móvil) con la marca Mi Mundial.

| Plantilla en Supabase | Archivo | Asunto sugerido | Variable principal |
| --- | --- | --- | --- |
| Confirm sign up | `confirm-signup.html` | `Confirma tu cuenta en Mi Mundial ⚽` | `{{ .ConfirmationURL }}` |
| Invite user | `invite.html` | `Te invitaron a Mi Mundial ⚽` | `{{ .ConfirmationURL }}` |
| Magic Link / OTP | `magic-link.html` | `Tu acceso a Mi Mundial ⚽` | `{{ .ConfirmationURL }}` + `{{ .Token }}` |
| Change email address | `change-email.html` | `Confirma tu nuevo correo en Mi Mundial ⚽` | `{{ .ConfirmationURL }}` |
| Reset password | `reset-password.html` | `Restablece tu contraseña de Mi Mundial ⚽` | `{{ .ConfirmationURL }}` |
| Reauthentication | `reauthentication.html` | `Tu código de verificación de Mi Mundial ⚽` | `{{ .Token }}` |

> No cambies los nombres de las variables `{{ . ... }}`: Supabase las
> reemplaza automáticamente al enviar el correo.
