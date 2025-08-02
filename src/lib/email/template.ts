export const DonationEmail = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
    h1 { color: #4caf50; }
    p { margin-bottom: 16px; }
    .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Thank You for Your Donation!</h1>
    <p>Dear {{ donor_name }},</p>

    <p>We sincerely appreciate your generous donation of <strong>{{ donation_amount }}</strong>. Your support helps us continue our mission to make a real difference in people's lives.</p>

    <p>If you have any questions or would like updates on how your contribution is being used, feel free to reach out to us.</p>

    <p>With gratitude,<br/>The {{ organization_name }} Team</p>

    <div class="footer">
      {{ organization_name }} | {{ organization_email }} | {{ organization_website }}
    </div>
  </div>
</body>
</html>
`



export const DonationEmailReject = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
    h1 { color: #4caf50; }
    p { margin-bottom: 16px; }
    .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Thank You for Your Donation!</h1>
    <p>Dear {{ donor_name }},</p>

    <p>We sincerely appreciate your kind heart to help, but unfortunately your donation of <strong>{{ donation_amount }}</strong> was not successfull, our team could not be able to confirm your donation. You can go back and make your donation, using the payment details provided in our website. Your support helps us continue our mission to make a real difference in people's lives.</p>

    <p>If you have any questions or would like updates on how your contribution is being used, feel free to reach out to us.</p>

    <p>With gratitude,<br/>The {{ organization_name }} Team</p>

    <div class="footer">
      {{ organization_name }} | {{ organization_email }} | {{ organization_website }}
    </div>
  </div>
</body>
</html>
`