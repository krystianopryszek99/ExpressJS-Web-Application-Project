var express = require('express')
var bodyParser = require('body-parser')
const countries = require('./static/countries')
//defining cities
var cities = require('./static/cities')
//defining allCountries
var allCountries = require('./static/countries')
//defining allDetails
var allDetails = require('./static/cities')
//defining headsOfState
var headsOfState = require('./static/headsOfState')
//import express-validator also has to be installed - npm install express-validator
const { body, validationResult, check } = require('express-validator');
//defining addCountries, updateCountry
const { addCountries, updateCountry } = require('./static/countries')

var app = express()

//using bodyParser
app.use(bodyParser.urlencoded({ extended: false }))

//tell express js that i'm using ejs 
//specify the engine is ejs
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

//get method for countries
app.get('/listCountries', (req, res) => {
  allCountries.getCountires()
    .then((result) => {
      res.render('showCountries', { countries: result })
    })
    .catch((error) => {
      res.send(error)
    })
})

//get method for cities
app.get('/listCities', (req, res) => {
  allDetails.getCities()
    .then((result) => {
      res.render('showCities', { cities: result })
    })
    .catch((error) => {
      res.send(error)
    })
})

//get method for HeadsOfState
app.get('/listHeadsOfState', (req, res) => {
  headsOfState.getHeadOfState()
    .then((documents) => {
      res.render('showHeadsOfState', { headsOfState: documents })
    })
    .catch((error) => {
      res.send(errorS)
    })
})

//get method for delete
app.get('/deleteCountry/:code', (req, res) => {
  countries.deleteCountry(req.params.code)
    .then((result) => {
      res.redirect('/listCountries')
    })
    .catch((error) => {
      res.send("<h1>Error Message</h1><br><br> <h2>" + req.params.code + " has cities, it cannot be deleted </h2><br>" + " <a href=/>Home</a>")
    })
})

//get method for update 
app.get('/updateCountry/:code', (req, res) => {
  countries.displayCountry(req.params.code)
    .then((result) => {
      res.render('updateCountry', { countries: result, errors: undefined })
    })
    .catch((error) => {
      res.send(error)
    })

})

//get method for allDetails - output the page to screen to show all details of cities
app.get('/allDetails/:code', (req, res) => {
  cities.displayEachCity(req.params.code)
    .then((result) => {
      res.render('allDetails', { cities: result })
    })
    .catch((error) => {
      res.send(error)
    })
})

// app.get('/allDetails/:code', (req, res) => {
//   connect((err) => {
//     if(err){
//       res.send("<h1>Error Message</h1>")
//     }
//     else {
//       let sql = "SELECT ci.*, co.co_name FROM city ci left join country co on co.co_code = ci.co_code WHERE cty_code = '" + req.params.cityCode + "'"
//       Db.query(sql, (err, result) => {
//         if(err) throw err;
//         res.render('allDetails', {cityCode:result[0]})
//       })
//     }
//   })

//get method for allDetails - showing each city 
app.get('/allDetails', (req, res) => {
  cities.displayAllDetails()
    .then((result) => {
      res.render('allDetails', { cities: result })
    })
    .catch((error) => {
      res.send(error)
    })
})

app.post('/updateCountry',

  [check('name').isLength({ min: 1 }).withMessage("The Country Name is mandatory")],

  (req, res) => {

    var errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render("updateCountry", { errors: errors.errors, countries: errors.errors })
    } else {

      countries.updateCountry(req.body.name, req.body.details, req.body.code)
        .then((result) => {
          res.redirect('/listCountries')
        })
        .catch((error) => {
          res.send(error)
        })
    }
  })

//add Country page
app.get('/addCountry', (req, res) => {
  //accessing the html file in the views folder 
  //render the file we just created
  //defining the variable called errors and making it equal to undefined
  res.render('addCountry', { errors: undefined })
})

//once clicked "OK" button it will send a message that the post is received 
//after we checked it
//this is middleware, after the request comes in but before its handled here by the post method
app.post('/addCountry',
  //checking if country code has 3 characters 
  [check('code').isLength({ min: 3, max: 3 }).withMessage("Country Code must be 3 characters"),
  //checking if country name is at least 3 characters long
  check('name').isLength({ min: 3 }).withMessage("Country Name must be at least 3 characters"),
  ],
  (req, res) => {
    //first of all did the express validator find any errors
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
      //.errors is the list of errors
      res.render("addCountry", { errors: errors.errors })
    } else {
      //adding to the database
      countries.addCountries(req.body.code, req.body.name, req.body.details)
        .then((result) => {
          res.redirect('/listCountries')
        })
        .catch((error) => {
          res.send("Error: " + req.body.code + " already exists")
        })
    }
  })

//get method for addHeadOfState
app.get('/addHeadOfState', (req, res) => {
  res.render('addHeadOfState', { errors: undefined })
})

//once clicked "OK" button it will send a message that the post is received 
//after we checked it
//this is middleware, after the request comes in but before its handled here by the post method
app.post('/addHeadOfState',
  //checking if country code has 3 characters 
  [check('_id').isLength({ min: 3, max: 3 }).withMessage("Country Code must be 3 characters"),
  //checking that head of state must be at least 3 characters
  check('headOfState').isLength({ min: 3 }).withMessage("Head Of State must be at least 3 characters"),

  ],
  (req, res) => {
    //first of all did the express validator find any errors
    var errors = validationResult(req)

    if (!errors.isEmpty()) {
      // .errors is the list of errors
      res.render("addHeadOfState", { errors: errors.errors })
    } else {
      headsOfState.addHeadOfState(req.body._id, req.body.headOfState)
        .then((result) => {
          //redirects to /listHeadsOfState
          res.redirect('/listHeadsOfState')
        })
        .catch((error) => {
          //send the error if the id is already used
          res.send("Error: " + req.body._id + " already exists")
        })
    }
  })

//listening to port 3007 can be accessed by typing localhost:3007 in the browser
app.listen(3007, () => {
  console.log("Listening on port 3007")
})

