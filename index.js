const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


// 
app.use(cors())


app.get('/', async(req,res)=> {
    app.send("task management is available")
})


app.listen(port,()=> {
    console.log(`task management is available on port ${port}`);
})