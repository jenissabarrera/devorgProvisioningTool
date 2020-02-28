import provisionTelephonyViews from './views/provisiontelephony.js.js'


const clientId = '83d37bf5-e050-47bf-9937-0314b259c9c4';
const redirectUri = window.location.href;
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// Set PureCloud settings
client.setEnvironment('mypurecloud.com');
$(document).ready(() => {
  client.loginImplicitGrant(clientId, redirectUri)
    .then(() => {
      console.log('Logged in');
      let token = client.authData.accessToken;
      provisionTelephonyViews.btnProvisionTelephonyEventListener();
      
    })
    .catch((err) => console.error(err));

})




