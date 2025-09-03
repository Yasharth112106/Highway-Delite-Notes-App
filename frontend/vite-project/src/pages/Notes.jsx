import React, { useEffect, useState } from "react";
import NoteItem from "../components/NoteItem";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
   
  };

  const handleAdd = async (e) => {

  };

  const handleDelete = async (id) => {
    
  };

  const handleLogout = () => {
   
  };

  return (
    <div className="container">
      <h2>Your Notes</h2>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="notes-list">
        {notes.map((note) => (
          <NoteItem key={note._id} note={note} onDelete={handleDelete} />
        ))}
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Notes;
