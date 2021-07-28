const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
const db = require('./app/models');
db.sequelize.sync();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

require('./app/routes/user.routes')(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
