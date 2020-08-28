const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const autoscalerManageWords = ['autoscaler manage link', '"manage" link for autoscale', 'manage button that throws 404'];
const springKeyWords = ['spring app', 'steeltoe app', 'actuator endpoint'];
const certKeyWords = ['blank apps manager', 'cert', 'my appsman broke', '502'];
const cloudfoundryapplicationKeyWords = ['cloudfoundryapplication'];
const websocketKeyWords = ['426', 'upgrade required', 'websocket', 'streaming logs', 'search bar'];
const uaaKeyWords = ['reset password', 'login page of apps manager'];
const redirectKeyWords = ['invalid redirect', 'request for authorization was invalidpack'];
const appMetricsKeyWords = ['view in pcf metrics', 'view in app metrics', 'metrics link', 'metrics 2.0', 'metrics link is missing', 'metrics link missing'];
const autoscalerNoProxyKeyWords = ['autoscaling controls missing', 'autoscaler controls missing'];

const clippyKeyWords = ['clippy'];

const contains = (message, pattern) => {
  let flag = false;
  pattern.forEach(p => {
    if (message.toLowerCase().includes(p)) {
      flag = true
    }
  });
  return flag;
};

const botText = ({message, userName}) => {
  if (contains(message, autoscalerManageWords)) return "Hi <@" + userName+ ">! It sounds like you might be asking a question about the 'Manage' link for autoscaler instances in Apps Manager being an invalid link. This is caused when you upgrade from an earlier version of PAS to PAS 2.3 or later. The autoscaler service instance may still be associated with a `dashboard_url`, which triggers Apps Manager to render the 'Manage' link, but the link leads to a `404`. \n\n The fix is to delete and recreate the autoscaler service instance. Further details can be found in this KB article: <https://community.pivotal.io/s/article/autoscaler-manage-button-in-apps-manager-shows-404-not-found-error> \n\n If this isn't what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, springKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be looking for information on spring or steeltoe app actuator endpoints. This KB article about troubleshooting spring apps might help: <https://community.pivotal.io/s/article/Spring-Boot-Actuator-Tabs-Not-Showing-in-Apps-Manager>. \n\n If it doesn't have what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, certKeyWords)) return "Hi <@" + userName + ">! It sounds like you might be looking for information on Apps Manager's interaction with SSL Certificate Validation. This KB article might help: <https://community.pivotal.io/s/article/ssl-validation-issue-apps-manager-shows-no-content>. \n\n If it doesn't have what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, cloudfoundryapplicationKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be looking for information on 404 errors displayed in the browser console on requests to a URL ending in `/cloudfoundryapplication`. Apps Manager makes such a request to an app when you visit the app page in Apps Manager, to determine whether the app has Spring or Steeltoe actuator endpoints, and if the app does not, seeing a 404 error in the console is normal. \n\n If the app does have Spring/Steeltoe actuator endpoints and you see the request to those endpoints failing, this KB article may help you diagnose the issue: <https://community.pivotal.io/s/article/Spring-Boot-Actuator-Tabs-Not-Showing-in-Apps-Manager> \n\n If it doesn't have what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, websocketKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be looking for a solution to failure of the search or streaming logs functionality in Apps Manager on PAS 2.6 or earlier. If your environment is using an untrusted certificate, you should see a prompt to click through to a window in which you can accept the untrusted certificate. After doing so, close the newly-opened window and click the browser refresh button to reload Apps Manager, and the problem should be solved. \n\nIf you are using a trusted certificate or have accepted the untrusted certificate and are still seeing a problem, and the browser console shows a `426 Upgrade Required error`, this indicates that your environment's network infrastructure does not support the necessary WebSocket connection. This is an issue particularly if your environment is using AWS Elastic Load Balancing (ELB), and one solution is to switch to using AWS Application Load Balancers. This forum post has more information on the ELB WebSocket issue: <https://forums.aws.amazon.com/thread.jspa?threadID=231996> \n\n If it doesn't have what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, uaaKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be asking a question about the Apps Manager login page or user password flow. That functionality is owned by UAA, and questions can be directed to their channel, #pcf-uaa. \n\n If this isn't what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, redirectKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be asking a question about an invalid redirect error when logging in to Apps Manager. The details about setting up redirect URIs in this doc might help: <https://docs.pivotal.io/platform/application-service/2-8/operating/configure-multi-foundation.html> \n\n If this isn't what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, appMetricsKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be asking a question about a problem with Apps Manager's Metrics integration. There are a few known issues and setup steps that might help: \n\n If using App Metrics v2.0.0, or have recently moved off of v2.0.0 these known issues may help: <https://docs.pivotal.io/platform/2-7/release-notes/runtime-rn.html#apps-manager-app-metrics-link> \n\n If not on App Metrics v2.0.0 and the Metrics link is not appearing, these setup steps may help: <https://docs.pivotal.io/platform/2-7/release-notes/runtime-rn.html#apps-manager-app-metrics-link-no-proxy> \n\n If this isn't what you're looking for, one of my humans will be with you when they have a moment.";
  if (contains(message, autoscalerNoProxyKeyWords)) return "Hi <@" + userName+ ">! It sounds like you might be asking a question about a problem with Apps Manager's App Autoscaler controls not appearing. These setup steps around this integration might help: <https://docs.pivotal.io/application-service/2-10/appsman-services/autoscaler/using-autoscaler.html#prerequisite> \n\n If this isn't what you're looking for, one of my humans will be with you when they have a moment.";

  if (contains(message, clippyKeyWords)) return "Hi <@" + userName+ ">! Hi user! It sounds like you appreciate Microsoft's best feature ever. Here are some communities of Clippy's biggest fans. \n <https://www.facebook.com/MicrosoftClippy> \n <https://steamcommunity.com/groups/ClippyFanclub> \n <https://twitter.com/ClippyFans>";
};

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
