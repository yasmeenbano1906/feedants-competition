# Feedants Competition Details

A full-stack Competition Details feature built for the Feedants Full Stack Development Internship Technical Assignment.

## Tech Stack

- React Native
- Node.js
- Express.js
- MongoDB
- Mongoose
- Axios

## Features

- Dynamic competition data from MongoDB
- Upcoming / Active / Ended competition states
- User registration and participation status
- Join competition functionality
- Participant limit validation
- Duplicate registration prevention
- Dynamic prize, entry fee, judge, dates, rewards and winners
- About / Judging / Rules tabs
- Countdown and important dates
- Responsive React Native UI

## Project Structure

```text
feedants-competition/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   └── services/
│   ├── android/
│   ├── ios/
│   ├── App.js
│   └── index.js
│
├── .gitignore
└── README.md
```
## Prerequisites

Before running the project, install:

- Node.js and npm
- JDK 17
- Android Studio
- Android SDK
- MongoDB Atlas

## Installation

### 1. Clone the Repository
```text
git clone https://github.com/yasmeenbano1906/feedants-competition.git
cd feedants-competition
```
### 2. Setup Backend
```text
cd backend
npm install
```

Create a .env file inside backend:
```text
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Start the server:
```
node src/server.js
```
Backend runs on:
```
http://localhost:5000
```
Health check:
```
GET /health
```
### 3. Setup Frontend

Open a new terminal:
```
cd frontend
npm install
```
Start Metro:
```
npx react-native start --port 8081
```
### 4. Run on Android

Connect an Android device with USB debugging enabled.
```
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"

adb devices
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5000 tcp:5000
```
Run the application:
```
npx react-native run-android --no-packager
```
For a physical device, update the API base URL in frontend/src/services/api.js to your computer's local IP address if required.

### API Endpoints
Get Competition
```
GET /api/v1/competitions/:id
```
Get Registration Status
```
GET /api/v1/competitions/:competitionId/registration?userId=:userId
```
Join Competition
```
POST /api/v1/competitions/:competitionId/join
```
Request body:
```
{
  "userId": "USER_ID"
}
```
### Database Models

- Competition — competition details, dates, limits and lifecycle
- User — participant information
- Registration — user participation records
A unique compound index prevents duplicate registrations.

### Architecture
```
React Native
     ↓
REST API
     ↓
Express.js
     ↓
MongoDB
```
Participant registration uses atomic updates and database constraints to maintain consistency when multiple users attempt to join.

### Security
- Helmet
- CORS
- API rate limiting
- Environment variables
- Mongoose validation
- .env excluded from Git
### Assumptions & Trade-offs
- Authentication is outside the core assignment scope.
- Payment processing is represented as a placeholder.
- Video upload/hosting is outside the core implementation.
- A test user is used for demonstrating registration state.
### Future Improvements
- Authentication and authorization
- Cloud video/file storage
- Payment gateway integration
- Redis caching
- Push notifications
- Admin dashboard
- Automated testing
- CI/CD and production monitoring

### Testing
Tested on a physical Android device with:

- Backend API connection
- MongoDB data loading
- Competition registration
- Dynamic competition details
- Competition lifecycle
- UI interactions
- Android build and installation

### Assignment

Developed as part of the Feedants Full Stack Development Internship Technical Assignment.

The implementation covers the required React Native frontend, Node.js/Express backend, MongoDB integration, dynamic competition data, registration state, participant limits, lifecycle handling, validation and data consistency.
