const superagent = require("superagent")

module.exports.read = async function (data) {
    data = data.replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-")
    data = data + "data.json"

    // console.log("READ: " + `https://gooier-cougar-2089.dataplicity.io/actions/read/${data}/null`)

    let {
        body
    } = await superagent.get(`https://gooier-cougar-2089.dataplicity.io/actions/read/${data}/null`)

    const result = body.data
    return result
}

module.exports.write = async function (patch, data) {
    patch = patch.replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-").replace("/", "-")
    patch = patch + "data.json"


    data = JSON.stringify(data)
    // console.log("WRITE: " + `https://gooier-cougar-2089.dataplicity.io/actions/save/${patch}/${data}`)
    let {
        body
    } = await superagent.get(`https://gooier-cougar-2089.dataplicity.io/actions/save/${patch}/${data}`)
}