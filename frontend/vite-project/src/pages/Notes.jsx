import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

function Notes({ token }) {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");

  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]); // fallback if error object
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  // Add Note
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      setContent("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Delete Note
  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note._id}
            className="flex justify-between items-center border p-2 rounded shadow-sm"
          >
            <span>{note.text}</span> {/* fixed from note.content */}
            <button
              onClick={() => handleDelete(note._id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
