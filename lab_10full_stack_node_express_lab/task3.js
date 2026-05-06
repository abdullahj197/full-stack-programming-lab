const express = require('express');
const app = express();

app.get('/user/:name', (req, res) => {
  const name = req.params.name;

  res.send(`
    <html>
      <head>
        <title>User</title>
        <style>
          body {
            font-family: Arial;
            background: linear-gradient(to right, #6a11cb, #2575fc);
            color:white;
            text-align:center;
            padding-top:100px;
          }
          h1 { font-size:40px; }
        </style>
      </head>
      <body>
        <h1>Hello, ${name} 👋</h1>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));