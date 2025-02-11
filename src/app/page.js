"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useTodos from "@/hooks/todos";

export default function Home() {
  const {
    todos,
    localTodo,
    editingTodo,
    editingText,
    setLocalTodo,
    setEditingTodo,
    setEditingText,
    createTodo,
    updateTodo,
    deleteTodo,
    deleteAllTodos,
  } = useTodos();

  const memoizedTodos = useMemo(() => todos, [todos]);

  return (
    <main className="max-w-screen-2xl h-screen m-auto dark">
      <section className="w-full h-full py-10 flex flex-col justify-start items-center gap-6">
        <Input
          onInput={(e) => setLocalTodo(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              createTodo();
            }
          }}
          className="w-1/3"
          placeholder="Add your text here"
          value={localTodo}
        />
        <div className="flex gap-4">
          <Button onClick={createTodo}>Add Todo</Button>
          <Button onClick={deleteAllTodos} variant="destructive">
            Delete All
          </Button>
        </div>
        <Separator className="my-4" />
        {memoizedTodos.map((todo) => (
          <div
            className="p-4 flex justify-center items-center gap-4 border rounded"
            key={todo.$id}
          >
            {editingTodo === todo.$id ? (
              <Input
                value={editingText}
                onInput={(e) => setEditingText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    updateTodo(todo.$id, editingText);
                  }
                }}
                className="w-1/3"
              />
            ) : (
              <h3 className="text-xl">{todo.text}</h3>
            )}
            <Separator orientation="vertical" />
            {editingTodo === todo.$id ? (
              <Button
                onClick={() => updateTodo(todo.$id, editingText)}
                variant="secondary"
              >
                Save
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setEditingTodo(todo.$id);
                  setEditingText(todo.text);
                }}
                variant="secondary"
              >
                Edit
              </Button>
            )}
            <Button onClick={() => deleteTodo(todo.$id)} variant="destructive">
              Delete
            </Button>
          </div>
        ))}
      </section>
    </main>
  );
}
