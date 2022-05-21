//      SELECT ITEMS
const alert = document.querySelector(".alert");
const form = document.querySelector(".todo-form");
const addBtn = document.querySelector(".add-Btn");
const container = document.querySelector(".todo-container");
const list = document.querySelector(".todo-list");
const clearBtn = document.querySelector(".clear-btn");
const todos = document.getElementById("todos")
//      EDIT OPTION
let editElement;
let editFlag = false;
let editID = "";

//      EVENT LISTENERS

//      SUBMIT FORM
form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

window.addEventListener('DOMContentLoaded', setupItems);


// functions
function addItem(e){
    e.preventDefault();
    const value = todos.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
    
        createListItem(id, value);

    displayAlert("item add to the list","success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
        
    }else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('value changed', "success");
        editLocalStorage(editID, value);
        setBackToDefault();
    }else{
        displayAlert("please enter value", "danger") 
    }
}

//  display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //  remove Alert
    setTimeout(
        function(){
            alert.textContent = "";
    alert.classList.add(`alert-${action}`);
        },3000
    );
}

function clearItems(){
    const items = document.querySelectorAll(".todo-item");
    if(items.length>0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();
    removeFromLocalStorage(id); 
}
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;

    editElement = e.currentTarget.parentElement.previousElementSibling;
    todos.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    addBtn.textContent = "edit"; 
}


function setBackToDefault(){
    todos.value = "";
    editFlag = false;
    editID = "";
    addBtn.textContent = "add";
}
function addToLocalStorage(id, value){
    const todo = {id, value};
    let items = getLocalStorage();
    console.log(items);
    items.push(todo);
    localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if(item.id != id){
            return item;
        }
    })
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value)
        })
        container.classList.add("show-container");
    }
}

function createListItem(id, value){
    const element = document.createElement("article");
    element.classList.add("todo-item");
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            edit
        </button>
        <button type="button" class="delete-btn">
            delete
        </button>
    </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    list.appendChild(element);
}