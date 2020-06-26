require("dotenv").config()
const chalk = require('chalk');
const log = console.log
const Discord = require("discord.js")
let client = new Discord.Client({
  disableEveryone: true
})
const config = require("./config.json")

let block = false

// client.setMaxListeners(20)

client.commands = new Discord.Collection()
client.owner = "Spyte"

var fs = require("fs")
var reactions = require('./listeners/reaction.js')
const moment = require("moment")

var firebase = require('firebase')
var fireconfig = {
  apiKey: "AIzaSyCC4lGc4R2wDdvIOXnNLTKcXMIl-jR4kTU",
    authDomain: "trit-237017.firebaseapp.com",
    databaseURL: "https://trit-237017.firebaseio.com",
    projectId: "trit-237017",
    storageBucket: "trit-237017.appspot.com",
    messagingSenderId: "315726150019",
    appId: "1:315726150019:web:538749b28ad0fd3b595eb6"
};
// var fireconfig = {
//     apiKey: "AIzaSyBewmiPJqsuA9HijzBy3hMDKyVG1zieB6E",
//     authDomain: "chat-9b30f.firebaseapp.com",
//     databaseURL: "https://chat-9b30f.firebaseio.com",
//     projectId: "chat-9b30f",
//     storageBucket: "chat-9b30f.appspot.com",
//     messagingSenderId: "446829660490",
//     appId: "1:446829660490:web:47998d396e1a54391e19b3",
//     measurementId: "G-KSE9KXNZZZ"
// };
const newDb = require("./database")

firebase.initializeApp(fireconfig);
var database = firebase.database();

