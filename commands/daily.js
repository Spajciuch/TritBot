const Discord = require("discord.js");
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
	var firebase = require('firebase')
	var database = firebase.database()
	var ms = require('parse-ms')
	var currencyFormatter = require('currency-formatter')
	let cooldown = 8.64e+7;
	let amount = 250;

	database.ref(`/economy/${message.guild.id}/${message.author.id}/lastdaily`).once("value").then(async lastdaily => {
		database.ref(`/economy/${message.guild.id}/${message.author.id}/bucks`).once("value").then(async bucks => {
			database.ref(`/economy/${message.guild.id}/${message.author.id}/inventory`).once("value").then(async inventory => {
				database.ref(`/economy/${message.guild.id}/${message.author.id}/lastwork`).once("value").then(async lastwork => {
					var lastDaily = lastdaily.val()
					try {
						if (bucks.val() == null || 0) {
							message.channel.send(lang.commands.daily.replies.createAcc)
							database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
								bucks: 50,
								inventory: inventory.val(),
								lastwork: lastwork.val(),
								lastdaily: lastdaily.val()
							})
						} else if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
							let timeObj = ms(cooldown - (Date.now() - lastDaily))
							let lastDailyEmbed = new Discord.MessageEmbed()
								.setAuthor(message.author.username, message.author.displayAvatarURL())
								.setColor(embed_color)
								.setDescription(`${lang.commands.daily.replies.not_ready}**${timeObj.hours}h** **${timeObj.minutes}m**!`)
							message.channel.send(lastDailyEmbed)
						} else {
							database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
								lastdaily: Date.now(),
								inventory: inventory.val(),
								lastwork: lastwork.val(),
								bucks: bucks.val()
							})
							database.ref(`/economy/${message.guild.id}/${message.author.id}`).set({
								bucks: bucks.val() + amount,
								inventory: inventory.val(),
								lastwork: lastwork.val(),
								lastdaily: Date.now()
							})
							let dailyEmbed = new Discord.MessageEmbed()
								.setAuthor(lang.commands.daily.embeds.titles[0] + " " + message.author.username, message.author.displayAvatarURL())
								.setColor(embed_color)
								.setDescription("**" + lang.commands.daily.embeds.fields[0] + ":** 250<:coin:565840795748401152>")
							message.channel.send(dailyEmbed)
						}
					} catch (err) {
						console.log(err)
					}
				})
			})
		})
	})
}
module.exports.help = {
	name: "daily",
	category: "economy",
	description: "Dodaje codziennie 250<:coin:565840795748401152> do twojego konta",
	use: "$daily"
}