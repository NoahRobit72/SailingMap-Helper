import serial

# Replace 'COM1' with the name of your serial port (e.g., '/dev/ttyUSB0' on Linux)
ser = serial.Serial('ttys000', 9600)  # Adjust baud rate as needed

# Write data to the serial port
data_to_send = b'Hello, serial port!'
ser.write(data_to_send)

# Close the serial port when done
ser.close()