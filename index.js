const express = require('express');

const app = express();

app.use(express.json({ extended: false }));

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});