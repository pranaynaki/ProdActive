/*-----------------------------------------------------------------------------
This bot demonstrates how to use dialogs with a LuisRecognizer to add LUIS support to a bot.
LUIS identifies intents and entities from user messages, or utterances.
Intents map utterances to functionality in your bot.
In this example, the intents provide the following mappings:
 * The Notes.Create intent maps to the CreateNote dialog
 * The Notes.Delete intent maps to the DeleteNote dialog
 * The Notes.ReadAloud intent maps to the ReadNote dialog
-----------------------------------------------------------------------------*/
var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});


// Create chat connector for communicating with the Bot Framework Service
// See https://aka.ms/node-env-var for information on setting environment variables in launch.json if you are using VSCode
var connector = new builder.ChatConnector({
    appId: "75d001bc-97ad-4493-97a9-b266026a692d",
    appPassword: "vlsjeZPCET613*)%aeSI72/"
});
// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Create your bot with a function to receive messages from the user.
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send("Hi... I'm the note bot sample. I can create new notes, read saved notes to you and delete notes.");

   // If the object for storing notes in session.userData doesn't exist yet, initialize it
   if (!session.userData.notes) {
       session.userData.notes = {};
       console.log("initializing userData.notes in default message handler");
   }
});


// Add global LUIS recognizer to bot
var luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/11981adb-3832-4391-8e2b-d8e56cee2b32?subscription-key=98df2c84845f47d98821971ba63049f3&staging=true&verbose=true&timezoneOffset=-360&q=';
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

// CreateNote dialog
bot.dialog('CreateTask', [
    function (session, args, next) {
        // Resolve and store any Note.Title entity passed from LUIS.
        var intent = args.intent;
        var name = builder.EntityRecognizer.findEntity(intent.entities, 'Task.Name');

        var task = session.dialogData.task = {
          title: name ? name.entity : null,
        };
        
        // Prompt for title
        if (!task.title) {
            //TODO
            builder.Prompts.text(session, 'What would you like to call your task?');
        } else {
            next();
        }
    },
    function (session, results, next) {
        var task = session.dialogData.task;
        if (results.response) {
            task.title = results.response;
        }

        // Prompt for the text of the note
        if (!task.duration) {
            builder.Prompts.text(session, 'How many minutes will your task take?');
        } else {
            next();
        }
    },
    function (session, results) {
        var task = session.dialogData.task;
        if (results.response) {
            task.duration = results.response;
        }
        
        var json = {'name' : task.title, 'duration': task.duration};

        var request = new http.ClientRequest({
            hostname: "prodactive.tech",
            port: 80,
            path: "/add-task",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(JSON.stringify(json))
            }
        });

        request.end(JSON.stringify(json));

        // Send confirmation to user
        session.endDialog('Creating task named "%s" with duration "%s"',
            task.title, task.duration);
    }
]).triggerAction({ 
    matches: 'Task.Create',
    confirmPrompt: "This will cancel the creation of the note you started. Are you sure?" 
}).cancelAction('cancelCreateNote', "Note canceled.", {
    matches: /^(cancel|nevermind)/i,
    confirmPrompt: "Are you sure?"
});

// Delete note dialog
bot.dialog('DeleteNote', [
    function (session, args, next) {
        http.get("http://prodactive.tech/current-status", res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                session.endDialog(body);
            });
        });
    }
]).triggerAction({
    matches: 'Task.Next'
}).cancelAction('cancelDeleteNote', "Ok - canceled note deletion.", {
    matches: /^(cancel|nevermind)/i
});


// Read note dialog
bot.dialog('ReadTasks', [
    function (session, args, next) {
        http.get("http://prodactive.tech/current-status", res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                session.endDialog("Your current task is " + body);
            });
        });
    }
]).triggerAction({
    matches: 'Task.Status'
}).cancelAction('cancelReadNote', "Ok.", {
    matches: /^(cancel|nevermind)/i
});


// Helper function to count the number of notes stored in session.userData.notes
function noteCount(notes) {

    var i = 0;
    for (var name in notes) {
        i++;
    }
    return i;
}

