//      SELECT ITEMS
const alrt = document.querySelector(".alert");
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

//      CLEAR ITEMS
clearBtn.addEventListener("click", clearTodos);

//      LOAD ITEMS
window.addEventListener("DOMContentLoaded", setupItems);

//      FUNCTIONS 
function addItem(e){
    e.preventDefault();
    const value = todos.value;
    const id = new Date().getTime().toString();
    if(value && !editFlag){
        createListItem(id, value);
        //      DISPLAY ALERT
        displayAlrt("item added to the list", "success");
        //      SHOW CONTAINER
        container.classList.add("show-container");
        //      ADD TO LOCAL STORAGE
        addToLocalStorage(id,value);
        //      set back to default
        setBackToDefault();
        alert("added successfully")

    } else if (value && editFlag){
        editElement.innerHTML = value;
        displayAlrt("value changed", "success");
        // EDIT LOCAL STORAGE
        editLocalStorage(editID, value);
        setBackToDefault();
        alert("edit successfull");
    }else{
        displayAlrt("please enter value","danger");
        alert("empty value");
    }
}
//      DISPLAY ALERT
function displayAlrt(text, action){
    alrt.textContent = text;
    alrt.classList.add(`alert-${action}`);

    //      REMOVE ALERT
    setTimeout(function(){
        alrt.textContent = "";
        alrt.classList.remove(`alert-${action}`);
    }, 3000);
}
//      CLEAR TODOS
function clearTodos(){
    const items = document.querySelectorAll(".todo-item");

    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlrt("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}
//      DELETE TODO
function deleteTodo(t){
    const elmnt = t.currentTarget.parentElement.parentElement;
    const id = elmnt.dataset.id;
    list.removeChild(elmnt);
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlrt("item emoved", "danger");
    setBackToDefault();
    //remave from mthe local storage
    removeFromLocalStorage(id);
    alert("delete successfully")
}
//      EDIT TODO
function editTodo(t){
    const elmnt = t.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = t.currentTarget.parentElement.previousElementSibling;
    // set back to default
    todos.value = editElement.innerHTML;
    editFlag = true;
    editID = elmnt.dataset.id;
    addBtn.textContent = "edit";
}
//      SET BACK TO DEFAULT
function setBackToDefault(){
    todos.value = "";
    editFlag = false;
    editID = "";
    addBtn.textContent = "add"
}
//      LOCAL STORAGE
function addToLocalStorage(id, value){
    const grocery = {id, value};
    let items = getLocalStorage();
    console.log(items);
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
    // console.log("added to local storage");
}
//      REMOVE ITEM
function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id,value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}
//      GET ITEM
function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}
//      LOCAL STORAGE API
//      SET ITEM


//      SAVE AS STRING
//******SETUP ITEMS******************

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0) {
        items.forEach(function(item){
            createListItem(item.id, item.value);
        })
        container.classList.add("show-container");

    }
    console.log(container);
}

function createListItem(id, value){
    const el = document.createElement("article");
        //      ADD CLASS
        el.classList.add("todo-item");
        //      ADD ID
        const attr = document.createAttribute("data-id");
        attr.value = id;
        el.setAttributeNode(attr);
        el.innerHTML = `
        <div class="task">
            <input type="checkbox"/>
            <p class="title" >${value}</p>
        </div>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                edit
            </button>
            <button type="button" class="delete-btn">
                delete
            </button>
        </div>`;
        const deltBtn = el.querySelector(".delete-btn");
        const edtBtn = el.querySelector(".edit-btn");
        edtBtn.addEventListener("click", editTodo);
        deltBtn.addEventListener("click", deleteTodo);
        
        //      APPEND CHILD
        list.appendChild(el);
}