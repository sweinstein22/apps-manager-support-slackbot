# Apps Manager Support Slackbot
Slackbot to help field common support requests about Apps Manager

## Adding phrases and responses to the Slackbot
Phrases and responses are configured in the `app.js` file.

## Running the bot locally
The bot can be run locally using the command `node app.js`. To avoid having to continue pushing the app while developing to see changes, a local Request URL can be used. Run `ngrok http 3000`, copy the url it provides, and change the app's Event Subscriptions configuration Request URL to `${url}/slack/events`. 

## Pushing the bot
This bot is located in the `apps-manager` org and `development` space on PWS, under the application name `amjs-support-slackbot`. Use `cf push` while in this directory to push any changes you have made to the bot.

Note that not removing the `node_modules` folder may cause the push to fail as the node version cached will be relevant to the machine you're developing on (e.g. for Mac the darwin node package will be installed) and CF will expect to be using a linux node package.

If you're pushing the app for the first time, there are two environment variables that need to be set. These two env vars can be found in the LastPass entry titled 'Apps Manager Support Slackbot', and should be set using the command `cf set-env amjs-support-slackbot ${env_name} ${env_value}`.

## Configuring the bot in Slack
This bot is configured as a Slack app, which can be configured with the associated [Slack app](https://pivotal.slack.com/apps/A0F7VRG6Q-outgoing-webhooks?next_id=0). 

Create a Bot User and give it a name. Set it to show as always being online.

Enable Event Subscriptions, and set the Request URL to `https://amjs-support-slackbot.cfapps.io/slack/events`. 
Subscribe to the Bot Events `message.channels`, `message.groups`, `message.im`, `message.mpim`, or a subset of the four depending on the use case of the bot.

On the Oauth & Permissions tab, take note of the Bot User OAuth Access Token. This will be set as the `SLACK_BOT_TOKEN` environment variable. On the Basic Information tab, take note of the Signing Secret. This will be set as the `SLACK_SIGNING_SECRET` environment variable.

## Disabling the bot
The bot can be disabled, or deleted, from the same configuration page from which it is set up.

## Underlying tech
This bot leverages [Bolt](https://slack.dev/bolt/tutorial/getting-started), which is a framework meant to help build Slack apps.
