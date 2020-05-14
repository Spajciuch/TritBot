const Discord = require("discord.js")
const chalk = require("chalk")
const {
    database
} = require("firebase")
const moment = require("moment")

module.exports.run = async (client, message, args, embed_color, lang) => {
    const member = message.mentions.members.first()

    if (!member) {
        const createdAt = message.author.createdAt
        const joinedAt = message.member.joinedAt

        let day = createdAt.getDate()
        if (day <= 9) day = `0${day}`
        let month = createdAt.getMonth() + 1
        if (month <= 9) month = `0${month}`
        const year = createdAt.getFullYear();

        let jDay = joinedAt.getDate();
        if (jDay <= 9) jDay = `0${jDay}`
        let jMonth = joinedAt.getMonth() + 1
        if (jMonth <= 9) jMonth = `0${jMonth}`
        const jYear = joinedAt.getFullYear();

        let roles = message.member.roles.cache.map(r => r.name)
        roles = roles.join("\n")

        let permissions = message.member.permissions.serialize(false)
        let permissionsKeys = Object.keys(permissions)

        let permissionsList = Array()

        var x = 0;

        permissionsKeys.forEach(element => {
            if (permissions[element] == true) {
                permissionsList[x] = element
                x++
            }
        });

        for (var i = 0; i <= permissionsList.length - 1; i++) {
            permissionsList[i] = permissionsList[i].toLowerCase().replace("_", " ").replace("_", " ").replace("_", " ").replace("_", " ")
        }

        database().ref(`/users/${message.guild.id}/${message.author.id}/level`).once("value").then(l => {
            database().ref(`/users/${message.guild.id}/${message.author.id}/mesagesCount`).once("value").then(c => {
                database().ref(`/userinfo/${message.author.id}/info`).once("value").then(inf => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(embed_color)
                        .setTitle(lang.commands.whois.embeds.titles[0] + message.author.tag)
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp()
                        .addField("ID", message.author.id)
                        .addField(lang.commands.whois.embeds.fields[0], `${day}.${month}.${year}`, true)
                        .addField(lang.commands.whois.embeds.fields[1], `${jDay}.${jMonth}.${jYear}`, true)
                        .addField("Status", message.author.presence.status)
                        .addField(lang.commands.whois.embeds.fields[5], l.val() || 0, true)
                        .addField("Xp", c.val() || 0, true)
                        .addField(lang.commands.whois.embeds.fields[2], roles.replace("@everyone", ""))
                        .addField(lang.commands.whois.embeds.fields[4], inf.val())
                    if (args.includes("permissions")) {
                        embed.addField(lang.commands.whois.embeds.fields[3], permissionsList.join(", "), true)
                    }
                    if (!args.includes("set")) message.channel.send(embed)
                })
            })
        })
    } else {

        const user = member.user

        const createdAt = user.createdAt
        const joinedAt = member.joinedAt

        let day = createdAt.getDate()
        if (day <= 9) day = `0${day}`
        let month = createdAt.getMonth() + 1
        if (month <= 9) month = `0${month}`
        const year = createdAt.getFullYear();

        let jDay = joinedAt.getDate();
        if (jDay <= 9) jDay = `0${jDay}`
        let jMonth = joinedAt.getMonth() + 1
        if (jMonth <= 9) jMonth = `0${jMonth}`
        const jYear = joinedAt.getFullYear();

        let roles = member.roles.map(r => r.name)
        roles = roles.join("\n")

        let permissions = member.permissions.serialize(false)
        let permissionsKeys = Object.keys(permissions)

        let permissionsList = Array()

        var x = 0;

        permissionsKeys.forEach(element => {
            if (permissions[element] == true) {
                permissionsList[x] = element
                x++
            }
        });

        for (var i = 0; i <= permissionsList.length - 1; i++) {
            permissionsList[i] = permissionsList[i].toLowerCase().replace("_", " ").replace("_", " ").replace("_", " ").replace("_", " ")
        }

        database().ref(`/users/${message.guild.id}/${message.author.id}/level`).once("value").then(l => {
            database().ref(`/users/${message.guild.id}/${message.author.id}/mesagesCount`).once("value").then(c => {
                database().ref(`/userinfo/${user.id}/info`).once("value").then(inf => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(embed_color)
                        .setTitle(lang.commands.whois.embeds.titles[0] + user.tag)
                        .setThumbnail(user.displayAvatarURL())
                        .setTimestamp()
                        .addField("ID", user.id)
                        .addField(lang.commands.whois.embeds.fields[0], `${day}.${month}.${year}`, true)
                        .addField(lang.commands.whois.embeds.fields[1], `${jDay}.${jMonth}.${jYear}`, true)
                        .addField("Status", user.presence.status)
                        .addField(lang.commands.whois.embeds.fields[5], l.val() || 0, true)
                        .addField("Xp", c.val() || 0, true)
                        .addField(lang.commands.whois.embeds.fields[2], roles.replace("@everyone", ""))
                        .addField(lang.commands.whois.embeds.fields[4], inf.val() || lang.commands.whois.replies.noInfo)
                    if (args.includes("permissions")) {
                        embed.addField(lang.commands.whois.embeds.fields[3], permissionsList.join(", "), true)
                    }
                    if (!args.includes("set")) message.channel.send(embed)
                })
            })
        })
    }
    if (args[0] == "set") {
        const info = args.join(" ").replace("set ", "")

        database().ref(`/userinfo/${message.author.id}`).set({
                info: info
            }).then(() => {
                message.reply(lang.commands.whois.replies.success)
            })
            .catch(err => {
                message.reply(lang.commands.whois.replies.error)
                console.log(chalk.red(`[error] ${err}`))
            })
    }
}

module.exports.help = {
    name: "whois",
    category: "info"
}

module.exports.aliases = ["userinfo"]