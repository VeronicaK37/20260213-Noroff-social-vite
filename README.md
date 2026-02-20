# Noroff Social Media Frontend

A frontend social media application built with JavaScript and Vite.
This project uses the Noroff Social API and allows users to register, log in, create posts, follow users, and interact with a feed.

---

## Features

### Authentication

- Register new user
- Login with Noroff account
- Store authentication token securely
- Logout functionality

### Posts

- View all posts in feed
- View single post details
- Create new post
- Edit own post
- Delete own post
- Search posts in feed

### Profiles

- View own profile
- View other user profiles
- View posts by specific user
- Follow users
- Unfollow users

### User Interface

- Single Page Application (SPA)
- Dynamic rendering using JavaScript
- Real-time UI updates
- Basic responsive layout

### API Integration

- Noroff Social API v2 integration
- Bearer token authentication
- API key authentication
- Modular API service layer

---

## Tech Stack

- JavaScript (ES6 modules)
- Vite
- Noroff Social API v2
- HTML / CSS
- Github for version control

---

## Installation

### Clone the repository:

- git clone https://github.com/VeronicaK37/20260213-Noroff-social-vite.git

### Navigate into the project:
- cd 20260213-Noroff-social-vite

### Install dependencies:
- npm install

### Run the development server:
- npm run dev

### Open in browser:
- http://localhost:5173

### API
- This project uses the Noroff Social API:
- This project uses the Noroff Social API:

- https://docs.noroff.dev/docs/v2/social/posts

- https://docs.noroff.dev/docs/v2/social/profiles

- Authentication is handled using Bearer token and X-Noroff-API-Key.

---

## Project Structure

    src/
      api/         API functions
      views/       Page views
      ui/          UI rendering
      utils/       Storage helpers
      router.js    SPA router
      main.js      App entry point

## Deployment

### This project can be deployed using
    - Github Pages
    - Netlify
    - Vercel


