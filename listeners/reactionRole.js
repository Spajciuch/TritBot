const { database } = require("firebase")

module.exports.run = async (client) => {
    client.on('raw', packet => {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return
        
        database().ref(`/reactionRole/${packet.d.guild_id}`).once("value").then(reactionRoleRaw => {
            if (reactionRoleRaw.val() == null) return 
            if (packet.d.user_id == client.user.id) return 

            const reactionRole = reactionRoleRaw.val()

            const emojis = reactionRole.emojis
            const roles = reactionRole.roles
            const messageId = reactionRole.messageId

            if (messageId !== packet.d.message_id) return 

            const guild = client.guilds.cache.get(packet.d.guild_id)
            const member = guild.members.cache.get(packet.d.user_id)

            const index = emojis.indexOf(packet.d.emoji.name)
            if (index < 0) return console.log(4)

            if(packet.t == "MESSAGE_REACTION_ADD") member.roles.add(roles[index])
            else member.roles.remove(roles[index])
        })

        database().ref(`/verification/${packet.d.guild_id}`).once("value").then(data => { 
            if(!data.val()) return
            const config = data.val()

            const messageId = config.message
            if(messageId !== packet.d.message_id) return
        
            const guild = client.guilds.cache.get(packet.d.guild_id)
            const roleId = config.role
            const member = guild.members.cache.get(packet.d.user_id)

            if(packet.d.emoji.name == "❤") {
                member.roles.add(roleId)
            }
        })
    })
}
