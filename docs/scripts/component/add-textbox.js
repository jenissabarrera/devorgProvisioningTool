let t = document.createElement('template');
t.innerHTML =
`
<div class="form-group-inline">
    <div style="align-items: initial; display: flex;">
        <label id="text-label"></label>
        <a href="#" data-toggle="tooltip">
            <i class="material-icons"> help </i>
        </a>
    </div>
    <input type="text" class="form-control" id="input-text">
</div>
`
;

export default {
    new(labelText, name, value){
        let inputTextModalEl = document.getElementById('modal-text-body');
        let textBox = document.getElementById('input-text');
        let label = document.getElementById('text-label');

        label.innerHTML = labelText;
        textBox.name = name;
        textBox.value = value;

        inputTextModalEl.appendChild(t.content);
    }
};