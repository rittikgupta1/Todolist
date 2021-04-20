const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const app = express();
const mongoose =require("mongoose")
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemSchema = {
    name: String
}



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
var items = ["Eat food", "Cook Food", "Buy Food"];
var WorkArray = [];
app.use(express.static("public"));
app.get("/", (req, res) => {

    var event = new Date();
    var options = {
        weekday: 'long',
        day: "numeric",
        month: "long",
    };
    var toSend = event.toLocaleDateString('en-US', options);
    res.render("list", { listTitle: toSend, newListItem: items });

})
app.post("/", (req, res) => {
    var item = req.body.Item;
    if(req.body.list=="work"){
        WorkArray.push(item);       
        res.redirect("/work")
    }else{
    items.push(item);
    res.redirect("/");
    }


})
app.get("/work", (req, res) => {
    res.render("list", { listTitle: "work", newListItem: WorkArray })
})
app.post("/", (req, res) => {
    var items = req.body.Item;
    WorkArray.push(items);
    res.redirect("/");
})
app.get("/about",(req,res)=>{
    res.render("about");
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
})