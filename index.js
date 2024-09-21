document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    fetchTasks(); 
});

//Funcao para habilitar Botao "Terminar Dia", recebe uma lista de tasks
function updateEndDayButtonState(tasks) {
    const endDayButton = document.getElementById('end-day-button');    
    //Confirma se existem tasks
    if (tasks.length > 0) {
        //Habilita botao de terminar dia  
        endDayButton.disabled = false;
    } else {
        //Desabilita o botao de terminar dia 
        endDayButton.disabled = true;
    }
}

//Acessa banco de dados e seleciona tasks existentes
function fetchTasks() {
    console.log('Fetching tasks...');
    fetch('http://127.0.0.1:5000/tasks')
    .then(response => response.json())
    .then(tasks => {
        const listDisplay = document.getElementById('task-lists');
        listDisplay.innerHTML = ''; // Clear previous tasks
        const taskList = document.createElement('ul');

        tasks.forEach(task => {
            const listItem = createTaskListItem(task); // Create task list item
            taskList.appendChild(listItem); // Append to the list
        });

        listDisplay.appendChild(taskList);
        //Faz call da funcao para atualizar botao
        updateEndDayButtonState(tasks); // Update button state if needed
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
}

//Cria cards para as tarefas
function createTaskListItem(task) {
    const listItem = document.createElement('li');
    
    //Cria checkbox para funcao de dar tarefa como feita
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed; //Baseado se a tarefa esta completa ou nao vai atualizar checkbox
    checkbox.dataset.taskId = task.id;

    //Adiciona EventListener para mudanca de cor no texto caso tarefa esteja completa
    checkbox.addEventListener('change', function() {

        const li = this.closest('li');
        if (this.checked) {
            li.style.textDecoration = 'line-through';
            li.style.color = '#78CFB0';
        } else {
            li.style.textDecoration = 'none'; // Remove strikethrough
        }

        //Atualiza se tarefa esta completa 
        updateTaskCompletion(task.id, this.checked);
    });

    //Criar texto para li de tarefas
    const taskText = document.createElement('span');
    taskText.textContent = `${task.title}: ${task.description}`;

    //Appen text and checkbox na lista
    listItem.appendChild(taskText);
    listItem.appendChild(checkbox);

    //Se task esta completa, muda cores e escrita
    if (task.completed) {
        listItem.style.textDecoration = 'line-through';
        listItem.style.color = '#78CFB0';
    }

    return listItem;
}
//                                                                            ^ ^ ^ ^
//Atualiza se task esta completa ou nao, chamada no eventlistener do checkbox | | | |(a cima)
function updateTaskCompletion(taskId, completed) {

    console.log('Updating task completion for task ID:', taskId);
    console.log('Completed status:', completed);
    fetch(`http://127.0.0.1:5000/update/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: completed })  // Envia apenas o campo completed no body
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);  // Log de mensagem positiva de atualização
    })
    .catch(error => {
        console.error('Error updating task:', error);
    });
}

//Funcao para criar task
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    fetch('http://127.0.0.1:5000/insert', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Reload the list of tasks after adding the new one
        fetchTasks();
    })
    .catch(error => console.error('Error:', error));

    const titleReset = document.getElementById('title').value = "";
    const descReset = document.getElementById('description').value = "";
});

//Funcao que limpa tarefas feitas
document.getElementById('end-day-button').addEventListener('click', function() {

    fetch('http://127.0.0.1:5000/end-day', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Optionally refresh the task list
        //fetchTasks();
    })
    .catch(error => console.error('Error:', error));
});

function print(){
    console.log("Oi estou conectado com o js file")
};

fetchTasks();

print();