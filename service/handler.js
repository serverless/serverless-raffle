// Dependencies
const AWS = require('aws-sdk')
const config = require('./config.json')
const dynamodb = new AWS.DynamoDB()
const addToMailchimp = require('./mailchimp')
/**
 * Lambda: Create
 */
module.exports.register = function(event, context, cb) {

  console.log('Event Received: ', event)
  const name = JSON.parse(event.body).name
  const email = JSON.parse(event.body).email

  saveUser(email, name, function(err, data) {

    if (err) {
      if (err.code == 'ConditionalCheckFailedException') {
        return cb(null, { created: false, error: 'Email is already registered' })
      } else {
        return cb(err, null)
      }
    }

    addToMailchimp(email, name, function(error, userAdded) {
      if (error) {
        return cb(error)
      }
      return cb(null, {
        headers: {
           // Required for CORS support to work
          "Access-Control-Allow-Origin" : "*",
          // Required for cookies, authorization headers with HTTPS
          "Access-Control-Allow-Credentials" : true
        },
        statusCode: 200,
        body: JSON.stringify({ created: userAdded })
      })
    })
  })
}

/**
 * Lambda: List
 */
module.exports.raffle = function(event, context, cb) {
  // console.log('Event Received: ', event)
  listEntrants(function(err, data) {
    if (err) {
      console.log(err)
      return cb(err, null)
    }
    console.log("Users Listed: ", data)
    return cb(null, {
      headers: {
         // Required for CORS support to work
        "Access-Control-Allow-Origin" : "*",
        // Required for cookies, authorization headers with HTTPS
        "Access-Control-Allow-Credentials" : true
      },
      statusCode: 200,
      body: JSON.stringify({ data })
    })
  })
}

/**
 * Save User
 */
function saveUser(email, name, fn) {
  const dateTime = +new Date();
  const timestamp = Math.floor(dateTime / 1000);
  dynamodb.putItem({
    TableName: config.DDB_TABLE,
    Item: {
      email: {
        S: email
      },
      date: {
        N: timestamp.toString()
      },
      name: {
        S: name
      }
    },
    ConditionExpression: 'attribute_not_exists (email)',
    ReturnValues: 'ALL_OLD'
  }, function(err, data) {
    console.log("Data saved: ", { email: { S: email }})
    if (err) {
      return fn(err)
    } else {
      fn(null, data)
    }
  })
}

/**
 * List Entrants
 */
function listEntrants(fn) {
  dynamodb.scan({
    TableName: config.DDB_TABLE,
    Select: 'ALL_ATTRIBUTES'
  }, function(err, data) {
    console.log(err, data)
    if (err) {
      return fn(err, null)
    } else {
      return fn(null, data.Items)
    }
  })
}

