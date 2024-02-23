const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const { randomPoint } = require('random-location');

// Define BU campus boundary coordinates (latitude, longitude)
const buCampusBoundary = {
  latitude: 42.3497,  // BU campus latitude
  longitude: -71.0998, // BU campus longitude
  radius: 500          // Radius (in meters) around BU campus
};

// Define serial port settings
const serialPortName = 'COM1'; // Change this to your serial port name
const baudRate = 9600;          // Change this to match your serial port settings

// Function to generate a random GPS point within the BU campus boundary
function generateRandomPoint() {
  const randomPointOptions = {
    latitude: buCampusBoundary.latitude,
    longitude: buCampusBoundary.longitude,
    radius: buCampusBoundary.radius,
  };
  return simulateMovement(randomPointOptions);
}

// Function to simulate movement with small deviations
function simulateMovement(previousPoint) {
  const maxDeviation = 0.0001; // Adjust this value to control the maximum deviation

  const newLatitude = previousPoint.latitude + (Math.random() * maxDeviation * 2 - maxDeviation);
  const newLongitude = previousPoint.longitude + (Math.random() * maxDeviation * 2 - maxDeviation);

  return { latitude: newLatitude, longitude: newLongitude };
}

// Function to print GPS point to serial port
function printPointToSerialPort(point) {
  const serialPort = new SerialPort(serialPortName, { baudRate });
  const parser = serialPort.pipe(new Readline({ delimiter: '\n' }));

  serialPort.on('open', () => {
    const message = `Latitude: ${point.latitude}, Longitude: ${point.longitude}\n`;
    serialPort.write(message);
  });
}

// Main function to continuously generate and print GPS points
function main() {
  let currentPoint = generateRandomPoint();

  // Print initial point
  printPointToSerialPort(currentPoint);

  setInterval(() => {
    const newPoint = simulateMovement(currentPoint);

    // Ensure the new point stays within the BU campus boundary
    if (Math.abs(newPoint.latitude - buCampusBoundary.latitude) <= buCampusBoundary.radius / 111000
      && Math.abs(newPoint.longitude - buCampusBoundary.longitude) <= buCampusBoundary.radius / (111000 * Math.cos(buCampusBoundary.latitude * Math.PI / 180))) {
      printPointToSerialPort(newPoint);
      currentPoint = newPoint;
    }
  }, 1000); // Adjust the interval (in milliseconds) as needed
}

// Start the script
main();
