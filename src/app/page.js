"use client";
import { databases, ID } from "@/appwrite/todos";
import { useState, useEffect, useCallback } from "react";
import conf from "@/config/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [localTodo, setLocalTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState(""); // New state for editing text

  useEffect(() => {
    listTodos();
  }, []);

  const listTodos = async () => {
    const response = await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId
    );
    setTodos(response.documents);
  };

  const createTodo = useCallback(async () => {
    await databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      { text: localTodo }
    );
    listTodos();
    setLocalTodo("");
  }, [localTodo]);

  const updateTodo = useCallback(async (id, text) => {
    await databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id,
      { text }
    );
    listTodos();
    setEditingTodo(null); // Clear the editing state
    setEditingText(""); // Clear the editing text state
  }, []);

  const deleteTodo = useCallback(async (id) => {
    await databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id
    );
    listTodos();
  }, []);

  const deleteAllTodos = useCallback(async () => {
    const response = await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId
    );
    const deletePromises = response.documents.map((todo) =>
      databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        todo.$id
      )
    );
    await Promise.all(deletePromises);
    listTodos();
  }, []);

  return (
    <main className="max-w-screen-2xl h-screen m-auto dark">
      <section className="w-full h-full py-10 flex flex-col justify-start items-center gap-6">
        <Input
          onInput={(e) => {
            setLocalTodo(e.target.value);
          }}
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
        {todos.map((todo) => (
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
                  setEditingText(todo.text); // Set the editing text state
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
