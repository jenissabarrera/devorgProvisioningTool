import provisionTelephonyViews from '../views/provisionTelephony.js'


// All functionalities related to provisioning telephony was placed here.
const platformClient = require('platformClient');
let AuthorizationApi = new platformClient.AuthorizationApi();
let telephonyProvidersEdgeApi = new platformClient.TelephonyProvidersEdgeApi();
let locationsApi = new platformClient.LocationsApi();



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

  validateCreateTrunk() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    let validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('input', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        else if (form.checkValidity() === true)  {
          provisionTelephonyFunctions.checkSipInput();
        } 
        form.classList.add('was-validated');
      }, true)
    })
  
  
  },

  checkSipInput() {
      
    if(document.getElementById("txtSIPExternalTrunk").value != "" && document.getElementById("txtInboundSIP").value != ""
    && document.getElementById("txtSIPServers").value != "" && document.getElementById("txtUserName").value != "" 
    && document.getElementById("txtSIPPassword").value != "" && document.getElementById("txtSIPRealm").value != ""
    && document.getElementById("txtSIPCallingAddress").value != "" && document.getElementById("txtSIPCallingName").value != "" ){
      document.getElementById("btnCreateSIPTrunk").disabled = false
    }
    else {
      provisionTelephonyFunctions.validateCreateTrunk()
      form.classList.add('needs-validation');
       
      }
    
  },

  createTrunk () {

    let trunkBody = {

      name: document.getElementById('txtSIPExternalTrunk').value, // External Trunk Name
      state: "active",
      trunkMetabase: {
        id: "external_sip_pcv_byoc_carrier.json",
        name: "Generic BYOC Carrier"
      },
      properties: {
        trunk_type: {
          type: "string",
          value: {
            default: "external.pcv.byoc.carrier",
            instance: "external.pcv.byoc.carrier"
          }
        },
        trunk_label: {
          type: "string",
          value: {
            default: "Generic BYOC Carrier",
            instance: "Sample Trunk"
          }
        },
        trunk_enabled: {
          type: "boolean",
          value: {
            default: true,
            instance: true
          }
        },
  
        trunk_transport_serverProxyList: {
          type: "array",
          items: {
            type: "string"
          },
          uniqueItems: true,
          value: {
            default: null,
            instance: [document.getElementById('txtSIPServers').value] //SIP Servers or Proxies
          },
          required: true
        },
        trunk_access_acl_allowList: {
          type: "array",
          items: {
            type: "string"
          },
          value: {
            default: [],
            instance: ["54.172.60.0/23", "34.203.250.0/23", "54.244.51.0/24", "54.65.63.192/26", "3.112.80.0/24",
              "54.169.127.128/26", "3.1.77.0/24"
            ]
          }
        },
        trunk_protocol: {
          type: "string",
          enum: ["SIP"],
          value: {
            default: "SIP",
            instance: "SIP"
          }
        },
  
        trunk_sip_authentication_credentials_realm: {
          type: "string",
          value: {
            default: "",
            instance: document.getElementById('txtSIPRealm').value // Realm
          }
        },
        trunk_sip_authentication_credentials_username: {
          type: "string",
          value: {
            default: "",
            instance: document.getElementById('txtUserName').value // User Name
          }
        },
        trunk_sip_authentication_credentials_password: {
          type: "string",
          value: {
            default: "",
            instance: document.getElementById('txtSIPPassword').value // Password
          }
        },
        trunk_outboundIdentity_callingName: {
          type: "string",
          pattern: "^[\\S ]{0,40}$",
          value: {
            default: "",
            instance: document.getElementById('txtSIPCallingName').value // Calling Name
          }
        },
        trunk_outboundIdentity_callingName_overrideMethod: {
          type: "string",
          enum: ["Always", "Unassigned DID"],
          value: {
            default: "Always",
            instance: "Always"
          }
        },
        trunk_outboundIdentity_callingAddress: {
          type: "string",
          value: {
            default: "",
            instance: document.getElementById('txtSIPCallingAddress').value // Calling Address
          }
        },
        trunk_outboundIdentity_callingAddress_overrideMethod: {
          type: "string",
          enum: ["Always", "Unassigned DID"],
          value: {
            default: "Always",
            instance: "Always"
          }
        },
        trunk_outboundIdentity_calledAddress_omitPlusPrefix: {
          type: "boolean",
          value: {
            default: false,
            instance: false
          }
        },
        trunk_outboundIdentity_callingAddress_omitPlusPrefix: {
          type: "boolean",
          value: {
            default: false,
            instance: false
          }
        },
        trunk_sip_termination_uri: {
          type: "string",
          value: {
            instance: document.getElementById('txtInboundSIP').value // Inbound SIP Termination Identifier
          },
          required: false
        }
  
      },
      trunkType: "EXTERNAL"
  
  
    }; // Object | Trunk base settings
  
    telephonyProvidersEdgeApi.postTelephonyProvidersEdgesTrunkbasesettings(trunkBody)
      .then((trunkData) => {
        console.log(`postTelephonyProvidersEdgesTrunkbasesettings success! data: ${JSON.stringify(trunkData, null, 2)}`);     

        provisionTelephonyViews.displaySipTrunkSuccess();
        
      
      })
      .catch((err) => {
        console.log('There was a failure calling postTelephonyProvidersEdgesTrunkbasesettings');
        provisionTelephonyViews.displaySipTrunkFailed(err.body.message);
     
      });
  
  }
  

}

export default provisionTelephonyFunctions