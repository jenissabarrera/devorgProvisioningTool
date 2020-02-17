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
let nextModal = ""

// Set PureCloud settings
client.setEnvironment('mypurecloud.com');
$(document).ready(() => {
  return client.loginImplicitGrant(clientId, redirectUri)
    .then(() => {
      console.log('Logged in');
      let token = client.authData.accessToken;
  // get the current user information
  return usersApi.getUsersMe()
    }).then((userInfo) => {
    currentUserInfo = userInfo;
    console.log(`getAuthorizationProducts success! data: ${JSON.stringify(currentUserInfo, null, 2)}`);
    })
    .catch((err) => console.error(err));
})

//  Commented out.
// function clearModal () {
//   $("#locationModal").removeData('bs.modal').empty();
// }

$("#listProducts").click(function(){
  let productsArray = [];
  //  Commented out.
  // clearModal ();
  return AuthorizationApi.getAuthorizationProducts()
    .then((data) => {
      console.log(`getAuthorizationProducts success! data: ${JSON.stringify(data, null, 2)}`);
      productsArray = data.entities;
      checkBYOC(productsArray);
    })
    .catch((err) => {
      console.log('There was a failure calling getAuthorizationProducts');
      console.error(err);
    });

})

function checkBYOC(productsArray) {
  let byocId = "";
  productsArray.forEach(product => {
    if (product.id == "byoc") {
      console.log("product id" + product.id)
      byocId = product.id;
    }
  });

  // console.log("test test test..." + byocId)

  if (byocId != "") {    
    nextModal = "trunkOption";
    showSuccessModal("Your org has BYOC Capability. Please proceed.");
  } else {
    showfailedModal("Your org has no BYOC Capability! Please contact administrator.");
  }
  
}



function validateCreateTrunk() {
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
        checkSipInput();
      } 
      form.classList.add('was-validated');
    }, true)
  })


}

function checkSipInput () {
  if(document.getElementById("txtSIPExternalTrunk").value != "" && document.getElementById("txtInboundSIP").value != ""
  && document.getElementById("txtSIPServers").value != "" && document.getElementById("txtUserName").value != "" 
  && document.getElementById("txtSIPPassword").value != "" && document.getElementById("txtSIPRealm").value != ""
  && document.getElementById("txtSIPCallingAddress").value != "" && document.getElementById("txtSIPCallingName").value != "" ){
    document.getElementById("btnCreateTrunk").disabled = false
  }
  else {
      validateCreateTrunk()
      form.classList.add('needs-validation');
     
    }
}

$("#btnCreateTrunk").click(function () {

  $('#sipModal').modal('hide');
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
      siteOutboundroutes(trunkData)   
      
      $("#twilioSuccessModal").modal();  
    })
    .catch((err) => {
      console.log('There was a failure calling postTelephonyProvidersEdgesTrunkbasesettings');
      console.error(err);
      let errorMessage = "Creating Trunk has failed. " + err.body.message;
      showFailedModal(errorMessage);
    });
});

$('#sipModal').on('hidden', function() {
  $(this).removeData('modal');
});


$("#gotoLocation").click(function () {
  $.ajax({
    // Get countries via API
    url: "https://restcountries.eu/rest/v2/all?fields=name;callingCodes;alpha2Code",
    success: function (result) {
      let countryList = result;
      countryList.forEach(createList)
    }
  });
  
})

function createList(item) {
let name = document.getElementById("country");
let option = document.createElement("option");
option.text = item.name;
option.value = item.alpha2Code;
name.add(option);
}

$("#createLocation").click(function () {
  // get country value and text
  let cntryOption = document.getElementById("country");
  let cntryValue = cntryOption.options[cntryOption.selectedIndex].value;
  let cntryText = cntryOption.options[cntryOption.selectedIndex].text;
  // formulate the body of the request
  let body = {
    "name": $("#location").val(),
    "emergencyNumber": {"number": $("#emergencyNumber").val(), "type": "default"},
    "address": {
      "street1": $("#address").val(),
      "city": $("#city").val(),
      "state": $("#state").val(),
      "zipcode": $("#zip").val(),
      "country": cntryValue.trim(),
      "countryFullName": cntryText
    }
  }
  locationsApi.postLocations(body)
    .then((data) => {
      console.log(`postLocations success! data: ${JSON.stringify(data, null, 2)}`);
      locationId = data.id
      locationText = data.name
      // $('#formCreateTrunk').reset();
      // $("#locationSuccessStatusModal").modal();     
      nextModal = "siteModal";
      showSuccessModal("Location is created successfully. Please proceed.");
    })
    .catch((err) => {
      console.log('There was a failure calling postLocations');
      let errorMessage = "Creating location has failed. " + err.body.message;
      showFailedModal(errorMessage);
    });
})

