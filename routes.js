const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

routes
  .add('category', '/category/:slug')
  .add('quiz', '/quiz/:quizName/:quizId')
  .add('singlePlayerAnswerChoiceQuizGame', '/single-player/answer-choice/:quizName/:quizId')
  .add('inviteAFriendAnswerChoiceQuizGame', '/invite-friend/answer-choice/:quizName/:quizId/:userId')
  .add('login', '/login');


