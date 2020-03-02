import architectFlowFunctions from '../pages/architectflow.js'
import infoModal from '../components/modals/info-modal.js'
import successModal from '../components/modals/success-modal.js'

const architectFlowViews = {

    btnInitiateArchitectDownloadEventListener() {
        document.getElementById("btnInitiateArchitectDownload").addEventListener("click", function () {
            architectFlowViews.displayArchitectFlowModal();
        }, false)
    },

    selectQueueEventListener() {

        document.getElementById("selectQueue").addEventListener('change', function () {
            let selectedQueueId = selectQueue.options[selectQueue.selectedIndex].value;
            let selectedQueueText = selectQueue.options[selectQueue.selectedIndex].text;
            architectFlowFunctions.modifyCallFlow(selectedQueueId, selectedQueueText)
        })
    },

    btnDownloadFlowEventListener() {
        document.getElementById("btnDownloadFlow").addEventListener("click", function () {
            let filename = "SampleCallFlow.i3InboundFlow";
            architectFlowFunctions.downloadFlow(filename);
        }, false)
    },



    displayArchitectFlowModal() {
        architectFlowFunctions.getListofQueues();
       

        let temporaryBody = `
        <p class="card-text">

        <div class="form-group-inline">
          <label>Select queue you want to use for the flow</label>
          <select type="text" class="form-control" id="selectQueue" name="selectQueue">
            <option selected>Select Queue</option>
          </select>
        </div>

      </p>
        
        `
        let newInfoModal = infoModal.new();
        document.body.appendChild(newInfoModal);
        successModal.show("Architect Flow", temporaryBody, "Download", "btnDownloadFlow");
        let downloadBtn = document.getElementById("btnDownloadFlow");
        downloadBtn.setAttribute("data-dismiss", "modal");
        $("#info-modal").modal();
        architectFlowViews.selectQueueEventListener();
    },
}

export default architectFlowViews