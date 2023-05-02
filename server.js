const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3001;

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
  const {title, text} = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile('./db/db.json',JSON.stringify(parsedNotes, null, 4),
          (writeErr) => {
            if( writeErr ) return console.error(writeErr)
            const response = {
              status: 'success',
              body: newNote,
            };
            console.info('Successfully added note!')
            return res.status(201).json(response);
          }
        );
      }
    })
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  const deleteId = req.params.id
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      for(i=0; i<parsedNotes.length; i++) {
        if(deleteId==parsedNotes[i].id){
          parsedNotes.splice(i,1)
        }
      }
      fs.writeFile('./db/db.json',JSON.stringify(parsedNotes, null, 4),
        (writeErr) => {
          if( writeErr ) return console.error(writeErr)
          const response = {
            status: 'success',
            body: 'deleted note',
          };
          console.info('Successfully deleted note!')
          return res.status(201).json(response);
        }
      );
    }
  })
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);