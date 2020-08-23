const firebase = require('firebase')
const firebaseConfig = require('./firebaseConf.json')
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore()
const auth = firebase.auth()
const chalk = require('chalk');
const fs = require('fs');
let allColors = "blue, black, red, green, orange, violet"

const open = require('open');
const axios = require('axios');
const path = require("path");
const {prompt} = require('inquirer')
const {styleCommandLog, styleErrorLog} = require('./LoggingModules/commandListLogging')
const userJsonFilePath = path.resolve(__dirname, "JsonModules", "JsonModules", "AppFiles", "user.json")
const hexCodes = require('./LoggingModules/hexCodes.json');


const getUserInfo = () => {

    try {
        signInIfUserExists().then(r => {
            successLog(chalk.green(`User Email -> ${auth.currentUser.email}`))
            stop()
        }).catch(e => {
            errorLog(e)
            stop()
        })

    } catch (e) {
        errorLog("Please login in before adding commands with 'andronix-cli login'.")
    }

}

const logout = () => {
    auth.signOut().then(() => {
        successLog("Logged out!")
        //deleting the user record
        try {
            fs.unlinkSync(userJsonFilePath)
            stop()
            //file removed
        } catch (err) {
            console.error(err)
        }
    }).catch(e => {
        errorLog("Error logging out :(")
    })
}


const signInIfUserExists = function (isVerbose) {
    return new Promise((resolve, reject) => {

        if (fs.existsSync(userJsonFilePath)) {
            fs.readFile(userJsonFilePath, (err, userDataString) => {
                if (err) {
                    reject("No logged in user detected. Please use 'acommands login' to login into your andronix account.")
                    console.error(err)
                }
                const userData = JSON.parse(userDataString.toString())
                const user = new firebase.User(userData, userData.stsTokenManager, userData)
                firebase.auth().updateCurrentUser(user).then(r => {
                    if (isVerbose) {
                        resolve("User Logged in with " + user.email)
                    } else {
                        resolve("")
                    }
                }).catch(e => {
                    errorLog(e)
                    reject("Login failed")
                })
            })
        } else {
            reject("No logged in user detected. Please use 'acommands login' to login into your andronix account.")
        }
    })
}

const getCommands = (color) => {
    let uid = auth.currentUser.uid
    if (!color) {
        //fetch all the commands
        firestore.collection("users").doc(uid).collection("commands").orderBy("com").get().then(function (querySnapshot) {
            let counter = 0
            if (querySnapshot.size === 0) {
                errorLog("No commands found.")
                stop()
            }
            querySnapshot.forEach(function (doc) {
                let commandData = Object.assign(doc.data(), {id: doc.id})
                if (counter === 0) {
                    styleCommandLog(commandData, true)
                    ++counter
                } else
                    styleCommandLog(commandData, false)
            })
            stop()
        })
            .catch(function (error) {
                errorLog("Error getting commands.");
            });
    } else {
        let hex = hexCodes[color.toString().toLowerCase()]
        if (hex) {
            firestore.collection("users")
                .doc(uid)
                .collection("commands")
                .orderBy("com")
                .where("color", "==", hex).get().then(function (querySnapshot) {
                let counter = 0
                if (querySnapshot.size === 0) {
                    errorLog("No commands found.")
                    stop()
                }
                querySnapshot.forEach(function (doc) {
                    let commandData = Object.assign(doc.data(), {id: doc.id})
                    if (counter === 0) {
                        styleCommandLog(commandData, true)
                        ++counter
                    } else
                        styleCommandLog(commandData, false)
                })
                stop()
            })
                .catch(function (error) {
                    errorLog("Error getting documents: ", error);
                    stop()
                });
        } else {
            //wrong color flag
            errorLog(`Please pass the correct color i.e from ${allColors}`)
            stop()
        }
    }

}

const addCommands = async (commandObj) => {
    let uid = auth.currentUser.uid
    if (isObjFilled(commandObj)) {
        try {
            let docReference = await firestore.collection("users").doc(uid).collection("commands").add({
                com: commandObj.command.toString(),
                dis: commandObj.description.toString(),
                color: hexCodes[(commandObj.color).toString().toLowerCase()]
            })
            successLog(`Command Added ${docReference.id}`)
            stop()
        } catch (e) {
            errorLog("Error adding command!")
        }
    } else {
        errorLog("Please provide all the values i.e a command, a description and a color of your choice.")
        stop()
    }
}
const login = async () => {
    runAll()
    try {
        processingLog("Opening the browser to login. If you can't use a browser on this device, please visit" +
            " https://cli-login.andronix.app manually.")
        setTimeout(openBrowser, 3000)

        async function openBrowser() {
            await open('https://cli-login.andronix.app/');
            // ask the user for the token now
            let tokenQuestion = [{
                type: 'input',
                message: 'Please enter the token here.',
                name: 'token'
            }]
            prompt(tokenQuestion).then(tokenObj => {
                const token = tokenObj.token
                loginUser(token)
            })
        }
    } catch (e) {
        errorLog("Logging while logging in the user.")
    }
}

async function loginUser(token) {
    let tokenPassed = token.toString()
    if (!tokenPassed) {
        errorLog("Token not detected. Please enter the token and then press enter.")
    } else {
        try {
            let res = await axios.get("https://us-central1-andronix-techriz.cloudfunctions.net/authTokenFetch", {
                params: {
                    token: tokenPassed,
                }
            })
            let token = res.data.token
            auth.signInWithCustomToken(token).then(user => {
                const userJson = JSON.stringify(auth.currentUser.toJSON())
                try {
                    fs.writeFileSync(userJsonFilePath, userJson)
                } catch (e) {
                    errorLog("Error logging in the user.")
                }
                successLog("User logged in")
                successLog(`Welcome ${auth.currentUser.email}`)
                stop()
            }).catch(e => {
                errorLog("Error logging in the user." + e)
            })
        } catch (e) {
            errorLog("Error logging in the user." + e)
        }
    }
}

const removeCommands = async (id) => {
    let uid = auth.currentUser.uid
    if (isFilled(id)) {
        await firestore.collection("users").doc(uid).collection("commands").doc(id.docID).delete().then(r => {
            successLog(`Command Deleted`)
            stop()
        }).catch(e => {
            errorLog("Something went wrong or incorrect command ID.")
            stop()
        })
    } else {
        errorLog("Please supply the ID of the command you want to delete.")
        stop()
    }
}

function isFilled(string) {
    return string.length !== 0 || string
}

function isObjFilled(object) {
    let temp = true
    for (let element in object) {
        if (object.hasOwnProperty(element)) {
            let val = object[element];
            if (!val || val.toString().length === 0)
                temp = false
        }
    }
    return temp

}

const errorLog = function errorLog(e) {
    console.log(chalk.red(e))
}

const successLog = function successLog(s) {
    console.log(chalk.green(s))
}

const processingLog = function processingLog(l) {
    console.log(chalk.yellow(l))
}

function updateNotifier() {
    const updateNotifier = require('update-notifier');
    const pkg = require('./package.json');
    updateNotifier({pkg}).notify();
}

function runAll() {
    updateNotifier()
}


function stop() {
    process.exit(-1);
}

module.exports = {
    addCommands,
    getCommands,
    removeCommands,
    login,
    getUserInfo,
    logout,
    signInIfUserExists,
    errorLog,
    successLog,
    processingLog
}