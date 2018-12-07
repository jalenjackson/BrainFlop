const express = require('express');
const upload = require('../imageUpload/quizImageMulter');
const checkAuth = require('../middleware/checkAuth');
const QuestionsController = require('../controllers/questionsController');

const router = express.Router();

// GET all questions
router.post('/get-quiz-questions', QuestionsController.getAllQuestions);

// GET all personality quiz questions
router.post('/get-personality-quiz-questions', QuestionsController.getPersonalityQuestions);

// Create new question
router.post('/', checkAuth, upload.single('questionImage'), QuestionsController.createNewQuestion);

// Create new personality question
router.post('/personality-question', upload.single('questionImage'), checkAuth, QuestionsController.createPersonalityQuestion);

// Retrieve individual question
router.get('/:questionId', QuestionsController.retrieveQuestion);

// Update question
router.patch('/:questionId', checkAuth, QuestionsController.updateQuestion);

// Delete question
router.delete('/:questionId', checkAuth, QuestionsController.deleteQuestion);

module.exports = router;
