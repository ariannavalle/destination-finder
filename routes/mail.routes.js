require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const mailgun = require('nodemailer-mailgun-transport');

router.get('/contact-form', (req, res) => {
  res.render('contact-form');
});

router.post('/contact-form', (req, res) => {
  const transporter = nodemailer.createTransport(mailgun(auth));

  const sendMail = (email, subject, text, name, cb) => {
    const mailOptions = {
      from: email,
      to: 'tradest34@gmail.com',
      subject: subject,
      name,
      text,
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, data);
      }
    });
  };
  const {
    name,
    email,
    subject,
    message
  } = req.body;
  console.log(req.body);

  sendMail(email, subject, message, name, function (err, data) {
    console.log(err, data)
    if (err) {
      res.status(500).json({ message: 'Internal Error' });
    } else {
      res.render('contact-form', { message: `We appreciate you contacting us, ${name}. 
      One of our colleagues will get back in touch with you soon!
      Have a great day!` });
      // res.json({ message: 'Email sent' });
    }
  });

  
});

const auth = {
  auth: {
    api_key: process.env.CONTACT_API,
    domain: process.env.YOUR_DOMAIN_NAME
  }
};

module.exports = router;
