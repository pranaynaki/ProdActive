var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "75d001bc-97ad-4493-97a9-b266026a692d",
    appPassword: "vlsjeZPCET613*)%aeSI72/"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    var luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5dfdaee7-f35b-46fd-a377-bde14a815daa?subscription-key=98df2c84845f47d98821971ba63049f3&staging=true&verbose=true&timezoneOffset=-360&spellCheck=true&q=';
    bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

    var msg = new builder.Message(session)
    .speak('This is the text that will be spoken.')
    .inputHint(builder.InputHint.acceptingInput);
    session.send(msg).endDialog();
});

bot.dialog('Create', [
    function(session, args, next) {
        var intent = args.intent;
        var title = builder.EntityRecognizer.findEntity(intent.entities, 'Note.Title');

        var note = session.dialogData.note = {
          title: title ? title.entity : null,
        };
    }
])