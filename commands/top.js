const Discord = require("discord.js")
const chalk = require("chalk")
const {
	database
} = require("firebase")

module.exports.run = async (client, message, args, embed_color, lang) => {

	const compareNumbers = function (a, b) {
		return b - a
	}

	database().ref(`/users/${message.guild.id}`).once("value").then(data => {
		if (!data.val()) return

		const usersData = data.val()

		let usersList = []
		let xpList = []

		message.guild.members.cache.forEach(member => { // Lista osób na serwerze 
			usersList[usersList.length] = member.user.id
		})

		for (var i = 0; i <= usersList.length - 1; i++) { // Lista XP
			if (usersData[usersList[i]]) {
				xpList[xpList.length] = usersData[usersList[i]].mesagesCount
			}
		}
		// Stworzono 2 listy :)

		xpList.sort(compareNumbers) // Sortowanie wartości od największego do najmniejszego

		let IdSorted = []

		xpList.forEach(xp => {
			usersList.forEach(id => {
				if (usersData[id]) {
					if (usersData[id].mesagesCount == xp) IdSorted[IdSorted.length] = id
				}
			})
		})

		if (IdSorted.length <= 10) {
			let description = ""

			for (var i = 0; i <= IdSorted.length - 1; i++) {
				description += `**[${i + 1}]** -> **${client.users.cache.get(IdSorted[i]).tag}** [ ${xpList[i]}<:xp_emoji:574551688724217866> ]\n`
			}

			let embed = new Discord.MessageEmbed()
				.setColor(embed_color)
				.setAuthor(lang.commands.top.embeds.titles[0], message.guild.iconURL())
				.setDescription(description)
				.setTimestamp()
			message.channel.send(embed)
		} else {
			let description = ""

			for (var i = 0; i <= 10 - 1; i++) {
				description += `**[${i + 1}]** -> **${client.users.cache.get(IdSorted[i]).tag}** [ ${xpList[i]}<:xp_emoji:574551688724217866> ]\n`
			}

			let embed = new Discord.MessageEmbed()
				.setColor(embed_color)
				.setAuthor(lang.commands.top.embeds.titles[0], message.guild.iconURL())
				.setDescription(description)
				.setTimestamp()
			message.channel.send(embed)
		}
	})
}
module.exports.help = {
	name: "top",
	category: "info"
}