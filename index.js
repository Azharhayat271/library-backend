const express= require("express");
const app=express();
const mongoose= require("mongoose");
app.use(express.json());
const users=require('./routes/index');
const login =require("./routes/login");
const Student =require("./routes/student");
const Book =require("./routes/books");
const BookIssue = require("./routes/bookrecords");
const Finecal = require("./routes/finecalculation");




const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
// http://127.0.0.1:5500
app.use(cors(corsOptions));
app.use("/signup",users);
app.use("/login",login);
app.use('/students',Student);
app.use('/book',Book);
app.use('/bookissue',BookIssue);
app.use('/fine',Finecal);




mongoose.connect('mongodb://localhost:27017/library')
.then(()=> console.log("connected to mongodb"))
.catch(err=> console.error("Could not connect to mongodb",err))

const port = 5000;

app.listen(port, () => {
  console.log('app listening at 5000');
});






