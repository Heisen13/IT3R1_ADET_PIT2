import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Fetch tasks from Django backend
  useEffect(() => {
    axios.get(API_URL)
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // Handle theme change
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Add a new task
  const addTask = () => {
    if (task.trim() === "") return;

    axios.post(API_URL, { title: task, completed: false })
      .then(response => setTasks([...tasks, response.data]))
      .catch(error => console.error("Error adding task:", error));

    setTask("");
  };

  // Delete a task
  const removeTask = (id) => {
    axios.delete(`${API_URL}${id}/`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.error("Error deleting task:", error));
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    axios.patch(`${API_URL}${id}/`, { completed: !task.completed })
      .then(() => {
        setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
      })
      .catch(error => console.error("Error updating task:", error));
  };

  // Start editing a task
  const startEditing = (id) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, editing: true } : t)));
  };

  // Save edited task
  const saveEdit = (id, newText) => {
    if (newText.trim() === "") return;

    axios.put(`${API_URL}${id}/`, { title: newText, completed: tasks.find(t => t.id === id).completed })
      .then(response => {
        setTasks(tasks.map(t =>
          t.id === id ? { ...t, title: response.data.title, editing: false } : t
        ));
      })
      .catch(error => console.error("Error updating task:", error));
  };

  // Filter tasks
  const getFilteredTasks = () => {
    if (filter === "completed") return tasks.filter(t => t.completed);
    if (filter === "pending") return tasks.filter(t => !t.completed);
    return tasks;
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>To-Do List</h1>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Add Task Input */}
      <div className="task-input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Filter Buttons */}
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* Task List */}
      <ul>
        {getFilteredTasks().map((t) => (
          <li key={t.id} className={t.completed ? "completed" : ""}>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={t.completed}
              onChange={() => toggleComplete(t.id)}
            />
            {t.editing ? (
              <>
                <input
                  type="text"
                  value={t.title}  // Track input changes
                  onChange={(e) => setTasks(tasks.map(task => 
                    task.id === t.id ? { ...task, title: e.target.value } : task
                  ))}
                  onBlur={() => saveEdit(t.id, t.title)} // Save on blur
                  autoFocus
                />
                <button onClick={() => saveEdit(t.id, t.title)}>💾 Save</button>
              </>
            ) : (
              <>
                <span className="task-text">{t.title}</span>
                <button onClick={() => startEditing(t.id)}>✏️ Edit</button>
                <button onClick={() => removeTask(t.id)}>❌ Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