fs.readdir(`./commands/`, async (err, files) => {
  if (err) console.log(err)
  let jsfile = files.filter(f => f.split(".").pop() == "js")
  if (jsfile.length <= 0) {
    console.log("Nie znaleziono komend!")
  }
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`)
    console.log(chalk.cyan(`[Załadowano] ${f}`))
    client.commands.set(props.help.name, props)
  })

})

client.setMaxListeners(30)

const antiRaid = require("./listeners/anti-raid.js")
const pool = require("./listeners/pool.js")
const logs = require("./listeners/logs.js")
// const dankmemes = require("./commands/dankmemes.js")
const status = require("./commands/status.js")
const wordsFilter = require("./commands/wordsfilter.js")
const counting = require("./commands/counting.js")
const verification = require("./commands/verification.js")
// const xp = require("./listeners/xp.js")
const propositions = require("./listeners/propositions.js")
const anon = require("./listeners/anon.js")
// const sierociniec = require("./listeners/sierociniec.js")
const voiceDetector = require("./listeners/voiceDetector.js")
const autoRole = require("./listeners/autoRole.js")
const reactionRole = require("./listeners/reactionRole.js")

pool.run(client).then(() => console.log(chalk.blue("[listener] pool.js")))
logs.run(client).then(() => console.log(chalk.blue("[listener] logs.js")))
// dankmemes.start(client, "ff4500").then(() => console.log(chalk.blue("[listener] dankmemes.js")))
status.start(client).then(() => console.log(chalk.blue("[listener] status.js")))
wordsFilter.start(client).then(() => console.log(chalk.blue("[listener] wordsFilter.js")))
counting.start(client).then(() => console.log(chalk.blue("[listener] counting.js")))
// verification.start(client).then(() => console.log(chalk.blue("[listener] verification.js")))
// xp.start(client).then(() => console.log(chalk.blue(`[listener] xp.js`)))
propositions.run(client).then(() => console.log(chalk.blue(`[listener] propositions.js`)))
anon.run(client).then(() => console.log(chalk.blue(`[listener] anon.js`)))
// sierociniec.run(client).then(() => console.log(chalk.blue(`[listener] sierociniec.js`)))
voiceDetector.run(client).then(() => console.log(chalk.blue(`[listener] voiceDetector.js`)))
autoRole.run(client).then(() => console.log(chalk.blue(`[listener] autoRole.js`)))
reactionRole.run(client).then(() => console.log(chalk.blue(`[listeners] reactionRole.js`)))

client.on("ready", async () => {
  const user = client.users.cache.get("367390191721381890")

  var weather = require("weather-js")
  var day = ""
  const moment = require("moment")
  setInterval(function () {
    switch (new Date().getDay()) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
    }
    weather.find({
      search: "warsaw",
      degreeType: 'C'
    }, function (err, currentult) {
      if (err) return console.log(chalk.red("[error] Nie można odczytać pogody, rozłączono z serwerem"))
      var current = currentult[0].current
      var today = moment(new Date()).format("DD.MM")
      var games = ["$help", "I'm serving " + client.guilds.cache.size + " guilds", "Serving " + client.users.cache.size + " users", "Today is " + day + " " + today, "Temperature: " + current.temperature + "°C"]
      // let games = ["$help", "Today MichGamesPL#1828 has birthday ^^ Thank you so much"]
      var choose = Math.floor(Math.random() * games.length - 0) + 0
      client.user.setActivity(games[choose])
    })
  }, 12000)

  console.log(`[client] Zalogowano jako ${client.user.tag}`)
  console.log(`[client] Obsługa ${client.guilds.cache.size} serwerów / ${client.users.cache.size} osób`)
  // client.commands.forEach((command)=> {
  //   if(!command.help.description) return
  //   database.ref(`/commands/${command.help.category}/${command.help.name}`).set({
  //     "name":command.help.name,
  //     "use":command.help.use,
  //     "description":command.help.description
  //   })
  // })
})

client.on("ready", () => {
  setInterval(function () {
    client.guilds.cache.forEach(async (guild, id) => {
      database.ref(`/status/${id}`).once("value").then(status => {
        const data = status.val()
        database.ref(`/settings/${guild.id}/language`).once("value").then(l => {
          const language = l.val()

          function getHighscore(online, d, lang, list) {
            let score

            database.ref(`highscore/${id}/score`).once("value").then(data => {
              if (!data.val()) {
                database.ref(`highscore/${id}/`).set({
                  score: online
                })
                score = online
              } else {
                score = data.val()
              }
              if (score < online) {
                database.ref(`highscore/${id}/`).set({
                  score: online
                })
                score = online
              }
              if (guild.id == "678305767756922912" && d.highscore) {
                guild.channels.cache.get(d.highscore).setName(`💝 | Rekord Online: ${score.toString()}`)
              } else if (d.highscore) {
                if(!guild.channels.cache.get(d.highscore) || !list[3] || !score.toString()) return
                guild.channels.cache.get(d.highscore).setName(`${list[3]}: ${score.toString()}`)
              }
            })
          }

          let lang
          if (language == "PL") {
            lang = require("./languages/pl.json")
          } else if (language == "EN") {
            lang = require("./languages/en.json")
          } else {
            lang = require("./languages/en.json")
          }
          if (!data) return
          if (data.enabled !== true) return
          if (!guild.channels.cache.get(data.date)) database.ref(`/status/${id}`).set({
            "enabled": false
          })
          if (!guild.channels.cache.get(data.online)) database.ref(`/status/${id}`).set({
            "enabled": false
          })
          if (!guild.channels.cache.get(data.all)) database.ref(`/status/${id}`).set({
            "enabled": false
          })

          if (!data.date) return

          database.ref(`/status_look/${guild.id}/list`).once("value").then(channels => {
            let list
            if (channels.val()) list = channels.val()
            else list = lang.commands.status.channels
            let online = guild.members.cache.filter(member => member.user.presence.status !== 'offline');
            if (guild.id == "678305767756922912") guild.channels.cache.get(data.date).setName(`💝 | Data: ${moment.utc(new Date()).format("DD.MM.YYYY")}`)
            else guild.channels.cache.get(data.date).setName(`${list[0]}: ${moment.utc(new Date()).format("DD.MM.YYYY")}`).catch(err => {
              console.log("[error] Błąd przy ustawianiu nazwy")
            })

            if (guild.id == "678305767756922912") guild.channels.cache.get(data.online).setName(`💝 | Online: ${online.size}`)
            else guild.channels.cache.get(data.online).setName(`${list[2]}: ${online.size}`)

            if (guild.id == "678305767756922912") guild.channels.cache.get(data.all).setName(`💝 | Członkowie: ${guild.members.cache.size}`)
            else guild.channels.cache.get(data.all).setName(`${list[1]}: ${guild.members.cache.size}`)

            getHighscore(online.size, data, lang, list)
          })
        })
      })
    })
  }, 10000)
})

// client.on('debug', m => console.log(chalk.yellow("[debug] " + m)));
// client.on('warn', m => console.log(chalk.orange("[warn] " + m)));
// client.on('error', m => console.log(chalk.red("[error] " + m)));

// process.on('uncaughtException', error => chalk.redBright("[error] " + error))

function generateSwitches(message) {
  database.ref(`/commands/${message.guild.id}/switches`).once("value").then(swc => {
    let switches = swc.val()

    // console.log(switches)

    client.commands.forEach(cmd => {
      let cmdName = cmd.help.name
      if (switches[cmdName] == undefined) {
        console.log(cmdName + " jest nową komendusią")
        switches[cmdName] = true

        database.ref(`/commands/${message.guild.id}/`).set({
          switches
        })
      }
    })
  })
}

client.on("message", message => {
  if(message.author.bot) return

  database.ref(`verification/${message.guild.id}`).once("value").then(data => {

    if (!data.val()) return
    const verification = data.val()
    const member = message.member

    const channel = member.guild.channels.cache.get(verification.channel)
    if (channel.id !== message.channel.id) return
    
    if(message.deletable) message.delete()

    if (message.content.toLowerCase() == "weryfikacja" || message.content.toLowerCase() == "verify") {
      const defaultRole = member.guild.roles.cache.get(verification.rolesList[0])
      member.roles.add(defaultRole)
    if (member.guild.id == "678305767756922912") {
        const role = member.guild.roles.cache.get("693802548766703647")
        member.roles.remove(role)
      }

    }
  })
})

client.on("message", message => {

  if (message.channel.type == "dm") return
  if (message.guild.id == "264445053596991498") return
  if (message.channel.id == "587907176467529738") message.react("✅")
  if (message.author.bot) return

  database.ref(`/settings/${message.guild.id}/prefix`).once("value").then(pf => {
    let prefix = pf.val()
    if (!message.content.startsWith(prefix)) return

    database.ref(`/settings/${message.guild.id}/embed_color`).once("value").then(ec => {
      database.ref(`/settings/${message.guild.id}/language`).once("value").then(ladb => {
        const la = ladb.val()

        if (message.content.includes(client.user.id)) {
          message.reply("**prefix: **`" + pf.val() + "`")
        }
        antiRaid.run(message, client)
        if (la == "PL") reactions.run(client, message)

        var embed_color = ec.val()


        let messageArray = message.content.split(" ")
        let cmd = messageArray[0]
        var args = message.content.slice(prefix.length).trim().split(/ +/g)
        var command = args.shift().toLowerCase()
        const commandName = cmd.slice(prefix.length)

        let commandfile = client.commands.get(cmd.slice(prefix.length)) ||
          client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
        // console.log(commandfile)
        let lang
        if (la == "PL") {
          lang = require("./languages/pl.json")
        } else {
          lang = require("./languages/en.json")
        }
        let commandEnabled

        commandEnabled = true

        if (commandfile && commandEnabled) {
          commandfile.run(client, message, args, embed_color, lang)
        } else if (commandEnabled == false) {
          message.reply("<:disable:665227998324326441> " + lang.commands.command.replies.disabled)
        }
      })
    })
  })
})

client.on("guildCreate", guild => {
  guild.owner.send("Hey I've joined to your server. You can change my language by typing on your server this command: $language EN/PL")
    .then(() => {
      return
    })
  database.ref(`/settings/${guild.id}/version`).once("value")
    .then(version => {
      if (version.val() !== 5) {
        database.ref(`/settings/${guild.id}`).set({
          "version": 5,
          "embed_color": "#1be5e2",
          "prefix": "$",
          "wmsg": "Witaj na serwerze /member/",
          "wlcm": false,
          "wchan": null,
          "wrole": "@everyone",
          "gbmsg": "papa",
          "gbay": false,
          "leveling": false,
          "logs": false,
          "logschan": null,
          "language": "EN"
        })
        let commandsArray = Array(0)
        client.commands.forEach(cmd => {
          let cmdName = cmd.help.name
          commandsArray[commandsArray.length] = cmdName
        })

        let JSONstring = ""

        for (var i = 0; i <= commandsArray.length - 1; i++) {
          JSONstring += ', "' + commandsArray[i] + '": true'
        }

        JSONstring = `{"controlPoint": ${client.commands.size}, ${JSONstring.replace(", ", "")}}`
        const switches = JSON.parse(JSONstring)

        database.ref(`commands/${guild.id}`).set({
          switches
        }).catch(err => {
          console.log(chalk.red(`[error] ${err}`))
        })
      }
    })
})

// var Music = require('discord.js-musicbot-addon-v2');
// var music = new Music(client, {
//   prefix: config.prefix,
//   youtubeKey: process.env.API,
//   embedColor: 1828322,
//   enableQueueStat: true,
//   botAdmins: [367390191721381890],
//   clearOnLeave: true,
//   disableVolume: true,
//   djRole: "@everyone"
// });

client.on('guildMemberRemove', async member => {
  database.ref(`/settings/${member.guild.id}/gbay`).once('value')
    .then(on => {
      if (on.val() == false) return
      database.ref(`/settings/${member.guild.id}/gbmsg`).once('value')
        .then(msg => {
          database.ref(`/settings/${member.guild.id}/gbchan`).once('value')
            .then(chan => {
              var wlcm = msg.val()
              if (!msg.val()) return;
              if (!chan.val()) return;
              client.channels.cache.get(chan.val()).send(wlcm.replace("/member/", "**" + member.user.tag + "**"))
                .catch(err => chalk.red(`[error] ${err}`))
            })
        })
    })
})



var on2 = database.ref('/admin/eval');
on2.on('value', function (result) {
  if (result.val() == "everything done") return;
  eval(`async function go() {
      ${result.val()}
    }
    go()`)
  database.ref('/admin/').set({
    "eval": "everything done"
  });
});
client.login(process.env.TOKEN)
