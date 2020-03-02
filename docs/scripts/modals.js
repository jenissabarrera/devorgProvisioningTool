import modalMessage from './modals/modal-message.js';
import loadingModal from './modals/loading-modal.js';
import inputModal from './modals/global-modal.js';
import createDeveloper from './modals/create-developer.js';
// import textField from './component/add-textbox.js';
export default {
    /**
     * Add the modals to the DOM
     */
    setup(){
        const newModalMessageEl = modalMessage.new();
        const newLoadingEl = loadingModal.new();
        const newInputModalEl = inputModal.new();
        const createDeveloperEl = createDeveloper.new();

        document.body.appendChild(newModalMessageEl);
        document.body.appendChild(newLoadingEl);
        document.body.appendChild(newInputModalEl);
        document.body.appendChild(createDeveloperEl);
    },

    showModalMessage(title, message, type){
        modalMessage.show(title, message, type);
    },

    showLoadingModal(message){
        loadingModal.show(message);
    },

    hideLoadingModal(){
        loadingModal.hide();
    },

    showUniModal(){
        inputModal.show();
    },

    showCreateDevModal(){
        createDeveloper.show();
    }
}