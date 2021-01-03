//variable equal to the package 
var mysql = require('promise-mysql');

//pool variable
var pool

//there's create pool package in here
mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'Kozaktoja19*',
  database: 'geography'
})
  .then((result) => {
    pool = result
  })
  .catch((error) => {
    console.log(error)
  });

var getCities = function () {
  //create a new promise 
  return new Promise((resolve, reject) => {
    pool.query('select * from city')

      .then((result) => {
        console.log("OK")
        resolve(result)
      })
      .catch((error) => {
        console.log("NOK")
        reject(error)
      })
  })
}

//displaying the page allDetails
var displayAllDetails = function () {
  //create a new promise   
  return new Promise((resolve, reject) => {
    pool.query('select city.cty_code,city.co_code, city.cty_name, city.population, city.isCoastal, city.areaKM, country.co_name from city left join country on city.co_code = country.co_code;')

      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

//displaying each city
var displayEachCity = function (cty_code) {
  //create a new promise 
  return new Promise((resolve, reject) => {

    var myQuery = {
      sql: 'select city.cty_code,city.co_code, city.cty_name, city.population, city.isCoastal, city.areaKM, country.co_name from city left join country on city.co_code = country.co_code where city.cty_code = ?',
      values: [cty_code]
    }
    pool.query(myQuery)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

//export function getCities, displayAllDetails, displayEachCity
module.exports = { getCities, displayAllDetails, displayEachCity }

