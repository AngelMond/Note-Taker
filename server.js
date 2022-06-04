const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./Develop/helpers/uuid');
const app = express();


const PORT = 3001;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static('develop/public'));

//Get the notes.html
app.get('/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, 'develop/public/notes.html'));
});

//Get all the notes created
app.get('/api/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, 'develop/db/db.json'));
});



// crear metodo POST que responda a la ruta "/api/notes" que debe de recibir una nueva nota guardada en el body
//   y agregarla al archivo "db.json" y retornar esa nueva nota al usuario en el navegador

app.post('/api/notes', (req, res)=>{
    console.info(`${req.method} request received `);

    //Destructurando la Info que envia el usuario
    const {title, text} = req.body;

    //If recive title and text through the body, then, create a new object with that title, text recived and add a unique id
    if(title && text ){

        const newNote = {
            title,
            text,
            id: uuid(),
        }
        //This response is only for me
        const response = {
            status: 'succes',
            body: newNote,
        }
       //Start reading db.json file converting the file into a JSON  and then append the new note into my db.json file
        fs.readFile('develop/db/db.json', 'utf8', (err, data)=>{
            if(err){
                console.log('Ups! There was an error trying to read db.json')
            }else{
                console.log('Reading db.js file')
                //Parse into a JSON db.json 
                const parsedData = JSON.parse(data);
                
                //Adding New notes to my existent db.json file
                parsedData.push(newNote);

                //Writing and saving new note to my db.json file
                fs.writeFile('develop/db/db.json', JSON.stringify(parsedData, null, 4), (err)=>{
                    err ? console.log("Ups! We couldn't update db.json with the new note :(" )
                    : console.log("New note added successfully :)");
                });
            }
        });

        res.sendFile(path.join(__dirname, 'develop/db/db.json'));
        res.status(201).json(response);
    }else {
        res.status(500).json('Error in creating a new note');
    }

   
});

app.delete('/api/notes/:id', (req, res)=>{
    console.info(`${req.method} request received `);

    const {id} = req.params;
    
    if(id){

        fs.readFile('develop/db/db.json', 'utf8', (err, data)=>{
            if(err){
                console.log('Ups! There was an error trying to read db.json in your DELETE request');
            }else{
                const parsedData = JSON.parse(data);
              
                //variable to recive the index from the element with the id matched in the forEach
                let indexParseData = [];
                
                //ForEach to get the index from the element I need to delete
                parsedData.forEach((element, index, arr)=>{
                    
                    if(element.id === id){
                        console.log('Found your id');
                        indexParseData.push(index);
                    }
                });       

                
                //Delete just one dingle index from the db.json
                parsedData.splice(indexParseData, 1);
                
                
               //Update the new db.json without the index deleted
                fs.writeFile('develop/db/db.json', JSON.stringify(parsedData, null, 4), (err)=>{
                    err ? console.log("Ups! We couldn't update db.json with the new note :(" )
                    : console.log("Note deleted successfully :)");
                }
                )
            }
        });

        res.status(200).sendFile(path.join(__dirname, 'develop/db/db.json'));
    }
});


app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'develop/public/index.html'));
});

app.listen(PORT, ()=>{
    console.log(`Port ${PORT} is listening`);
});