const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    const database = require("firebase").database()
    if (!args[0]) return message.reply(lang.commands.roleMenu.replies.setup)

    if (args[0] == "setup") {
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(lang.commands.roleMenu.replies.permission_error)
        let rolesArray = []
        for (var i = 1; i <= args.length - 1; i++) {
            let value = args[i]
            value = value.replace("<@", "").replace("&", "").replace(">", "")
            rolesArray[i - 1] = value
        }
        database.ref(`/rolemenu/${message.guild.id}`).set({
            rolesList: rolesArray
        }).then(() => {
            message.reply(lang.commands.roleMenu.replies.succes)
            let embed = new Discord.MessageEmbed()
                .setColor(embed_color)
                .setTitle(lang.commands.roleMenu.embeds.titles[0])
                .addField(lang.commands.roleMenu.embeds.fields[0], lang.commands.roleMenu.embeds.fields[1])
            let description = ""
            for (var i = 1; i <= args.length - 1; i++) {
                description += `[${i+1}]` + args[i] + "\n"
            }
            embed.setDescription(description)
            message.channel.send(embed)
        })
    } else if (args[0] == "add") {
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(lang.commands.roleMenu.replies.permission_error)
        database.ref(`/rolemenu/${message.guild.id}/rolesList`).once("value").then(data => {
            let rolesArray = data.val()
            for (var i = 1; i <= args.length - 1; i++) {
                let value = args[i]
                value = value.replace("<@", "").replace("&", "").replace(">", "")
                rolesArray[rolesArray.length + (i - 1)] = value
            }
            database.ref(`/rolemenu/${message.guild.id}`).set({
                    rolesList: rolesArray
                })
                .then(() => {
                    message.reply(lang.commands.roleMenu.replies.add)
                    let rolesList = []
                    for (var i = 0; i <= rolesArray.length - 1; i++) {
                        let name = message.guild.roles.cache.get(rolesArray[i]).name
                        rolesList[i] = name
                    }
                    let embed = new Discord.MessageEmbed()
                        .setColor(embed_color)
                        .setTitle(lang.commands.roleMenu.embeds.titles[0])
                    let description = ""
                    for (var i = 0; i <= rolesList.length - 1; i++) {
                        description += `[${i+1}]` + rolesList[i] + "\n"
                    }
                    embed.setDescription(description)
                    message.channel.send(embed)
                })
                .catch(err => {
                    console.log(`[error] Nie można dodać roli`)
                    message.reply(lang.commands.roleMenu.replies.add_error)
                })
        })
    } else if (args[0] == "remove") {
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(lang.commands.roleMenu.replies.permission_error)
        database.ref(`/rolemenu/${message.guild.id}/rolesList`).once("value").then(data => {
            let rolesArray = data.val()

            const roleName = args[1]
            if (!roleName) return message.reply(lang.commands.roleMenu.replies.no_name)

            const roleId = message.guild.roles.cache.find(r => r.name == roleName).id
            if (roleId == null) return message.reply(lang.commands.roleMenu.replies.cannot_find)
            const index = rolesArray.indexOf(roleId)

            rolesArray.splice(index, 1)
            database.ref(`/rolemenu/${message.guild.id}`).set({
                    rolesList: rolesArray
                })
                .then(() => {
                    message.reply(lang.commands.roleMenu.replies.removed)
                    let rolesList = []
                    for (var i = 0; i <= rolesArray.length - 1; i++) {
                        let name = message.guild.roles.cache.get(rolesArray[i]).name
                        rolesList[i] = name
                    }
                    let embed = new Discord.MessageEmbed()
                        .setColor(embed_color)
                        .setTitle(lang.commands.roleMenu.embeds.titles[0])
                    let description = ""
                    for (var i = 0; i <= rolesList.length - 1; i++) {
                        description += `[${i+1}]` + rolesList[i] + "\n"
                    }
                    embed.setDescription(description)
                    message.channel.send(embed)
                })
                .catch(err => {
                    console.log(`[error] Nie można dodać roli`)
                    message.reply(lang.commands.roleMenu.replies.remove_error)
                })
        })
    } else if (args[0] == "rid") {
        database.ref(`/rolemenu/${message.guild.id}/rolesList`).once("value").then(data => {
            const rolesIds = data.val()
            if (!data.val()) return message.reply(lang.commands.roleMenu.replies.no_menu)
            let rolesList = []
            for (var i = 0; i <= rolesIds.length - 1; i++) {
                let name = message.guild.roles.cache.get(rolesIds[i]).name
                rolesList[i] = name
            }
            const toGive = message.guild.roles.cache.find(r => r.name == args.join(" ").replace("rid ", ""))
            message.member.roles.remove(toGive.id)
                .catch(err => {
                    console.log(`[error] Nie można ustawić roli`)
                    message.reply(lang.commands.roleMenu.replies.cannot_remove)
                })
                .then(() => {
                    if (!toGive) return
                    message.reply(lang.commands.roleMenu.replies.remove_your_role + toGive.name + "`")
                })
        })
    } else if (args[0] == "get") {
        database.ref(`/rolemenu/${message.guild.id}/rolesList`).once("value").then(data => {
            const rolesIds = data.val()
            if (!data.val()) return message.reply(lang.commands.roleMenu.replies.no_menu)
            let rolesList = []
            for (var i = 0; i <= rolesIds.length - 1; i++) {
                let name = message.guild.roles.cache.get(rolesIds[i]).name
                rolesList[i] = name
            }
            const toGive = message.guild.roles.cache.find(r => r.name == args.join(" ").replace("get ", ""))
            message.member.roles.add(toGive)
                .catch(err => {
                    console.log(`[error] Nie można ustawić roli`)
                    message.reply(lang.commands.roleMenu.replies.cannot_give)
                })
                .then(() => {
                    if (!toGive) return
                    message.reply(lang.commands.roleMenu.replies.give_role + toGive.name + "`")
                })
        })
    } else if (args[0] == "list") {
        database.ref(`/rolemenu/${message.guild.id}/rolesList`).once("value").then(data => {
            const rolesIds = data.val()
            let rolesList = []
            if (!data.val()) return message.reply(lang.commands.roleMenu.replies.no_menu)
            for (var i = 0; i <= rolesIds.length - 1; i++) {
                let name = message.guild.roles.cache.get(rolesIds[i]).name
                rolesList[i] = name
            }
            let embed = new Discord.MessageEmbed()
                .setColor(embed_color)
                .setTitle(lang.commands.roleMenu.embeds.titles[0])
                .addField(lang.commands.roleMenu.embeds.fields[0], lang.commands.roleMenu.embeds.fields[1])
            let description = ""
            for (var i = 0; i <= rolesList.length - 1; i++) {
                description += `[${i+1}]` + rolesList[i] + "\n"
            }
            embed.setDescription(description)
            message.channel.send(embed)
        })
    }
}
module.exports.help = {
    name: "roleMenu",
    category: "util"
}