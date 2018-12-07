const express = require('express');
const SearchController = require('../controllers/searchController');

const router = express.Router();

// search quiz questions
router.get('/questions', SearchController.searchQuestions);

// search all tags
router.get('/tags', SearchController.searchTags);

// search all quizzes
router.get('/quizzes', SearchController.searchQuizzes);


module.exports = router;
