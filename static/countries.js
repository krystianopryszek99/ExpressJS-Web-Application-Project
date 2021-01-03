//variable equal to the package 
var mysql = require('promise-mysql');
//pool variable
var pool
//there's create pool package in here
mysql.createPool({
    connectionLimit : 5,
    host            : 'localhost',
    user            : 'root',
    password        : 'Kozaktoja19*',
    database        : 'geography'
  })
  .then((result) => {
    pool = result
  })
  .catch((error) => {
    console.log(error)
  });

//function to get countires
var getCountires = function(){
    //create a new promise 
    return new Promise((resolve, reject) => {

    pool.query('select * from country')
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

//insert it in the database 
  var addCountries = function(co_code, co_name, co_details){
    //create a new promise     
    return new Promise((resolve, reject) => {
        pool.query('insert into country set ?', { co_code, co_name, co_details})
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })
    })
  }

//function to update country with the following country name details and code
  var updateCountry = function(co_name, co_details, co_code){
    //create a new promise 
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'update country set co_name = ?, co_details = ? where co_code = ?',
            values: [co_name, co_details, co_code]
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

//function to get single country 
  var displayCountry = function (co_code) {
    //create a new promise 
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from country where co_code = ?',
            values: [co_code]
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

//code to delete country
  var deleteCountry = function(co_code){
    //create a new promise 
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
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

//export function getCountires, addCountries, deleteCountry, updateCountry, displayCountry
module.exports = { getCountires, addCountries, deleteCountry, updateCountry, displayCountry }

