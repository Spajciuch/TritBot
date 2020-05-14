const Discord = require("discord.js")
const chalk = require("chalk")

module.exports.run = async (client, message, args, embed_color, lang) => {
	if (args[0]) {
		if (!lang.commands[args[0]].help) return message.reply(lang.commands.help.replies.no_command)
		const firebase = require("firebase")
		const database = firebase.database()
		database.ref(`/settings/${message.guild.id}/prefix`).once("value").then(async prefix => {

			let use = client.commands.filter(cmd => cmd.help.name === args[0]).map(cmd => '\ ' + cmd.help.use + '\ ')
			use = use.toString()
			let embed = new Discord.MessageEmbed()
				.setAuthor(lang.commands.help.embeds.titles[8], "https://cdn.discordapp.com/attachments/566193814591635457/568421808336928781/info_emoji.png")
				.addField(lang.commands.help.embeds.titles[9], lang.commands[args[0]].help)
				.setColor(embed_color)
			message.channel.send({
				embed
			})
		})
	}
	if (!args[0]) {
		// message.delete()
		// .catch(err => {
		// 	console.log(chalk.red(`[error] ${err}`))
		// })
		let startEmbed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setAuthor(lang.commands.help.embeds.titles[0], "https://cdn.discordapp.com/attachments/565189397000224779/565948215162175508/info_emoji.png")
			.setDescription(lang.commands.help.embeds.descriptions[0] + client.commands.size + lang.commands.help.embeds.descriptions[1])

		let gamesDescription = ""
		const gamesRawString = "[" + client.commands.filter(cmd => cmd.help.category === 'game').map(cmd => '"' + cmd.help.name + '"').join(", ") + "]"
		const gamesCommandsArray = JSON.parse(gamesRawString)


		for (var i = 0; i <= gamesCommandsArray.length - 1; i++) {
			gamesDescription += "**" + gamesCommandsArray[i] + "** - " + lang.commands[gamesCommandsArray[i]].help + "\n"
		}

		let gamesEmbed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setAuthor(lang.commands.help.embeds.titles[1], "https://cdn.discordapp.com/attachments/565189397000224779/607163635072106536/game_emoji.png")
			.setDescription(gamesDescription)


		let cleverbotEmbed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setAuthor(lang.commands.help.embeds.titles[2], "https://cdn.discordapp.com/attachments/565189397000224779/569822027834458112/clever_emoji.png")
			.setDescription(lang.commands.help.embeds.descriptions[2])


		let economyDescription = ""
		const economyRawString = "[" + client.commands.filter(cmd => cmd.help.category === 'economy').map(cmd => '"' + cmd.help.name + '"').join(", ") + "]"
		const economyCommandsArray = JSON.parse(economyRawString)


		for (var i = 0; i <= economyCommandsArray.length - 1; i++) {
			economyDescription += "**" + economyCommandsArray[i] + "** - " + lang.commands[economyCommandsArray[i]].help + "\n"
		}

		let economyEmbed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setAuthor(lang.commands.help.embeds.titles[3], "https://cdn.discordapp.com/attachments/565189397000224779/565948591638577173/coin_emoji.png")
			.setDescription(economyDescription)


		let utilRawString = "[" + client.commands.filter(cmd => cmd.help.category === 'util').map(cmd => '"' + cmd.help.name + '"').join(", ") + "]"
		const utilCommandsArray = JSON.parse(utilRawString)

		let utilDescription = ""

		for (var i = 0; i <= utilCommandsArray.length - 1; i++, function (err) {
				console.log(err)
			}) {
			// console.log(utilCommandsArray[i])
			if (lang.commands[utilCommandsArray[i]]) {
				utilDescription += "**" + utilCommandsArray[i] + "** - " + lang.commands[utilCommandsArray[i]].help + "\n"
			}
		}

		let utilEmbed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setAuthor(lang.commands.help.embeds.titles[4], "https://cdn.discordapp.com/attachments/566193814591635457/568421723091763200/user_emoji.png")
			.setDescription(utilDescription)


		let adminRawString = "[" + client.commands.filter(cmd => cmd.help.category === 'admin').map(cmd => '"' + cmd.help.name + '"').join(", ") + "]"
		const adminCommandsArray = JSON.parse(adminRawString)

		let adminDescription = ""

		for (var i = 0; i <= adminCommandsArray.length - 1; i++, function (err) {
				console.log(err)
			}) {
			adminDescription += "**" + adminCommandsArray[i] + "** - " + lang.commands[adminCommandsArray[i]].help + "\n"
		}

		let adminEmbed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setAuthor(lang.commands.help.embeds.titles[5], "https://cdn.discordapp.com/attachments/566193814591635457/568421717140045825/admin_emoji.png")
			.setDescription(adminDescription)


		let infoRawString = "[" + client.commands.filter(cmd => cmd.help.category === 'info').map(cmd => '"' + cmd.help.name + '"').join(", ") + "]"
		const infoCommandsArray = JSON.parse(infoRawString)

		let infoDescription = ""

		for (var i = 0; i <= infoCommandsArray.length - 1; i++, function (err) {
				console.log(err)
			}) {
			infoDescription += "**" + infoCommandsArray[i] + "** - " + lang.commands[infoCommandsArray[i]].help + "\n"
		}

		let infoEmbed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setAuthor(lang.commands.help.embeds.titles[6], "https://cdn.discordapp.com/attachments/565189397000224779/565948215162175508/info_emoji.png")
			.setDescription(infoDescription)


		let musicEmbed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setAuthor(lang.commands.help.embeds.titles[7], "https://cdn.discordapp.com/attachments/566193814591635457/568421720004886534/music_emoji.png")
			.setDescription(lang.commands.help.embeds.descriptions[3] || "musichelp");

		const embeds = [startEmbed, gamesEmbed, economyEmbed, utilEmbed, adminEmbed, infoEmbed]

		message.channel.send(embeds[0]).then(msg => {

			msg.react('⏪').then(r => {
				msg.react('⏩')
				let page = 1
				const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
				const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;


				const backwards = msg.createReactionCollector(backwardsFilter)
				const forwards = msg.createReactionCollector(forwardsFilter)

				backwards.on('collect', r => {
					r.users.remove(message.author)
					if (page == 1) return;
					page--;
					msg.edit(embeds[page - 1])
				})

				forwards.on('collect', r => {
					r.users.remove(message.author)
					if (page == embeds.length) return;
					page++;
					msg.edit(embeds[page - 1])
				})
			})
		})
	}
}

module.exports.help = {
	name: "help"
}
module.exports.aliases = ["pomoc"]