
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Mongoose model definition-
const NoteSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  answer: { type: String, required: true },
  user_id: { type: String, required: false },
  color: { type: String, default: "#000000" },
  // imageLink: { type: String, required: false, default: null },
  imageLink: { 
    type: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String, required: true }
      }
    ], 
    required: false, 
    default: [] 
  },
  socialUrl: {
      type: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          url: { type: String, required: true }
        }
      ],
      required: false,
      default: []
    }
}, { timestamps: true });

const ticketSchema = new mongoose.Schema(
  {
    issueNumber: {
      type: String,
      required: true,
      unique: true, // ISS-1023 should be unique
      trim: true
    },

    reporterId:  { type: String, required: true },
    reportName: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type : String,
      enum: ['Completed', 'Pending'],
      default: 'Pending'
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ['Bug', 'Feature'],
      required: true
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);

const ticket = mongoose.model('Tickets', ticketSchema);

const Note = mongoose.model("Note", NoteSchema);

// Create a new note
router.post("/", async (req, res) => {
  try {
    const note = new Note(req.body);
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single note by ID
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Note.find({ user_id: id });
    res.status(200).json(data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a note by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: Update a note by ID (if you want it)
router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// TICKET ROUTES
// ==========================

// Create new ticket
router.post("/tickets", async (req, res) => {
  try {
    const newTicket = new ticket(req.body);
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all tickets
router.get("/tickets", async (req, res) => {
  try {
    const tickets = await ticket.find().populate("reporterId");
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single ticket by ID
router.get("/tickets/:id", async (req, res) => {
  try {
    const singleTicket = await ticket.findById(req.params.id).populate("reporterId");
    if (!singleTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(singleTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete ticket by ID
router.delete("/tickets/:id", async (req, res) => {
  try {
    const deletedTicket = await ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update ticket by ID
router.put("/tickets/:id", async (req, res) => {
  try {
    const updatedTicket = await ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(updatedTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
