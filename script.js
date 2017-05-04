
function getNewItemText() {
    if (document.getElementById("newItemText").value === ""){
        return false;
    } else {
        return document.getElementById("newItemText").value;
    }
}

function newItemClear() {
    document.getElementById("newItemText").value = '';
}

function Item(text) {
    this.id = ++globalId + '';
    this.isDone = false;
    this.text = text;
}

Item.prototype.toggle = function () {
    if (this.isDone === true) {
        this.isDone = false;
    } else {
        this.isDone = true;
    }
};

function ItemGroup() {
    this.items = [];
}

ItemGroup.prototype.addItem = function () {
    var text = getNewItemText();
    if (text === false) {
        alert("You did not write anything!");
    } else {
        var item = new Item(text);
        this.items.push(item);
        updateHtml(this);
        newItemClear();
    }
};

ItemGroup.prototype.removeItem = function (id) {
    var newItems = this.items.filter(function (item) {
        return item.id !== id;
    });
    this.items = newItems;
    updateHtml(this);
};

ItemGroup.prototype.toggleItem = function (id) {
    this.items.forEach(function (item) {
        if (item.id === id) {
            item.toggle();
        }
    });
    updateHtml(this);
};

function updateHtml(itemsGroup) {
    var itemList = document.querySelector("div.listOfItem");
    itemList.innerHTML = '';

    itemsGroup.items.forEach(function (item) {
        var createTag = document.createElement("div");
        createTag.className = "item";
        if (item.isDone) {
            createTag.classList.add("done-item");
        }
        var text = document.createTextNode(item.text);
        createTag.innerHTML = "" +
            "<input id=" + item.id + " class='button-delete' type='button' value='' onclick='itemGroup.removeItem(this.id)'>"+
            "<input id=" + item.id + " class='button-done' type='button' value='' onclick='itemGroup.toggleItem(this.id)' >";

        createTag.insertBefore(text, createTag.children[0]);
        itemList.appendChild(createTag);
    });
    saveToStorage(itemGroup);
}

function saveToStorage(obj) {
    var myObj = JSON.stringify(obj);
    localStorage.setItem("saveObg", myObj);
}

function fetchFromStorage() {
    var getObg = JSON.parse(localStorage.getItem("saveObg"));

    //TODO too complicated - find out solution
    getObg.__proto__ = ItemGroup.prototype;

    getObg.items.forEach(function (item) {
        item.__proto__ = Item.prototype;
        globalId = item.id;
    });

    return getObg;
}

var globalId = 0;

//TODO too complicated - find out solution
var itemGroup;

var saved = fetchFromStorage();
if(saved){
    itemGroup = saved;
}else{
    itemGroup = new ItemGroup();
}

window.onload = function(){
    updateHtml(itemGroup)
};
