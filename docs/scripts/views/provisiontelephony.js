import provisionTelephonyFunctions from '../pages/provisionTelephony.js.js'
import infoModal from '../components/modals/info-modal.js.js'
import formModal from '../components/modals/form-modal.js.js'
import errorModal from '../components/modals/error-modal.js.js'

const provisionTelephonyViews = {

  // All button on click related functions

  btnProvisionTelephonyEventListener() {
    document.getElementById("btnProvisionTelephony").addEventListener("click", function () {
      provisionTelephonyFunctions.listProducts();
    }, false)
  },
  btnByocEnableEventListener() {
    document.getElementById("btnByocEnable").addEventListener("click", function () {
      provisionTelephonyViews.selectTelephony();
    }, false)
  },
  btnTwilioEventListener() {
    document.getElementById("btnTwillio").addEventListener("click", function () {
      provisionTelephonyViews.displayTwillioModal();
    }, false)
  },

  btnStartProvisionEventListener() {
    document.getElementById("btnStartProvision").addEventListener("click", function () {
      provisionTelephonyViews.displaySipTrunkModal();
    }, false)
  },

  btnCreateTrunkEventListener() {
    document.getElementById("btnCreateSIPTrunk").addEventListener("click", function () {
      provisionTelephonyViews.validateCreateTrunk();
    }, false)
  },

  // Function related modals
  displaybyocEnabledModal() {
    let newInfoModal = infoModal.new();
    let temporaryBody = `  
    <p class="card-text">
    <div class="icon-box">
      <i class="material-icons">check_circle</i>
    </div>
    <p class="body-content" id= "modal-body-content">Your org has BYOC Capability. Please proceed.</p>
  </p>
    `
    document.body.appendChild(newInfoModal);
    infoModal.show("Provision Telephony", temporaryBody, "Next", "btnByocEnable");
    $("#info-modal").modal();
    provisionTelephonyViews.btnByocEnableEventListener();
  },

  displaybyocDisabledModal() {
    let newErrorModal = errorModal.new();
    document.body.appendChild(newErrorModal);
    infoModal.show("Provision Telephony", "Your org has no BYOC Capability.Please contact administrator.", "Dismiss");
    $("#error-modal").modal();
  },

  selectTelephony() {

    let temporaryBody = `
    <div class="card-deck" style="text-align: center;">

    <button type="button" id="btnTwillio" class="card bg-primary-modified card-body" data-dismiss="modal" data-toggle="modal" style="color: white; text-align: center !important;" >
   
    <p class="card-text" style="text-align: center !important;"> <a href="#" style="color: white; text-align: center !important;"> Twillio </a> </p>
 
    </button>
  
    <button type="button" id="btnTwillio" class="card bg-primary-modified" data-dismiss="modal" data-toggle="modal" style="color: white;">
    <div class="card-body text-center">
    <p class="card-text"> <a href="#" style="color: white;"> Twillio </a> </p>
  </div>
    </button>
  </div> `;
    document.getElementById("info-modal").remove();
    let newInfoModal = infoModal.new();
    document.body.appendChild(newInfoModal);
    document.getElementById("info-modal").querySelector(".modal-footer").style.display = "none"
    infoModal.show("Select Telephony", temporaryBody, "", "");
    $("#info-modal").modal();
    provisionTelephonyViews.btnTwilioEventListener();
  },

  displayTwillioModal() {

    let temporaryBody = `
    <p class="card-text">
    <p>We will be provisioning the following items:</p>
    <p>Create a Location</p>
    <p>Create a Site</p>
    <p>Create a BYOC SIP Trunk to Twilio</p>
  </p> `


    document.getElementById("info-modal").remove()
    let newInfoModal = infoModal.new();
    document.body.appendChild(newInfoModal);
    infoModal.show("Provision Telephony - Twilio", temporaryBody, "Next", "btnStartProvision");
    $("#info-modal").modal();
    provisionTelephonyViews.btnStartProvisionEventListener();
  },

  displaySipTrunkModal() {

    let temporaryBody = `
    <div class="card-text">

              <p>Create BYOC SIP Trunk</p>
              <p>Now I’ll provision a SIP trunk for your new site that is linked to your Twilio SIP trunk. I need the
                following information:
              </p>
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
                      title="Your termination URI is unique within your PureCloud Organization's region. &#10The termination URI will be used by the 3rd party PBX or Carrier to direct SIP traffic to PureCloud ">
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
            </div> `

        
    document.getElementById("info-modal").remove()
    let newInfoModal = formModal.new();
    document.body.appendChild(newInfoModal);
    infoModal.show("Provision Telephony - Twilio", temporaryBody, "Next", "btnCreateSIPTrunk");
    $("#info-modal").modal();
    provisionTelephonyViews.btnCreateTrunkEventListener();

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

        } else if (form.checkValidity() === true) {
          // provisionTelephonyFunctions.checkSipInput();
        }
        form.classList.add('was-validated');
      }, true)
    })

  }

}

export default provisionTelephonyViews
