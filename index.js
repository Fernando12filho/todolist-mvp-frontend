document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents page reload
    fetchTasks(); // Call your function here
});

function updateEndDayButtonState(tasks) {
    const endDayButton = document.getElementById('end-day-button');    
    // Check if there are any tasks at all
    if (tasks.length > 0) {
        // Enable the button if there are tasks
        endDayButton.disabled = false;
    } else {
        // Disable the button if there are no tasks
        endDayButton.disabled = true;
    }
}

/*
function fetchTasks() {
    console.log('Inside fetchTasks')
    fetch('http://127.0.0.1:5000/tasks')
    .then(response => response.json())
    .then(tasks => {
        const listDisplay = document.getElementById('task-lists')
        const taskList = document.createElement('ul');
        
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            
            // Create the checkbox input element
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed; // Set checkbox based on task's completion status
            checkbox.dataset.taskId = task.id;
            checkbox.addEventListener('change', function(){
                const li = this.closest('li');
                if(this.checked){
                    li.style.textDecoration = "line-through";
                    li.style.color = "#78CFB0"
                } else {
                    li.style.backgroundColor = "#f9f9f9";
                }
            })

            // Create a label associated with the checkbox
            const label = document.createElement('label');
            label.setAttribute('for', checkbox.id);

            checkbox.addEventListener('change', function() {
                const completed = this.checked;
                const taskId = this.dataset.taskId;

                 // Log taskId to ensure it is correctly set
                console.log('Checkbox clicked for task ID:', taskId);

                fetch(`http://127.0.0.1:5000/update/${taskId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed: completed })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data.message);
                    // Optionally handle success or update the UI
                })
                .catch(error => console.error('Error:', error));
            });
            //checkbox.disabled = true; // Make the checkbox read-only; remove this line if you want to allow user interaction

            // Add a label or text for the list item
            const taskText = document.createElement('span');
            taskText.textContent = `${task.title}: ${task.description}  `;

            // Append the text and checkbox to the list item
            listItem.appendChild(taskText);
            listItem.appendChild(checkbox);

            // Append the list item to the task list
            taskList.appendChild(listItem);
        });

        listDisplay.appendChild(taskList)

        updateEndDayButtonState(tasks)
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });

}
*/

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
        updateEndDayButtonState(tasks); // Update button state if needed
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
}

function createTaskListItem(task) {
    const listItem = document.createElement('li');
    
    // Create the checkbox input element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed; // Set checkbox based on task's completion status
    checkbox.dataset.taskId = task.id;

    // Add event listener to handle checkbox changes
    checkbox.addEventListener('change', function() {

        const li = this.closest('li');
        if (this.checked) {
            li.style.textDecoration = 'line-through';
            li.style.color = '#78CFB0';
        } else {
            li.style.textDecoration = 'none'; // Remove strikethrough
        }

        // Update task completion status on the server
        updateTaskCompletion(task.id, this.checked);
    });

    // Create a label or text for the list item
    const taskText = document.createElement('span');
    taskText.textContent = `${task.title}: ${task.description}`;

    // Append the text and checkbox to the list item
    listItem.appendChild(taskText);
    listItem.appendChild(checkbox);

    // Set initial styles based on task completion status
    if (task.completed) {
        listItem.style.textDecoration = 'line-through';
        listItem.style.color = '#78CFB0';
    }

    return listItem; // Return the fully constructed list item
}

function updateTaskCompletion(taskId, completed) {
    console.log('Updating task completion for task ID:', taskId);

    fetch(`http://127.0.0.1:5000/update/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: completed })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error updating task:', error);
    });
}

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
});

document.getElementById('end-day-button').addEventListener('click', function() {
    fetch('http://127.0.0.1:5000/end-day', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Optionally refresh the task list
        fetchTasks();
    })
    .catch(error => console.error('Error:', error));
});

function print(){
    console.log("Oi estou conectado com o js file")
};

fetchTasks();

print();