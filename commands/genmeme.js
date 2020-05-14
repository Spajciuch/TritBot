const Discord = require("discord.js")
const config = require(`../config.json`)
const snekfetch = require('snekfetch')
module.exports.run = async (client, message, args, embed_color, lang) => {
	if (!args.join(" ").split(" | ")[0]) return message.reply(lang.commands.genmeme.replies.no_text)
	if (!args.join(" ").split(" | ")[1]) return message.reply(lang.commands.genmeme.replies.no_text)

	const {
		createCanvas,
		loadImage
	} = require('canvas')

	const canvas = createCanvas(500, 500)
	const ctx = canvas.getContext('2d')

	if (message.mentions.members.first()) {
		const {
			body: bg
		} = await snekfetch.get(message.mentions.members.first().user.displayAvatarURL().replace("webp", "png"))

		function applyText(canvas, text) {
			const ctx = canvas.getContext('2d')

			// Declare a base size of the font
			let fontSize = 900

			do {
				ctx.font = `${fontSize -= 10}px Impact`
			}
			while (ctx.measureText(text).width > canvas.width - 10 || ctx.measureText("█").width * 2 > canvas.height / 4)

			return ctx.font
		}
		loadImage(bg).then((image) => {

			ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
			ctx.fillStyle = 'white'
			ctx.strokeStyle = 'black'
			ctx.textAlign = 'center'
			ctx.lineWidth = 3
			ctx.textBaseline = "top"
			ctx.font = applyText(canvas, args.join(" ").split(" | ")[0].slice(21))
			ctx.fillText(args.join(" ").split(" | ")[0].slice(21).toUpperCase(), 250, 10)
			ctx.strokeText(args.join(" ").split(" | ")[0].slice(21).toUpperCase(), 250, 10)
			ctx.textBaseline = "bottom"
			ctx.font = applyText(canvas, args.join(" ").split(" | ")[1])
			ctx.fillText(args.join(" ").split(" | ")[1].toUpperCase(), 250, canvas.height - 10)
			ctx.strokeText(args.join(" ").split(" | ")[1].toUpperCase(), 250, canvas.height - 10)

			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'meme.png')
			message.channel.send(attachment)
		})
	} else {
		const {
			body: bg
		} = await snekfetch.get(message.author.displayAvatarURL().replace("webp", "png"))

		function applyText(canvas, text) {
			const ctx = canvas.getContext('2d')
			let fontSize = 900
			do {
				ctx.font = `${fontSize -= 10}px Impact`
			} while (ctx.measureText(text).width > canvas.width - 10 || ctx.measureText("█").width * 2 > canvas.height / 4)

			return ctx.font
		}
		loadImage(bg).then((image) => {

			ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
			ctx.fillStyle = 'white'
			ctx.strokeStyle = 'black'
			ctx.textAlign = 'center'
			ctx.lineWidth = 3
			ctx.textBaseline = "top"
			ctx.font = applyText(canvas, args.join(" ").split(" | ")[0])
			ctx.fillText(args.join(" ").split(" | ")[0].toUpperCase(), 250, 10)
			ctx.strokeText(args.join(" ").split(" | ")[0].toUpperCase(), 250, 10)
			ctx.textBaseline = "bottom"
			ctx.font = applyText(canvas, args.join(" ").split(" | ")[1])
			ctx.fillText(args.join(" ").split(" | ")[1].toUpperCase(), 250, canvas.height - 10)
			ctx.strokeText(args.join(" ").split(" | ")[1].toUpperCase(), 250, canvas.height - 10)

			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'meme.png')
			message.channel.send(attachment)
		})
	}
}
module.exports.help = {
	name: "genmeme",
	category: "util"
}