import { useEffect, useState } from "react";
import { AuthPage } from "../features/auth";
import { TodoForm } from "../features/todos/components/TodoForm";
import { TodoList } from "../features/todos/components/TodoList";
import { useTodos } from "../features/todos/hooks/useTodos";
import "../App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    todos,
    completedCount,
    pendingCount,
    loading,
    error,
    addTodo,
    toggleTodo,
  } = useTodos(isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("todo_token");
    setIsAuthenticated(Boolean(token));
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <main className="app">
      <section className="todo-panel">
        <h1>Todo App</h1>
        <p>
          {completedCount} completed • {pendingCount} pending
        </p>
        {error ? <p role="alert">{error}</p> : null}
        <TodoForm onAdd={addTodo} />
        {loading ? (
          <p>Loading todos…</p>
        ) : (
          <TodoList todos={todos} onToggle={toggleTodo} />
        )}
      </section>
    </main>
  );
}

export default App;
