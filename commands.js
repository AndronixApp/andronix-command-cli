#!/usr/bin/env node

const program = require('commander')
const {prompt} = require('inquirer')
const chalk = require('chalk');

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
    login
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
    .version('1.0.0')
    .description('Andronix Commands CLI')

program
    .command('remove')
    .alias('r')
    .description("Remove a command")
    .action(() => {
        try {
            signInIfUserExists().then(r => {
                prompt({
                    name: 'docID',
                    type: 'input',
                    message: 'Please enter the ID of the command you want to delete.',
                }).then(docID => removeCommands(docID))
            }).catch(e => {
                errorLog(e)
            })

        } catch (e) {
            errorLog("Please login in before adding commands with 'acommands login'.")
        }

    })

program
    .command('list')
    .alias('l')
    .option('-c, --color [value]', `Filter with colors | ${allColors}`)
    .description(`Get all the commands or filter with -c [${allColors}]`)
    .action(async (args) => {
        try {
            signInIfUserExists().then(r => {
                getCommands(args.color)
            }).catch(e => {
                errorLog(e)
            })
        } catch (e) {
            errorLog("Please login in before adding commands with 'andronix-cli login'.")
        }
    })


program
    .command('add')
    .alias('a')
    .description('Add commands')
    .action(() => {
        try {
            signInIfUserExists().then(r => {
                prompt(questions).then(answers => addCommands(answers))
            }).catch(e => {
                errorLog(e)
            })

        } catch (e) {
            errorLog("Please login in before adding commands with 'acommands login'.")
        }
    })


program.parse(process.argv)

let NO_COMMAND_SPECIFIED = program.args.length === 0;

// Handle it however you like
if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help();
}
