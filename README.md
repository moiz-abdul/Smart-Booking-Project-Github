# Smart Booking Management System

This project is a Smart Booking Management System designed to streamline the process of scheduling and managing bookings. It provides a user-friendly interface for making reservations and an administrative panel for managing bookings and system settings. The system is built with modern web technologies, ensuring a responsive and efficient experience for both users and administrators. 

## Installation

To set up the Smart Booking System on your machine, please follow these steps:

### Step 1: Install XAMPP
This project requires a database; you will need a local server environment XAMPP. Download and install XAMPP from the official website. 
Link: https://www.apachefriends.org/index.html

After installation, Open Xampp Server from Start Menu of your system and starts the Apache and MySQL from the XAMPP control panel.

### Step 2: Import MySQL Database
1. Open PHP-My-Admin from browser 
   Link: https://locallhost.me/phpmyadmin
2. Click on "New" (left sidebar) to create a new database for import
3. Enter a database name:
   - Database Name: smart_booking_system
   - Choose Collation (e.g., utf8mb4_general_ci) then Click Create
4. Select the newly created database
   - It will now appear in the left panel, Click on it
5. Go to the "Import" tab (top menu bar)
6. Click "Choose File"
7. Select your .sql file from your computer (download the .sql database file from the GitHub repository root folder, named smart_booking_system.sql)
8. Set Format
   - Ensure Format: SQL is selected
9. Click "Go" (bottom right)
10. Wait for the import to finish
    - A success message like "Import has been successfully finished" will appear

### Step 3: Install Node.js and npm
Download and install Node.js from the official website (https://nodejs.org/) to run this project. npm comes bundled with Node.js.

### Step 4: Install Git
Download and install Git from the official website (https://git-scm.com/downloads). Git is required for version control and managing the project. After installation:
1. Open a new terminal/command prompt
2. Verify the installation by running:
   ```bash
   git --version
   ```
3. Configure Git with your credentials:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Step 5: Navigate to the Backend directory
Open the project in an editor (e.g., VS Code), open the terminal from "view" in the top menu, and change your current directory to the Backend folder:
```bash
cd Backend
```

### Step 6: Install Backend Dependencies
Run the following command to install the necessary packages for the backend:
```bash
npm install
```

### Step 7: Open Another Terminal
1. Click on "View" in the top menu
2. Select "Terminal" from the dropdown 
3. Terminal opens at the bottom
4. Click on the + icon in the terminal tab (top-right of terminal panel)
5. A new terminal opens in a new tab

You can now use multiple terminal tabs.

### Step 8: Navigate to the Frontend directory
On New terminal Change your current directory to the frontend folder:
```bash
cd frontend
```

### Step 9: Install Frontend Dependencies
Run the following command to install the necessary packages for the frontend:
```bash
npm install
```

### Step 10: Running the Project
After installing the dependencies from backend and frontend, follow these steps to run the application Smart Booking System:

1. Start the Backend Server:
   - Navigate to the Backend directory in your terminal and run the start command:
   ```bash
   cd Backend
   npm start
   ```
   This will start the backend server. Keep this terminal running to ensure the backend continues to operate.

2. Start the Frontend Development Server:
   - Navigate to the frontend directory in the second terminal window and run the following commands:
   ```bash
   cd frontend
   npm start
   ```
   This will start the frontend development server and open the application in your browser.

Your Smart Booking System application should now be running successfully in your browser. 