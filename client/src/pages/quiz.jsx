import { useState, useEffect } from "react";
import axios from "axios";
import "./quiz.css"; // Import the updated CSS file

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Initialize as null

  useEffect(() => {
    // Fetch the userId from the authentication token
    const token = localStorage.getItem("token");
    if (token) {
      // Decode the token to get the userId
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
      setUserId(decodedToken.id); // Set userId from the token
      fetchQuiz();
    } else {
      // Redirect to login if the token is not available
      window.location.href = "/login"; // Replace with your login route
    }
  }, []);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/quiz", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Questions:", res.data.questions);
      if (res.data && Array.isArray(res.data.questions)) {
        setQuestions(res.data.questions);
      } else {
        console.error("Invalid quiz data received");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, selectedOption) => {
    console.log(`Answer selected for question ${questionId}: Option ${selectedOption}`);
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: selectedOption,
      }));

      setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    }
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id],
    }));

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/quiz/submit",
        { userId, answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response:", res.data);

      setScore(res.data.correctCount);
      setCoins(res.data.coinsEarned || 0);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return <p className="loading">Loading questions...</p>;
  }

  return (
    <div className="quiz-container">
      <h2>Ayurvedic Quiz</h2>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      {questions.length === 0 ? (
        <p className="loading">No questions available.</p>
      ) : submitted ? (
        <div className="result">
          <h3>Your Score: {score}/{questions.length}</h3>
          {coins > 0 ? <p>🎉 You earned {coins} coins! 🎉</p> : <p>Try again to win coins!</p>}
        </div>
      ) : (
        <div className="question">
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
          <p>{questions[currentQuestionIndex]?.question}</p>
          <div className="options">
            {questions[currentQuestionIndex]?.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(questions[currentQuestionIndex].id, i + 1)}
                className={`option-btn ${answers[questions[currentQuestionIndex].id] === i + 1 ? "selected" : ""}`}
                disabled={submitted}
              >
                {option}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 && (
            <button onClick={submitQuiz} className="submit-btn">
              Submit Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;