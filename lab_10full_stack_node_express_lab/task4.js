const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>My Website</title>
        <style>
          body {
            font-family: Arial;
            margin:0;
            background:#f4f4f4;
          }
          header {
            background:#333;
            color:white;
            padding:15px;
            text-align:center;
          }
          .container {
            padding:20px;
            text-align:center;
          }
          ul {
            list-style:none;
            padding:0;
          }
          li {
            background:white;
            margin:10px auto;
            width:200px;
            padding:10px;
            border-radius:8px;
            box-shadow:0 0 5px rgba(0,0,0,0.2);
          }
        </style>
      </head>
      <body>
        <header>
          <h1>My Website</h1>
        </header>

        <div class="container">
          <p>This is a simple page using Express</p>

          <h3>Technologies</h3>
          <ul>
            <li>Node.js</li>
            <li>Express.js</li>
            <li>JavaScript</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));