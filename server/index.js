const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Load environment variables
const http = require('http');  // Required for WebSocket server
const { Server } = require('socket.io');  // Socket.IO for real-time communication

const Plant = require('./models/Plant');
const User = require('./models/User');
const Quiz = require('./models/quiz');

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app); // Create HTTP server for WebSocket
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, )
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));



    const nodemailer = require('nodemailer');

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service (e.g., Gmail, SendGrid)
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email (store in .env)
        pass: process.env.EMAIL_PASSWORD, // Replace with your email password or app-specific password (store in .env)
      },
    });
    
    // Function to send email
    const sendEmail = (to, roomUrl, appointmentDetails) => {
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to: to, // Professional's email
        subject: 'Video Call Appointment - Herbsphere', // Email subject
        text: `Dear Ayurvedic Professional,
    
    You have a video call appointment with the following details:
    
    User: ${appointmentDetails.userName}
    Time: ${appointmentDetails.time}
    
    Please join the call using this link:
    ${roomUrl}
    
    Thank you,
    Herbsphere Team`,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    };

    const axios = require('axios');

    const createDailyRoom = async () => {
      const DAILY_API_KEY = 'YOUR_DAILY_API_KEY';
      
      try {
        const response = await axios.post(
          'https://api.daily.co/v1/rooms',
          {
            properties: {
              enable_chat: true,
              enable_screenshare: true,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${DAILY_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
    
        return response.data.url;
      } catch (error) {
        console.error('Error creating Daily room:', error.response?.data || error.message);
        throw new Error('Failed to create Daily room');
      }
    };
    
// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Register User
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json("User already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json("Success");
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json("Registration failed");
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json("Incorrect username or password");
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user info
app.get('/api/userinfo', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ name: user.name, email: user.email });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update password
app.post('/api/change-password', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (user && await bcrypt.compare(oldPassword, user.password)) {
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.json("Password updated successfully");
        } else {
            res.status(400).json("Old password is incorrect");
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get All Plants
app.get('/api/plants', async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Plant.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Plants by Category
app.get('/api/plants/category/:categoryName', async (req, res) => {
    try {
        const { categoryName } = req.params;
        const plants = await Plant.find({ category: categoryName });
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Plant by ID
app.get('/api/plants/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const plant = await Plant.findById(id);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.json(plant);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Add a plant to favorites
app.post('/api/favorites/add', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json('User not found');

        // Check if the plant is already a favorite
        if (!user.favorites.includes(plantId)) {
            user.favorites.push(plantId);
            await user.save();
            res.json('Plant added to favorites');
        } else {
            res.json('Plant is already a favorite');
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal server error');
    }
});

// Remove a plant from favorites
app.post('/api/favorites/remove', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json('User not found');

        user.favorites = user.favorites.filter(id => id.toString() !== plantId);
        await user.save();
        res.json('Plant removed from favorites');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal server error');
    }
});

// Get user's favorite plants
app.get('/api/favorites', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        if (!user) return res.status(404).json('User not found');
        res.json(user.favorites);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal server error');
    }
});

// Toggle favorite status
app.post('/api/toggle-favorite', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.favorites.indexOf(plantId);
        if (index === -1) {
            // Add to favorites
            user.favorites.push(plantId);
        } else {
            // Remove from favorites
            user.favorites.splice(index, 1);
        }

        await user.save();
        res.json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Check if a plant is a favorite
app.post('/api/check-favorite', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isFavorite = user.favorites.includes(plantId);
        res.json({ isFavorite });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add plant to cart
app.post('/api/cart/add', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if plant is already in the cart
        if (!user.cart.includes(plantId)) {
            user.cart.push(plantId);
            await user.save();
            res.json({ message: 'Plant added to cart' });
        } else {
            res.json({ message: 'Plant already in cart' });
        }
    } catch (err) {
        console.error('Error adding plant to cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch cart items for user
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.cart);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove plant from cart
app.post('/api/cart/remove', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Remove plant from cart
        user.cart = user.cart.filter(id => id.toString() !== plantId);
        await user.save();

        res.json({ message: 'Plant removed from cart' });
    } catch (err) {
        console.error('Error removing plant from cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Add plant to cart
app.post('/api/orders/add', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if plant is already in the cart
        if (!user.orders.includes(plantId)) {
            user.orders.push(plantId);
            await user.save();
            res.json({ message: 'Plant added to cart' });
        } else {
            res.json({ message: 'Plant already in cart' });
        }
    } catch (err) {
        console.error('Error adding plant to cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch cart items for user
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('orders');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.orders);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// ✅ Fetch 5 easy, 3 medium, 2 hard questions
app.get("/api/quiz", async (req, res) => {
    try {
      const quizData = await Quiz.findOne();
      if (!quizData) return res.status(404).json({ success: false, message: "No quiz data found" });
  
      const { questions } = quizData;
  
      // Debugging: Check available questions for each difficulty
      const easyQs = questions.filter(q => q.difficulty === "easy");
      const mediumQs = questions.filter(q => q.difficulty === "moderate");
      const hardQs = questions.filter(q => q.difficulty === "hard");
  
      console.log("Available Easy Questions:", easyQs.length);
      console.log("Available Medium Questions:", mediumQs.length);
      console.log("Available Hard Questions:", hardQs.length);
  
      // Shuffle and pick required questions
      const selectedEasyQs = easyQs.sort(() => Math.random() - 0.5).slice(0, 5);
      const selectedMediumQs = mediumQs.sort(() => Math.random() - 0.5).slice(0, 3);
      const selectedHardQs = hardQs.sort(() => Math.random() - 0.5).slice(0, 2);
  
      const selectedQuestions = [...selectedEasyQs, ...selectedMediumQs, ...selectedHardQs];
  
      console.log("Total Questions Sent:", selectedQuestions.length);
  
      res.json({ success: true, questions: selectedQuestions });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  });
  



  app.post("/api/quiz/submit", authenticateToken, async (req, res) => {
    try {
        const { answers } = req.body;
        const userId = req.user.id; // Get userId from the authenticated token

        // Validate request
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: "Invalid request data" });
        }

        // Fetch the quiz document
        const quizData = await Quiz.findOne();
        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
            return res.status(404).json({ error: "No questions found in the document" });
        }

        let correctCount = 0;

        // Check each answer
        answers.forEach(({ questionId, selectedOption }) => {
            const question = quizData.questions.find(q => q.id === Number(questionId));
            if (question && question.correct_option === selectedOption) {
                correctCount++;
            }
        });

let coinsEarned=0;
        
        // Calculate coins earned (e.g., 10 coins per correct answer)
        if(correctCount==10){
            // Calculate coins earned (e.g., 10 coins per correct answer)
            coinsEarned = 10;}
    
            else{
                 coinsEarned=0;
            }

        // Update the user's coins in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.coins += coinsEarned;
        await user.save();

        // Return response
        res.json({
            userId,
            correctCount,
            totalQuestions: answers.length,
            score: `${correctCount}/${answers.length}`,
            coinsEarned,
            totalCoins: user.coins
        });

    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/*app.post('/api/schedule-consultation', async (req, res) => {
    try {
      const { userName, time, professionalEmail } = req.body;
  
      // Create a Daily.co room
      const roomUrl = await createDailyRoom();
  
      // Send email to the professional with the room URL
      sendEmail(professionalEmail, roomUrl, { userName, time });
  
      res.json({ message: 'Consultation scheduled and email sent successfully', roomUrl });
    } catch (err) {
      console.error('Error scheduling consultation:', err);
      res.status(500).json({ message: 'Failed to schedule consultation' });
    }
  });


  app.post('/api/schedule-consultation', async (req, res) => {
    const { userName, time, professionalEmail } = req.body;
  
    try {
      const roomUrl = await createDailyRoom();
  
      // Send email to the professional (skipping the implementation for now)
  
      res.status(200).json({
        message: 'Consultation scheduled successfully!',
        roomUrl,
      });
    } catch (error) {
      console.error('Error scheduling consultation:', error.message);
      res.status(500).json({ message: 'Failed to schedule consultation' });
    }
  });
  
*/

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
