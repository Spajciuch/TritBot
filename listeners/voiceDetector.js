const chalk = require("chalk")
const {
    database
} = require("firebase")

module.exports.run = async client => {
    client.on("voiceStateUpdate", async (oldMember, newMember) => {
        // console.log("VOICE")
        const guild = oldMember.member.guild
        // console.log(guild)
        database().ref(`/voiceDetect/${guild.id}/enabled`).once("value").then(async data => {

            if (data.val() !== true) return

            let role = guild.roles.cache.find(r => r.name == "voice - Trit")

            if (!role) {
                try {
                    role = await guild.createRole({
                        name: "voice - Trit",
                        color: "#000000",
                        permissions: []
                    })
                } catch (err) {
                    console.log(chalk.red(`[error] ${err}`))
                }
            }

            if (!oldMember.channel && newMember.channel) {
                // console.log("1")
                oldMember.member.roles.add(role.id)
            } else if (!newMember.channel) {
                // console.log("2")
                oldMember.member.roles.remove(role.id)
            }
        })
    })
}