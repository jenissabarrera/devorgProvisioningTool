import loadingModal from './modals/loading-modal.js';
import formModal from './modals/form-modal.js'
import errorModal from './modals/error-modal.js'
import successModal from './modals/success-modal.js'

export default{
    setupLoadingEl() {
        const newLoadingEl = loadingModal.new();
        document.body.appendChild(newLoadingEl);
    },
    showloadingModal(message) {
        loadingModal.show(message);
    },
    hideLoadingModal(){
        loadingModal.hide();
    },
    updateLoadingModal(message){
        loadingModal.updateText(message);
    },

    // function to open new modal and delete previous modal
    showNewModal(modal) {
        let formModal = document.getElementById('form-modal')
        let successModal= document.getElementById('success-modal')
        let infoModal= document.getElementById('info-modal')
        let errorModal = document.getElementById('error-modal')
        this.hideLoadingModal();
        if (typeof(formModal) != 'undefined' && formModal != null) {
            console.log('remove the infomodal')
            formModal.remove();
        }
        if (typeof(successModal) != 'undefined' && successModal != null) {
            console.log('remove the succeess')
            successModal.remove();
        }
        if (typeof(errorModal) != 'undefined' && errorModal != null) {
            console.log('remove the succeess')
            errorModal.remove();
        }
        if (typeof(infoModal) != 'undefined' && infoModal != null) {
            console.log('remove the succeess')
            infoModal.remove();
        }
        let newModal = modal.new();
        document.body.appendChild(newModal);
    }
}