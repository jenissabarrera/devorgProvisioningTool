import textField from './component/add-textbox.js';
import modals from './modals.js';

export default {
    addTextBox(labelText, id, value){
        let inputTextModalEl = document.getElementById('modal-text-body');
        let textBox = document.createElement('input');
        let label = document.createElement('label');
        let linebreak = document.createElement('br');
        
        label.innerHTML = labelText;
        
        setAttributes(textBox, {'type':'text', 'class':'form-control', 'id':id, 'value':value})

        inputTextModalEl.appendChild(label);
        inputTextModalEl.appendChild(linebreak);
        inputTextModalEl.appendChild(textBox);     
    },
    ceateUserDropDownOption(obj){
        let select = document.getElementById('selectUser');
        for(var key in obj) {
            createList(select, obj[key].name, obj[key].id);
        }
    }
}

// set attributes
function setAttributes(el, attrs) {
    for(var key in attrs) {
        console.log(key, attrs[key]);
        el.setAttribute(key, attrs[key]);
    }
}

function createList(el, text, value) {
    let option = document.createElement("option");
    option.text = text;
    option.value = value;
    option.id = value;
    el.add(option);
}