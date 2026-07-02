import type { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <li className={`todo-item${todo.completed ? " completed" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span>{todo.title}</span>
      </label>
    </li>
  );
}
