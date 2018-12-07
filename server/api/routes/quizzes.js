const express = require('express');
const upload = require('../imageUpload/quizImageMulter');
const checkAuth = require('../middleware/checkAuth');
const QuizzesController = require('../controllers/quizzesController');

const router = express.Router();

// GET all quizzes
router.get('/', QuizzesController.quizzesGetAll);

// GET all featured quizzes
router.get('/featured', QuizzesController.getAllFeaturedQuizzes);

// GET all personality quizzes
router.get('/personality-quizzes', QuizzesController.getAllPersonalityQuizzes);

// GET all user quizzes
router.post('/user-quizzes', QuizzesController.getAllUserQuizzes);

// remove Personality result
router.post('/remove-personality-result', QuizzesController.removePersonalityQuestionResult);

// GET quizzes by topic
router.post('/quizzes-by-topic', QuizzesController.getQuizzesByTopic);

// Add new personality result
router.post('/personality-question-results', checkAuth, QuizzesController.createPersonalityQuestionResult);

// Create new Quiz
router.post('/', checkAuth, upload.single('quizImage'), QuizzesController.createNewQuiz);

// Create new Quiz from API
router.post('/api', checkAuth, upload.single('quizImage'), QuizzesController.createNewQuizFromAPI);

// Retrieve individual quiz
router.get('/:quizId', QuizzesController.retrieveQuiz);

// Update quiz
router.patch('/:quizId', checkAuth, QuizzesController.updateQuiz);

// Update quiz analytics
router.patch('/analytics/:quizId', QuizzesController.updateQuizAnalytics);


// Delete quiz
router.delete('/:quizId', checkAuth, QuizzesController.deleteQuiz);

module.exports = router;
