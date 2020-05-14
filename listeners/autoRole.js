const {
    database
} = require("firebase")

module.exports.run = async client => {
    client.on("guildMemberAdd", member => {
        database().ref(`/settings/${member.guild.id}/wrole`).once("value").then(r => {
            if (r.val() == undefined) return;

            const roleID = r.val()
            if (roleID == "@everyone") return;
            const guild = member.guild

            const role = guild.roles.cache.get(roleID.replace("<@&", "").replace(">", ""))

            member.roles.add(role)
        })
    })
}