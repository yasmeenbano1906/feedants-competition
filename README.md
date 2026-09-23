# Feedants Competition Details

A functional full-stack implementation of the Feedants Competition Details screen for the Full Stack Development Internship technical assignment.

The feature is implemented using React Native, Node.js, Express.js, and MongoDB. Competition information is dynamically loaded from the backend/database rather than being hardcoded in the frontend.

---

## Tech Stack

### Frontend
- React Native
- JavaScript
- Axios

### Backend
- Node.js
- Express.js
- Mongoose
- MongoDB
- Helmet
- CORS
- Express Rate Limit

### Database
- MongoDB

---

## Features

- Dynamic competition details
- Competition status based on dates
- User registration status
- Join Competition functionality
- Participant limit handling
- Remaining participant spots
- Entry fee
- Prize pool
- Competition tags
- Judge information
- Important competition dates
- Countdown timer
- Previous winners
- Rewards
- Judging parameters
- Rules and eligibility
- Functional competition tabs
- Upload Submission interaction
- Refer & Earn interaction
- Intro Video interaction
- Responsive React Native screen
- Backend API integration
- MongoDB data persistence
- Duplicate registration prevention
- Atomic participant count update
- MongoDB transaction for registration consistency
- API rate limiting
- Basic security middleware

---

# Project Structure

