# Smart Campus Service Hub

Smart Campus Service Hub is a modern, web-based platform designed as a **single digital solution for college campus services**.  
It streamlines communication between students and administrators by centralizing notices, events, issues, and lost & found items into one unified system.

---

## Live Deployment

**Platform:** Vercel  
**Live URL:** https://smart-campus-service-hub.vercel.app/

---

## Test Credentials

### Admin
- **Email:** admin@gmail.com  
- **Password:** 12345678  

### Student
- **Email:** student@gmail.com  
- **Password:** 12345678  

---

## Problem Statement

In many colleges, important campus information is scattered across physical notice boards, WhatsApp groups, and informal communication channels.  
This fragmentation results in missed updates, confusion, and inefficient issue resolution.

**Smart Campus Service Hub** addresses this problem by providing **one centralized digital platform** for all campus-related services and updates.

---

## Project Motivation

- Establish a single source of truth for campus notices and events  
- Enable students to raise complaints digitally  
- Organize lost & found items in a structured system  
- Improve transparency and communication between students and administrators  

---

## Key Features

- User authentication for Students and Admins  
- Role-based access control  
- Notices and Events management  
- Issue and complaint tracking system  
- Lost & Found management module  
- Search and filter functionality  
- Fully responsive user interface  

---

## Technology Stack

### Frontend
- Next.js  
- React.js  
- Tailwind CSS  

### Backend
- Next.js API Routes  
- MongoDB  
- Mongoose  
- JWT Authentication  

### Deployment & Infrastructure
- Vercel  
- MongoDB Atlas  

---

## User Roles

### Student
- Secure registration and login  
- View campus notices and events  
- Raise and track campus issues (hostel, WiFi, classroom, etc.)  
- Report lost or found items  
- Search and filter information  

### Admin
- Secure admin login  
- Create and manage notices and events  
- Review and update student issues  
- Manage lost & found submissions  

---

## Phase-wise Development

- Phase 0: Project Setup  
- Phase 1: Authentication and Role Management  
- Phase 2: Notices and Events Module  
- Phase 3: Issues and Complaints Module  
- Phase 4: Lost & Found Module  
- Phase 5: Search and Filter  
- Phase 6: UI and UX Enhancements  
- Phase 7: Deployment  

---

## Project Structure

```
/app
  /api
/components
/models
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
- type (notice or event)  
- createdAt  

### Issue
- title  
- category  
- description  
- status  

### Lost & Found
- itemName  
- description  
- type (lost or found)  
- contact  

---

## Setup and Installation

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

### Step 3: Configure Environment Variables

Create a `.env.local` file and add:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Run the Application
```
npm run dev
```

Access the application at:
```
http://localhost:3000
```

---

## Deployment Steps

1. Push the project to GitHub  
2. Log in to Vercel  
3. Import the GitHub repository  
4. Add required environment variables  
5. Deploy the project  

---

## Testing

- Manual UI testing  
- API testing using browser or Postman  
- Role-based access validation  

---

## Limitations

- No email notification system  
- Limited admin analytics  
- No dedicated mobile application  

---

## Future Enhancements

- Mobile application support  
- Push notifications  
- Advanced admin analytics dashboard  
- Progressive Web App (PWA) support  

---

## Conclusion

Smart Campus Service Hub simplifies campus communication by making it digital, transparent, and efficient.  
It reduces dependency on fragmented communication channels and improves overall campus management.

---

## Developers

**Nilesh Kumar**  
B.Tech (2024–2028)  
Katihar Engineering College, Katihar  

**Swati Priya**  
B.Tech (2024–2028)  
Katihar Engineering College, Katihar  

**Jeevan Prem**  
B.Tech (2024–2028)  
Katihar Engineering College, Katihar  
