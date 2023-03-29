const listEl = document.getElementById("list")
const createEl = document.getElementById("create")
const taskSltEl = document.getElementById("selector")
const createPermEl = document.getElementById("perm-task")
const createTimedEl = document.getElementById("temp-task")
const timerEl = document.getElementById("timer");

let items = []

createEl.addEventListener("click", showTaskSelector)
createPermEl.addEventListener("click", createNewItem)
createTimedEl.addEventListener("click", createNewTimerItem)

function showTaskSelector() {
    taskSltEl.style.display = "flex"
}

function createNewItem() {
    const item = {
        id: new Date().getTime(),
        text: "",
        complete: false
    }

    items.unshift(item)

    const { item_el, input_el } = createItemElement(item)

    listEl.prepend(item_el)

    input_el.removeAttribute("disabled")
    input_el.focus()

    taskSltEl.style.display = "none"

    save()
}

function createItemElement(item) {
    const item_el = document.createElement("div")
    item_el.classList.add("item")

    const check_div = document.createElement("div")
    check_div.classList.add("check-div")

    const checkbox_el = document.createElement("input")
    checkbox_el.type = "checkbox"
    checkbox_el.classList.add("check")
    checkbox_el.checked = item.complete

    checkbox_el.addEventListener("click", () => {
        item_el.classList.add("complete")
        checkbox_el.classList.add("complete-check")
    })
    
    if (item.complete) {
        item_el.classList.add("complete")
    }

    const input_el = document.createElement("input")
    input_el.type = "text"
    input_el.value = item.text
    input_el.setAttribute("disabled", "")

    const action_el = document.createElement("div")
    action_el.classList.add("action")

    const edit_btn = document.createElement("button")
    edit_btn.classList.add("edit-btn")
    edit_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M180 876h44l443-443-44-44-443 443v44Zm614-486L666 262l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>`

    const remove_btn = document.createElement("button")
    remove_btn.classList.add("remove-btn")
    remove_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M480 976q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm0-60q142.375 0 241.188-98.812Q820 718.375 820 576q0-60.662-21-116.831Q778 403 740 357L261 836q45 39 101.493 59.5Q418.987 916 480 916ZM221 795l478-478q-46-39-102.169-60T480 236q-142.375 0-241.188 98.812Q140 433.625 140 576q0 61.013 22 117.506Q184 750 221 795Z"/></svg>`

    item_el.appendChild(check_div)

    check_div.appendChild(checkbox_el)

    item_el.appendChild(input_el)
    item_el.appendChild(action_el)

    action_el.appendChild(edit_btn)
    action_el.appendChild(remove_btn)

    // EVENTS

	checkbox_el.addEventListener("change", () => {
		item.complete = checkbox_el.checked;

		if (item.complete) {
			item_el.classList.add("complete");
		} else {
			item_el.classList.remove("complete");
		}

		save();
	});

	input_el.addEventListener("input", () => {
		item.text = input_el.value;
	});

	input_el.addEventListener("blur", () => {
		input_el.setAttribute("disabled", "");
		save();
	});

	edit_btn.addEventListener("click", () => {
        input_el.removeAttribute("disabled");
        input_el.focus();
    });
    
    remove_btn.addEventListener("click", () => {
        items = items.filter(t => t.id != item.id);
    
        item_el.remove();
    
        save();
    });
    
    return { item_el, input_el, edit_btn, remove_btn }
}

// New timer task creation
function createNewTimerItem() {
    const item = {
        id: new Date().getTime(),
        text: "",
        complete: false
    }

    items.unshift(item)

    const { item_el, input_el } = createTimerItemElement(item)

    listEl.prepend(item_el)

    input_el.removeAttribute("disabled")
    input_el.focus()

    taskSltEl.style.display = "none"

    startTimer()

    save()
}

function createTimerItemElement(item) {
    const item_el = document.createElement("div")
    item_el.classList.add("item")

    const check_div = document.createElement("div")
    check_div.classList.add("check-div")

    const checkbox_el = document.createElement("input")
    checkbox_el.type = "checkbox"
    checkbox_el.classList.add("check")
    checkbox_el.checked = item.complete

    checkbox_el.addEventListener("click", () => {
        item_el.classList.add("complete")
        checkbox_el.classList.add("complete-check")
    })
    
    if (item.complete) {
        item_el.classList.add("complete")
    }

    const input_el = document.createElement("input")
    input_el.type = "text"
    input_el.value = item.text
    input_el.setAttribute("disabled", "")

    const timer_el = document.createElement("div")
    timer_el.id = "timer"
    timer_el.innerHTML = "00:00:00"

    const action_el = document.createElement("div")
    action_el.classList.add("action")

    const edit_btn = document.createElement("button")
    edit_btn.classList.add("edit-btn")
    edit_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M180 876h44l443-443-44-44-443 443v44Zm614-486L666 262l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>`

    const remove_btn = document.createElement("button")
    remove_btn.classList.add("remove-btn")
    remove_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M480 976q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm0-60q142.375 0 241.188-98.812Q820 718.375 820 576q0-60.662-21-116.831Q778 403 740 357L261 836q45 39 101.493 59.5Q418.987 916 480 916ZM221 795l478-478q-46-39-102.169-60T480 236q-142.375 0-241.188 98.812Q140 433.625 140 576q0 61.013 22 117.506Q184 750 221 795Z"/></svg>`

    item_el.appendChild(check_div)

    check_div.appendChild(checkbox_el)

    item_el.appendChild(input_el)
    item_el.appendChild(timer_el)
    item_el.appendChild(action_el)

    action_el.appendChild(edit_btn)
    action_el.appendChild(remove_btn)

    // EVENTS

	checkbox_el.addEventListener("click", () => {
		item.complete = checkbox_el.checked;

		if (item.complete) {
			item_el.classList.add("complete");
            items = items.filter(t => t.id != item.id);
    
            item_el.remove();
    
            save();
		} else {
			item_el.classList.remove("complete");
		}

		save();
	});

	input_el.addEventListener("input", () => {
		item.text = input_el.value;
	});

	input_el.addEventListener("blur", () => {
		input_el.setAttribute("disabled", "");
		save();
	});

	edit_btn.addEventListener("click", () => {
        input_el.removeAttribute("disabled");
        input_el.focus();
    });
    
    remove_btn.addEventListener("click", () => {
        items = items.filter(t => t.id != item.id);
    
        item_el.remove();
    
        save();
        
    });
    startTimer(timer_el)
    
    return { item_el, input_el, edit_btn, remove_btn }
}

let totalSeconds = 180;
let timerInterval = null;

function startTimer(timer) {
  timerInterval = setInterval(() => {
    --totalSeconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = totalSeconds - hours * 3600 - minutes * 60;
    timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}


function displayTasks() {
    load()

    for (let i = 0; i < items.length; i++) {
        const item = items[i]

        const { item_el } = createItemElement(item)

        listEl.append(item_el)
    }
}

displayTasks()

function save() {
    const save = JSON.stringify(items)

    localStorage.setItem("my_tasks", save)   
}

function load() {
    const data = localStorage.getItem("my_tasks")

    if (data) {
        items = JSON.parse(data)
    }
}
