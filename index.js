var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        console.log("\n\nThis is first\n\n")
        if (event.message && event.message.text) {
        		console.log("\n\nevent is ok\n\nmessage is " + event.messgae.text)
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});


// generic function sending messages
function sendMessage(recipientId, message) {  
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: "EAAZA8ZCPBu1Y8BANW0i631NAjTVi3OCRXOlB3A4w4iZBsSbHFXZA98RJ5O9XftMBua6ZBU1tEZCxAe6hdqIntW6ZB77YbIWDCFZB3BHZC2fwAol9vUoqTQJQHY7eH2qPpbiL84rIu7VJ6MgTRZCZCvnKLrnBYFSV0VCbHcoEzCXZBZAUeLQZDZD"},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};