const express = require('express');
const mysql = require('mysql2');
const app = express();
require('./mysql/config');

// app.use(express.json({ extended: false }));
app.use(express.json({ limit: '200mb', extended: true }));

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/stories', require('./routes/stories'));
app.use('/test', require('./routes/test'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});