require('dotenv').config({path: "./modules/.env"});
const express = require('express');
const app = express();
const os = require('os');
const nodemailer = require('nodemailer');

const serverIP = Object.values(os.networkInterfaces())
  .flat()
  .filter(item => item.family === 'IPv4' && !item.internal)
  .map(item => item.address)[0];

const networkInterfaces = os.networkInterfaces();
let macAddress;

for (const name of Object.keys(networkInterfaces)) {
  const iface = networkInterfaces[name];
  const ifaceInfo = iface.find(iface => iface.family === 'IPv4' && !iface.internal);
  if (ifaceInfo) {
    macAddress = ifaceInfo.mac;
    break;
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS
  }
});

app.use((req, res, next) => {
    const routerIP = serverIP; 
    const deviceIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log('Router IP:', routerIP);
    console.log('Device IP:', deviceIP);
    console.log('MAC Address:', macAddress);

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.YOUR_EMAIL,
      subject: 'Данные из консоли Express сервера',
      text: `Router IP: ${routerIP}\nDevice IP: ${deviceIP}\nMAC Address: ${macAddress}`
    }, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    next();
});

app.get('/', (req, res) => {
    res.send('<h1>Добро пожаловать на сайт!</h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
