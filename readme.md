#  AI-Powered Meeting Minutes Extractor

A production-ready Node.js backend service that transforms unstructured meeting notes into actionable insights using AI. Built with enterprise-grade architecture and robust error handling.

##  Overview

This service accepts meeting notes (via file upload or raw text) and uses Google Gemini AI to extract:
- **Summary**: 2-3 sentence meeting overview
- **Key Decisions**: List of important decisions made
- **Action Items**: Structured tasks with owners and deadlines

## ️ Architecture

```
├── config/              # Centralized configuration management
│   ├── app.js          # Main app configuration
├── controllers/         # Business logic layer
│   └── meetingController.js
├── middleware/          # Reusable middleware components
│   ├── upload.js       # File upload handling
│   └── errorHandler.js # Error handling middleware
├── routes/             # API route definitions
│   └── api.js
├── services/           # External service integrations
│   └── llmService.js   # AI/LLM service
├── utils/              # Utility functions
│   └── helpers.js
├── samples/            # Sample meeting notes files
│   ├── team-sync.txt
│   └── project-meeting.txt
└── server.js           # Application entry point
```

##  Features

-  **Triple Input Support**: File upload (.txt), JSON body, OR plain text body
-  **AI-Powered Extraction**: Google Gemini integration with prompt engineering
-  **Robust Error Handling**: Comprehensive API error management
-  **Input Validation**: File type, size, and content validation
-  **Security First**: Secure file handling and input sanitization
-  **Production Ready**: Environment configuration and health checks
-  **Clean Architecture**: Separation of concerns with modular design

##  Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-meeting-extractor
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
   Create a `.env` file in the root directory:
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3000
NODE_ENV=development
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000`

##  API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "service": "Server is running"
}
```

### Process Meeting Notes
```http
POST /api/process-meeting
```

**Input Options:**

**Option 1: File Upload**
- Content-Type: `multipart/form-data`
- Field: `file` (must be .txt file, max 10MB)

**Option 2: JSON Body**
- Content-Type: `application/json`
- Body: `{"text": "your meeting notes here"}`

**Option 3: Plain Text Body**
- Content-Type: `text/plain`
- Body: Raw text directly in request body

**Response Format:**
```json
{
  "summary": "2-3 sentence meeting summary",
  "decisions": [
    "Decision 1",
    "Decision 2"
  ],
  "actionItems": [
    {
      "task": "Task description",
      "owner": "Person name or null",
      "due": "Deadline or null"
    }
  ]
}
```

##  Testing Examples

### Using cURL

#### 1. Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

#### 2. File Upload
```bash
curl -X POST http://localhost:3000/api/process-meeting \
  -F "file=@samples/team-sync.txt"
```

#### 3. JSON Body Input
```bash
curl -X POST http://localhost:3000/api/process-meeting \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Team Sync – May 26\n\n- We will launch the new product on June 10.\n- Ravi to prepare onboarding docs by June 5.\n- Priya will follow up with logistics team on packaging delay.\n- Beta users requested a mobile-first dashboard."
  }'
```

#### 4. Plain Text Input
```bash
curl -X POST http://localhost:3000/api/process-meeting \
  -H "Content-Type: text/plain" \
  -d "Team Sync – May 26

- We will launch the new product on June 10.
- Ravi to prepare onboarding docs by June 5.  
- Priya will follow up with logistics team on packaging delay.
- Beta users requested a mobile-first dashboard."
```

### Using Postman

#### File Upload Test:
1. Set method to `POST`
2. URL: `http://localhost:3000/api/process-meeting`
3. Body → form-data
4. Key: `file` (select File type)
5. Value: Choose `samples/team-sync.txt`

#### JSON Body Test:
1. Set method to `POST`
2. URL: `http://localhost:3000/api/process-meeting`
3. Headers: `Content-Type: application/json`
4. Body → raw → JSON:
```json
{
  "text": "Team Sync – May 26\n\n- We'll launch the new product on June 10.\n- Ravi to prepare onboarding docs by June 5.\n- Priya will follow up with logistics team on packaging delay.\n- Beta users requested a mobile-first dashboard."
}
```

#### Plain Text Test:
1. Set method to `POST`
2. URL: `http://localhost:3000/api/process-meeting`
3. Headers: `Content-Type: text/plain`
4. Body → raw → Text:
```
Team Sync – May 26

- We'll launch the new product on June 10.
- Ravi to prepare onboarding docs by June 5.
- Priya will follow up with logistics team on packaging delay.
- Beta users requested a mobile-first dashboard.
```

