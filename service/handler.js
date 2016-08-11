'use strict'

console.log('serverlessRaffle Loading function...')

// Dependencies
var AWS = require('aws-sdk')
var crypto = require('crypto')
var util = require('util')
var config = require('./config.json')
var dynamodb = new AWS.DynamoDB()

/**
 * Lambda: Create
 */
module.exports.register = function(event, context, cb) {

  console.log('Event Received: ', event)

  var name = event.body.name
  var email = event.body.email

  saveUser(email, name, function(err, data) {

    if (err) {
      if (err.code == 'ConditionalCheckFailedException') {
        return cb(null, { created: false, error: 'Email is already registered' })
      } else {
        return cb(err, null)
      }
    }

    return cb(null, { created: true })
  })
}

/**
 * Lambda: List
 */
module.exports.list = function(event, context, cb) {

  console.log('Event Received: ', event)

  listUsers(function(err, data) {
    if (err) {
      console.log(err)
      return cb(err, null)
    }
    console.log("Users Listed: ", data)
    return cb(null, data)
  })
}

/**
 * Save User
 */
function saveUser(email, name, fn) {
  var datetime = new Date().getTime().toString();
  dynamodb.putItem({
    TableName: config.DDB_TABLE,
    Item: {
      email: {
        S: email
      },
      date: {
        N: datetime
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
 * List Users
 */
function listUsers(fn) {
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
