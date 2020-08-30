<p align="center">
<img src="https://raw.githubusercontent.com/AndronixApp/AndroNix-Web/master/screenshots/command_app_logo_verticle.png">
</p>

<p align="center">
  <a href="https://forum.andronix.app"><img src="https://img.shields.io/badge/Questions%3F-Join%20our%20forum-blue?style=flat-square"></a>
  <a href="https://chat.andronix.app"><img src="https://img.shields.io/badge/Join%20us%20on-Discord-blue?style=flat-square&logo=discord"></a>
  <a href="https://docs.andronix.app"><img src="https://img.shields.io/badge/Documentation-Read%20the%20docs-blue?style=flat-square"></a>
  <a href="https://play.google.com/store/apps/details?id=studio.com.techriz.andronix"><img src="https://img.shields.io/badge/Download-Google%20Play-orange?style=flat-square&logo=google-play"></a>
  <a href="https://github.com/AndronixApp/AndronixOrigin/releases"><img src="https://img.shields.io/badge/Download-GitHub%20Releases-orange?style=flat-square&logo=github"></a>

<h1 align="center">Andronix Commands | CLI 🔥</h1>

Andronix Commands CLI makes it easy for you to access Andronix Commands on your machines, be it **Linux, Windows, Mac, Termux or even a remote machine you're SSHing into**. It's easy to install and realtime.

## Installation
Since this CLI is made with NodeJS, you will need NodeJS and NPM installed on your machine.

### Termux
 If you're on Termux, just copy and paste the command given below. This will install everything you need including Andronix Command CLI itself.

``` 
pkg install -y curl && curl https://raw.githubusercontent.com/imprakharshukla/andronix-command-cli/master/Scripts/termux-install.sh > install_andronix_cli.sh && chmod +x install_andronix_cli.sh && bash install_andronix_cli.sh
```

### Windows or Mac

#### 1. Install NodeJS
 1. **Windows** - You can follow this [tutorial written by NodeSource](https://nodesource.com/blog/installing-nodejs-tutorial-windows/)
 2. **Linux or Mac** - You can use either [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm#installing-and-updating) or use your default package manager (*Remember that this app needs NodeJS version greater than 6*)

#### 2. Install Andronix Command CLI
After you've installed NodeJS and verified that both Node and NPM are properly working, just run the command below.
```
npm i -g andronix-command-cli
```
#### 3. Verification
After the package has been installed (if there was no error during the installation), you can verify the installation by running
```
acommands hello
``` 
This should print out the following line-
`Hello! Andronix Commands seems to be working okay.`

**Note** - If you get some error or something other than this, just uninstall and reinstall the package with 
```
npm remove -g andronix-command-cli && npm i -g andronix-command-cli
```

## Get Started
Now that you've installed everything, our next step this to login into Andronix.

#### Login-
In order to access anything, you need to login into your Andronix Premium account. To login just enter the following command in your terminal
```
acommands login 
```
This will open up https://cli-login.andronix.app, login there with your Premium account and click the copy button to **copy a token**. Paste that token back in the CLI app and press enter.
You should see login confirmation with your email. If not please follow 
```
npm remove -g andronix-command-cli && npm i -g andronix-command-cli
```
#### Usage -
After getting logged in the app, you're good to go. To get a quick reference about all the commands you can use with the CLI type, 
```
acommands
```

#### List Commands -
You can list all the commands that you've uploaded to Andronix Commands or filter based on a colour. Use 
```
acommands list
``` 
or filter based on a colour with, 
```
acommands list -c blue
```

> **The CLI is supposed to show the exact hex colours as you see in the Andronix app or web app but if your terminal doesn't support colours or supports very limited colours, the accuracy of the colours will take a hit.**

You can use one out of these colours **[blue, black, red, green, orange, violet]**

To view all the available options, run,
```
acommands list --help
```
#### Add Commands
Adding commands is quite simple, just run 
```
acommands add
```
and the app will ask you the command, a description and a colour to choose. Just complete the quick form and the command should be uploaded with a confirmation containing the ID of the command.

#### Remove a command
You can remove a command by running,
```
acommands remove
```
and then entering the ID of the command.
You will see the ID of every command when you list then like this,
```
Command- gjj gg
Description- gxgoxu00
ID- y9YE7JZPkFITpw4NXlPU
```
The command should be deleted with a confirming message following it.

#### Logout -
You can logout of your current account by running, 
```
acommaands logout
```
#### User Info -
Get the email of your current logged in user by running,
```
acommands info
```
#### Help -
You can get all this info by just running,
```
acommands
```
or 
```
acommands help
```
If you want to get a more in depth info on a single command, use
```
acommands help <command>
```
