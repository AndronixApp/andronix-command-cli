const chalk = require('chalk');


function isHex(color) {
    return color.startsWith("#") && color.length === 7
}

const styleCommandLog = (commandObj, isFirst, isLast) => {
    let command = commandObj.com.trim()
    let description = commandObj.dis.trim()
    let color = commandObj.color.trim()
    let id = commandObj.id.trim()
    if (isHex(color)) {
        console.log("")
        if (isFirst) {
            console.log("___________________________________________")
            console.log("")
        }
        console.log('Command- ' + chalk.hex(color).bold(command))
        console.log('Description- ' + chalk.hex(color)(description))
        console.log('ID- ' + chalk.white(id))
        console.log("___________________________________________")
    } else {
        styleErrorLog({error: "Hex Invalid"})
    }

}

const styleErrorLog = (errorObj) => {
    console.log(chalk.red.bold(errorObj.error))
}


module.exports = {
    styleErrorLog, styleCommandLog
}