const express = require('express');
const path = require('path');
const fs = require('fs');
// const util = require("util");
// const dbData = require('./db/db.json');
const uuid = require('./helpers/uuid');
const {readAndAppend} = require('./helpers/readWrite')
const PORT = process.env.PORT || 3001;

// const readFileAsync = util.promisify(fs.readFile);
// const writeFileAsync = util.promisify(fs.writeFile);

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => 
  fs.readFile('./db/db.json', 'utf8', (err,data) =>{
    if(err) return console.log(err);
    res.json(JSON.parse(data))
  })
);

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    const { title, text,} = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      






      //const reviewString = JSON.stringify(newNote);

      //   return readFileAsync("./db/db.json", "utf8").then( data => {
      //   const parsedNotes = JSON.parse(data);
      //   parsedNotes.push(newNote);

      //   return writeFileAsync("./db/db.json", JSON.stringify(parsedNotes, null, 4)).then( err => {
      //     return res.json("We hope this works!")
      //   })
      // })
      









      fs.readFile('./db/db.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
          } else {
            const parsedNotes = JSON.parse(data);
    
            parsedNotes.push(newNote);
            
            console.log("writing file")
            
            fs.writeFile(
              './db/db.json',
              JSON.stringify(parsedNotes, null, 4),
              (writeErr) => {
                if( writeErr ) return console.error(writeErr)
                const response = {
                  status: 'success',
                  body: newNote,
                };

                  console.info('Successfully updated notes!')
                  return res.status(201).json(response);

              }
            );
          }
      })

    } else {
      res.status(500).json('Error in posting note');
    }
});












// const writeToFile = (destination, content) =>
//   fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
//     err ? console.error(err) : console.info(`\nData written to ${destination}`)
//   );

// const readAndAppend = (content, file) => {
//   fs.readFile(file, 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const parsedData = JSON.parse(data);
//       parsedData.push(content);
//       writeToFile(file, parsedData);
//     }
//   });
// };


// app.post('/api/notes', (req, res) => {
//   console.info(`${req.method} request received to submit feedback`);
//   const { title, text} = req.body;
//   if (title && text) {
//     const newNote = {
//       title,
//       text,
//       id: uuid(),
//     };
//     readAndAppend(newNote, './db/db.json');
//     const response = {
//       status: 'success',
//       body: newNote,
//     };
//     res.status(201).json(response);
//   } else {
//     res.status(500).json('Error in posting feedback');
//   }
// });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);