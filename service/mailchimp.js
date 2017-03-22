const request = require('request')
const mailChimpAPI = process.env.MAILCHIMP_API_KEY
const mailChimpListID = process.env.MAILCHIMP_LIST_ID
const mcRegion = process.env.MAILCHIMP_REGION

module.exports = function saveToMailchimp(email, name, callback) {

  var data = {
    'email_address': email,
    'status': 'subscribed',
    'merge_fields': {}
  }

  const fullName = name.split(" ")

  if (name && fullName[0]) {
    data.merge_fields.FNAME = fullName[0]
  }

  if (name && fullName[1]) {
    data.merge_fields.LNAME = fullName[1]
  }

  var subscriber = JSON.stringify(data)
  console.log('start to mailchimp', subscriber)

  request({
    method: 'POST',
    url: `https://${mcRegion}.api.mailchimp.com/3.0/lists/${mailChimpListID}/members`,
    body: subscriber,
    headers: {
      Authorization: `apikey ${mailChimpAPI}`,
      'Content-Type': 'application/json'
    }
  },
    function (error, response, body) {
      if (error) {
        console.log('error', error)
        return callback(error, null)
      }
      const bodyObj = JSON.parse(body);

      console.log('success added to list in mailchimp')
      return callback(null, true)
    })
}