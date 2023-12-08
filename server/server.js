const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const PORT = process.env.port || 3000;
const app = express();

// const bcrypt = require('bcrypt');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { expressjwt: exjwt } = require('express-jwt');
// const jwt_decode = require('jwt-decode');

app.use(compression());
app.use(express.json());
const corsOptions = {
    origin: 'http://157.245.211.147:4200',
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
    res.setHeader('Access-Control-Allow-Origin', 'http://157.245.211.147:4200, http://104.236.8.207:3000');
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

    bcryptjs.hash(password, saltRounds, function(err, hash) {
        const pwd = hash;
        const insertSQL = `INSERT INTO pb_users (userId, password, firstName, lastName, signupDate) VALUES('${userId}','${pwd}','${firstname}','${lastname}', DATE_SUB(NOW(), INTERVAL 5 HOUR));`;
        connection.query(insertSQL, function(error, results, fields){
            if (error) {
                console.error("Error executing the query:", error);
                return res.status(400).json({
                    success: false,
                    error: 'Error in signup process'
                });
            }
            res.status(200).json({
                success: true,
                firstname: firstname,
                myContent: 'Register completed successfully'
            });
        });

    });
});

app.post('/api/login', async(req, res) => {
    const { userId, password } = req.body;
    // console.log("\n(req) userId: " + userId + ", password: " + password);

    try{
        const selectSQL = `SELECT * FROM pb_users WHERE userId = '${userId}'`;
        connection.query(selectSQL, function(error, results, fields){
            if (error) {
                console.error("Error executing the query:", error);
                throw error;
            }

            if (!results.length == 0) {
                bcryptjs.compare(password, results[0].password, function(err, result) {
                    // console.log("Trying to compare with encrypted password");
                    // console.log("Password correct?: " + result);

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
                        res.status(200).json({
                            success: true,
                            err: null,
                            token,
                            firstname: results[0].firstName,
                            lastname: results[0].lastName,
                           // exp: decodeToken.exp
                        });

                    } else {
                        console.log("Password is incorrect");
                        res.status(400).json({
                            success: false,
                            token: null,
                            officialError: err,
                            err: 'Password is incorrect'
                        });
                    }
                });
            } else {
                console.log("Invalid username");
                res.status(400).json({
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


app.post('/api/getIncomeData', async(req, res) => {
    const { userId, year, month } = req.body;

    const selectSQL = `SELECT * FROM pb_budget_month WHERE userId = '${userId}' AND category = 'Income' AND year = '${year}' AND month = ${month};`;

    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            res.status(500).json({ error: 'Internal Server Error: getting income data' });
            throw error;
        }
        if(results.length == 0){
            res.status(200).json({
                success: true,
                results: null
            });
        }else{
            res.status(200).json({
                success: true,
                results: results
            });
        }
        
    });
});

app.get('/api/getBudgetData/:userId', async(req, res) => {
  const userId = req.params.userId;

  const selectSQL = `SELECT * FROM pb_budget WHERE userId = '${userId}';`;
  connection.query(selectSQL, function(error, results, fields){
    if(error) {
        res.status(500).json({ error: 'Internal Server Error: getting budget data' });
        throw error;
    }
    res.status(200).json({
        success: true,
        results: results
    });
  });
});

app.post('/api/saveBudget', async(req, res) => {
    const { userId, titles, budgets, colors, expenses, budgetIds } = req.body;

    for(var i=0; i<titles.length; i++){
        var budgetSQL = '';
        var title = `(CONCAT(UPPER(SUBSTRING('${titles[i]}', 1, 1)), (SUBSTRING('${titles[i]}', 2))))`;
        if(budgetIds[i] == 0){
            budgetSQL = `INSERT INTO pb_budget(userId, title, budget, color, expense) VALUES('${userId}', ${title}, ${budgets[i]}, UPPER('${colors[i]}'), ${expenses[i]}); `;
        }else{
            budgetSQL = `UPDATE pb_budget SET title=${title}, budget=${budgets[i]}, color=UPPER('${colors[i]}'), expense=${expenses[i]} WHERE userId='${userId}' AND budgetId=${budgetIds[i]}; `;
        }            
        connection.query(budgetSQL, function(error, results, fields){
            if(error) {
                res.status(500).json({ error: 'Internal Server Error: insert/update budget data' });
                throw error;
            }
        });
    }
    
    res.status(200).json({
        success: true,
        myContent: 'Budget data saved successfully'
    });

});

app.post('/api/deleteBudget', async(req, res) => {
    const { userId, budgetId } = req.body;

    const deleteSQL = `DELETE FROM pb_budget WHERE userId='${userId}' AND budgetId=${budgetId}; `;
    connection.query(deleteSQL, function(error, results, fields){
        if(error) {
            res.status(500).json({ error: 'Internal Server Error: delete budget' });
            throw error;
        }
        
        const deleteBudgetMonth = `DELETE FROM pb_budget_month WHERE userId='${userId}' AND budgetId=${budgetId}; `;
        connection.query(deleteBudgetMonth, function(error, results, fields){
            if(error) {
                res.status(500).json({ error: 'Internal Server Error: delete budget month' });
                throw error;
            }
            
            res.status(200).json({
                success: true,
                myContent: 'Budget data deleted successfully'
            });
        });
    });
    

});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });


app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});