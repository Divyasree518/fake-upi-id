const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vinayak155',
    database: 'userdetails'
})

connection.connect((err) => {
    if (!err) {
        console.log("connected to database");
    } else {
        console.log('Error connecting to database:', err.message || err);
    }
})

app.get('/', (req, res) => {
    res.render('home');
});

// Handle email sending
app.post('/send-email', (req, res) => {
    //console.log('Request Body:',req.body);
    const { username,usermail,Scammedmail,recipient, subject, message } = req.body;
    connection.query(`INSERT INTO details(UserName, UserEmailId, Scammed_upi_id, PoliceStationEmailId, ScamType, Message) VALUES ('${username}', '${usermail}', '${Scammedmail}', '${recipient}', '${subject}', '${message}')`, (err,results)=>{
        if(err){
            console.log('Getting error whil inserting data into databse:', err.message || err);
        }else{
            console.log('Data inserted successfully into database');
        }
    });

    const transporter = nodemailer.createTransport({
        //service: 'gmail',
        secure: false,
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'kleelavinayak@gmail.com',
            pass: 'ajdu qffu pacf esfq'
        }
    });

    // Define the email options
    const mailOptions = {
        from: 'kleelavinayak@gmail.com',
        to: recipient,
        subject: subject,
        text: message,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error occurred:", error);
            res.status(500).send('Error in sending email. Please try again later.');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully!');
        }
    });
});
app.post('/user-details',(req,res)=>{
    const {username,usermail,Scammedmail} = req.body;

    const transporter = nodemailer.createTransport({
        //service: 'gmail',
        secure: false,
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'kleelavinayak@gmail.com',
            pass: 'ajdu qffu pacf esfq'
        }
    });

    const mailOptions = {
        from: 'kleelavinayak@gmail.com',
        to: username,
        subject: 'Fake UPI ID Detection & Scam Report',
        text: `Dear ${nameuser}\n\nThanks for reporting on ${Scammedmail} UPI ID soon we will solve your problem.\n\nThanks for reporting`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error occurred:", error);
            res.status(500).send('Error in sending email. Please try again later.');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully!');
        }
    });
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});