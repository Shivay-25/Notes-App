const notesList = document.getElementById("notes-list");
const noteModal = document.getElementById("note-modal");
const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const createNoteBtn = document.getElementById("create-note");

let editingId = null;

function openEditor(note = null) {
  noteModal.classList.remove("hidden");
  if (note) {
    editingId = note._id;
    document.getElementById("modal-title").textContent = "Edit Note";
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
  } else {
    editingId = null;
    document.getElementById("modal-title").textContent = "New Note";
    noteTitleInput.value = "";
    noteContentInput.value = "";
  }
}

function closeEditor() {
  noteModal.classList.add("hidden");
  noteTitleInput.value = "";
  noteContentInput.value = "";
  editingId = null;
}

async function fetchNotes() {
  try {
    const res = await fetch("http://localhost:4000/api/notes");
    const notes = await res.json();

    notesList.innerHTML = "";
    notes.forEach(note => {
      const div = document.createElement("div");
      div.className =
        "bg-white p-4 rounded-lg shadow flex justify-between items-start";
      div.innerHTML = `
        <div>
          <h3 class="text-lg font-bold">${note.title}</h3>
          <p class="text-gray-600 whitespace-pre-line">${note.content}</p>
        </div>
        <div class="space-x-2">
          <button class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" onclick="openEditor(${JSON.stringify(
            note
          )})">Edit</button>
          <button class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onclick="deleteNote('${
            note._id
          }')">Delete</button>
        </div>
      `;
      notesList.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    notesList.innerHTML = "<p class='text-red-500'>Failed to load notes.</p>";
  }
}

async function saveNote() {
  console.log("🚀 saveNote function started");

  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (!title || !content) {
    alert("Both title and content are required.");
    return;
  }

  console.log("📌 Sending to backend:", { title, content });

  try {
    let res;
    if (editingId) {
      res = await fetch(`http://localhost:4000/api/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
    } else {
      res = await fetch("http://localhost:4000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
    }

    console.log("📩 Backend response:", res.status);

    if (!res.ok) throw new Error("Server error");

    closeEditor();
    await fetchNotes();
  } catch (err) {
    alert("Failed to save note.");
    console.error("❌ Error saving note:", err);
  }
}

async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;

  try {
    await fetch(`http://localhost:4000/api/notes`, {
      method: "DELETE"
    });
    await fetchNotes();
  } catch (err) {
    alert("Failed to delete note.");
    console.error(err);
  }
}

createNoteBtn.addEventListener("click", () => openEditor());
cancelBtn.addEventListener("click", closeEditor);
saveBtn.addEventListener("click", saveNote);

fetchNotes();