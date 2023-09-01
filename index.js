// server.js
const express = require('express');
const Datastore = require('nedb');
const app = express();
const port = 3001;

const db = new Datastore({ filename: 'my-database.db', autoload: true });

app.use(express.json());

/*app.post('/api/addData', (req, res) => {
  const data = req.body;

  db.insert(data, (err, newDoc) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(newDoc);
    }
  });
});*/

app.get('/home',(req,res)=>{
    console.log("conenctado a server")
    res.send("conenctado a server")
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});