//Backend application
const express = require('express');
const cors = require('cors'); //module to allow incoming requests
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");


const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/tweeter'); //connection to database on local machine. Environment variables
const tweets = db.get('tweets'); //collection in database
const filter = new Filter();

app.use(cors()); //middlewear that intercpets requests and allows access
app.use(express.json()); //body parser




//get request to dynamic server (to get tweets), and respond with array of json objects.
app.get('/', (req, res)=> {
 res.json({
     message: 'tweet recieved!!'
 });
});

//get request to retrieve records and query database. 
app.get('/tweets', (req, res) => {
    tweets
     .find()
     .then(tweets => {
         res.json(tweets);
     });
});

//validate 'tweet
function isValidTweet(tweet) {
    return tweet.name && tweet.name.toString().trim() !== '' &&
     tweet.content && tweet.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs: 5 * 10000, //limit to 1 request every 5 seconds
    max: 1
}));


//route for recieving data
app.post('/tweets', (req,res) => {
  if(isValidTweet(req.body)) {
      //insert into database
      const tweet = {
          name: filter.clean(req.body.name.toString()),
          content: filter.clean(req.body.content.toString()),
          created: new Date()
      };

      tweets
         .insert(tweet)
         .then(createdTweet => {
            res.json(createdTweet);
         }); //insert into database
  } else {
      res.status(422);
      res.json({
          message: 'Tweet invalid! Name and content required!'
      });
  }
});

//listen from server
app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});