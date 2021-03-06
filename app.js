const express = require("express");
const _ = require("lodash")
const bodyParser = require("body-parser");
const { static } = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Admin_rittik:Guptaji@cluster0.vjxlj.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemSchema)
const ListSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});
const List = mongoose.model("List", ListSchema);
const Item1 = new Item({
    name: "Welocme to our ToDoList"
});
const Item2 = new Item({
    name: "Hit this + button to add an item"
});
const Item3 = new Item({
    name: "<-- Hit this to delete an item"
});
const defaultItems = [Item1, Item2, Item3];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
///Get request for home route
app.get("/", (req, res) => {

    Item.find({}, function (err, findings) {
        if (findings.length == 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Successfully Saved!")
                }
                res.redirect("/");
            })

        }
        else {
            res.render("list", { listTitle: "Today", newListItem: findings });
        }

    })

})
//Adding new items to home and post route
app.post("/", (req, res) => {
    var itemName = req.body.Item;
    var listName = req.body.list;
    var ItemAdded = new Item({
        name: itemName
    })
    if (listName == "Today") {
        ItemAdded.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, (error, resul) => {
            const toAdd = resul.items
            toAdd.push(ItemAdded);
            resul.save();
            res.redirect("/" + listName);
        })
    }
})
///Deteting from home and custom route
app.post("/delete", (req, res) => {
    const toDelete = req.body.checkbox;
    const ListName = req.body.ListName;
    if (ListName == "Today") {
        Item.deleteOne({ _id: toDelete }, (err) => {
            console.log("Successed in deleting the entry")
        })
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name:ListName},{$pull:{items:{_id:toDelete}}},(err,foundList)=>{
            if(!err){
                res.redirect("/"+ListName)
            }
        })
    }

});
////Get about Page
app.get("/about", (req, res) => {
    res.render("about");
});
///Get request for custom route 
app.get("/:customListName", (req, res) => {
    const CustomListName =_.capitalize(req.params.customListName);
    List.findOne({ name: CustomListName }, (err, results) => {
        if (!err) {
            if (!results) {
                ///create
                const list = new List({
                    name: CustomListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + CustomListName)

            }
            else {
                //show

                res.render("list", { listTitle: results.name, newListItem: results.items });
            }
        }
        else {
            console.log(results)
        }
    })
});

let port = process.env.PORT;
if(port ==null || port == ""){
    port = 5000;
}

///Listening on port 5000
app.listen( port, () => {
    console.log("Server started ");
})



















