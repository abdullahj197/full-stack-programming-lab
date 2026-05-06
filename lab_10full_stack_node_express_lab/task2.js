const express = require('express');
const app = express();

function page(title, message) {
  return `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial; text-align:center; background:#eef; }
          h1 { color:#2c3e50; margin-top:50px; }
          p { font-size:18px; }
        </style>
      </head>
      <body>
        <h1>${message}</h1>
      </body>
    </html>
  `;
}

app.get('/home', (req, res) => {
  res.send(page("Home", "Welcome Home"));
});

app.get('/about', (req, res) => {
  res.send(page("About", "About Us Page"));
});

app.get('/contact', (req, res) => {
  res.send(page("Contact", "Contact Us Page"));
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));