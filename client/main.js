async function saveNote() {
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();
  if (!title || !content) return alert("Both title and content are required.");

  try {
    if (editingId) {
      await fetch(`http://localhost:4000/api/notes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
    } else {
      await fetch("http://localhost:4000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
    }

    closeEditor();
    await fetchNotes();
  } catch (err) {
    alert("Failed to save note.");
    console.error(err);
  }
}

async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;

  try {
    await fetch(`http://localhost:4000/api/notes/${id}`, {
      method: "DELETE"
    });
    await fetchNotes();
  } catch (err) {
    alert("Failed to delete note.");
    console.error(err);
  }
}
