import { Router, type Request, type Response } from "express";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const router = Router();

const todos: TodoItem[] = [];

router.get("/", (_req, res) => {
  res.json(todos);
});

router.post("/", (req: Request, res: Response) => {
  const title = req.body?.title?.trim();

  if (!title) {
    res.status(400).json({ message: "Title is required" });
    return;
  }

  const todo: TodoItem = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.unshift(todo);
  res.status(201).json(todo);
});

router.patch("/:id", (req: Request, res: Response) => {
  const todo = todos.find((item) => item.id === req.params.id);

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  todo.completed =
    typeof req.body?.completed === "boolean"
      ? req.body.completed
      : !todo.completed;

  res.json(todo);
});
