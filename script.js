let cards = document.querySelectorAll('.card');
let add_button = document.querySelector('.add__task_btn');
let add_input = document.querySelector('.add__task_input');
let areas = document.querySelectorAll('.js_area');
let warning = document.querySelector('.warning__text');
let del_button = document.querySelector('.delete_tasks');
let currentCard;
let empty_card = document.createElement('div');
let cell_titles = document.querySelectorAll('.cell_title');
let isCardInsert = false;
let currentArea;
empty_card.className = 'empty_card';
empty_card.innerHTML = 'Вставить сюда';
let data;
let card_title;

let input = document.createElement('input');

input.onblur = () => {
    data = input.value;
    input.remove();
    currentCard.prepend(card_title);
    card_title.innerHTML = data;
    Store.update();
};

class Store {
    static update() {
        localStorage.clear();

        for (let i = 0; i < areas.length; i++) {
            for (let j = 0; j < areas[i].children.length; j++) {
                let title = areas[i].children[j].children[0].innerHTML.trim();
                let area = areas[i].dataset.id;
                localStorage.setItem(String(i) + String(j), title + '<' + area);
            }
        }
    }
}

class UI {
    static render() {
        for (let i = 0; i < areas.length; i++) {
            areas[i].innerHTML = '';
        }

        for (let i = localStorage.length - 1; i >= 0; i--) {
            let key = localStorage.key(i);
            let data = localStorage.getItem(key);
            let cl = data.split('<')[1];
            let text = data.split('<')[0];

            const card = new Card({ text });

            document.querySelector(`.${cl}_area`).prepend(card.getCardNode());
        }
    }
}

class Warning {
    static open() {
        warning.classList.add('warning__show');
    }

    static close() {
        warning.classList.remove('warning__show');
    }
}

class Manager {
    static init() {
        empty_card.addEventListener('dragover', dragOver);
        empty_card.addEventListener('dragleave', CdragLeave);
        empty_card.addEventListener('drop', CdragDrop);

        del_button.addEventListener('click', Manager.deleteCards);

        window.addEventListener('keydown', e => {
            if (e.key === 'Enter' && document.activeElement === add_input) {
                Manager.addTask();
            }
        });

        add_button.addEventListener('click', Manager.addTask);

        areas.forEach(area => {
            area.addEventListener('dragenter', dragEnter);
            area.addEventListener('dragleave', dragLeave);
            area.addEventListener('dragover', dragOver);
            area.addEventListener('drop', dragDrop);
        });

        cell_titles.forEach(title => {
            title.addEventListener('dragenter', () => {
                title.parentNode.children[1].prepend(empty_card);
            });
        });

        UI.render();
    }

    static deleteCards() {
        areas[3].innerHTML = '';
        Store.update();
    }

    static addTask() {
        let text = add_input.value.trim();

        if (!text) {
            Warning.open();

            setTimeout(() => {
                Warning.close();
            }, 4000);

            return;
        }

        Warning.close();

        const card = new Card({ text });

        areas[0].prepend(card.getCardNode());

        add_input.value = '';

        Store.update();
    }
}

class Card {
    constructor({ text }) {
        this.text = text;

        this.card = this.createNode();
    }

    createNode() {
        const card = document.createElement('div');

        card.classList.add('card');
        card.setAttribute('draggable', 'true');
        card.insertAdjacentHTML(
            'beforeend',
            `
                <div class="card__title">
                    ${this.text}
                </div>
                <div class="card__correct_icon hide">
                    ✎
                </div>
                <div class="card__indicator backlog_ind"></div>
        `
        );

        card.addEventListener('dragstart', this.onDragStart);
        card.addEventListener('dragend', this.onDragEnd);
        card.addEventListener('dragenter', this.onDragEnter);

        card.addEventListener('mouseover', () => {
            card.querySelector('.card__correct_icon').classList.remove('hide');
        });

        card.addEventListener('mouseleave', () => {
            card.querySelector('.card__correct_icon').classList.add('hide');
        });

        card.querySelector('.card__correct_icon').addEventListener('click', this.onCorrect.bind(this));

        return card;
    }

    onDragStart() {
        setTimeout(() => {
            this.classList.add('hide');
        }, 0);

        currentCard = this;
    }

    onDragEnd() {
        this.classList.remove('hide');
        empty_card.remove();
        isCardInsert = false;
    }

    onCorrect() {
        card_title.remove();
        currentCard.prepend(input);
        input.value = this.text.trim();
        input.focus();
    }

    onDragEnter() {
        currentArea = this.parentNode;
        this.after(empty_card);
        isCardInsert = true;
    }

    remove() {
        this.card.remove();
    }

    getCardNode() {
        return this.card;
    }
}

function dragEnter() {
    if (!isCardInsert || currentArea !== this) {
        this.classList.add('dragEnter');
    }
}

function CdragDrop() {
    this.before(currentCard);
    currentCard.children[2].classList.remove(currentCard.children[2].classList[1]);
    currentCard.children[2].classList.add(`${this.parentNode.dataset.id}_ind`);
    empty_card.remove();
    Store.update();
}
function CdragLeave() {
    isCardInsert = false;
    empty_card.remove();
}

function dragLeave() {
    this.classList.remove('dragEnter');
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop() {
    if (!isCardInsert || currentArea !== this) {
        this.append(currentCard);
        this.classList.remove('dragEnter');
        currentCard.children[2].classList.remove(currentCard.children[2].classList[1]);
        currentCard.children[2].classList.add(`${this.dataset.id}_ind`);
        empty_card.remove();
        Store.update();
    }
}

Manager.init();
