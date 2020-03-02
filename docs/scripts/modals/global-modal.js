let t = document.createElement('template');
t.innerHTML =
`
<div class="modal fade" id="inputModal">
  <div class="modal-dialog modal-lg">
      <div class="modal-content">
  
          <!-- Modal Header -->
          <div class="modal-header">
              <h3 id="modalTitle"></h3>         
              <button type="button" class="close" data-dismiss="modal">×</button>
          </div>
  
          <!-- Modal body -->
          <div class="modal-body" id="modal-text-body">
              <p class="card-text">
                  <h4 id="secondTitle"></h4>
                  <p id="instruction"></p>
              </p>  
              <div id="text-content">
              </div>
          </div>
  
          <div class="modal-footer">
              <button type="button" class="btn btn-success-modified" id="processModal" data-dismiss="modal" data-toggle="modal">Next</button>
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

    show(){
        $("#inputModal").modal(); 
    }
};