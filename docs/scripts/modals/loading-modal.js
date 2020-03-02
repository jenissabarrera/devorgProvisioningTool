let t = document.createElement('template');
t.innerHTML =
`
<div id="loading-modal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content has-text-centered modal-center">
        <div class="spinner-grow text-primary" role="status"></div>
        <div class="loader"></div>
    </div>
</div>
`
;

export default {
    new(){
        return document.importNode(t.content, true);
    },

    show(message){
        // document.getElementById('loading-message').innerText = message;
        $('#loading-modal').modal(); 
    },

    hide(){
        $('#loading-modal').modal('hide');
    }
};