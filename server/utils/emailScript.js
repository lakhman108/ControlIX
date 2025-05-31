const createTableRows = (data) => {
  return Object.entries(data)
    .map(([key, value]) => {
      return `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${key}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${value}</td>
      </tr>
    `;
    })
    .join("");
};

const baseStyles = `
  body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f0f2f5;
      margin: 0;
      padding: 0;
      text-align: center;
  }

  .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .logo-container {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background-color: #0066cc;
      border-radius: 50%;
      padding: 15px;
  }

  .logo {
      width: 100%;
      height: 100%;
      border-radius: 50%;
  }

  h1 {
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 20px;
  }

  p {
      color: #4a4a4a;
      line-height: 1.6;
      font-size: 16px;
  }

  .button {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 24px;
      text-decoration: none;
      color: #ffffff !important;  /* Force white text */
      background-color: #0066cc;
      border-radius: 6px;
      font-weight: 500;
      transition: background-color 0.3s ease;
  }

  .button:visited {
      color: #ffffff !important; /* Ensure visited link stays white */
  }

  .button:hover {
      background-color: #005bb5;
  }

  .footer {
      margin-top: 30px;
      color: #666666;
      font-size: 14px;
  }

  table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background-color: #ffffff;
  }

  th, td {
      border: 1px solid #e0e0e0;
      padding: 12px;
      text-align: left;
  }

  th {
      background-color: #f5f7f9;
      color: #333333;
  }
`;

function userVerificationLinkMailScript(name, link) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ControlX - Verify Your Account</title>
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="container">
      <div class="logo-container">
        <img src="https://api.dicebear.com/9.x/initials/png?seed=CX" alt="ControlX" class="logo">
      </div>
      <h1>Welcome to ControlX!</h1>
      <p>Hey ${name},</p>
      <p>Thank you for joining ControlX - your smart device management platform. To start managing your devices, please verify your account:</p>
      <a href="${link}" class="button">Verify Account</a>
      <p class="footer">If you didn't create a ControlX account, please ignore this email.</p>
    </div>
  </body>
  </html>
  `;
}

function userVerifiedLinkMailScript(name) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ControlX - Account Verified</title>
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="container">
      <div class="logo-container">
        <img src="https://api.dicebear.com/9.x/initials/png?seed=CX" alt="ControlX" class="logo">
      </div>
      <h1>Account Verified Successfully!</h1>
      <p>Welcome aboard, ${name}!</p>
      <p>Your ControlX account is now verified. You can start managing your smart devices and automating your space.</p>
      <a href="https://app.controlx.tech/" class="button">Access Dashboard</a>
      <p class="footer">Need help? Our support team is always here to assist you.</p>
    </div>
  </body>
  </html>`;
}

function deviceAddedMailScript(name, deviceName, deviceType, location) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ControlX - New Device Added</title>
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="container">
      <div class="logo-container">
        <img src="https://api.dicebear.com/9.x/initials/png?seed=CX" alt="ControlX" class="logo">
      </div>
      <h1>New Device Added</h1>
      <p>Hello ${name},</p>
      <p>A new device has been added to your ControlX dashboard:</p>
      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Device Name</td>
            <td>${deviceName}</td>
          </tr>
          <tr>
            <td>Device Type</td>
            <td>${deviceType}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>${location}</td>
          </tr>
        </tbody>
      </table>
      <a href="https://app.controlx.tech/devices" class="button">Manage Device</a>
      <p class="footer">Keep your smart home safe and efficient with ControlX</p>
    </div>
  </body>
  </html>
  `;
}

function userResetPasswordLinkScript(name, link) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ControlX - Reset Password</title>
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="container">
      <div class="logo-container">
        <img src="https://api.dicebear.com/9.x/initials/png?seed=CX" alt="ControlX" class="logo">
      </div>
      <h1>Reset Your Password</h1>
      <p>Hey ${name},</p>
      <p>We received a request to reset your ControlX account password. Click the button below to set a new password:</p>
      <a href="${link}" class="button">Reset Password</a>
      <p class="footer">If you didn't request this change, please contact our support team immediately.</p>
    </div>
  </body>
  </html>
  `;
}


// customer access link mail script
function customerAccessLinkMailScript(name, link) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ControlX - Customer Access Link</title>
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="container">
      <div class="logo-container">
        <img src="https://api.dicebear.com/9.x/initials/png?seed=CX" alt="ControlX" class="logo">
      </div>
      <h1>Welcome to ControlX!</h1>
      <p>Hey ${name},</p>
      <p>Thank you for joining ControlX - your smart device management platform. To start managing your devices, please verify your account:</p>
      <a href="${link}" class="button">Access Your Location</a>
      <p class="footer">If you didn't create a ControlX account, please ignore this email.</p>
    </div>
  </body>
  </html>
  `;
}

module.exports = {
  userVerificationLinkMailScript,
  userVerifiedLinkMailScript,
  userResetPasswordLinkScript,
  deviceAddedMailScript,
  customerAccessLinkMailScript,
};