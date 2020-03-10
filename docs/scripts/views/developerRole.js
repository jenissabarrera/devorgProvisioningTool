import formModal from '../components/modals/form-modal.js'
import loadingModalView from '../components/modals.js'
import createDeveloperRoleFunctions from '../pages/developerRole.js'

const createDeveloperRoleView = {

    btnDeveloperRoleEventListener() {
        document.getElementById('btnDeveloperRole').addEventListener('click', function () {
            loadingModalView.showloadingModal('Getting users name...');
            createDeveloperRoleView.displayDeveloperModal();
        }, false)
    },
    btnCreateRoleEventListener() {
        document.getElementById('btnCreateDev').addEventListener('click', function () {
            loadingModalView.showloadingModal('Fetching all default permission...');
            createDeveloperRoleFunctions.createDevUser()
        }, false)
    },

    displayDeveloperModal () {
        let temporaryBody = 
        `
        <p class="card-text">
          <p>Select a user to grant a Developer role.</p>

          <div class="form-group-inline">
            <div style="align-items: initial; display: flex;">
              <label>Select User:</label>
              <a href="#" data-toggle="tooltip" title="Select a user from the dropdown">
                <i class="material-icons"> help </i>
              </a>
            </div>
            <select type="text" class="form-control" id="selectUser">
                <option selected>Select User</option>
            </select>
          </div>
        </p>
        `
        loadingModalView.showNewModal(formModal);
        createDeveloperRoleFunctions.getOrgUser();
        formModal.show('Create a Developer Role', temporaryBody, 'Next', 'btnCreateDev');
        createDeveloperRoleView.btnCreateRoleEventListener();
    }
}

export default createDeveloperRoleView