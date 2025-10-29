const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/module/user/user.routes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = 4000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
