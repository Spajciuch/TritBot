var Discord = require("discord.js")
var config = require(`../config.json`)
module.exports.run = async (client, message, args, color, lang) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("nie masz uprawnień.");
  var firebase = require('firebase')
  var database = firebase.database()
  database.ref(`/settings/${message.guild.id}/embed_color`).once("value")
    .then(embed_color => {
      database.ref(`/settings/${message.guild.id}/prefix`).once("value")
        .then(prefix => {
          database.ref(`/settings/${message.guild.id}/version`).once("value")
            .then(version => {
              database.ref(`/settings/${message.guild.id}/wchan`).once("value")
                .then(wchan => {
                  database.ref(`/settings/${message.guild.id}/wlcm`).once("value")
                    .then(wlcm => {
                      database.ref(`/settings/${message.guild.id}/wmsg`).once("value")
                        .then(wmsg => {
                          database.ref(`/settings/${message.guild.id}/wrole`).once("value")
                            .then(wrole => {
                              database.ref(`/settings/${message.guild.id}/gbmsg`).once("value")
                                .then(gbmsg => {
                                  database.ref(`/settings/${message.guild.id}/gbay`).once("value")
                                    .then(gbay => {
                                      database.ref(`/settings/${message.guild.id}/gbchan`).once("value")
                                        .then(gbchan => {
                                          database.ref(`/settings/${message.guild.id}/leveling`).once("value")
                                            .then(leveling => {
                                              database.ref(`/settings/${message.guild.id}/logs`).once("value")
                                                .then(logs => {
                                                  database.ref(`/settings/${message.guild.id}/logschan`).once("value")
                                                    .then(logschan => {
                                                      database.ref(`/settings/${message.guild.id}/badWords`).once("value")
                                                        .then(badWords => {
                                                          database.ref(`/settings/${message.guild.id}/forBan`).once("value")
                                                            .then(forBan => {
                                                              database.ref(`/settings/${message.guild.id}/language`).once("value")
                                                                .then(langw => {
                                                                  const language = langw.val()
                                                                  var chan = wchan.val()
                                                                  var msg = wmsg.val()

                                                                  if (!args[0]) {
                                                                    if (typeof wchan == 'object') {
                                                                      chan = "-----"
                                                                    }
                                                                    if (typeof wmsg == 'object') {
                                                                      msg = "-----"
                                                                    }
                                                                    let embed = new Discord.MessageEmbed()
                                                                      .setAuthor(lang.commands.settings.embeds.titles[0], message.guild.iconURL())
                                                                      .setColor(embed_color.val())
                                                                      .addField(lang.commands.settings.embeds.fields[0], embed_color.val(), true)
                                                                      .addField(lang.commands.settings.embeds.fields[1], prefix.val(), true)
                                                                      .addField(lang.commands.settings.embeds.fields[2], `<@&${wrole.val()}>`, true)
                                                                      .addField(lang.commands.settings.embeds.fields[3], forBan.val() || "-nie ustalono-", true)
                                                                      .addField(lang.commands.settings.embeds.fields[4], leveling.val(), true)
                                                                      .addField(lang.commands.settings.embeds.fields[5], wlcm.val(), true)
                                                                      .addField(lang.commands.settings.embeds.fields[6], gbay.val(), true)
                                                                      .addField(lang.commands.settings.embeds.fields[7], "```" + gbmsg.val() + "```")
                                                                      .addField(lang.commands.settings.embeds.fields[8], "<#" + wchan.val() + ">" || "-brak-", true)
                                                                      .addField(lang.commands.settings.embeds.fields[9], "<#" + gbchan.val() + ">" || "-brak-", true)
                                                                      .addField(lang.commands.settings.embeds.fields[10], "```" + wmsg.val() + "```" || "-brak-")
                                                                      .addField(lang.commands.settings.embeds.fields[11], logs.val() || "false", true)
                                                                      .addField(lang.commands.settings.embeds.fields[12], "<#" + logschan.val() + ">", true)
                                                                    message.channel.send(embed)
                                                                    let infoEmbed = new Discord.MessageEmbed()
                                                                      .setAuthor(lang.commands.settings.embeds.titles[1], message.guild.iconURL())
                                                                      .setColor(embed_color.val())
                                                                      .setDescription(lang.commands.settings.embeds.descriptions[0])
                                                                    message.channel.send(infoEmbed)
                                                                  } else if (args[0] == 'help') {




                                                                    let titles = lang.commands.settings.embeds.help_titles
                                                                    let pages = lang.commands.settings.embeds.help_pages
                                                                    let page = 1;
                                                                    const embed = new Discord.MessageEmbed()
                                                                      .setAuthor(titles[page - 1], message.guild.iconURL())
                                                                      .setColor(color)
                                                                      .setFooter(`${page} / ${pages.length}`)
                                                                      .setDescription(pages[page - 1])

                                                                    message.channel.send(embed).then(msg => {

                                                                      msg.react('⏪').then(r => {
                                                                        msg.react('⏩')

                                                                        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
                                                                        const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;

                                                                        const backwards = msg.createReactionCollector(backwardsFilter);
                                                                        const forwards = msg.createReactionCollector(forwardsFilter);


                                                                        backwards.on('collect', r => {
                                                                          r.users.remove(message.author)
                                                                          if (page == 1) return;
                                                                          page--;
                                                                          embed.setDescription(pages[page - 1]);
                                                                          embed.setFooter(`${page} / ${pages.length}`);
                                                                          embed.setAuthor(titles[page - 1], message.guild.iconURL())
                                                                          msg.edit(embed)
                                                                        })

                                                                        forwards.on('collect', r => {
                                                                          r.users.remove(message.author)
                                                                          if (page == pages.length) return;
                                                                          page++;
                                                                          embed.setDescription(pages[page - 1]);
                                                                          embed.setFooter(`${page} / ${pages.length}`);
                                                                          embed.setAuthor(titles[page - 1], message.guild.iconURL())
                                                                          msg.edit(embed)
                                                                        })

                                                                      })

                                                                    })
                                                                  } else if (args[0] == "warns") {
                                                                    database.ref(`/settings/${message.guild.id}/`).set({
                                                                      "version": version.val(),
                                                                      "embed_color": embed_color.val(),
                                                                      "prefix": prefix.val(),
                                                                      "wmsg": wmsg.val(),
                                                                      "wlcm": wlcm.val(),
                                                                      "wchan": wchan.val(),
                                                                      "wrole": wrole.val(),
                                                                      'gbmsg': gbmsg.val(),
                                                                      "gbay": gbay.val(),
                                                                      "gbchan": gbchan.val(),
                                                                      "leveling": leveling.val(),
                                                                      "logs": logs.val(),
                                                                      "logschan": logschan.val(),
                                                                      "badWords": badWords.val(),
                                                                      "forBan": args[1],
                                                                      "language": language
                                                                    })
                                                                    message.reply(lang.commands.settings.replies.warns + args[1] + "`")
                                                                  } else if (args[0] == "logs") {
                                                                    if (args[1] == "off") {
                                                                      database.ref(`/settings/${message.guild.id}/`).set({
                                                                        "version": version.val(),
                                                                        "embed_color": embed_color.val(),
                                                                        "prefix": prefix.val(),
                                                                        "wmsg": wmsg.val(),
                                                                        "wlcm": wlcm.val(),
                                                                        "wchan": wchan.val(),
                                                                        "wrole": wrole.val(),
                                                                        'gbmsg': gbmsg.val(),
                                                                        "gbay": gbay.val(),
                                                                        "gbchan": gbchan.val(),
                                                                        "leveling": leveling.val(),
                                                                        "logs": false,
                                                                        "logschan": logschan.val(),
                                                                        "badWords": badWords.val(),
                                                                        "forBan": forBan.val(),
                                                                        "language": language
                                                                      })
                                                                      message.reply(lang.commands.settings.replies.logs_off)
                                                                    }
                                                                    if (args[1] == "on") {
                                                                      database.ref(`/settings/${message.guild.id}/`).set({
                                                                        "version": version.val(),
                                                                        "embed_color": embed_color.val(),
                                                                        "prefix": prefix.val(),
                                                                        "wmsg": wmsg.val(),
                                                                        "wlcm": wlcm.val(),
                                                                        "wchan": wchan.val(),
                                                                        "wrole": wrole.val(),
                                                                        'gbmsg': gbmsg.val(),
                                                                        "gbay": gbay.val(),
                                                                        "gbchan": gbchan.val(),
                                                                        "leveling": leveling.val(),
                                                                        "logs": true,
                                                                        "logschan": message.channel.id,
                                                                        "badWords": badWords.val(),
                                                                        "forBan": forBan.val(),
                                                                        "language": language
                                                                      })
                                                                      message.reply(lang.commands.settings.replies.logs_on)
                                                                    }
                                                                  } else if (args[0] == "leveling") {
                                                                    if (args[1] == "off") {
                                                                      database.ref(`/settings/${message.guild.id}/`).set({
                                                                        "version": version.val(),
                                                                        "embed_color": embed_color.val(),
                                                                        "prefix": prefix.val(),
                                                                        "wmsg": wmsg.val(),
                                                                        "wlcm": wlcm.val(),
                                                                        "wchan": wchan.val(),
                                                                        "wrole": wrole.val(),
                                                                        'gbmsg': gbmsg.val(),
                                                                        "gbay": gbay.val(),
                                                                        "gbchan": gbchan.val(),
                                                                        "leveling": false,
                                                                        "logs": logs.val(),
                                                                        "logschan": logschan.val(),
                                                                        "badWords": badWords.val(),
                                                                        "forBan": forBan.val(),
                                                                        "language": language
                                                                      })
                                                                      message.reply(lang.commands.settings.replies.leveling_off)
                                                                    }
                                                                    if (args[1] == "on") {
                                                                      database.ref(`/settings/${message.guild.id}/`).set({
                                                                        "version": version.val(),
                                                                        "embed_color": embed_color.val(),
                                                                        "prefix": prefix.val(),
                                                                        "wmsg": wmsg.val(),
                                                                        "wlcm": wlcm.val(),
                                                                        "wchan": wchan.val(),
                                                                        "wrole": wrole.val(),
                                                                        'gbmsg': gbmsg.val(),
                                                                        "gbay": gbay.val(),
                                                                        "gbchan": gbchan.val(),
                                                                        "leveling": true,
                                                                        "logs": logs.val(),
                                                                        "logschan": logschan.val(),
                                                                        "badWords": badWords.val(),
                                                                        "forBan": forBan.val(),
                                                                        "language": language
                                                                      })
                                                                      message.reply(lang.commands.settings.replies.leveling_on)
                                                                    }
                                                                  } else if (args[0] == "gbmsg") {
                                                                    if (args[1] == "off") {
                                                                      database.ref(`/settings/${message.guild.id}/`).set({
                                                                        "version": version.val(),
                                                                        "embed_color": embed_color.val(),
                                                                        "prefix": prefix.val(),
                                                                        "wmsg": wmsg.val(),
                                                                        "wlcm": wlcm.val(),
                                                                        "wchan": wchan.val(),
                                                                        "wrole": wrole.val(),
                                                                        'gbmsg': gbmsg.val(),
                                                                        "gbay": false,
                                                                        "gbchan": gbchan.val(),
                                                                        "leveling": leveling.val(),
                                                                        "logs": logs.val(),
                                                                        "logschan": logschan.val(),
                                                                        "badWords": badWords.val(),
                                                                        "forBan": forBan.val(),
                                                                        "language": language
                                                                      })
                                                                      message.reply(lang.commands.settings.replies.gbmsg_off)
                                                                    } else {
                                                                      database.ref(`/settings/${message.guild.id}/`).set({
                                                                        "version": version.val(),
                                                                        "embed_color": embed_color.val(),
                                                                        "prefix": prefix.val(),
                                                                        "wmsg": wmsg.val(),
                                                                        "wlcm": wlcm.val(),
                                                                        "wchan": wchan.val(),
                                                                        "wrole": wrole.val(),
                                                                        'gbmsg': args.join(" ").replace("gbmsg ", ""),
                                                                        "gbay": true,
                                                                        "gbchan": message.channel.id,
                                                                        "leveling": leveling.val(),
                                                                        "logs": logs.val(),
                                                                        "logschan": logschan.val(),
                                                                        "badWords": badWords.val(),
                                                                        "forBan": forBan.val(),
                                                                        "language": language
                                                                      })
                                                                      message.reply(lang.commands.settings.replies.gbmsg_on)
                                                                    }
                                                                  } else if (args[0] == "role") {
                                                                    database.ref(`/settings/${message.guild.id}/`).set({
                                                                      "version": version.val(),
                                                                      "embed_color": embed_color.val(),
                                                                      "prefix": prefix.val(),
                                                                      "wmsg": wmsg.val(),
                                                                      "wlcm": wlcm.val(),
                                                                      "wchan": wchan.val(),
                                                                      "wrole": args[1].replace("<@&", "").replace(">", ""),
                                                                      'gbmsg': gbmsg.val(),
                                                                      "gbay": gbay.val(),
                                                                      "gbchan": gbchan.val(),
                                                                      "leveling": leveling.val(),
                                                                      "logs": logs.val(),
                                                                      "logschan": logschan.val(),
                                                                      "badWords": badWords.val(),
                                                                      "forBan": forBan.val(),
                                                                      "language": language
                                                                    })
                                                                    message.reply(lang.commands.settings.replies.wrole + args[1] + "`")
                                                                  } else if (args[0] == "prefix") {
                                                                    database.ref(`/settings/${message.guild.id}/`).set({
                                                                      "version": version.val(),
                                                                      "embed_color": embed_color.val(),
                                                                      "prefix": args[1],
                                                                      "wmsg": wmsg.val(),
                                                                      "wlcm": wlcm.val(),
                                                                      "wchan": wchan.val(),
                                                                      "wrole": wrole.val(),
                                                                      'gbmsg': gbmsg.val(),
                                                                      "gbay": gbay.val(),
                                                                      "gbchan": gbchan.val(),
                                                                      "leveling": leveling.val(),
                                                                      "logs": logs.val(),
                                                                      "logschan": logschan.val(),
                                                                      "badWords": badWords.val(),
                                                                      "forBan": forBan.val(),
                                                                      "language": language
                                                                    })
                                                                    message.reply(lang.commands.settings.replies.prefix + args[1] + "`")
                                                                  } else if (args[0] == "color") {
                                                                    database.ref(`/settings/${message.guild.id}/`).set({
                                                                      "version": version.val(),
                                                                      "embed_color": args[1],
                                                                      "prefix": prefix.val(),
                                                                      "wmsg": wmsg.val(),
                                                                      "wlcm": wlcm.val(),
                                                                      "wchan": wchan.val(),
                                                                      "wrole": wrole.val(),
                                                                      'gbmsg': gbmsg.val(),
                                                                      "gbay": gbay.val(),
                                                                      "gbchan": gbchan.val(),
                                                                      "leveling": leveling.val(),
                                                                      "logs": logs.val(),
                                                                      "logschan": logschan.val(),
                                                                      "badWords": badWords.val(),
                                                                      "forBan": forBan.val(),
                                                                      "language": language
                                                                    })
                                                                    message.reply(lang.commands.settings.replies.embed_color + args[1] + "`")
                                                                  } else if (args[0] == "welcome") {
                                                                    if (args[1] !== "off") {
                                                                      database.ref(`/settings/${message.guild.id}/`).set({
                                                                        "version": version.val(),
                                                                        "embed_color": embed_color.val(),
                                                                        "prefix": prefix.val(),
                                                                        "wmsg": args.join(" ").replace("welcome ", ""),
                                                                        "wlcm": true,
                                                                        "wchan": message.channel.id,
                                                                        "wrole": wrole.val(),
                                                                        'gbmsg': gbmsg.val(),
                                                                        "gbay": gbay.val(),
                                                                        "gbchan": gbchan.val(),
                                                                        "leveling": leveling.val(),
                                                                        "logs": logs.val(),
                                                                        "logschan": logschan.val(),
                                                                        "badWords": badWords.val(),
                                                                        "forBan": forBan.val(),
                                                                        "language": language
                                                                      })
                                                                      message.reply(lang.commands.settings.replies.wmsg_on)
                                                                    } else if (args[1] == "off") {
                                                                      database.ref(`/settings/${message.guild.id}/`).set({
                                                                        "version": version.val(),
                                                                        "embed_color": embed_color.val(),
                                                                        "prefix": prefix.val(),
                                                                        "wmsg": wmsg.val(),
                                                                        "wlcm": false,
                                                                        "wchan": wchan.val(),
                                                                        "wrole": wrole.val(),
                                                                        'gbmsg': gbmsg.val(),
                                                                        "gbay": gbay.val(),
                                                                        "gbchan": gbchan.val(),
                                                                        "leveling": leveling.val(),
                                                                        "logs": logs.val(),
                                                                        "logschan": logschan.val(),
                                                                        "badWords": badWords.val(),
                                                                        "forBan": forBan.val(),
                                                                        "language": language
                                                                      })
                                                                      message.reply(lang.commands.settings.replies.wmsg_off)
                                                                    }
                                                                  }
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}
module.exports.help = {
  name: "settings",
  category: "admin"
}
module.exports.aliases = ["ustawienia"]