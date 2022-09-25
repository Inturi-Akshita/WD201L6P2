const http = require('http');
const express = require("express");
const app = express();

//const { initializeApp, cert } = require("firebase-admin/app");
const admin = require("firebase-admin");

//const { getFirestore} = require("firebase-admin/firestore");

//var serviceAccount = require("./key.json");
const credentials = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

//const db = getFirestore();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*app.listen('3000', function() {
    console.log("I started in the server 3000")
})*/

const db = admin.firestore();

app.post('/create', async (req, res) => {
    try {
        console.log(req.body);
        const id = req.body.email;
        const userJson = {
            email : req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        const response = await db.collection("users").add(userJson);
        res.send(response);
    } catch(error) {
        res.send(error);
    }
})

app.get('/read/all', async (req, res) => {
    try {
        const usersRef = db.collection("users");
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch(error) {
        res.send(error);
    }
})

app.get('/read/:id', async (req, res) => {
    try {
        console.log(req.body);
        const userRef = db.collection("users").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    } catch(error) {
        res.send(error);
    }
})

app.post('/update', async(req, res) => {
    try {
        const id = req.body.id;
        const newFirstName = "BVRITHYD";
        const userRef = await db.collection("users").doc(id)
        .update({
            firstName : newFirstName
        });
        //const response = await userRef.get();
        res.send(userRef);
    } catch(error) {
        res.send(error);
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
        const response = await db.collection("users").doc(req.params.id).delete();
        res.send(response);
    } catch(error) {
        res.send(error);
    }
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);
})

/*
//Adding new data to collection
db.collection('student').add ({
    name : "jyothi",
    age : 19,
    email : "jyothi@gmail.com"
})

//for getting data from the collection
db.collection('student').get().then((snapshot) => {
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
});
*/