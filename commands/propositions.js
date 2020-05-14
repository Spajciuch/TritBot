const Discord = require("discord.js")
const chalk = require("chalk")
const {
	database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {
	if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply(lang.commands.propositions.replies.permissionError)

	if (!args[0]) {
		database().ref(`/propositions/${message.guild.id}`).once("value").then(data => {
			if (!data.val()) {
				database().ref(`/propositions/${message.guild.id}`).set({
						channel: message.channel.id
					})
					.then(() => {
						message.reply(lang.commands.propositions.replies.successEnable)
					})
			} else {
				database().ref(`/propositions/${message.guild.id}`).remove()
					.then(() => {
						message.reply(lang.commands.propositions.replies.successDisable)
					})
			}
		})
	}
}

module.exports.help = {
	name: "propositions",
	category: "util"
}

module.exports.aliases = ["propozycje", "ideas"]