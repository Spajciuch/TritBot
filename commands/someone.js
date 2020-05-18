const Discord = require("discord.js")
const config = require(`../config.json`)
module.exports.run = async (client, message, args, embed_color, lang) => {
    const asciiFaces = ["̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\З= ( ▀ ͜͞ʖ▀) =Ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿   ", "ʕ•ᴥ•ʔ", "༼ つ ◕_◕ ༽つ", "(◕‿◕✿)", "༼ つ ͡° ͜ʖ ͡° ༽つ", "(╯°□°）╯︵ ┻━┻"]
    let members = []
    let i = 0
    message.guild.members.cache.forEach(member => {
        members[i] = member.user.id
        i++
    });
    message.channel.send("<@" + members[Math.floor(Math.random() * members.length)] + "> " + asciiFaces[Math.floor(Math.random() * asciiFaces.length)])
}
module.exports.help = {
    name: "someone",
    category: "util"
}