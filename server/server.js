const express = require('express');
const mysql = require('mysql');
const path = require('path');

const PORT = process.env.port || 3000;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
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

    const insertSQL = `INSERT INTO pb_users (userId, password, firstName, lastName)
                VALUES('${userId}','${password}','${firstname}','${lastname}');`;
    console.log(insertSQL);

    connection.query(insertSQL, function(error, results, fields){
        if (error) throw error;
        res.json({
            success: true,
            myContent: 'Register completed successfully'
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