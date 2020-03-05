import architectFlowViews from '../views/architectflow.js'

const platformClient = require('platformClient');
let routingApi = new platformClient.RoutingApi();
let encodeUri = "";
let encodeProcessed ="";

const architectFlowFunctions = {

    getListofQueues () {
        let opts = { 
          'pageSize': 100
        };
        
        routingApi.getRoutingQueues(opts)
          .then((queueList) => {
            console.log(`getRoutingQueues success! data: ${JSON.stringify(queueList, null, 2)}`);
            let queuesArray =  queueList.entities
            queuesArray.forEach(architectFlowFunctions.createQueueList);
            architectFlowFunctions.initializeFlowCreation();
          })
          .catch((err) => {
            console.log('There was a failure calling getRoutingQueues');
            console.error(err);
          });
        
      },
      initializeFlowCreation () {
        $.ajax({
          // Get countries via API
          url: "https://raw.githubusercontent.com/jenissabarrera/callFlowFile/master/docs/callFLow",
          success: function (callFlowFile) {
            let callFlowJSON = callFlowFile;
            architectFlowFunctions.decodeRawCallFlow(callFlowJSON);
          }
        })
      
      },

      createQueueList (queueData) {
        console.log(queueData)
        let queueSelect = document.getElementById("selectQueue");
        let queueOption = document.createElement("option");
        queueOption.text = queueData.name;
        queueOption.value = queueData.id;
        queueSelect.add(queueOption);
      },

      decodeRawCallFlow (callFlowJSON) {
        let decodeRaw = window.atob(callFlowJSON);
        architectFlowFunctions.encodeRawCallFlow(decodeRaw);
      },

      encodeRawCallFlow (decodeRaw) {
        encodeUri = decodeURIComponent(decodeRaw);
        console.log("encode URI" + (encodeUri));
      },
      modifyCallFlow (selectedQueueId,selectedQueueText) {
        let encodeUriJSON ="";
        encodeUriJSON = JSON.parse(encodeUri)
        console.log(typeof(encodeUriJSON));
        
        encodeUriJSON.manifest.queue[0].name = selectedQueueText ;
        encodeUriJSON.manifest.queue[0].id = selectedQueueId;
        encodeUriJSON.flowSequenceItemList[0].actionList[2].queues[0].config.lit.text = selectedQueueText;
        encodeUriJSON.flowSequenceItemList[0].actionList[2].queues[0].config.lit.val = selectedQueueId;
        encodeUriJSON.flowSequenceItemList[0].actionList[2].queues[0].text = selectedQueueText;
        encodeUriJSON.flowSequenceItemList[1].menuChoiceList[1].action.queues[0].config.lit.text = selectedQueueText;
        encodeUriJSON.flowSequenceItemList[1].menuChoiceList[1].action.queues[0].config.lit.val = selectedQueueId;
        encodeUriJSON.flowSequenceItemList[1].menuChoiceList[1].action.queues[0].text = selectedQueueText;
        
        encodeUri = JSON.stringify(encodeUriJSON);
        
        console.log(encodeUri);
        console.log(typeof(encodeUri));
        
        architectFlowFunctions.decodeProcessedFlow(encodeUri);
         
        },

        decodeProcessedFlow (encodeUri) {
            let decodeURI = "";
            decodeURI = encodeURIComponent(encodeUri);
            architectFlowFunctions.encodeProcessCallFlow(decodeURI);
          },

          encodeProcessCallFlow (decodeURI) {
            encodeProcessed = window.btoa(decodeURI);
            console.log(encodeProcessed)
            architectFlowViews.btnDownloadFlowEventListener();
          
          },

          downloadFlow (filename) {  
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeProcessed);
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        
        },
}

export default architectFlowFunctions