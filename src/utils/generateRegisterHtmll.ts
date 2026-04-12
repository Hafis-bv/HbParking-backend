export const generateRegisterHtmll = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:14px; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">

          <!-- Logo -->
          <tr>
            <td style="font-size:20px; font-weight:600; color:#111;">
              HbParking
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding-top:20px; font-size:22px; font-weight:600; color:#111;">
              Welcome 👋
            </td>
          </tr>

          <!-- Text -->
          <tr>
            <td style="padding-top:12px; font-size:15px; color:#444; line-height:1.6;">
              Hi ${name || "there"},<br/><br/>
              Thanks for signing up. Your account has been successfully created.<br/><br/>
              You can now start using HbParking and manage everything easily.
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td style="padding-top:28px;">
              <a href="http://localhost:3000"
                 style="display:inline-block; background:#111; color:#fff; text-decoration:none; padding:12px 22px; border-radius:8px; font-size:14px;">
                 Open dashboard
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:30px 0;">
              <hr style="border:none; border-top:1px solid #eee;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="font-size:13px; color:#888; line-height:1.5;">
              If you didn’t create this account, you can safely ignore this email.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
