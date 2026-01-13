
# Smart Campus Service Hub

A simple web application that works as a **single digital platform for college campus services**.
It helps students and admins manage notices, events, issues, and lost & found items easily.

---

## Problem Statement 
Students usually get campus information from many different places like notice boards, WhatsApp groups, or word of mouth.  
This causes confusion and missed updates.

**Smart Campus Service Hub** solves this by providing **one common platform** for all campus-related information.

---

## Project's motivation
- Provide one place for all campus notices and events
- Allow students to raise complaints online
- Manage lost & found items digitally
- Make communication between students and admins easy

---

## User Roles

### Student
- Register and login
- View notices and events
- Raise issues (hostel, wifi, classroom, etc.)
- Add lost or found items
- Search and filter information

### Admin
- Login as admin
- Post notices and events
- View and update student issues
- Manage lost & found posts

---

## Technology Used

### Frontend
- Next.js
- React.js
- Tailwind CSS

### Backend
- Next.js API Routes
- MongoDB
- Mongoose
- JWT Authentication

### Deployment
- Vercel
- MongoDB Atlas

---

## Main Features
- User Authentication (Student / Admin)
- Role-based access control
- Notices and events section
- Issue / complaint management
- Lost & found section
- Search and filter functionality
- Responsive UI

---

## Project Structure
```
/app
/components
/models
/api
/public
```
---

## Database Collections

### User
- name
- email
- password
- role

### Post
- title
- description
- type (notice/event)
- createdAt

### Issue
- title
- category
- description
- status

### Lost & Found
- itemName
- description
- type (lost/found)
- contact

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Step 1: Clone the Repository
```
git clone https://github.com/your-username/smart-campus-service-hub.git
cd smart-campus-service-hub
```

### Step 2: Install Dependencies
```
npm install
```

### Step 3: Create Environment File
Create a file named `.env.local` and add:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Run the Project
```
npm run dev
```

Open browser and visit:
```
http://localhost:3000
```

---

## Deployment Steps
1. Push project to GitHub
2. Login to Vercel
3. Import GitHub repository
4. Add environment variables
5. Click Deploy

---

## Testing
- Manual testing of UI
- API testing using browser/Postman
- Role-based access testing

---

## Limitations
- No email notifications
- Limited admin analytics
- No mobile app

---

## Future Improvements
- Mobile application
- Push notifications
- Admin analytics dashboard
- PWA support

---

## Conclusion
Smart Campus Service Hub makes campus communication simple, digital, and organized.
It saves time for students and admins and improves overall campus management.

---

## Developer
- **Nilesh Kumar**  
B.Tech (2024-28)  
Katihar Engineering College, Katihar

- **Swati Priya**  
B.Tech (2024-28)  
Katihar Engineering College, Katihar

- **Jeevan Prem**  
B.Tech (2024-28)  
Katihar Engineering College, Katihar
