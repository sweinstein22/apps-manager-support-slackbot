const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const springKeyWords = ['spring app', 'steeltoe app', 'actuator endpoint'];
const certKeyWords = ['blank apps manager', 'cert', 'my appsman broke', '502'];
const cloudfoundryapplicationKeyWords = ['cloudfoundryapplication'];
const websocketKeyWords = ['426', 'upgrade required', 'websocket', 'streaming logs', 'search bar'];
const uaaKeyWords = ['reset password', 'login page of apps manager']

const clippyKeyWords = ['clippy'];

const contains = (message, pattern) => {
  let flag = false;
  pattern.forEach(p => {
    if (message.toLowerCase().includes(p)) {
      flag = true
    };
  })
  return flag;
}

const botText = ({message, userName}) => {
  if (contains(message, springKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be looking for information on spring or steeltoe app actuator endpoints. This KB article about troubleshooting spring apps might help: <https://community.pivotal.io/s/article/Spring-Boot-Actuator-Tabs-Not-Showing-in-Apps-Manager>. \n\n If it doesn't have what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, certKeyWords)) return "Hi <@" + userName + ">! It sounds like you might be looking for information on Apps Manager's interaction with SSL Certificate Validation. This KB article might help: <https://community.pivotal.io/s/article/ssl-validation-issue-apps-manager-shows-no-content>. \n\n If it doesn't have what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, cloudfoundryapplicationKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be looking for information on 404 errors displayed in the browser console on requests to a URL ending in `/cloudfoundryapplication`. Apps Manager makes such a request to an app when you visit the app page in Apps Manager, to determine whether the app has Spring or Steeltoe actuator endpoints, and if the app does not, seeing a 404 error in the console is normal. \n\n If the app does have Spring/Steeltoe actuator endpoints and you see the request to those endpoints failing, this KB article may help you diagnose the issue: <https://community.pivotal.io/s/article/Spring-Boot-Actuator-Tabs-Not-Showing-in-Apps-Manager> \n\n If it doesn't have what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, websocketKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be looking for a solution to failure of the search or streaming logs functionality in Apps Manager on PAS 2.6 or earlier. If your environment is using an untrusted certificate, you should see a prompt to click through to a window in which you can accept the untrusted certificate. After doing so, close the newly-opened window and click the browser refresh button to reload Apps Manager, and the problem should be solved. \n\nIf you are using a trusted certificate or have accepted the untrusted certificate and are still seeing a problem, and the browser console shows a `426 Upgrade Required error`, this indicates that your environment's network infrastructure does not support the necessary WebSocket connection. This is an issue particularly if your environment is using AWS Elastic Load Balancing (ELB), and one solution is to switch to using AWS Application Load Balancers. This forum post has more information on the ELB WebSocket issue: <https://forums.aws.amazon.com/thread.jspa?threadID=231996> \n\n If it doesn't have what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, uaaKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be asking a question about the Apps Manager login page or user password flow. That functionality is owned by UAA, and questions can be directed to their channel, #pcf-uaa. \n\n If this isn't what you're looking for, one of my humans will be with you when they have a moment.";

  if (contains(message, clippyKeyWords)) return "Hi <@" + userName+ ">! Hi user! It sounds like you appreciate Microsoft's best feature ever. Here are some communities of Clippy's biggest fans. \n <https://www.facebook.com/MicrosoftClippy> \n <https://steamcommunity.com/groups/ClippyFanclub> \n <https://twitter.com/ClippyFans>";
}  

app.message( async ({ message, context }) => {
  try {
    const text = botText({message: message.text, userName: message.user});
    if (message.thread_ts && text) return;
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      channel: message.channel,
      thread_ts: message.ts,
      text
    });
  } catch (e) {}
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
