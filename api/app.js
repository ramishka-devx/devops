const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/module/user/user.routes');
const courseRoutes = require('./src/module/course/course.routes');
const paymentRoutes = require('./src/module/payment/payment.routes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', paymentRoutes);

const PORT = process.env.PORT || 4000;
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
