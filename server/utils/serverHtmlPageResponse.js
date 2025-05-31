const baseStyles = `
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background-color: #f0f2f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    padding: 20px;
  }

  .container {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    width: 90%;
  }

  .logo-container {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;
    background-color: #0066cc;
    border-radius: 50%;
    padding: 20px;
  }

  .logo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  h2, h4 {
    color: #1a1a1a;
    margin: 15px 0;
  }

  .timer {
    color: #0066cc;
    font-weight: bold;
  }

  .message {
    color: #4a4a4a;
    line-height: 1.6;
    font-size: 16px;
    margin: 15px 0;
  }
`;

function formResponseMiddlePage(link, message) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>ControlX - Processing</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
      <script>
        let countdown = 5;
        function updateTimer() {
          document.getElementById('timer').innerText = countdown;
          countdown--;
          if (countdown < 0) {
            window.location.href = '${link}';
          } else {
            setTimeout(updateTimer, 1000);
          }
        }
        window.onload = updateTimer;
      </script>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="https://api.dicebear.com/9.x/initials/svg?seed=CX" alt="ControlX" class="logo">
        </div>
        <h4 class="message">${message}</h4>
        <p>Redirecting in <span id="timer" class="timer">5</span> seconds...</p>
      </div>
    </body>
  </html>
  `;
}

function linkMiddlePageNotFound() {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>ControlX - Page Not Found</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="https://api.dicebear.com/9.x/initials/svg?seed=CX" alt="ControlX" class="logo">
        </div>
        <h2>404 - Page Not Found</h2>
        <p class="message">The requested URL does not exist. Please check the link and try again.</p>
      </div>
    </body>
  </html>
  `;
}

function linkMiddlePageSuccess(link) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>ControlX - Processing Request</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
      <script>
        let countdown = 5;
        function updateTimer() {
          document.getElementById('timer').innerText = countdown;
          countdown--;
          if (countdown < 0) {
            window.location.href = '${link}';
          } else {
            setTimeout(updateTimer, 1000);
          }
        }
        window.onload = updateTimer;
      </script>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="https://api.dicebear.com/9.x/initials/svg?seed=CX" alt="ControlX" class="logo">
        </div>
        <h4>Processing Your Request</h4>
        <p class="message">Redirecting in <span id="timer" class="timer">5</span> seconds...</p>
      </div>
    </body>
  </html>
  `;
}

function userVerificationMiddlePage(message, link) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>ControlX - Verification</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
      <script>
        let countdown = 5;
        function updateTimer() {
          document.getElementById('timer').innerText = countdown;
          countdown--;
          if (countdown < 0) {
            window.location.href = '${link}';
          } else {
            setTimeout(updateTimer, 1000);
          }
        }
        window.onload = updateTimer;
      </script>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="https://api.dicebear.com/9.x/initials/svg?seed=CX" alt="ControlX" class="logo">
        </div>
        <h4>${message}</h4>
        <p class="message">Redirecting to ControlX dashboard in <span id="timer" class="timer">5</span> seconds...</p>
      </div>
    </body>
  </html>
  `;
}

module.exports = {
  formResponseMiddlePage,
  linkMiddlePageNotFound,
  linkMiddlePageSuccess,
  userVerificationMiddlePage,
};
