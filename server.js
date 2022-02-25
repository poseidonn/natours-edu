const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION. Kapatılıyor');
  console.error(err.name, ',', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION. Kapatılıyor');
  console.error(err.name, ',', err.message);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('Veritanı bağlandı'));
//.catch((err) => console.error(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Uygulama ${port} portunda çalışıyor `);
});
