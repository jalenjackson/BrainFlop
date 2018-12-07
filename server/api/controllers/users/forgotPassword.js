var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var User = require('../../models/user');

exports.forgotPassword = (req, res) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token)
      })
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          });
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpiresIn = Date.now() + 3600000;

        user.save(function(err) {
          done(err, token, user);
        })
      })
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'brainflop@brainflop.com',
          pass: process.env.GMAIL_PW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'brainflop@brainflop.com',
        subject: 'BrainFlop Password Reset',
        text: `You are receiving this because you have requested the reset of the password associated with the BrainFlop account ${user.email}.\n
          Please click the following link, or paste into your browser to complete the forgot password process.\n 
          http://${req.headers.host}/reset/${token}\n\n
          if you did not request this, please ignore this email and your password will remain unchanged.
        `
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        return res.status(200).json({
          message: 'Forgot password email has been successfully sent!'
        })
      })
    }
  ], function(err) {
      if(err) {
        res.status(500).json({
          message: 'Unexpected error occurred'
        })
      }
    })
};
