# SocialApp 🌐

A full-featured social media web application built with React — where users can sign up, share posts, comment, and manage their profile in a clean, modern interface.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-6-CA4245?logo=reactrouter&logoColor=white)

## 📖 About

SocialApp is a social networking platform where users can create an account, share posts (text and images), engage with the community through comments, and manage their own content. Built as a complete, production-style CRUD application consuming a REST API, with authentication, protected routes, and a consistent, custom-designed UI throughout.

## ✨ Features

- **Authentication** — Sign up, log in, and log out with full form validation
- **Home Feed** — Browse all posts in a scrollable, Facebook-style feed
- **Post Details** — View a single post with all its comments
- **Create, Edit & Delete Posts** — Full post management for the post owner, including image uploads
- **Comments** — Add, edit, and delete comments on any post
- **User Profile** — View your profile info and your own posts
- **Change Password** — Update your account password securely
- **Protected Routes** — Auth-gated pages that redirect unauthenticated users automatically
- **Responsive Design** — Works cleanly across desktop and mobile

## 🛠️ Built With

- **React** — UI library
- **React Router DOM** — Client-side routing and route protection
- **TanStack Query (React Query)** — Server state management, caching, and automatic refetching
- **React Hook Form** — Form state and validation handling
- **Zod** — Schema-based form validation
- **Axios** — HTTP client for API requests
- **Tailwind CSS** — Utility-first styling
- **HeroUI** — UI component primitives
- **Font Awesome** — Icon set

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/social-app.git
   cd social-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

## 🔌 API

This project consumes the [Route Academy Posts API](https://route-posts.routemisr.com), which provides endpoints for authentication, posts, and comments.

## 📁 Project Structure

```
src/
├── Auth/              # Login, Register, Change Password
├── Components/        # Home, PostCard, PostDetails, CreatePost, EditPost, CommentCard, CreateComment
├── Context/            # Auth context (user session state)
├── hooks/              # Custom hooks (e.g. useCurrentUser)
├── Layout/             # App layout wrapper
├── Navbar/             # Navigation bar
├── Footer/             # Footer
├── Profile/            # User profile page
├── ProtectRotute/       # Route guards (ProtectRoute, ProtectAuth)
└── Notfound/           # 404 page
```

## 📸 Screenshots

*(Add screenshots of the Home feed, Post Details, and Profile pages here)*

## 🗺️ Roadmap

- [ ] Like / Unlike posts and comments
- [ ] Bookmark posts
- [ ] Share posts
- [ ] Notifications
- [ ] Nested comment replies

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](../../issues).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Built by [Ammar Ramadan] as part of a full-stack React learning project.