##  Sample Files

### samples/team-sync.txt
```
Team Sync – May 26

- We'll launch the new product on June 10.
- Ravi to prepare onboarding docs by June 5.
- Priya will follow up with logistics team on packaging delay.
- Beta users requested a mobile-first dashboard.
- Decision: Move to mobile-first approach for next sprint.
```

**Expected Output:**
```json
{
  "summary": "The team confirmed the product launch on June 10, assigned onboarding preparation and logistics follow-up, and decided to implement mobile-first dashboard based on beta user feedback.",
  "decisions": [
    "Launch set for June 10",
    "Move to mobile-first approach for next sprint",
    "Need mobile-first dashboard for beta users"
  ],
  "actionItems": [
    {
      "task": "Prepare onboarding docs",
      "owner": "Ravi",
      "due": "June 5"
    },
    {
      "task": "Follow up with logistics team on packaging delay",
      "owner": "Priya",
      "due": null
    }
  ]
}
```

### samples/project-meeting.txt
```
Project Kickoff Meeting - January 15

Attendees: Sarah (PM), Mike (Dev), Lisa (Design), Tom (QA)

Key Points:
- Project deadline set for March 31st
- Sarah will create project timeline by January 20th
- Mike to set up development environment by January 18th
- Lisa needs design mockups ready by February 1st
- Tom will prepare testing strategy document
- Decision: Use React for frontend framework
- Decision: Weekly standups every Tuesday at 10 AM
- Budget approved: $50,000
```

**Expected Output:**
```json
{
  "summary": "Project kickoff meeting established March 31st deadline, assigned initial setup tasks to team members, and made key technical and process decisions including React framework adoption and weekly standups.",
  "decisions": [
    "Project deadline set for March 31st",
    "Use React for frontend framework",
    "Weekly standups every Tuesday at 10 AM",
    "Budget approved: $50,000"
  ],
  "actionItems": [
    {
      "task": "Create project timeline",
      "owner": "Sarah",
      "due": "January 20th"
    },
    {
      "task": "Set up development environment",
      "owner": "Mike",
      "due": "January 18th"
    },
    {
      "task": "Design mockups ready",
      "owner": "Lisa",
      "due": "February 1st"
    },
    {
      "task": "Prepare testing strategy document",
      "owner": "Tom",
      "due": null
    }
  ]
}
```

##  Error Handling

The API provides comprehensive error handling with appropriate HTTP status codes:

- `400 Bad Request` - Invalid input, file type, or size issues
- `401 Unauthorized` - Invalid or missing Gemini API key
- `429 Too Many Requests` - API quota exceeded or rate limiting
- `500 Internal Server Error` - Unexpected server errors
- `502 Bad Gateway` - AI service returned invalid response
- `504 Gateway Timeout` - AI service timeout

### Example Error Response:
```json
{
  "error": "File size too large. Maximum size is 10MB."
}
```

## 🔧 Configuration

### Environment Variables
- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `GOOGLE_API_KEY` - Alternative API key variable name
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment setting (development/production)

### Limits
- File size: 10MB maximum
- Text input: 50,000 characters maximum
- Supported formats: .txt files only
- AI model: gemini-2.5-flash

##  Key Differentiators

1. **Production-Ready Architecture**: Proper separation of concerns with MVC pattern
2. **Comprehensive Validation**: Multi-layer input validation and sanitization
3. **Robust Error Handling**: Meaningful error messages with proper HTTP codes
4. **Flexible Input Methods**: Support for both file uploads and raw text
5. **AI Response Validation**: Validates and sanitizes AI responses before returning
6. **Security First**: File type validation, size limits, and secure middleware
7. **Configuration Management**: Environment-based setup for different deployments

##  Dependencies

### Core Dependencies
```json
{
  "express": "^4.18.2",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "dotenv": "^16.3.1",
  "@google/generative-ai": "^0.1.3"
}
```

### Dev Dependencies
```json
{
  "nodemon": "^3.0.2"
}
```


##  Development

### Scripts
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
npm test       # Run tests (when implemented)
```

### Code Quality
- Proper error handling and logging
- Input validation and sanitization
- Security middleware implementation

---

**Built by Priyadeep with ❤️ for efficient meeting management**