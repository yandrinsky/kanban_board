let cards = document.querySelectorAll(".card");
let add_button = document.querySelector(".add__task_btn");
let add_input = document.querySelector(".add__task_input");
let areas = document.querySelectorAll(".js_area");
let warning = document.querySelector(".warning__text");
let del_button = document.querySelector(".delete_tasks");
let currentCard;
let empty_card = document.createElement("div");
let cell_titles = document.querySelectorAll(".cell_title");
let isCardInsert = false;
let currentArea;
empty_card.className = "empty_card";
empty_card.innerHTML = "Вставить сюда"
let data;
let input = document.createElement("input");
let card_title;

function updateStorage(){
    localStorage.clear();
    for(let i = 0; i < areas.length; i++){
        for(let j = 0; j < areas[i].children.length; j++){
            let title = areas[i].children[j].children[0].innerHTML.trim();
            let area = areas[i].dataset.id;
            localStorage.setItem(String(i) + String(j), title + "<" + area);
        }
    }
    console.log("upd")
}

function draw(){
    for(let i = 0; i < areas.length; i++){
        areas[i].innerHTML = "";
    }
    console.log("items: ", localStorage.length);
    for(let i = localStorage.length - 1; i >= 0; i--){
        let key = localStorage.key(i);
        let data = localStorage.getItem(key);
        let cl = data.split("<")[1];
        let title = data.split("<")[0];
        let html = `
            <div class="card" draggable="true">
                <div class="card__title">
                    ${title}
                </div>
                <div class="card__correct hide">
                    ✎
                </div>
                 <div class="card__indicator ${cl}_ind"></div>
            </div>
        `
        document.querySelector(`.${cl}_area`).insertAdjacentHTML("afterbegin", html);
        setCardsLst(document.querySelector(`.${cl}_area`).children[0]);
    }
}

input.onblur = ()=>{
    data = input.value;
    input.remove();
    currentCard.prepend(card_title);
    card_title.innerHTML = data;
    updateStorage();
}

function correctCard(){
    currentCard = this.parentNode;
    card_title = currentCard.children[0]
    data = card_title.innerHTML;
    console.log(data);
    card_title.remove();
    currentCard.prepend(input);
    input.value = data.trim();
    input.focus();
}

function setCardCorrectLst(card){
    card.addEventListener("mouseover", ()=>{
        //console.log(card.children)
        card.children[1].classList.remove("hide")
    })
    card.addEventListener("mouseleave", ()=>{
        card.children[1].classList.add("hide")
    })
    card.children[1].addEventListener("click", correctCard);
}


function dragStart(){
    setTimeout(()=>{
        this.classList.add("hide");
    }, 0)
    currentCard = this;
}

function dragEnd(){
    this.classList.remove("hide");
    empty_card.remove();
    isCardInsert = false;
}
function dragEnter(){
    if(!isCardInsert || currentArea !== this){
        this.classList.add("dragEnter");
    }

}
function CdragEnter(){
    currentArea = this.parentNode;
    this.after(empty_card);
    isCardInsert = true;
}

function CdragDrop(){
    this.before(currentCard);
    currentCard.children[2].classList.remove(currentCard.children[2].classList[1])
    currentCard.children[2].classList.add(`${this.parentNode.dataset.id}_ind`);
    empty_card.remove();
    updateStorage()
}
function CdragLeave(){
    isCardInsert = false;
    empty_card.remove();
}


function dragLeave(){
    this.classList.remove("dragEnter");
}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    if(!isCardInsert || currentArea !== this){
        this.append(currentCard);
        this.classList.remove("dragEnter");
        currentCard.children[2].classList.remove(currentCard.children[2].classList[1])
        currentCard.children[2].classList.add(`${this.dataset.id}_ind`);
        empty_card.remove();
        updateStorage()
    }

}

function setCardsLst(card){
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
    card.addEventListener("dragenter", CdragEnter);
    setCardCorrectLst(card);
}

function deleteCards(){
    areas[3].innerHTML = "";
    updateStorage()
}
function addTask(){
    let task = add_input.value;
    if(task !== ""){
        warning.classList.remove("warning__show");
        let html = `
            <div class="card" draggable="true">
                <div class="card__title">
                    ${task}
                </div>
                <div class="card__correct hide">
                    ✎
                </div>
                 <div class="card__indicator backlog_ind"></div>
            </div>
        `
        areas[0].insertAdjacentHTML("afterbegin", html);
        add_input.value = "";
        setCardsLst(areas[0].children[0])
        updateStorage();
    } else {
        warning.classList.add("warning__show");
        setTimeout(()=>{
            warning.classList.remove("warning__show");
        }, 4000)
    }
}
add_button.addEventListener("click", ()=>{
    addTask()
})

areas.forEach(area=> {
    area.addEventListener("dragenter", dragEnter);
    area.addEventListener("dragleave", dragLeave);
    area.addEventListener("dragover", dragOver);
    area.addEventListener("drop", dragDrop);
})

cell_titles.forEach(title => {
    title.addEventListener("dragenter", ()=>{
        title.parentNode.children[1].prepend(empty_card)
    })
})

del_button.addEventListener("click", deleteCards);

window.addEventListener("keydown", e => {
    if(e.key === "Enter" && document.activeElement === add_input){
        addTask()
    }
})

empty_card.addEventListener("dragover", dragOver);
empty_card.addEventListener("dragleave", CdragLeave)
empty_card.addEventListener("drop", CdragDrop);
draw();