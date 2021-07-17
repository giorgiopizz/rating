const express = require('express')
const app = express()
app.use(express.json())

// var firebase = require("firebase");

// // Firebase App (the core Firebase SDK) is always required and must be listed first
// import firebase from "firebase/app";
// // If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// // import * as firebase from "firebase/app"

// // If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import "firebase/analytics";




// // TODO: Replace the following with your app's Firebase project configuration
// // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
// var firebaseConfig = {
//     apiKey: "AIzaSyD2tL_uDFbQakDqobSSNgPJMjU6Wb6p-qo",
//     authDomain: "ratings-7be78.firebaseapp.com",
//     projectId: "ratings-7be78",
//     storageBucket: "ratings-7be78.appspot.com",
//     messagingSenderId: "57280790256",
//     appId: "1:57280790256:web:97009c98df502962204c35",
//     measurementId: "G-ZL5EH7QV03"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);


// var admin = require("firebase-admin");

// // Fetch the service account key JSON file contents
// // var serviceAccount = require("path/to/serviceAccountKey.json");

// var config = {
//     apiKey: "apiKey",
//     authDomain: "ratings-7be78.firebaseapp.com",
//     // For databases not in the us-central1 location, databaseURL will be of the
//     // form https://[databaseName].[region].firebasedatabase.app.
//     // For example, https://your-database-123.europe-west1.firebasedatabase.app
//     databaseURL: "https://ratings-7be78-default-rtdb.europe-west1.firebasedatabase.app/",
//     storageBucket: "bucket.appspot.com"
// };
// firebase.initializeApp(config);

// // As an admin, the app has access to read and write all data, regardless of Security Rules
// var db = admin.database();
// var ref = db.ref("restricted_access/secret_document");
// ref.once("value",  (snapshot)=> {
//     console.log(snapshot.val());
// });





users = []
posts = []
likes = []

// const computePoints = (username) => {
//     points = 1;
//     for (let post of posts){
//         if (post.username === username){
//             if (post.likes.length>0){
//                 for (let like of post.likes){
//                     if (like !== username){
//                         for (let user of users){
//                             if (user.username === like){
//                                 points += user.points;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return points;
// }


const updatePoints = (like) =>{
    for (let user of users){
        if (user.username === like.receiver){
            other_points = 0;
            for (let user2 of users){
                if (user2.username === like.sender) {
                        other_points = user2.points;
                }
            }
            nw = user.ow + other_points;
            user.points = user.points * user.ow / nw + other_points * parseInt(like.vote)/ nw;
            user.ow = nw;
            console.log(user.points);
            console.log(user.ow);
            return;
        }
    }
}

const generateId = (array) => {
    const maxId = array.length > 0
        ? Math.max(...array.map(n => n.id))
        : 0
    return maxId + 1
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})


app.get('/api/points/:username', (request, response) => {
    for (let element of users){
        if (element.username === request.params.username){
            response.json({"Points": element.points});
            return;
        }
    }
    response.status(404).send("User not found");
    
})

app.post('/api/new_user', (request, response) => {
    const user = request.body
    if (!user.username) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    if (!users.includes(user)){
        console.log(!users.includes(user))
        user['points'] = 1;
        user['ow'] = 1;
        users.push(user)
        response.json(user)
    }
    else{
        return response.status(400).json({
            error: "User already exist"
        })
    }
    
})

app.post('/api/new_post', (request, response) => {
    const post = request.body
    post['id'] = generateId(posts)
    post['likes'] = []
    posts.push(post)
    response.json(post)
    console.log(posts)
})

app.get('/api/likes/:id', (request, response) => {
    for (let element of posts) {
        if (element.id === parseInt(request.params.id)) {
            response.json({ "Likes": element.likes });
            return;
        }
    }
    response.status(404).send("Post not found");

})

app.post('/api/new_like', (request, response) => {
    const like = request.body;
    for (let element of posts){
        if (element.id === parseInt(like.post_id)){
            element.likes.push([like.sender, parseInt(like.vote)]);
            updatePoints(like);
            response.json(like);
            return;
        }
    }
    response.status(400).send("erroreee");
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})