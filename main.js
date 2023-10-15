const boxInput = document.querySelector('#boxInput');
const boxResult = document.querySelector('#boxResult');
const errorFile = document.querySelector('#boxInput .error-file');
const treeView = document.querySelector('#treeView');
var nameFile = '';

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        showError('Please load a valid JSON file.');
        return;
    }
    if (file.type !== 'application/json') {
        showError('Type file invalid. Please load a valid JSON file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
        const contents = event.target.result;
        try {
            const data = JSON.parse(contents);
            createTree(data);
        } catch (e) {
            showError('Invalid file. Please load a valid JSON file.');
        }
    }
    reader.readAsText(file);
    nameFile = file.name;
    
}

function showError(message) {
    errorFile.innerText = message;
    errorFile.style.display = 'block';
}

function createTree(data) {    
    const tree = createNode(data);

    treeView.innerHTML = '';
    treeView.appendChild(tree);

    boxInput.style.display = 'none';

    boxResult.querySelector('h2').innerText = nameFile;
    boxResult.style.display = 'block';
}

function createNode(data) {
    const dataIsArray = Array.isArray(data);

    const ul = document.createElement('ul');    
    ul.classList.add(dataIsArray ? 'array' : 'object');

    for (let key in data) {

        const content = data[key];
        const contentType = typeof content;
        const contentIsArray = Array.isArray(content);
        const contentIsNull = content === null;

        const li = document.createElement('li');
        li.classList.add(contentType);
        
        const span = document.createElement('span');
        span.classList.add(contentIsArray ? 'array' : contentType);
        span.appendChild(document.createTextNode(`${key}: `));

        if (contentIsArray) {
            const spanBracket = document.createElement('span');
            spanBracket.classList.add('bracket');
            spanBracket.appendChild(document.createTextNode('['));
            span.appendChild(spanBracket);
        }

        li.appendChild(span);

        if(contentIsNull) {
            li.appendChild(document.createTextNode('null'));
        } else if (contentType === 'object') {
            li.appendChild(createNode(content));
        } else {
            li.appendChild(document.createTextNode(content));
        }

        if (contentIsArray) {
            const spanBracket = document.createElement('span');
            spanBracket.classList.add('bracket');
            spanBracket.appendChild(document.createTextNode(']'));
            li.appendChild(spanBracket);
        }

        ul.appendChild(li);
    }
    return ul;
}

const fileInput = document.getElementById('jsonFileInput');
fileInput.addEventListener('change', handleFileSelect, false);