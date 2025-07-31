// client/main.js

document.addEventListener("DOMContentLoaded", () => {
  const notesList = document.getElementById("notes-list");
  const createBtn = document.getElementById("create-note");

  const modal = document.getElementById("note-modal");
  const modalTitle = document.getElementById("modal-title");
  const noteTitleInput = document.getElementById("note-title");
  const noteContentInput = document.getElementById("note-content");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  let notes = [];
  let editingId = null;

  async function fetchNotes() {
    try {
      const res = await fetch("http://localhost:3000/api/notes");
      notes = await res.json();
      renderNotes();
    } catch (err) {
      alert("Failed to load notes from server.");
      console.error(err);
    }
  }

  function renderNotes() {
    notesList.innerHTML = "";
    notes.forEach(note => {
      const noteCard = document.createElement("div");
      noteCard.className = "bg-white p-4 rounded shadow";
      noteCard.innerHTML = `
        <h2 class="text-xl font-semibold">${note.title}</h2>
        <p class="text-gray-700">${note.content}</p>
        <div class="mt-2 space-x-2">
          <button class="edit-btn text-blue-500 hover:underline" data-id="${note.id}">Edit</button>
          <button class="delete-btn text-red-500 hover:underline" data-id="${note.id}">Delete</button>
        </div>
      `;
      notesList.appendChild(noteCard);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => openEditor(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteNote(parseInt(btn.dataset.id)));
    });
  }

  function openEditor(id = null) {
    if (id) {
      const note = notes.find(n => n.id === id);
      noteTitleInput.value = note.title;
      noteContentInput.value = note.content;
      modalTitle.textContent = "Edit Note";
      editingId = id;
    } else {
      noteTitleInput.value = "";
      noteContentInput.value = "";
      modalTitle.textContent = "New Note";
      editingId = null;
    }
    modal.classList.remove("hidden");
  }

  function closeEditor() {
    modal.classList.add("hidden");
  }

  async function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    if (!title || !content) return alert("Both title and content are required.");

    try {
      if (editingId) {
        await fetch(`http://localhost:3000/api/notes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content })
        });
      } else {
        await fetch("http://localhost:3000/api/notes", {
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
      await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: "DELETE"
      });
      await fetchNotes();
    } catch (err) {
      alert("Failed to delete note.");
      console.error(err);
    }
  }

  // Events
  createBtn.addEventListener("click", () => openEditor());
  cancelBtn.addEventListener("click", closeEditor);
  saveBtn.addEventListener("click", saveNote);

  fetchNotes(); // Load notes from backend on page load
});
