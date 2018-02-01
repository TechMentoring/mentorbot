require('dotenv').config();
var slackAPI = require('slackbotapi');
var cheerio = require('cheerio');
var axios = require('axios');

var slack = new slackAPI({
    'token': process.env.SLACK_TOKEN,
    'logging': true,
    'autoReconnect': true
});

slack.on('message', function (data) {
    if (typeof data.text === 'undefined') {
        return;
    }

    if (data.text === 'cake!!') {
        slack.sendMsg(data.channel, '<@' + slack.getUser(data.user).id + '> OOH, CAKE!! :cake:');
    }

    if (data.text.charAt(0) === '!') {
        let command = data.text.substring(1).split(' ');
        if (command[0] === 'learning') {
            let learningUrl = 'https://www.packtpub.com//packt/offers/free-learning';
            axios.get(learningUrl)
            .then(function(resp) {
                let parsedHtml = cheerio.load(resp.data);
                let block = parsedHtml('.dotd-title h2');
                let title = block.text().trim();
                let description = block.parent().next().next().text().trim();
                slack.sendMsg(data.channel, title + "\n\n" + description + "\n" + learningUrl);
            })
            .catch(function(err) {
                slack.sendMsg(data.channel, "Sorry, couldn't find today's free ebook. Check here:\n" + learningUrl);
            });
        }
        if (command[0] === 'salary') {
            slack.sendMsg(data.channel, 'http://www.kalzumeus.com/2012/01/23/salary-negotiation/');
        }
    }

});

slack.on('team_join', function(data) {
    slack.sendMsg('C8WTKTML3', 'Welcome <@' + data.user.id + '>! Thanks for joining us!');
});
