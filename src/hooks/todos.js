import { useState, useCallback, useEffect } from "react";
import { databases, ID } from "@/appwrite/todos";
import conf from "@/config/config";

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [localTodo, setLocalTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState("");

  const listTodos = useCallback(async () => {
    const response = await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId
    );
    setTodos(response.documents);
  }, []);

  useEffect(() => {
    listTodos();
  }, [listTodos]);

  const createTodo = useCallback(async () => {
    if (!localTodo.trim()) return;
    await databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      { text: localTodo }
    );
    setLocalTodo("");
    listTodos();
  }, [localTodo, listTodos]);

  const updateTodo = useCallback(
    async (id, text) => {
      if (!text.trim()) return;
      await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id,
        { text }
      );
      setEditingTodo(null);
      setEditingText("");
      listTodos();
    },
    [listTodos]
  );

  const deleteTodo = useCallback(
    async (id) => {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id
      );
      listTodos();
    },
    [listTodos]
  );

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
  }, [listTodos]);

  return {
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
  };
};

export default useTodos;
