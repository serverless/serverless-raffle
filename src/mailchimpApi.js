function mailchimpAddListCall(email, cb) {
    var subscriber = JSON.stringify({
      "email_address": email,
      "status": "subscribed",
      "merge_fields": {
        "FNAME": "",
        "LNAME": ""
      },
    });

    request({
        method: 'POST',
        url: 'https://us13.api.mailchimp.com/3.0/lists/290505/members',
        body: subscriber,
        headers: {
            Authorization: 'apikey 11bea397b5c3acbb4001b9c6113584cf-us11',
            'Content-Type': 'application/json'
        }
    },
    function(error, response, body) {
        if (error) {
          cb(err, null)
        } else {
          var bodyObj = JSON.parse(body);
          console.log(bodyObj.status);
          if (bodyObj.status === 400) {
              cb(bodyObj.detail, null);
          }
          var bodyObj = JSON.parse(body);
          cb(null, bodyObj.email_address + " added to list.");
        }
    });
}
