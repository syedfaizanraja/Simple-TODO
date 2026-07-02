import { useEffect, useMemo, useState } from "react";
import type { Todo } from "../types/todo";

const API_URL = "/api/todos";

export function useTodos(isAuthenticated: boolean) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setTodos([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const loadTodos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("todo_token");
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load todos");
        }

        const data = await response.json();

        if (isMounted) {
          setTodos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load todos");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTodos();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  const pendingCount = todos.length - completedCount;

  const addTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem("todo_token");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      if (!response.ok) {
        throw new Error("Unable to add todo");
      }

      const createdTodo = await response.json();
      setTodos((currentTodos) => [createdTodo, ...currentTodos]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo");
    }
  };

  const toggleTodo = async (id: string) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    try {
      const token = localStorage.getItem("todo_token");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });

      if (!response.ok) {
        throw new Error("Unable to update todo");
      }

      const updatedTodo = await response.json();
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  return {
    todos,
    completedCount,
    pendingCount,
    loading,
    error,
    addTodo,
    toggleTodo,
  };
}
