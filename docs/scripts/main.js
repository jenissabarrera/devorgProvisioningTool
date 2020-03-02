import modals from './modals.js';
import view from './view.js';

const clientId = '83d37bf5-e050-47bf-9937-0314b259c9c4';
const redirectUri = window.location.href;
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

let AuthorizationApi = new platformClient.AuthorizationApi();
let telephonyProvidersEdgeApi = new platformClient.TelephonyProvidersEdgeApi();
let locationsApi = new platformClient.LocationsApi();
let routingApi = new platformClient.RoutingApi();
let usersApi = new platformClient.UsersApi();
let successMessage = document.getElementById('successMessage');
let failedMessage = document.getElementById('failedMessage');

let letSiteId ="";
let locationId = ""; 
let locationText = "";
let currentUserInfo = "";
let nextModal = "";

// Set PureCloud settings
client.setEnvironment('mypurecloud.com');
$(document).ready(() => {
    return client.loginImplicitGrant(clientId, redirectUri)
        .then(() => {
            console.log('Logged in');
            let token = client.authData.accessToken;
            modals.setup ();
            eventHandler ()
    // get the current user information
    return usersApi.getUsersMe()
    })
        .then((userInfo) => {
            currentUserInfo = userInfo;
            console.log(`getAuthorizationProducts success! data: ${JSON.stringify(currentUserInfo, null, 2)}`);
        })
    .catch((err) => console.error(err));
})

function getAuthorizationList(){
    modals.showLoadingModal("Loading");
    let productsArray = [];
    return AuthorizationApi.getAuthorizationProducts()
        .then((data) => {
            console.log(`getAuthorizationProducts success! data: ${JSON.stringify(data, null, 2)}`);
            productsArray = data.entities;
            nextModal = ''
            checkBYOC(productsArray);
            modals.hideLoadingModal()
        })
        .catch((err) => {
            console.log('There was a failure calling getAuthorizationProducts');
            console.error(err);
        });
}

function checkBYOC(productsArray) {
    let byocId = "";
    productsArray.forEach(product => {
        if (product.id == "byoc") {
            console.log("product id" + product.id);
            byocId = product.id;
        }
    });
    if (byocId != "") {    
        nextModal = "trunkOption";
        modals.showModalMessage("Provisioning Telephony","Your org has BYOC Capability. Please proceed.","check");
    } else {
        modals.showModalMessage("Provisioning Telephony","Your org has no BYOC Capability! Please contact administrator.","fail");
    }
}

function getOrgUser () {
    modals.showLoadingModal("Loading...");
    let opts = { 
        'pageSize': 100,
        'pageNumber': 1,
        'sortOrder': "ASC"
    };      
    usersApi.getUsers(opts)
        .then((data) => {
            console.log(`getUsers success! data: ${JSON.stringify(data, null, 2)}`);
            view.ceateUserDropDownOption(data.entities);
        })
        .catch((err) => {
            console.log('There was a failure calling getUsers');
            console.error(err);
        });
}

function createDevUser () {
    let opts = { 
        'pageSize': 50,
        'pageNumber': 1, 
    };

    AuthorizationApi.getAuthorizationRoles(opts)
        .then((rolesList) => {
            console.log(`getAuthorizationRoles success! data: ${JSON.stringify(rolesList, null, 2)}`);
            let tempRoles = ""
            let roles = "";
            rolesList = rolesList.entities;
            rolesList.forEach(role => {
                tempRoles ="\"" + role.id + "\"" ;
                if(roles === "") {
                    roles = "["+tempRoles
                }else {
                    roles = roles + "," + tempRoles;
                }
            });
            roles = roles + "]"
            console.log(roles);
            putUserRoles (roles);
        })
        .catch((err) => {
            console.log('There was a failure calling getAuthorizationRoles');
            console.error(err);
        });
};
  
function putUserRoles (roles) {
    let userId = document.getElementById('selectUser').value; 
    let username = document.getElementById(userId).text; 
    let body = roles;
    // console.log(userId  + ' ' + username);
    AuthorizationApi.putUserRoles(userId, body)
        .then((data) => {
            console.log(`putUserRoles success! data: ${JSON.stringify(data, null, 2)}`);
            modals.hideLoadingModal()
            modals.showModalMessage('Assign Developer Role','Developer Role assigned to ' +username, 'check')            
        })
        .catch((err) => {
            console.log('There was a failure calling putUserRoles');
            console.error(err);
            document.getElementById("siteError").innerHTML =  err.body.message;
        });
};

function eventHandler () {
    document.getElementById('provisionTelephony')
        .addEventListener('click', function(e){
            getAuthorizationList();
        });

    document.getElementById('kickStarter')
        .addEventListener('click', function(e){
            modals.showLoadingModal("Loading...");
            // modals.showCreateDevModal();
            // view.addTextBox('ThisLabel1: ', 'thisId', 'thisValue');
            // view.addTextBox('ThisLabel2: ', 'thisId2', 'thisValue');
            // modals.showUniModal();
        });
    
    document.getElementById('nextModalButton')
        .addEventListener('click', function(e){
            $("#" + nextModal).modal();
        });

    document.getElementById('createDeveloperRole')
        .addEventListener('click', function(e){
            getOrgUser();
            modals.hideLoadingModal()
            modals.showCreateDevModal();
        });

    document.getElementById('makeDeveloper')
        .addEventListener('click', function(e){
            modals.showLoadingModal("Loading...");
            createDevUser();           
        });
};

