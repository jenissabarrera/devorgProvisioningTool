let t = document.createElement('template');
t.innerHTML =
`
<div class="modal fade" id="successStatusModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h3 id="modalTitle"></h3>
          <button type="button" class="close" data-dismiss="modal">×</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body" style="text-align:center">
          <p class="card-text">
            <div class="icon-box">
              <i id="modalIcon" class="material-icons"></i>
            </div>
            <p id="modalMessage"></p>
          </p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-success-modified" id="nextModalButton" data-dismiss="modal" data-toggle="modal">Next</button>
        </div>

      </div>
    </div>
  </div>
`
;

export default {
    new(){
        return document.importNode(t.content, true);
    },

    show(title, message, type){
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalMessage').innerText = message;

        let icon = document.getElementById('modalIcon');        
        if(type === "check") {            
            icon.innerHTML = "check_circle";
        }else if(type === "fail") {           
            icon.innerHTML = "cancel_presentation";
            icon.style.color = "#F53131";
        }
        $("#successStatusModal").modal(); 
    },

    hide(){
        $("#successStatusModal").modal('hide'); 
    }
};