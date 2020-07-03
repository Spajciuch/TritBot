const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
  const firebase = require("firebase")
  const database = firebase.database()
  if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.badword.replies.permission_error)
  if (!args.join(" ")) return message.reply(lang.commands.badword.replies.proper_use)
  if (args[0] !== "disable") {
    database.ref(`/settings/${message.guild.id}/`).once("value").then(data => {
      const settings = data.val()
      let embed = new Discord.MessageEmbed()
        .setTitle(lang.commands.badword.embeds.titles[0])
        .setColor(embed_color)
        .setFooter(lang.commands.badword.embeds.footers[0])
      let description = ""
      for (var i = 0; i <= args.join(" ").split(" | ").length - 1; i++) {
        description += `[${i+1}] ` + args.join(" ").split(" | ")[i] + "\n"
      }
      embed.setDescription(description)
      message.channel.send(embed).then(msg => {

        msg.react('✅').then(r => {
          msg.react('❌')
          const acceptbadword = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
          const cancelbadword = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

          const accept = msg.createReactionCollector(acceptbadword);
          const cancel = msg.createReactionCollector(cancelbadword);

          accept.on('collect', r => {
            r.users.remove(message.author)
            database.ref(`/settings/${message.guild.id}/`).set({
              "badWords": args.join(" ").split(" | "),
              "version": settings.version || null,
              "embed_color": settings.embed_color || null,
              "prefix": settings.prefix || null,
              "wmsg": settings.wmsg || null,
              "wlcm": settings.wlcm || null,
              "wchan": settings.wchan || null,
              "wrole": settings.wrole || null,
              'gbmsg': settings.gbmsg || null,
              "gbay": settings.gbay || null,
              "gbchan": settings.gbchan || null,
              "leveling": settings.leveling || null,
              "logs": settings.logs || null,
              "logschan": settings.logschan || null,
              "language": settings.language || null
            })
            message.reply(lang.commands.badword.replies.success)
            accept.stop()
            cancel.stop()
          })
          cancel.on('collect', r => {
            r.users.remove(message.author)
            msg.delete()
            message.reply(lang.commands.badword.replies.canceled).then(sent => sent.delete(2000))
            accept.stop()
            cancel.stop()
          })
        })
      })
    })
  } else if (args[0] == "disable") {
    database.ref(`/settings/${message.guild.id}/badWords`).remove()
    message.reply(lang.commands.badword.replies.disabled)
  }
}
module.exports.start = async (client) => {
  client.on("message", message => {
    if (!message.guild) return;
    database.ref(`/settings/${message.guild.id}/`).once("value").then(data => {
      let settings = data.val()
      if(!settings) return
      l = settings.language
      let lang

      if (l == "PL") lang = require("../languages/pl.json")
      else lang = require("../languages/en.json")

      if (message.channel.type == "dm") return
      database.ref(`/settings/${message.guild.id}/badWords`).once("value").then(data => {
        let badWords = data.val()
        if (!badWords) return
        badWords.forEach(async (word, i) => {
          badWords[i] = word.toLowerCase()
        })
        let sent = false
        let rsn = ""
        for (var i = 0; i <= badWords.length - 1; i++) {
          if (message.content.toLowerCase().includes(badWords[i])) {
            message.delete()
            if (sent) return
            sent = true
            rsn = badWords[i]
            message.reply(lang.commands.badword.replies.warning)
              .then(() => {
                database.ref(`/warns/${message.guild.id}/${message.author.id}/`).once("value").then(async warns => {
                  database.ref(`/settings/${message.guild.id}/forBan`).once("value").then(async ban => {
                    let forBan = ban.val()
                    let warn = warns.val()
                    let reasons
                    let count
                    let byList
                    if (!warn) {
                      reasons = []
                      count = 0
                      byList = []
                    } else {
                      reasons = warn.reasons
                      count = warn.count
                      if (!warn.byList) byList = []
                      else byList = warn.byList
                    }

                    byList[byList.length || 0] = client.user.tag

                    if (!reasons) reasons = []

                    reasons[reasons.length || 0] = lang.commands.badword.replies.reasons || "Badword -> `" + rsn + "`"
                    count += 1

                    database.ref(`/warns/${message.guild.id}/${message.author.id}`).set({
                      "reasons": reasons,
                      "byList": byList
                    }).then(() => {
                      let embed = new Discord.MessageEmbed()
                        .setColor("#ff6f00")
                        .setTitle("Warn")
                        .addField(lang.logs.warn.embeds.fields[0], message.author.tag, true)
                        .addField(lang.logs.warn.embeds.fields[1], client.user.tag, true)
                        .addField(lang.logs.warn.embeds.fields[2], lang.commands.badword.replies.reasons || "Badword -> `" + rsn + "`")
                      
                      if(reasons.length >= settings.forBan) member.ban("TRIT - WARNS")

                        if (settings.logs == true) {
                        const channelId = settings.logschan
                        const channel = message.guild.channels.cache.get(channelId.replace("<@", "").replace(">", ""))

                        channel.send(embed)
                      }
                    })
                  })
                })
              })
          }
        }
      })
    })
  })
  const database = require("firebase").database()
  client.on('guildMemberAdd', async member => {
    if (member.guild.id == "587659744810893312") {
      member.setNickname("MGP_" + member.user.username)
    }
    database.ref(`/blacklist/${member.guild.id}/list`).once("value").then(data => {
      if (data.val()) {
        const blacklist = data.val()

        if (blacklist.includes(member.user.id)) {
          member.kick("Blacklist :)")
            .catch(err => {
              console.log(`[error] ${err}`)
            })
        }
      }
    })
    database.ref(`/settings/${member.guild.id}/wlcm`).once('value')
      .then(on => {
        if (on.val() !== true) return
        database.ref(`/settings/${member.guild.id}/wmsg`).once('value')
          .then(msg => {
            database.ref(`/settings/${member.guild.id}/wchan`).once('value')
              .then(chan => {
                database.ref(`/settings/${member.guild.id}/wrole`).once('value')
                  .then(wrole => {
                    var roleId = wrole.val()
                    if (!msg.val() || !client.channels.cache.get(chan.val())) return;
                    var wlcm = msg.val()
                    client.channels.cache.get(chan.val()).send(wlcm.replace("/member/", member))
                    if (roleId == "@everyone") return
                    var role = member.guild.roles.cache.get(roleId.replace("<@&", "").replace(">", ""))
                    member.roles.add(role)
                    // console.log(roleId.replace("<@&", "").replace(">", ""))
                  })
              })
          })
      })
  })
}
module.exports.help = {
  name: "badword",
  category: "admin"
}
module.exports.aliases = ["wordsfilter"]