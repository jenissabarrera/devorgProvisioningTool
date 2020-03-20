import provisionTelephonyViews from './views/provisiontelephony.js'
import architectFlowViews from './views/architectflow.js'
import loadModalView from './components/modals.js'
import developerRoleFlowViews from './views/developerRole.js'

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

            // eventlisteners for main buttons
            provisionTelephonyViews.btnEventListeners('btnProvisionTelephony');
            provisionTelephonyViews.btnEventListeners('btnLearnMore');
            architectFlowViews.btnInitiateArchitectDownloadEventListener();
            developerRoleFlowViews.btnEventListener();
            loadModalView.setupLoadingEl();
            
            // To be placed to right section, trigger hide of nav bar.
            document.getElementById("topNavBar").addEventListener('click', function () {
                let navBar = document.getElementById("topNavBar");
                (navBar.style.display === "none") ? navBar.style.display = "block" : navBar.style.display = "none";
            })
            
            // Trigger uninstall button to uninstall app.
            document.getElementById("btnUninstall").addEventListener('click', () => window.location='./wizard/uninstall.html')

        })
        .catch((err) => console.error(err));
})




