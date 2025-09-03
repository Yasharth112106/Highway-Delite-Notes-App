import React from "react";

function NoteItem({ note, onDelete }) {
  return (
    <div className="note-item">
      <p>{note.text}</p>
      <button onClick={() => onDelete(note._id)}>Delete</button>
    </div>
  );
}

export default NoteItem;
