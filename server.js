const express = require('express');
const path = require('path');
const fs = require('fs');
const dbData = require('./db/db.json');
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

app.get('/api/notes', (req, res) => res.json(dbData));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    const { title, text,} = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        note_id: uuid(),
    };
      
    const reviewString = JSON.stringify(newNote);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
  
          parsedNotes.push(newNote);
  
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
    });
    const response = {
        status: 'success',
        body: newNote,
    };
  
    console.log(response);
    res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);