const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // ID inside the array
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  correct_option: { type: Number, required: true }, // Option index
  difficulty: { type: String, enum: ["easy", "medium", "difficult"], required: true },
});

const quizSchema = new mongoose.Schema({
  questions: [questionSchema], // Array of questions inside one document
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