```text
feedants-competition/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── android/
│   ├── App.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

#How to Run
##Prerequisites

Make sure the following are installed:

Node.js
npm
Java JDK 17
Android Studio
Android SDK
MongoDB Atlas account
React Native Android development environment

1. Clone the Repository
git clone <your-github-repository-url>
cd feedants-competition
2. Backend Setup

Open a terminal.

cd backend
npm install

Create a file:

backend/.env

Add:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Do not commit the .env file to GitHub.

Start the backend:
node src/server.js

You should see:
MongoDB connected
Server running on port 5000

The backend runs on:
http://localhost:5000

Health check:
GET /health

3. Frontend Setup

Open another terminal.
cd frontend
npm install

Start Metro:
npx react-native start

Metro will run on:
http://localhost:8081
Keep this terminal running.

4. Android Setup

Open another terminal.
Go to the frontend:
cd frontend

Set the Android SDK environment variables if required:
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"

Check the connected Android device:
adb devices

A connected device should appear similar to:
OVCMM7DQKRBGJGQ9L    device

Connect the device to Metro:
adb reverse tcp:8081 tcp:8081

Then install and launch the application:
npx react-native run-android --no-packager

--no-packager is used because Metro is already running separately.

5. Physical Android Device

For a physical Android device:

Enable Developer Options.
Enable USB Debugging.
Connect the device to the computer.
Confirm the device using:
adb devices
Connect Metro:
adb reverse tcp:8081 tcp:8081
Run:
npx react-native run-android --no-packager

The frontend API configuration is located at:

frontend/src/services/api.js

For a physical device, the backend URL should use the development computer's local network IP address.

Example:
baseURL: "http://YOUR_LOCAL_IP:5000/api/v1"

The phone and development computer should be connected to the same network when using the computer's local IP.

Backend API
Get Competition
GET /api/v1/competitions/:id

Returns the competition details and calculates the current competition status from its dates.

Get Registration Status
GET /api/v1/competitions/:competitionId/registration?userId=:userId

Returns whether the user has already registered for the competition.

Example response:

{
  "success": true,
  "joined": true,
  "data": {}
}
Join Competition
POST /api/v1/competitions/:competitionId/join

Request body:

{
  "userId": "USER_ID"
}

The API checks:

Competition availability
Competition dates
Participant limit
Duplicate registration

The participant count is updated atomically.

Database Models

The application uses separate MongoDB collections for:

Competition

Stores:

Title
Description
Tags
Prize
Entry fee
Maximum participants
Current participants
Competition dates
Registration deadline
Submission dates
Result date
Judge
Previous winners
Rewards
Judging parameters
Rules
Status
User

Stores:

Name
Email
Registration

Stores:

User ID
Competition ID
Registration time

A unique compound index on:

userId + competitionId

prevents the same user from registering for the same competition more than once.

Frontend Behaviour

The frontend fetches competition information from the backend when the screen loads.

The screen dynamically displays:

Competition title
Tags
Prize
Entry fee
Participant count
Remaining spots
Judge
Important dates
Winners
Rewards
Description
Judging parameters
Rules
Registration state

The UI also updates based on the user's registration state.

Competition Lifecycle

Competition status is determined from the competition dates.

Possible states:

upcoming
active
ended

The backend calculates the current status using the current date/time.

Registration is allowed only when the competition is active and participant capacity is available.

Concurrency and Data Consistency

The registration flow is designed to prevent inconsistent participant counts when multiple users attempt to join.

The participant update uses an atomic MongoDB operation:

currentParticipants < maxParticipants

and increments the participant count as part of the operation.

MongoDB transactions are also used when creating the registration record.

A unique registration index prevents duplicate registrations.

This helps maintain consistency when multiple users interact with the competition at the same time.

Security and API Protection

The backend uses:

Helmet for HTTP security headers
CORS configuration
Express rate limiting
Environment variables for database configuration
MongoDB validation through Mongoose

API rate limiting is applied to the API routes to help prevent excessive requests.

Important Assumptions
A user is identified using a user ID.
Authentication and login were kept outside the core scope of this assignment.
A test user is used for demonstrating registration functionality.
A user can register only once for a competition.
A competition cannot accept registrations after reaching its participant limit.
Competition status is determined using the competition start and end dates.
Submission upload, referral and video functionality are represented as functional UI interactions for this assignment.
Payment processing is outside the current assignment scope.
Major Technical Decisions
Dynamic Data

Competition information is stored in MongoDB and retrieved through backend APIs instead of hardcoding competition information in the React Native screen.

Separate Data Models

Competition, User and Registration are maintained as separate MongoDB models to keep responsibilities separated.

Registration Consistency

Atomic MongoDB updates and transactions are used during registration to reduce the possibility of participant-count inconsistencies.

Duplicate Registration Prevention

A unique compound index is used on:

userId + competitionId

to prevent duplicate registrations.

Frontend State

React Native state is used for:

Competition data
Registration state
Loading state
Joining state
Countdown
Active competition tab
API Layer

Axios is used through a dedicated API service so frontend API calls are separated from screen UI code.

Trade-offs
Authentication

A complete authentication system was not implemented because authentication was not the core requirement of the assignment.

A fixed test user is used to demonstrate registration behaviour.

Submission Upload

A production submission system would require file storage and validation. For this assignment, the Upload Submission interaction is represented through the functional UI.

Referral System

The referral interaction is represented in the UI without implementing a complete referral/reward backend.

Video

The Intro Video interaction is represented as a functional UI interaction rather than integrating a production video hosting service.

UI Structure

The main competition screen is kept in a relatively simple structure to allow fast development and maintainability while still separating API services and reusable UI helpers.

Future Production Improvements

If this application were developed further for production, I would add:

User authentication
JWT/session-based authorization
Role-based access control
Real submission/file upload
Cloud file storage
Payment gateway integration
Real referral system
Push notifications
Competition creation/admin dashboard
Submission review system
Judge management
Pagination
API caching
Redis for high-traffic workloads
Automated unit tests
API integration tests
End-to-end tests
Structured logging
Monitoring and metrics
Error tracking
CI/CD pipeline
Production database configuration
Stronger API validation
Production-level rate limiting
Load testing for high concurrency
Testing

The application was tested on a physical Android device.

Verified functionality includes:

Backend connection
MongoDB data loading
Competition details loading
Registration status
Join Competition
Competition tabs
Countdown
Upload Submission interaction
Refer & Earn interaction
Intro Video interaction
Android installation and launch

Android build was successfully completed using:

npx react-native run-android --no-packager
Environment Variables

The backend requires:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Never commit real credentials or passwords to the repository.

Assignment Requirements

This project follows the core assignment requirements:

React Native frontend
Node.js + Express.js backend
MongoDB database
Dynamic competition information
User participation state
Competition lifecycle
Remaining participant spots
Time-dependent information
User actions
Data consistency
Backend APIs
Database modelling
Business logic
Validation and edge-case handling
Scalable architecture considerations
Author

Developed as part of the Feedants Full Stack Development Internship technical assignment.