//   Create Site Functions 
   
$('#siteModal').on('show.bs.modal', function() {
  getTimezone();   
  document.getElementById("inputLocation").value = locationText;
})

// Get time zone and add to select option 
function getTimezone () {
  let opts = { 
  'pageSize': 1000,
  'pageNumber': 1
  };

  telephonyProvidersEdgeApi.getTelephonyProvidersEdgesTimezones(opts)
  .then((data) => {
    let timezone = data.entities;
    timezone.forEach(addTimezoneToSelect);
  })
  .catch((err) => {
    console.log('There was a failure calling getTimezones');
    console.error(err);
  });
}

// format timezone
function addTimezoneToSelect(timeZone)
{ 
  let select = document.getElementById("timeZone");
  let option = document.createElement("option");
  
  let thisTime = timeZone.offset;
  let country = timeZone.id;  
  let hours = Math.floor(thisTime / 60);  
  // fomrat minutes
  let minutes = formatNumber(Math.abs(thisTime) % 60);
  let timeZoneFormat = country+"("+ hours + ":" + minutes +")"; 

  option.text = timeZoneFormat;
  option.value = country;
  select.add(option);
}
function formatNumber (n) {
  return n > 9 ? "" + n: "0" + n;
}

// Get the site list and find default site --PureCloud Voice - AWS-- which is used as Primary Site and Secondary Sites then create sites
$("#getSites").click(function(){
  let opts = { 
    'pageSize': 25,
    'pageNumber': 1,
    'sortBy': "name",
    'sortOrder': "ASC",
  };
  telephonyProvidersEdgeApi.getTelephonyProvidersEdgesSites(opts)
  .then((data) => {
    let awsItem = data.entities.find(entitiesItem => entitiesItem.name === "PureCloud Voice - AWS");

    locationsApi.getLocation(locationId)
    .then((locInfo) => {
      createSite(awsItem, locInfo);
    })
    .catch((err) => {
      console.log('There was a failure calling getLocation');
      console.error(err);
    });
  })
  .catch((err) => {
    console.log('There was a failure calling getTelephonyProvidersEdgesSites');
    console.error(err);
})
})
// Create the site 
function createSite (awsItem, locInfo) {
  // get information of the site
  let awsItemId = awsItem.id;
  let awsItemName = awsItem.name;
  let awsItemSelfUri = awsItem.selfUri;
  // get the date
  let today = new Date();
  let dateConfig = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  let startDateConfig = dateConfig+"T02:00:00.000";
  let endDateConfig = dateConfig+"T05:00:00.000";
  
  let body = {
    "name": $("#siteName").val(),
    "primarySites": [
        {
          "id": awsItemId,
          "name": awsItemName,
          "selfUri": awsItemSelfUri
        }
    ],
    "secondarySites": [
        {
          "id": awsItemId,
          "name": awsItemName,
          "selfUri": awsItemSelfUri
        }
    ],
    "edgeAutoUpdateConfig": {
          "timeZone": $("#timeZone").val(),
          "rrule": "FREQ=DAILY",
          "start": startDateConfig,
          "end": endDateConfig

        },
    "location": locInfo,
    "ntpSettings": {
        "servers": []
    }
  };

  telephonyProvidersEdgeApi.postTelephonyProvidersEdgesSites(body)
  .then((siteData) => {
    console.log(siteData);
    letSiteId = siteData.id;
    nextModal = "sipModal";
    showSuccessModal("Site is created successfully. Please proceed.");
  })
  .catch((err) => {
    console.log('There was a failure calling postTelephonyProvidersEdgesSites');
    console.error(err);
    let errorMessage = "Creating Site has failed. " + err.body.message;
    showFailedModal(errorMessage);
  });
}

