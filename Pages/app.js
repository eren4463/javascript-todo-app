const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = StorageHelper.getTodos();
let currentFilter = 'all'; 

renderTodos();

// EKLEME İŞLEMİ
addBtn.addEventListener('click', function() {
    const text = taskInput.value.trim();
    
    if (text === "") {
        Swal.fire('Hata!', 'Lütfen boş bir görev girmeyin.', 'warning');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    StorageHelper.saveTodos(todos);
    taskInput.value = '';
    
    Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: 'Görev eklendi', showConfirmButton: false, timer: 1500
    });

    renderTodos();
});

// LİSTELEME VE FİLTRELEME 
function renderTodos() {
    taskList.innerHTML = ""; 
    
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(function(t) { return !t.completed; });
    }
    if (currentFilter === 'completed') {
        filteredTodos = todos.filter(function(t) { return t.completed; });
    }

    if (filteredTodos.length === 0) {
        const messageItem = document.createElement('li');
        messageItem.className = "list-group-item text-center text-muted";
        messageItem.innerText = "Bu listede görev bulunamadı.";
        taskList.appendChild(messageItem);
        return;
    }

    
    for (let i = 0; i < filteredTodos.length; i++) {
        const todo = filteredTodos[i];
        
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center"; 

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input me-2";
        checkbox.checked = todo.completed;
        checkbox.onchange = function() { toggleStatus(todo.id); };

        const textSpan = document.createElement('span');
        textSpan.innerText = todo.text;
        // Tamamlandıysa üstünü çiz
        if (todo.completed) {
            textSpan.style.textDecoration = "line-through";
            textSpan.style.color = "gray";
        }

        const editBtn = document.createElement('button');
        editBtn.innerText = "Düzenle"; // İkon yerine düz yazı
        editBtn.className = "btn btn-warning btn-sm mx-2";
        editBtn.onclick = function() { updateTodo(todo.id, todo.text); };

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = "Sil"; // İkon yerine düz yazı
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.onclick = function() { deleteTodo(todo.id); };

      
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }
}

// DURUM DEĞİŞTİRME
function toggleStatus(id) {
    const todo = todos.find(function(t) { return t.id === id; });
    todo.completed = !todo.completed;
    StorageHelper.saveTodos(todos);
    renderTodos();
}

// GÜNCELLEME
function updateTodo(id, oldText) {
    Swal.fire({
        title: 'Görevi Güncelle',
        input: 'text',
        inputValue: oldText,
        showCancelButton: true,
        confirmButtonText: 'Kaydet',
        cancelButtonText: 'İptal'
    }).then(function(result) {
        if (result.isConfirmed && result.value.trim() !== '') {
            const todo = todos.find(function(t) { return t.id === id; });
            todo.text = result.value.trim();
            StorageHelper.saveTodos(todos);
            renderTodos();
        }
    });
}

// SİLME
function deleteTodo(id) {
    Swal.fire({
        title: 'Emin misiniz?',
        text: "Silmek istediğinize emin misiniz?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonText: 'Vazgeç',
        confirmButtonText: 'Evet, Sil'
    }).then(function(result) {
        if (result.isConfirmed) {
            todos = todos.filter(function(t) { return t.id !== id; });
            StorageHelper.saveTodos(todos);
            renderTodos();
        }
    });
}

// FİLTRELEME
for (let i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener('click', function(e) {
        for (let j = 0; j < filterBtns.length; j++) {
            filterBtns[j].classList.remove('active');
        }
        this.classList.add('active'); 
        currentFilter = this.getAttribute('data-filter');
        renderTodos();
    });
}