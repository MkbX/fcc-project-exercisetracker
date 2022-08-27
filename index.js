const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//temp database
let index = 2;
let database = [];



//main
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//POST user
app.post('/api/users', (req, res) => {

  if(database.filter(elem => elem.username === req.body.username).length === 0) {
    index++;
    database.push({username: req.body.username, _id: index.toString(), log: []});
  }
  console.log(index);
  console.log(database);
  res.json({username: req.body.username, _id: database.filter(e=> e.username == req.body.username)[0]._id});
});

//GET users
app.get('/api/users', (req, res) => {
  res.send(database);
});

//POST exercices
app.post('/api/users/:_id/exercises', (req, res) => {
  /*console.log(req.params._id);
  console.log(req.body.description);
  console.log(req.body.duration);
  console.log(req.body.date);
  console.log(database.filter(elem => elem._id === req.params._id).length);*/
  if(database.filter(elem => elem._id === req.params._id).length > 0) {
    database.filter(elem => elem._id === req.params._id)[0].log.push({
      description: req.body.description,
      duration: Number(req.body.duration),
      date: (req.body.date == '' || req.body.date == undefined) ? new Date(Date.now()).toDateString() : new Date(req.body.date).toDateString()
    });

    //console.log('exercises',database.filter(e=> e._id === req.params._id)[0]);
    //console.log('req.body.date',req.body.date);
    //console.log('ddtte',(req.body.date == '') ? new Date(Date.now()).toDateString() : new Date(req.body.date).toDateString());

    res.json({username: database.filter(e=> e._id === req.params._id)[0].username,
      description: database.filter(e=> e._id === req.params._id)[0].log[database.filter(e=> e._id === req.params._id)[0].log.length-1].description,
      duration: database.filter(e=> e._id === req.params._id)[0].log[database.filter(e=> e._id === req.params._id)[0].log.length-1].duration,
      date: database.filter(e=> e._id === req.params._id)[0].log[database.filter(e=> e._id === req.params._id)[0].log.length-1].date,      
      _id: database.filter(e=> e._id === req.params._id)[0]._id,});
  } else {
    res.send('_id seems non-existent. <br /> <br /> Please try making a GET request to /api/users, to get a list of all users.');
  }
  

});

app.get('/api/users/:_id/logs',(req, res) => {
  if(database.filter(elem => elem._id === req.params._id).length > 0) {
    //console.log('queryF', new Date(req.query.from).toDateString());
    //console.log('queryT', new Date(req.query.to).toDateString());
    //console.log('date',database.filter(e=> e._id === req.params._id)[0].log.filter(e=>new Date(e.date).getTime() >= new Date(new Date(req.query.from).toDateString()).getTime()));
    let logArray = database.filter(e=> e._id === req.params._id)[0].log;
    //console.log('logArray: ',logArray);
    let logArrayFrom = (req.query.from) ? logArray.filter(e=>new Date(e.date) >= new Date(new Date(req.query.from).toDateString())) : [...logArray];
    //console.log('logArrayFrom', logArrayFrom);
    let logArrayTo = (req.query.to) ? logArrayFrom.filter(e=>new Date(e.date) <= new Date(new Date(req.query.to).toDateString())) : [...logArrayFrom];
    //console.log('logArrayTo', logArrayTo);
    let logArrayReduced = (req.query.limit && logArrayTo.length >= req.query.limit) ? logArrayTo.slice(0,req.query.limit) : [...logArrayTo];
    //console.log('logArrayReduced', logArrayReduced);

    //string cast of log.date
    //let logArrayReducedDateStr = logArrayReduced.map(e=>e.date = e.date.toDateString());

    res.json({username: database.filter(e=> e._id === req.params._id)[0].username,
      count: database.filter(e=> e._id === req.params._id)[0].log.length,
      _id: database.filter(e=> e._id === req.params._id)[0]._id,
      log: logArrayReduced});      

    
  } else {
    res.send('Something wrong...');
  }

});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
