import provisionTelephonyViews from '../views/provisionTelephony.js.js'


// All functionalities related to provisioning telephony was placed here.
const platformClient = require('platformClient');
let AuthorizationApi = new platformClient.AuthorizationApi();
let telephonyProvidersEdgeApi = new platformClient.TelephonyProvidersEdgeApi();
let locationsApi = new platformClient.LocationsApi();
let routingApi = new platformClient.RoutingApi();



const provisionTelephonyFunctions = {

  listProducts() {
    let productsArray = [];
    AuthorizationApi.getAuthorizationProducts()
      .then((data) => {
        console.log(`getAuthorizationProducts success! data: ${JSON.stringify(data, null, 2)}`);
        productsArray = data.entities;
        provisionTelephonyFunctions.checkBYOC(productsArray);
      })
      .catch((err) => {
        console.log('There was a failure calling getAuthorizationProducts');
        console.error(err);
      });

  },

  checkBYOC(productsArray) {
    let byocId = "";
    productsArray.forEach(product => {
      if (product.id == "byoc") {
        console.log("product id" + product.id)
        byocId = product.id;
      }

    });

    if (byocId != "") {
      return provisionTelephonyViews.displaybyocEnabledModal();
    } else {
      return provisionTelephonyViews.displaybyocDisabledModal();
    }



  },

  



}

export default provisionTelephonyFunctions