// add trunk details in Site created
function siteOutboundroutes (trunkData) {
  let opts = { 
    'pageSize': 25,
    'pageNumber': 1
  };
  // get outbound routes and delete them
  telephonyProvidersEdgeApi.getTelephonyProvidersEdgesSiteOutboundroutes(letSiteId, opts)
  .then((outboundRoute) => {
    let routeEntities = outboundRoute.entities 
    routeEntities.forEach(entity => {
      let entityId = entity.id;
      telephonyProvidersEdgeApi.deleteTelephonyProvidersEdgesOutboundroute(entityId)
      .then(() => {
          console.log('deleteTelephonyProvidersEdgesOutboundroute returned successfully.');
          createOutboundRoute(trunkData);
      })
      .catch((err) => {
        console.log('There was a failure calling getTelephonyProvidersEdgesSiteOutboundroutes');
        console.error(err);
      });
    });
  //   console.log(routes.id);
  })
  .catch((err) => {
    console.log('There was a failure calling getTelephonyProvidersEdgesSiteOutboundroutes');
    console.error(err);
  });
}

function createOutboundRoute (trunkData) {
  let trunkId = trunkData.id;
  let trunkName = trunkData.name;
  let trunkSelfuri = trunkData.selfUri;
  let body = {
    "name": "Outbound Route",
    "classificationTypes": ["National", "International"],
    "enabled": true,
    "distribution": "",
    "externalTrunkBases": [
      {
        "id": trunkId,
        "name": trunkName,
        "selfUri": trunkSelfuri
      }
    ]
  };

  telephonyProvidersEdgeApi.postTelephonyProvidersEdgesSiteOutboundroutes(letSiteId, body)
  .then((data) => {
      console.log(`postTelephonyProvidersEdgesSiteOutboundroutes success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
      console.log('There was a failure calling postTelephonyProvidersEdgesSiteOutboundroutes');
      console.error(err);
  });
}

// Delete contents of modal when closed
$('#sipModal').on('hidden.bs.modal', function (e) {
  $(this).find("input").val('').end()
  document.getElementById("sipModal").className = "needs-validation";
})

$('#sipModal').on('shown.bs.modal', function () {
  validateCreateTrunk();
})

$("#getListofQueues").click(function(){
  let opts = { 
    'pageSize': 100
  };
  
  routingApi.getRoutingQueues(opts)
    .then((queueList) => {
      console.log(`getRoutingQueues success! data: ${JSON.stringify(queueList, null, 2)}`);
      let queues =  queueList.entities
      queues.forEach(element => {
        let queueSelect = document.getElementById("selectQueue");
        let queueOption = document.createElement("option");
        queueOption.text = element.name;
        queueOption.value = element.id;
        queueSelect.add(queueOption);
      });
      initializeFlowCreation();
    })
    .catch((err) => {
      console.log('There was a failure calling getRoutingQueues');
      console.error(err);
    });
  
});


function initializeFlowCreation () {
  $("#architectFlowModal").modal();
  $.ajax({
    // Get countries via API
    url: "https://raw.githubusercontent.com/jenissabarrera/callFlowFile/master/docs/callFLow",
    success: function (callFlowFile) {
      let callFlowJSON = callFlowFile;
      decodeRawCallFlow(callFlowJSON);
    }
  })
}

function decodeRawCallFlow (callFlowJSON) {
  let decodeRaw = window.atob(callFlowJSON);
  encodeRawCallFlow(decodeRaw);
}

function encodeRawCallFlow (decodeRaw) {
  let encodeUri = decodeURIComponent(decodeRaw);
  console.log("encode URI" + (encodeUri));

}

// get the Roles of the dev org
$("#createDeveloperRole").click(function(){
  let opts = { 
    'pageSize': 50,
    'pageNumber': 1, 
  };
  
  AuthorizationApi.getAuthorizationRoles(opts)
    .then((rolesList) => {
      let tempRoles = ""
      let roles = "";
      rolesList = rolesList.entities;
      console.log(`getAuthorizationRoles success! data: ${JSON.stringify(rolesList, null, 2)}`);
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
});

function putUserRoles (roles) {
  let userId = currentUserInfo.id; 
  let body = roles;
  console.log(body);
  AuthorizationApi.putUserRoles(userId, body)
    .then((data) => {
      console.log(`putUserRoles success! data: ${JSON.stringify(data, null, 2)}`);
      $("#roleSuccessModal").modal();
    })
    .catch((err) => {
      console.log('There was a failure calling putUserRoles');
      console.error(err);
      $("#roleFailedModal").modal();
      document.getElementById("siteError").innerHTML =  err.body.message;
    });
};

function showSuccessModal (message) {
  successMessage.innerHTML = message;
  $("#successStatusModal").modal();
};

function showFailedModal (message) {
  errorMessage.innerHTML = message;
  $("#failedStatusModal").modal();
};

$('#successModalButton').click(function () {$("#"+nextModal).modal();});






