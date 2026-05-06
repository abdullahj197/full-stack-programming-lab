const express = require('express');
const app = express();

const students = ["Ali", "Ahmed", "Sara", "Ayesha"];

app.get('/students', (req, res) => {
  const list = students.map(s => `<li>${s}</li>`).join('');

  res.send(`
    <html>
      <head>
        <title>Students</title>
        <style>
          body { font-family: Arial; background:#f4f4f4; text-align:center; }
          h1 { color:#333; }
          ul { list-style:none; padding:0; }
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
        <h1>Student List</h1>
        <ul>${list}</ul>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));