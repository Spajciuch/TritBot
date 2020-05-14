const Discord = require("discord.js");
const ms = require("ms");
const config = require('../config.json')
const {
    database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(lang.commands.mute.replies.permission_error);
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

    if (!tomute) return message.reply(lang.commands.mute.replies.no_member);

    database().ref(`/mute/${message.guild.id}/role`).once("value").then(async data => {

        let roleName = ""

        if (!data.val()) {
            message.reply("wyślij teraz nazwę roli wyciszającej")

            const filter = msg => msg.author.id == message.author.id;
            const collector = new Discord.MessageCollector(message.channel, filter);
            collector.on("collect", msg => {
                roleName = msg.content
                database().ref(`/mute/${message.guild.id}`).set({
                    role: roleName
                })
                collector.stop()
            })
            return
        } else roleName = data.val()

        let muterole = message.guild.roles.cache.find(r => r.name == roleName)

        if (!muterole) {
            try {
                muterole = await message.guild.createRole({
                    name: roleName,
                    color: "#000000",
                    permissions: []
                })
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        let mutetime = args[1];
        if (!mutetime) return message.reply(lang.commands.mute.replies.no_time);

        await (tomute.roles.add(muterole.id));
        message.reply(`<@${tomute.id}>${lang.commands.mute.replies.done}${ms(ms(mutetime))}`);

        setTimeout(function () {
            tomute.roles.remove(muterole.id);
            message.channel.send(`<@${tomute.id}>${lang.commands.mute.replies.unmute}`);
        }, ms(mutetime));
    })
}
module.exports.help = {
    name: "mute",
    category: "admin"
}
module.exports.aliases = ["wycisz"]