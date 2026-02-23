const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// ==========================
// TICKET SCHEMA
// ==========================
const ticketSchema = new mongoose.Schema(
  {
    issueNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    reporterId: { type: String, required: true },
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
      type: String,
      enum: ["Completed", "Pending"],
      default: "Pending"
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Bug", "Feature"],
      required: true
    }
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

// ==========================
// ROUTES
// ==========================

// Create Ticket
router.post("/", async (req, res) => {
  try {
    const newTicket = new Ticket(req.body);
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Ticket By ID
router.get("/:id", async (req, res) => {
  try {
    // const ticket = await Ticket.findById(req.params.id);
    const tickets = await Ticket.find({ reporterId: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Ticket
router.put("/:id", async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
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

// Delete Ticket
router.delete("/:id", async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tickets by Reporter ID
router.get("/user/:id", async (req, res) => {
  try {
    const tickets = await Ticket.find({ reporterId: req.params.id });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
