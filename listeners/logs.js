const Discord = require("discord.js")
const chalk = require("chalk")
const moment = require("moment")
const {
  database
} = require("firebase")

module.exports.run = async (client) => {
  client.on("guildMemberAdd", member => {
    database().ref(`/settings/${member.guild.id}`).once("value").then(data => {
      if (!data.val()) return;

      const settings = data.val()
      if (!settings.logschan || !settings.logs) return;

      const channel = member.guild.channels.cache.get(settings.logschan)
      const language = settings.language

      let lang

      if (language == "PL") lang = require("../languages/pl.json")
      else lang = require("../languages/en.json")

      const embed = new Discord.MessageEmbed()
        .setColor("#59ff00")
        .setTitle(lang.logs.newMember.embeds.titles[0])
        .addField(lang.logs.newMember.embeds.fields[0], member.user.username)
        .addField(lang.logs.newMember.embeds.fields[1], moment.utc(member.user.createdAt).format("DD.MM.YYYY"))
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
      channel.send(embed)
    })
  })

  client.on("guildMemberRemove", member => {
    database().ref(`/settings/${member.guild.id}`).once("value").then(data => {
      if (!data.val()) return;

      const settings = data.val()
      if (!settings.logschan || !settings.logs) return;

      const channel = member.guild.channels.cache.get(settings.logschan)
      const language = settings.language

      let lang

      if (language == "PL") lang = require("../languages/pl.json")
      else lang = require("../languages/en.json")

      let embed = new Discord.MessageEmbed()
        .setColor("#ff0037")
        .setAuthor(lang.logs.memberRemove.embeds.titles[0])
        .addField(lang.logs.memberRemove.embeds.fields[0], member.user.tag)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
      channel.send(embed)
    })
  })

  client.on("messageDelete", message => {
    if (!message.guild) return
    database().ref(`/settings/${message.guild.id}`).once("value").then(data => {
      if (!data.val()) return;

      const settings = data.val()
      if (!settings.logschan || !settings.logs) return;

      const channel = message.guild.channels.cache.get(settings.logschan)
      const language = settings.language

      let lang

      if (language == "PL") lang = require("../languages/pl.json")
      else lang = require("../languages/en.json")

      let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("#ff0037")
        .setAuthor(lang.logs.messageRemove.embeds.titles[0])
        .addField(lang.logs.messageRemove.embeds.fields[0], message.author, true)
        .addField(lang.logs.messageRemove.embeds.fields[1], message.channel, true)
        .addField(lang.logs.messageRemove.embeds.fields[2], message.content || lang.logs.messageRemove.embeds.fields[3])
      channel.send(embed)

      if (message.embeds.length > 0) {
        let warning = new Discord.MessageEmbed()
          .setColor("#ff0037")
          .setTitle(lang.logs.messageRemove.embeds.titles[1])
        channel.send(warning)

        message.embeds.forEach(e => {
          channel.send(e)
        })
      }
    })
  })
  client.on("messageUpdate", (oldMessage, newMessage) => {
    if (!oldMessage.guild) return
    database().ref(`/settings/${newMessage.guild.id}`).once("value").then(data => {
      if (!data.val()) return;
      if (oldMessage.content == newMessage.content) return

      const settings = data.val()
      if (!settings.logschan || !settings.logs) return;

      const channel = newMessage.guild.channels.cache.get(settings.logschan)
      const language = settings.language

      let lang

      if (language == "PL") lang = require("../languages/pl.json")
      else lang = require("../languages/en.json")

      let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("#ffe100")
        .setTitle(lang.logs.messageEdit.embeds.titles[0])
        .addField(lang.logs.messageEdit.embeds.fields[0], "```" + oldMessage.content + "```", true)
        .addField(lang.logs.messageEdit.embeds.fields[1], "```" + newMessage.content + "```", true)
        .addField(lang.logs.messageRemove.embeds.fields[1], newMessage.channel, true)
        .addField(lang.logs.messageEdit.embeds.fields[2], newMessage.author.tag)
      channel.send(embed)
    })
  })

  client.on("voiceStateUpdate", (oldMember, newMember) => {
    database().ref(`/settings/${oldMember.member.guild.id}`).once("value").then(data => {
      if (!data.val()) return;

      const settings = data.val()
      if (!settings.logschan || !settings.logs) return;

      const channel = oldMember.member.guild.channels.cache.get(settings.logschan)
      const language = settings.language

      let lang

      if (language == "PL") lang = require("../languages/pl.json")
      else lang = require("../languages/en.json")

      if (!newMember.channel) { // opuszczenie
        let embed = new Discord.MessageEmbed()
          .setColor("#ff0037")
          .setTitle(lang.logs.voiceState.embeds.titles[0])
          .addField(lang.logs.voiceState.embeds.fields[0], oldMember.member.user.tag, true)
          .addField(lang.logs.voiceState.embeds.fields[1], oldMember.channel.name, true)
        channel.send(embed)
      } else if (!oldMember.channel && newMember.channel) { //dołączenie
        let embed = new Discord.MessageEmbed()
          .setColor("#59ff00")
          .setTitle(lang.logs.voiceState.embeds.titles[1])
          .addField(lang.logs.voiceState.embeds.fields[0], newMember.member.user.tag, true)
          .addField(lang.logs.voiceState.embeds.fields[1], newMember.channel.name, true)
        channel.send(embed)
      } else if (oldMember.channel !== newMember.channel) { //przełączenie
        let embed = new Discord.MessageEmbed()
          .setColor("#ffe100")
          .setTitle(lang.logs.voiceState.embeds.titles[2])
          .addField(lang.logs.voiceState.embeds.fields[0], newMember.member.user.tag)
          .addField(lang.logs.voiceState.embeds.fields[2], oldMember.channel.name, true)
          .addField(lang.logs.voiceState.embeds.fields[3], newMember.channel.name, true)
        channel.send(embed)
      }
    })
  })

  client.on("messageDeleteBulk", messages => {
    messages.forEach(message => {
      if (!message.guild) return
      database().ref(`/settings/${message.guild.id}`).once("value").then(data => {
        if (!data.val()) return;

        const settings = data.val()
        if (!settings.logschan || !settings.logs) return;

        const channel = message.guild.channels.cache.get(settings.logschan)
        const language = settings.language

        let lang

        if (language == "PL") lang = require("../languages/pl.json")
        else lang = require("../languages/en.json")

        let embed = new Discord.MessageEmbed()
          .setColor("#ff0080")
          .setAuthor(lang.logs.messageRemove.embeds.titles[2])
          .addField(lang.logs.messageRemove.embeds.fields[0], message.author, true)
          .addField(lang.logs.messageRemove.embeds.fields[1], message.channel, true)
          .addField(lang.logs.messageRemove.embeds.fields[2], message.content || lang.logs.messageRemove.embeds.fields[3])
        channel.send(embed)

        if (message.embeds.length > 0) {
          let warning = new Discord.MessageEmbed()
            .setColor("#ff0080")
            .setTitle(lang.logs.messageRemove.embeds.titles[1])
          channel.send(warning)

          message.embeds.forEach(e => {
            let removedEmbed = new Discord.MessageEmbed()
              .setColor(e.color)
              .setAuthor(e.author.name, e.author.displayAvatarURL())
              .setDescription(e.description || "")
            e.fields.forEach(f => {
              removedEmbed.addField(f.name, f.value, f.inline)
            })
            channel.send(removedEmbed)
          })
        }
      })
    })
  })
}