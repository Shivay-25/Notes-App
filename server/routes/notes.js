// server/routes/notes.js
const express = require("express");
const router = express.Router();
const Note = require("../models/note");

// GET all notes
router.get("/", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

// POST new note
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Title and content are required." });

  const newNote = new Note({ title, content });
  await newNote.save();
  res.status(201).json(newNote);
});

// PUT update note
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  if (!note) return res.status(404).json({ error: "Note not found." });
  res.json(note);
});

// DELETE a note
router.delete("/:id", async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found." });
  res.json({ message: "Note deleted." });
});

module.exports = router;
