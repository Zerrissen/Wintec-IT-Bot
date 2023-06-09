# Wintec IT Bot
![GitHub repo size](https://img.shields.io/github/repo-size/zerrissen/wintec-it-bot?style=flat-square) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/zerrissen/wintec-it-bot?color=dark-green&style=flat-square) ![GitHub issues](https://img.shields.io/github/issues-raw/zerrissen/wintec-it-bot?style=flat-square)

###### Note: This bot and its authors are not directly affiliated with, nor managed by, Wintec or Te Pukenga, and do not represent their views or policies. This is designed for educational and recreational purposes only.

## What is this?
This is a discord bot used by Wintec (Waikato Institute of Technology) students to automate the majority of their server features. This bot is designed to automate student verification, role assignment, moderation, and more!

It is being designed and developed by the students, for the students; present, past, and future.

## Installation
To install and setup this bot yourself, you require the following dependancies:
> - Node version >20.0.0
> - npm version >9.6.5

You can then clone the repository

```
git clone https://github.com/zerrissen/wintec-it-bot
```

Or download the source directly from the latest release [here](https://github.com/Zerrissen/Wintec-IT-Bot/releases#latest)

You will also have to set up the following environment variables:
> - "TOKEN" (Bot token)
> - "MONGO_DB" (MongoDB connection string)
> - "DB_NAME" (name of the actual database)
> - "CLIENT_ID" (Bot user ID)
> - "GUILD_ID" (Server ID)
> - "MAIL_USER" (Email address for the bot. We use Zoho mail)
> - "MAIL_PASS" (Bot email account password)

These variables should be set in a `.env` file in the root file of the repository.

Open the projects base directory in your terminal and run install the npm packages required:
```
npm i
```

And that's it! You can now run the bot with:

```
node .
```

## Usage
Documentation is currently being worked on, sorry for the disappointment! We hope to get this released for you soon.

## Contributers
The Wintec IT Student server wouldn't be possible without contributions from various people. Many thanks to the following!

Bot contributers:
- [@Zerrissen](https://github.com/Zerrissen)
- [@unicornenjoyer](https://github.com/unicornenjoyer)

Server contributers:
- [@Zerrissen](https://github.com/Zerrissen)
- [@JamesOlwyn](https://github.com/JamesOlwyn)
- [@SkulduggeryDude](https://github.com/SkulduggeryDude)

## License
This repository is licensed under the GNU Affero General Public License v.30.
Permissions of this strongest copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. When a modified version is used to provide a service over a network, the complete source code of the modified version must be made available.

Read more [here](https://github.com/Zerrissen/Wintec-IT-Bot/blob/main/LICENSE)
