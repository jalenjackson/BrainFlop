const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

routes
  .add('category', '/category/:slug')
  .add('quiz', '/quiz/:quizName/:quizId')
  .add('singlePlayerAnswerChoiceQuizGame', '/single-player/answer-choice/:quizName/:quizId')
  .add('inviteAFriendAnswerChoiceQuizGame', '/invite-friend/answer-choice/:quizName/:quizId/:userId')
  .add('login', '/login')
  .add('profile', '/profile')
  .add('personalityQuizGame', '/personality-quiz/:quizName/:quizId')
  .add('onlineAnswerChoiceQuizGame', '/online/answer-choice/:quizName/:quizId')
  .add('createAQuiz', '/create-quiz')
  .add('categories', '/categories')
  .add('customizeExperience', '/customize-experience')
  .add('editQuiz', '/create-quiz/:quizId')
  .add('Search', '/search/:searchQuery')
  .add('viewProfile', '/profile/:name/:id')
  .add('personalityQuizzes', '/personality-quizzes')
  .add('Register', '/register')
  .add('termsAndConditions', '/terms-and-conditions')
  .add('privacyPolicy', '/privacy-policy')
  .add('blog', '/blog/:name/:id')
  .add('forgotPassword', '/reset/:token')
  .add('leaderBoard', '/leaderboard')
  .add('cta', '/register-to-win');
