import provisionTelephonyFunctions from '../pages/provisionTelephony.js'
// import infoModal from '../components/modals/info-modal.js'
import formModal from '../components/modals/form-modal.js'
import errorModal from '../components/modals/error-modal.js'
import successModal from '../components/modals/success-modal.js'
import loadingModalView from '../components/loadModal.js'

const provisionTelephonyViews = {
    // All button on click related functions

    btnProvisionTelephonyEventListener() {
        document.getElementById('btnProvisionTelephony').addEventListener('click', function () {
            provisionTelephonyFunctions.listProducts();
        }, false)
    },
    btnByocEnableEventListener() {
        document.getElementById('btnByocEnable').addEventListener('click', function () {
            provisionTelephonyViews.selectTelephony();
        }, false)
    },
    btnTwilioEventListener() {
        document.getElementById('btnTwillio').addEventListener('click', function () {
            provisionTelephonyViews.displayTwillioModal();
        }, false)
    },

    btnStartProvisionEventListener() {
        document.getElementById('btnStartProvision').addEventListener('click', function () {
            provisionTelephonyViews.displayLocationModal();
        }, false)
    },

    btnOpenSiteModalListener() {
        document.getElementById('btnDisplaySiteModal').addEventListener('click', function () {
            provisionTelephonyViews.displaySiteModal();
        }, false)
    },

    btnOpenTrunkModalListener() {
        document.getElementById('btnTrunkModal').addEventListener('click', function () {
            provisionTelephonyViews.displaySipTrunkModal();
        }, false)
    },
    
    btnCreateSIPTrunkListener() {
        document.getElementById('btnCreateSIPTrunk').addEventListener('click', function () {
            loadingModalView.showloadingModal('Sip Trunk is being created...');
            provisionTelephonyFunctions.createTrunk();
        }, false)
    },
    
    btnLocationModalListener() {
        document.getElementById('btnCreateLocation').addEventListener('click', function () {
            loadingModalView.showloadingModal('Location is being created...');
            provisionTelephonyFunctions.createLocation();
        }, false)
    },

    btnCloseModalListener() {
        document.getElementById('btnClose').addEventListener('click', function () {
            loadingModalView.hideLoadingModal();
        }, false)
    },

    btnSiteModalListener() {
        document.getElementById('btnCreateSite').addEventListener('click', function () {
            loadingModalView.showloadingModal('Getting Telephony Providers Edges Sites...');
            provisionTelephonyFunctions.getEdgeSite();
        }, false)
    },

    // Function related modals
    //  Success modal function
    displaySuccessModal(title, message, nextAction, btnID) {
        provisionTelephonyViews.showNewModal(successModal);
        loadingModalView.hideLoadingModal();
        successModal.show(title,message, nextAction, btnID)
        switch(btnID) {
            case 'btnByocEnable':
                provisionTelephonyViews.btnByocEnableEventListener();
                break;
            case 'btnDisplaySiteModal':
                provisionTelephonyViews.btnOpenSiteModalListener();
                break;
            case 'btnTrunkModal':
                provisionTelephonyViews.btnOpenTrunkModalListener();
                break;
            case 'btnClose':
                provisionTelephonyViews.btnCloseModalListener();
                break;
        }  
    },

    // Failed modal function
    displayFailedModal(title, message, nextAction) {
        loadingModalView.hideLoadingModal();
        provisionTelephonyViews.showNewModal(errorModal);
        errorModal.show(title, message, nextAction)
    },

    selectTelephony() {
        let temporaryBody = 
        `
        <div class="card-deck" style="text-align: center;">
          <button type="button" id="btnTwillio" class="card bg-primary-modified card-body" data-dismiss="modal" data-toggle="modal" style="color: white; text-align: center !important;">    
            <p class="card-text" style="text-align: center !important;"> 
              <a href="#" style="color: white; text-align: center !important;"> Twillio </a> 
            </p>  
          </button>
          <button type="button" id="btnNexmo" class="card bg-primary-modified" data-dismiss="modal" data-toggle="modal" style="color: white;">
            <div class="card-body text-center">
              <p class="card-text"> 
                <a href="#" style="color: white;"> Nexmo </a> 
              </p>
            </div>
          </button>
        </div> 
        `;    
        provisionTelephonyViews.showNewModal(formModal);
        document.getElementById('info-modal').querySelector('.modal-footer').style.display = 'none'
        formModal.show('Select Telephony', temporaryBody, '', '');
        provisionTelephonyViews.btnTwilioEventListener();
    },

    displayTwillioModal() {
        let temporaryBody = 
        `
        <p class="card-text">
          <p>We will be provisioning the following items:</p>
          <p>Create a Location</p>
          <p>Create a Site</p>
          <p>Create a BYOC SIP Trunk to Twilio</p>
        </p> 
        `
        provisionTelephonyViews.showNewModal(formModal);
        formModal.show('Provision Telephony - Twilio', temporaryBody, 'Next', 'btnStartProvision');
        provisionTelephonyViews.btnStartProvisionEventListener();
    },

    displaySipTrunkModal() {

        let temporaryBody = `
        <div class="card-text">
          <p>Create BYOC SIP Trunk</p>
          <p>Now I’ll provision a SIP trunk for your new site that is linked to your Twilio SIP trunk. I need the following information:</p>
          <div class="form-row">
            <div class="form-group-inline col-md-4 mb-3">
              <div style="align-items: initial; display: flex;">
                <label>External Trunk Name:</label>
                <a href="#" data-toggle="tooltip" title="Enter your desired trunk name &#10 e.g: Dev Cloud">
                  <i class="material-icons"> help </i>
                </a>
              </div>
              <input type="text" class="form-control" id="txtSIPExternalTrunk" required>
              <div class="invalid-feedback"> Please provide a valid External Trunk Name. </div>
              <div class="valid-feedback"> Looks good! </div>
            </div>
            <div class="form-group-inline col-md-4 mb-3">
              <div style="align-items: initial; display: flex;">
                <label style="font-size: 14px">Inbound SIP Termination Identifier:</label>
                <a href="#" data-toggle="tooltip"
                  title="Your termination URI is unique within your PureCloud Organization"s region. &#10The termination URI will be used by the 3rd party PBX or Carrier to direct SIP traffic to PureCloud ">
                  <i class="material-icons"> help </i>
                </a>
              </div>
              <input type="text" class="form-control" id="txtInboundSIP" required>
              <div class="invalid-feedback"> Please provide a valid Inbound SIP Termination Identifier. </div>
              <div class="valid-feedback"> Looks good! </div>
            </div>
            <div class="form-group-inline col-md-4 mb-3">
              <div style="align-items: initial; display: flex;">
                <label>SIP Servers or Proxies:</label>
                <a href="#" data-toggle="tooltip"
                  title="This is a list of SIP servers or intermediate proxies where all outgoing &#10request should be sent to, regardless of the destination address of the request.&#10 If no port is specified, the inbound listen port will be used.">
                  <i class="material-icons"> help </i>
                </a>
              </div>
              <input type="text" class="form-control" id="txtSIPServers" required>
              <div class="invalid-feedback"> Please provide a valid SIP Servers or Proxies. </div>
              <div class="valid-feedback"> Looks good! </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-inline col-md-4">
              <div style="align-items: initial; display: flex;">
                <label>User Name:</label>
                <a href="#" data-toggle="tooltip" title="User name to send when trunk is challenged for the realm.">
                  <i class="material-icons"> help </i>
                </a>
              </div>
              <input type="text" class="form-control" id="txtUserName" required>
              <div class="invalid-feedback"> Please provide a valid User Name. </div>
              <div class="valid-feedback"> Looks good! </div>
            </div>
            <div class="form-group-inline col-md-4 mb-3">
              <div style="align-items: initial; display: flex;">
                <label>Password:</label>
                <a href="#" data-toggle="tooltip" title="Password to send when trunk is challenged for the realm.">
                  <i class="material-icons"> help </i>
                </a>
              </div>
              <input type="password" class="form-control" id="txtSIPPassword" required>
              <div class="invalid-feedback"> Please provide a valid password. </div>
              <div class="valid-feedback"> Looks good! </div>
            </div>
            <div class="form-group-inline col-md-4 mb-3">
              <div style="align-items: initial; display: flex;">
                <label>Realm:</label>
                <a href="#" data-toggle="tooltip" title="Realm must match the username and password to be sent.">
                  <i class="material-icons"> help </i>
                </a>
              </div>
              <input type="text" class="form-control" id="txtSIPRealm" required>
              <div class="invalid-feedback"> Please provide a valid Realm. </div>
              <div class="valid-feedback"> Looks good! </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-inline col-md-5 mb-3">
              <div style="align-items: initial; display: flex;">
                <label>Address:</label>
                <a href="#" data-toggle="tooltip"
                  title="Specific overriding caller ID adddress to use as the outgoing origination address. &#10May be a URI or raw phone number">
                  <i class="material-icons"> help </i>
                </a>
              </div>
              <input type="text" class="form-control" id="txtSIPCallingAddress" required>
              <div class="invalid-feedback"> Please provide a valid Address. </div>
              <div class="valid-feedback"> Looks good! </div>
            </div>
            <div class="form-group-inline col-md-5 mb-3">
              <div style="align-items: initial; display: flex;">
                <label>Name:</label>
                <a href="#" data-toggle="tooltip"
                  title="Specific overriding caller ID name to use as the outgoing origination address. &#10May be a URI or raw phone number">
                  <i class="material-icons"> help </i>
                </a>
              </div>
              <input type="text" class="form-control" id="txtSIPCallingName" required>
              <div class="invalid-feedback"> Please provide a valid Name. </div>
              <div class="valid-feedback"> Looks good! </div>
            </div>
          </div>
        </div> 
        `
        provisionTelephonyViews.showNewModal(formModal);
        formModal.show('Provision Telephony - Twilio', temporaryBody, 'Next', 'btnCreateSIPTrunk');
        provisionTelephonyViews.btnCreateSIPTrunkListener(); 
    },

    displayLocationModal () {
        let temporaryBody = 
        `
        <p class="card-text">
          <p>Create a Location</p>
          <p>To create a location we need the following information:</p>
          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>Name of location:</label>
              <a href="#" data-toggle="tooltip" title="Enter your desired location name &#10 e.g: Headquarters ">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <input type="text" class="form-control" name="txtLocation" id="location" required>

          </div>

          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>Address:</label>
              <a href="#" data-toggle="tooltip" title="Please make sure that you will input a verified address">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <input type="text" class="form-control" name="txtAddress" id="address" required>
          </div>

          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>City:</label>
              <a href="#" data-toggle="tooltip" title="City">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <input type="text" class="form-control" name="txtCity" id="city" required>
          </div>

          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>State/Province/Region: </label>
              <a href="#" data-toggle="tooltip" title="State or Province">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <input type="text" class="form-control" name="txtState" id="state" required>
          </div>

          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>Zip / Postal Code:</label>
              <a href="#" data-toggle="tooltip" title="Zip or Postal Code">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <input type="text" class="form-control" name="txtZip" id="zip" required>
          </div>

          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>Country:</label>
              <a href="#" data-toggle="tooltip" title="Country">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <select type="text" class="form-control" id="selectCountry" required>
              <option selected>Choose Country</option>
            </select>
          </div>

          <div class="input-field form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>Emergency Number:</label>
              <a href="#" data-toggle="tooltip"
                title="Please make sure to follow the number format E.164 &#10 e.g: +12345678911">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <label for="emergencyNumber" class="static-value"></label>
            <input type="tel" maxlength="13" required id="emergencyNumber" class="form-control"
              name="emergencyNumberInput" placeholder="+XX XXX XXX XXXX" required>
          </div>
        </p>
        `
        provisionTelephonyViews.showNewModal(formModal);
        provisionTelephonyFunctions.countryList();
        formModal.show('Provision Telephony - Twilio', temporaryBody, 'Next', 'btnCreateLocation'); 
        provisionTelephonyViews.btnLocationModalListener();
    },

    displaySiteModal () {
        let temporaryBody = 
        `
        <p class="card-text">
          <p>Create a Site</p>
          <p>To create a site we need the following information:</p>

          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>Site Name:</label>
              <a href="#" data-toggle="tooltip" title="Enter your desired site name &#10 e.g: Daily City">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <input type="text" class="form-control" name="txtSiteName" id="siteName">
          </div>

          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>Time Zone:</label>
              <a href="#" data-toggle="tooltip" title="Select a Time Zone">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <select type="text" class="form-control" id="timeZone">
              <option selected>Choose Time Zone</option>
            </select>
          </div>
        </p>
        `
        provisionTelephonyViews.showNewModal(formModal);
        provisionTelephonyFunctions.getTimezone();
        formModal.show('Provision Telephony - Twilio', temporaryBody, 'Next', 'btnCreateSite');
        provisionTelephonyViews.btnSiteModalListener();
    },

    // function to open new modal and delete previous modal
    showNewModal(modal) {
        let formModal = document.getElementById('info-modal')
        let successModal= document.getElementById('success-modal')
        loadingModalView.hideLoadingModal();
        if (typeof(formModal) != 'undefined' && formModal != null) {
            console.log('remove the infomodal')
            formModal.remove();
        }
        if (typeof(successModal) != 'undefined' && successModal != null) {
            console.log('remove the succeess')
            successModal.remove();
        }
        let newModal = modal.new();
        document.body.appendChild(newModal);
    }
}

export default provisionTelephonyViews
