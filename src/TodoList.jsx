import { useState } from "react";
export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");

    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };
    const addTask = () => {
        if (task.trim() === "") return;
        setTasks([...tasks, task]);
        setTask("");
    };
return (
    <div>
        <h2> To-Do List</h2>
        <input
        type="text"
        placeholder="Add a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
    />
    <button onClick={addTask}>Add Task</button>
    <ul>
        {tasks.map((t, index) => (
        <li key={index} onClick={() => removeTask(index)}>
        {t}
        </li>
        ))}
    </ul>
    </div>
    );
}