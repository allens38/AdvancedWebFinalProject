const express = require('express');
const app = express();
const cors = require('cors');

const {books} = require('./models/books');

app.use(express.static(__dirname + "/public"));


// allow all origins to access this server
app.use(cors());


// encode document -- formerly:  app.use(bodyParser.urlencode(...));
app.use(express.urlencoded({extended: false}));


// parsing JSON -- formerly:  app.use(bodyParser.json());
app.use(express.json());


// A port number for this server not currently used by another app
const port = 8080;
const url = `http://localhost:${port}`;


// Listen at port number
app.listen(port,()=>console.log(`Server is active:  ${url}`));


app.get('/',(req,res)=>{
    res.send("Hello Earth!");
});

//Read all records
app.get('/api/',(req,res)=>{    
    res.json(books)
})
// Read a single record
app.get('/api/:id', (req, res) => {
    let id = req.params.id;
    // Find the index of the element that matches the id
    let index = books.findIndex(book => book.id == id);
    // If found, return the record at the index as an array
    // Otherwise, return an array with a single message
    let record = index != -1 ? [books[index]] : [{ message: "No Record Found." }];
    res.json(record);
});


//Insert a new data
app.post('/api/',(req,res)=>{    
    var data = req.body;
    books.push(data);
    res.json(data);
});


//Update an existing record
app.put('/api/:id',(req,res)=>{
    let id = req.params.id;
    let message ="No Record Found.";


    //find the index of the element that matches the id
    //If a match is found, return the index position
    //else return a -1 (not found) 
    let index = books.findIndex( book => book.id == id );        
    if(index != -1){
        let data = req.body;
        books[index] = data;
        message = "Record Updated."
    }
    res.json(message);    
})


//Delete a single record
app.delete('/api/:id',(req,res)=>{
    let id = req.params.id;
    let message = "Sorry, No Record Found.";


    //find the index of the element that matches the id
    //If a match is found, return the index position
    //else return a -1 (not found) 
    let index = books.findIndex( book => book.id == id );


    //if found then delete teh record using splice()
    //otherwise return a not found message       
    if(index != -1){
        books.splice(index,1);
        message = "Record Deleted."  
    } 
    
    res.json(message);
})

//Deleting all records
app.delete('/api/',(req,res)=>{
    books.splice(0);
    res.json("All Records Deleted.");
})



