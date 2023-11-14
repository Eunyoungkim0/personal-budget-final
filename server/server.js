const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const PORT = process.env.port || 3000;
const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { expressjwt: exjwt } = require('express-jwt');
// const jwt_decode = require('jwt-decode');

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const secretKey = 'My super secret key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

var connection = mysql.createConnection({
    host    : 'classplus.mysql.database.azure.com',
    user    : 'classplus',
    password: 'uncc4155!',
    database: 'classplus'
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/signup', async(req, res) => {
    const { userId, password, firstname, lastname } = req.body;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        const pwd = hash;
        const insertSQL = `INSERT INTO pb_users (userId, password, firstName, lastName, signupDate) VALUES('${userId}','${pwd}','${firstname}','${lastname}', DATE_SUB(NOW(), INTERVAL 5 HOUR));`;
        connection.query(insertSQL, function(error, results, fields){
            if (error) throw error;
            res.json({
                success: true,
                firstname: firstname,
                myContent: 'Register completed successfully'
            });
        });

    });
});

app.post('/api/login', async(req, res) => {
    const { userId, password } = req.body;
    console.log("\n(req) userId: " + userId + ", password: " + password);

    try{
        const selectSQL = `SELECT * FROM pb_users WHERE userId = '${userId}'`;
        connection.query(selectSQL, function(error, results, fields){
            if (error) {
                console.error("Error executing the query:", error);
                throw error;
            }

            if (!results.length == 0) {
                bcrypt.compare(password, results[0].password, function(err, result) {
                    console.log("Trying to compare with encrypted password");
                    console.log("Password correct?: " + result);

                    if (err) {
                        console.error("Error comparing passwords:", err);
                        throw err;
                    }

                    if (result) {
                        let userData = {
                            userId: results[0].userId,
                            firstname: results[0].firstName,
                            lastname: results[0].lastName,
                        };

                        let token = jwt.sign(userData, secretKey, { expiresIn: '1m' });
                        //let decodeToken = jwt_decode(token);
                        res.json({
                            success: true,
                            err: null,
                            token,
                            firstname: results[0].firstName,
                            lastname: results[0].lastName,
                           // exp: decodeToken.exp
                        });
                    } else {
                        console.log("Password is incorrect");
                        res.json({
                            success: false,
                            token: null,
                            officialError: err,
                            err: 'Password is incorrect'
                        });
                    }
                });
            } else {
                console.log("Invalid username");
                res.json({
                    success: false,
                    token: null,
                    officialError: error,
                    err: 'Invalid username'
                });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
          success: false,
          err: 'Internal server error'
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });


app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});