import provisionTelephonyFunctions from '../pages/provisionTelephony.js'
import formModal from '../components/modals/form-modal.js'
import errorModal from '../components/modals/error-modal.js'
import successModal from '../components/modals/success-modal.js'
import loadingModalView from '../components/modals.js'
import infoModal from '../components/modals/info-modal.js'

const provisionTelephonyViews = {
    // btn event listener cases
    btnEventListeners(btnID) {
        document.getElementById(btnID).addEventListener('click', function () {
            switch(btnID) {
                case 'btnByocEnable':
                    console.log(btnID)
                    provisionTelephonyViews.selectTelephony();
                    break;
                case 'btnLearnMore':
                    provisionTelephonyViews.tbdButtonFunction();
                    break;
                case 'btnDisplaySiteModal':
                    provisionTelephonyViews.displaySiteModal();
                    break;
                case 'btnTrunkModal':
                    provisionTelephonyViews.displaySipTrunkModal();
                    break;
                case 'btnClose':
                    loadingModalView.hideLoadingModal();
                    break;
                case 'btnCreateSite':
                    loadingModalView.showloadingModal('Getting Telephony Providers Edges Sites...');
                    provisionTelephonyFunctions.getEdgeSite();
                    break;
                case 'btnCreateLocation':
                    loadingModalView.showloadingModal('Location is being created...');
                    provisionTelephonyFunctions.createLocation();
                    break;
                case 'btnCreateSIPTrunk':
                    loadingModalView.showloadingModal('Sip Trunk is being created...');
                    provisionTelephonyFunctions.createTrunk();
                    break;
                case 'btnStartProvision':
                    provisionTelephonyViews.displayLocationModal();
                    break;
                case 'btnTwillio':
                    provisionTelephonyFunctions.determineSipEndpoint(this.getAttribute('id'));
                    provisionTelephonyViews.displayProvisioningModal();
                    break;
                case 'btnNexmo':
                    provisionTelephonyViews.tbdButtonFunction();
                    // provisionTelephonyFunctions.determineSipEndpoint(this.getAttribute('id'));
                    // provisionTelephonyViews.displayProvisioningModal();
                    break;
                case 'btnProvisionTelephony':
                    provisionTelephonyFunctions.listProducts();
                    break;
            }    
        }, false)
    },

    // Function related modals
    // Success modal function
    displaySuccessModal(title, message, nextAction, btnID) {
        loadingModalView.showNewModal(successModal);
        successModal.show(title,message, nextAction, btnID)
        console.log(btnID)
        this.btnEventListeners(btnID);  
    },

    // Failed modal function
    displayFailedModal(title, message, nextAction) {
        loadingModalView.hideLoadingModal();
        loadingModalView.showNewModal(errorModal);
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
        loadingModalView.showNewModal(formModal);
        document.getElementById('form-modal').querySelector('.modal-footer').style.display = 'none'
        formModal.show('Select Telephony', temporaryBody, '', '');
        this.btnEventListeners('btnTwillio');
        this.btnEventListeners('btnNexmo');
    },

    displayProvisioningModal() {
        let temporaryBody = 
        `
        <p class="card-text">
          <p>We will be provisioning the following items:</p>
          <p>Create a Location</p>
          <p>Create a Site</p>
          <p>Create a BYOC SIP Trunk to Twilio</p>
        </p> 
        `
        loadingModalView.showNewModal(infoModal);
        infoModal.show('Provision Telephony - Twilio', temporaryBody, 'Next', 'btnStartProvision');
        this.btnEventListeners('btnStartProvision');
    },

    displaySipTrunkModal() {

        let temporaryBody = 
        `
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
        loadingModalView.showNewModal(formModal);
        formModal.show('Provision Telephony - Twilio', temporaryBody, 'Next', 'btnCreateSIPTrunk');
        this.btnEventListeners('btnCreateSIPTrunk'); 
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
        loadingModalView.showNewModal(formModal);
        provisionTelephonyFunctions.countryList();
        formModal.show('Provision Telephony - Twilio', temporaryBody, 'Next', 'btnCreateLocation'); 
        this.btnEventListeners('btnCreateLocation');
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
        loadingModalView.showNewModal(formModal);
        provisionTelephonyFunctions.getTimezone();
        formModal.show('Provision Telephony - Twilio', temporaryBody, 'Next', 'btnCreateSite');
        this.btnEventListeners('btnCreateSite');
    },

    tbdButtonFunction() {
        alert("This function is currently unavailable!")
    }
}

export default provisionTelephonyViews