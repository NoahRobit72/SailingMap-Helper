const { SerialPort } = require('serialport')
// // or
// import { SerialPort } from 'serialport'

// Create a port
const port = new SerialPort({
  path: '/dev/cu.usbserial-0001',
  baudRate: 57600,
})