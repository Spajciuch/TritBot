module.exports.stringify = (array, ignoredWord, separator, emptyMessage) => {
    let string = ""

    for (var i = 0; i <= array.length - 1; i++) {
        if (array[i] !== ignoredWord) {
            string += " " + array[i] + separator
        }
    }
    if (string == undefined) string = emptyMessage
    if (string == "") string = emptyMessage

    return string
}