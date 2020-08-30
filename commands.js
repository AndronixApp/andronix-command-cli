#!/usr/bin/env node

const program = require('commander')
const {prompt} = require('inquirer')
const packageJson = require('./package.json');

let allColors = "blue, black, red, green, orange, violet"

const {
    getCommands,
    addCommands,
    removeCommands,
    logout,
    signInIfUserExists,
    getUserInfo,
    successLog,
    errorLog,
    processingLog,
    login,
    checkIfLoginValid
} = require('./app')

const questions = [
    {
        type: 'input',
        name: "command",
        message: "Enter the command..."
    },
    {
        type: 'input',
        name: "description",
        message: "Enter what does this command do..."
    },
    {
        type: 'list',
        name: "color",
        message: "What color you want your command to be associated with...",
        choices: ['Blue', 'Red', 'Green', 'Black', 'Violet', 'Orange'],
    }
]
const removeQuestion = {
    name: 'docID',
    type: 'input',
    message: 'Please enter the ID of the command you want to delete.',
}

program
    .command('login')
    .description('Login into your Andronix account.')
    .action(() => login())
program
    .command('logout')
    .description('Logout of your Andronix account.')
    .action(() => logout())
program
    .command('info')
    .description('Get some basic info about the current signed in user.')
    .action(() => getUserInfo())
program
    .command('hello')
    .description('Nothing fancy...Just a sweet little hello! 🖐')
    .action(async () => {
        processingLog("Hello! Andronix Commands seems to be working okay.")
    })

program
    .version(packageJson.version)
    .description('Andronix Commands CLI')

program
    .command('remove')
    .alias('r')
    .description("Remove a command")
    .action(async () => {
        try {
            await signInIfUserExists()
            let isLoginValid = await checkIfLoginValid()
            if (isLoginValid)
                prompt(removeQuestion).then(docID => removeCommands(docID))
        } catch (e) {
            errorLog("Please login in before listing commands with 'acommands login'.")
        }
    })

program
    .command('list')
    .alias('l')
    .option('-c, --color [value]', `Filter with colors | ${allColors}`)
    .description(`Get all the commands or filter with -c [${allColors}]`)
    .action(async (args) => {
        try {
            await signInIfUserExists()
            let isLoginValid = await checkIfLoginValid()
            if (isLoginValid)
                getCommands(args.color)
        } catch (e) {
            errorLog("Please login in before listing commands with 'acommands login'.")
        }
    })


program
    .command('add')
    .alias('a')
    .description('Add commands')
    .action(async () => {
        try {
            await signInIfUserExists()
            let isLoginValid = await checkIfLoginValid()
            if (isLoginValid)
                prompt(questions).then(answers => addCommands(answers))
        } catch (e) {
            errorLog("Please login in before listing commands with 'acommands login'.")
        }
    })


program.parse(process.argv)

let NO_COMMAND_SPECIFIED = program.args.length === 0;

// Handle it however you like
if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help();
}
