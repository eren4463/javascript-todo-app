const StorageHelper = {
    getTodos: function() {
        return JSON.parse(localStorage.getItem('todos')) || [];
    },
    saveTodos: function(todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
};