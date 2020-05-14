const Discord = require("discord.js")
const chalk = require("chalk")
const snekfetch = require("snekfetch")
const {
  database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {
  if (!message.mentions.members.first()) return message.reply(lang.commands.ttt.replies.no_mention)

  const enemy = message.mentions.members.first()

  if (enemy.user.id == message.author.id && message.author.id !== "367390191721381890") return message.reply(lang.commands.ttt.replies.no_mention)

  if (enemy.user.bot) return message.reply(lang.commands.ttt.replies.bot)

  const filter = msg => msg.author.id == message.author.id || msg.author.id == enemy.user.id;
  const collector = new Discord.MessageCollector(message.channel, filter);

  const avaibleAnswers = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"]

  let positions = Array(9).fill(null)
  let tick = 0

  const {
    body: buffer
  } = await snekfetch.get(`https://tritbot.glitch.me/tictactoe/${JSON.stringify(positions)}`)

  const attachment = new Discord.MessageAttachment(buffer, 'plansza.png');
  message.channel.send(attachment)

  let instructionEmbed = new Discord.MessageEmbed()
    .setColor(embed_color)
    .setAuthor(lang.commands.ttt.embeds.titles[0])
    .setDescription(lang.commands.ttt.embeds.descriptions[0])
  message.channel.send(instructionEmbed)

  const exist = function (array, position) {
    if (array[position] == null) return false
    else return true
  }

  const write = function (value, pos, array) {
    const place = avaibleAnswers.indexOf(pos)
    if (place < 0) return "notfound";
    if (exist(array, place)) {
      return false
    } else {
      array[place] = value
    }
  }

  const check = function (array) {
    let winner = null
    let position = null
    let mode = null
    // POZIOM
    if (array[0] == array[1] && array[1] == array[2] && array[2] != null) {
      if (array[0] == "x") winner = "x"
      if (array[0] == "o") winner = "o"
      position = 'horizontal'
      mode = 1
    }
    if (array[3] == array[4] && array[4] == array[5] && array[5] != null) {
      if (array[5] == "x") winner = "x"
      if (array[5] == "o") winner = "o"
      position = 'horizontal'
      mode = 2
    }
    if (array[6] == array[7] && array[7] == array[8] && array[8] != null) {
      if (array[8] == "x") winner = "x"
      if (array[8] == "o") winner = "o"
      position = 'horizontal'
      mode = 3
    }
    //PION
    if (array[0] == array[3] && array[3] == array[6] && array[6] != null) {
      if (array[6] == "x") winner = "x"
      if (array[6] == "o") winner = "o"
      position = 'vertical'
      mode = 1
    }
    if (array[1] == array[4] && array[4] == array[7] && array[7] != null) {
      if (array[7] == "x") winner = "x"
      if (array[7] == "o") winner = "o"
      position = 'vertical'
      mode = 2
    }
    if (array[2] == array[5] && array[5] == array[8] && array[8] != null) {
      if (array[8] == "x") winner = "x"
      if (array[8] == "o") winner = "o"
      position = 'vertical'
      mode = 3
    }
    //SKOS
    if (array[0] == array[4] && array[4] == array[8] && array[8] != null) {
      if (array[8] == "x") winner = "x"
      if (array[8] == "o") winner = "o"
      position = 'right'
      mode = 4
    }
    if (array[2] == array[4] && array[4] == array[6] && array[6] != null) {
      if (array[6] == "x") winner = "x"
      if (array[6] == "o") winner = "o"
      position = 'left'
      mode = 5
    }

    return [winner, position, mode]
  }

  const even = function (int) {
    var res = int % 2
    if (res == 0) return true;
    else return false;
  }

  collector.on("collect", async msg => {
    let symbol = null

    if (msg.content.includes("abort")) {
      collector.stop()
      return msg.react("✅")
    }

    if (even(tick)) {
      if (msg.author.id !== message.author.id) return;
      symbol = "x"
    } else {
      if (msg.author.id !== enemy.user.id) return;
      symbol = "o"
    }

    const writed = write(symbol, msg.content.toLowerCase(), positions)

    if (writed == false) {
      msg.reply(lang.commands.ttt.replies.taken)
      if (symbol == "x") symbol = "o"
      else symbol = "x"
      tick -= 1
    } else if (writed == "notfound") {
      msg.reply(lang.commands.ttt.replies.not_proper)
      if (symbol == "x") symbol = "o"
      else symbol = "x"
      tick -= 1
    }

    const checked = check(positions);

    if (checked[0] == "x") {
      let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setAuthor(lang.commands.ttt.embeds.titles[1], message.author.displayAvatarURL())
        .setDescription(`${lang.commands.ttt.embeds.descriptions[1]} ${message.author.tag}\n+50<:xp_emoji:574551688724217866>`)
      message.channel.send(embed)

      database().ref(`/users/${message.guild.id}/${message.author.id}`).once("value").then(data => {
        let messagesCount = ""
        let level = ""
        if (data.val()) {
          const profile = data.val()

          messagesCount = profile.messagesCount
          level = profile.level
        }

        database().ref(`/users/${message.guild.id}/${message.author.id}`).set({
          level: level,
          messagesCount: messagesCount += 50
        })
      })

      collector.stop()
    } else if (checked[0] == "o") {
      let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setAuthor(lang.commands.ttt.embeds.titles[1], enemy.user.displayAvatarURL())
        .setDescription(`${lang.commands.ttt.embeds.descriptions[1]} ${enemy.user.tag}\n+50<:xp_emoji:574551688724217866>`)
      message.channel.send(embed)

      const user = enemy.user

      database().ref(`/users/${message.guild.id}/${user.id}`).once("value").then(data => {
        let messagesCount = ""
        let level = ""
        if (data.val()) {
          const profile = data.val()

          messagesCount = profile.messagesCount
          level = profile.level
        }

        database().ref(`/users/${message.guild.id}/${user.id}`).set({
          level: level,
          messagesCount: messagesCount += 50
        })
      })

      collector.stop()
    } else if (!positions.includes(null)) {
      let embed = new Discord.MessageEmbed()
        .setColor(embed_color)
        .setTitle(lang.commands.ttt.embeds.titles[2])
        .setTimestamp()
      message.channel.send(embed)
      collector.stop()
    } else {
      // wysyłanie obrazka z planszą normalną
    }

    const {
      body: buffer
    } = await snekfetch.get(`https://tritbot.glitch.me/tictactoe/${JSON.stringify(positions)}`);

    const attachment = new Discord.MessageAttachment(buffer, 'plansza.png');
    message.channel.send(attachment)

    tick += 1

  })
}

module.exports.help = {
  name: "ttt",
  category: "game"
}