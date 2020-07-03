const {
    database
} = require("firebase")

module.exports.run = async client => {
    client.on("guildMemberAdd", async member => {
        database().ref(`/settings/${member.guild.id}/wrole`).once("value").then(r => {
            database().ref(`/settings/${member.guild.id}/settings`).once("value").then(s => {
                if (r.val() == undefined) return;
                const settings = s.val()

                const roleID = r.val()
                if (roleID == "@everyone") return;
                const guild = member.guild

                const role = guild.roles.cache.get(roleID.replace("<@&", "").replace(">", ""))

                member.roles.add(role)
            })
        })
    })
}