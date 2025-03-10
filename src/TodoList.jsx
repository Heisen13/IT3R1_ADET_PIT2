import { useState, useEffect } from "react";
import "./App.css"; // Ensure this contains styles for dark mode

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false, editing: false }]);
    setTask("");
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEditing = (index) => {
    setTasks(
      tasks.map((t, i) => (i === index ? { ...t, editing: true } : t))
    );
  };

  const saveEdit = (index, newText) => {
    if (newText.trim() === "") return;
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, text: newText, editing: false } : t
      )
    );
  };

  const getFilteredTasks = () => {
    if (filter === "completed") return tasks.filter((t) => t.completed);
    if (filter === "pending") return tasks.filter((t) => !t.completed);
    return tasks;
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>To-Do List</h1>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>

      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <ul>
        {getFilteredTasks().map((t, index) => (
          <li key={index} className={t.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleComplete(index)}
            />
            {t.editing ? (
              <>
                <input
                  type="text"
                  defaultValue={t.text}
                  onBlur={(e) => saveEdit(index, e.target.value)}
                  autoFocus
                />
                <button onClick={() => saveEdit(index, t.text)}>💾 Save</button>
              </>
            ) : (
              <>
                <span>{t.text}</span>
                <button onClick={() => startEditing(index)}>✏️ Edit</button>
                <button onClick={() => removeTask(index)}>❌ Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}