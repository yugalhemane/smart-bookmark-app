# Smart Bookmark Manager

A full-stack bookmark management application built with Next.js (App Router), Supabase (Auth + Database + Realtime), and Tailwind CSS.

## 🚀 Live Demo

👉 Live URL: https://smart-bookmark-app-two-inky-68.vercel.app/  
👉 GitHub Repo: https://github.com/yugalhemane/smart-bookmark-app

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Authentication:** Supabase Auth (Google OAuth only)
- **Database:** Supabase Postgres
- **Realtime:** Supabase Realtime (Postgres changes)
- **Styling:** Tailwind CSS
- **Notifications:** react-hot-toast
- **Deployment:** Vercel

---

## ✨ Features

### 🔐 Authentication
- Google OAuth login only
- Secure session management
- Logout functionality
- Private bookmarks per user (RLS enforced)

### 📌 Bookmark Management
- Add bookmark (Title + URL)
- Delete bookmark with confirmation
- Disabled Add button when inputs are empty
- Clean empty state UI

### ⚡ Realtime Updates
- Bookmarks update instantly across multiple tabs
- Uses Supabase Realtime with Postgres replication

### 🎨 Professional UI
- Responsive design (mobile + desktop)
- Hamburger menu on mobile
- Dark mode toggle
- Loading spinner
- Toast notifications
- Avatar + user profile display

---

## 🔒 Database Design

### Table: `bookmarks`

| Column      | Type        | Description |
|-------------|------------|-------------|
| id          | uuid       | Primary key |
| user_id     | uuid       | References auth.users |
| title       | text       | Bookmark title |
| url         | text       | Bookmark URL |
| created_at  | timestamptz| Timestamp |

---

## 🔐 Row Level Security (RLS)

RLS is enabled to ensure users can only access their own data.

Policies used:

### SELECT
```sql
user_id = auth.uid()

```

### INSERT
user_id = auth.uid()

```
### DELETE
user_id = auth.uid()

This guarantees strict data isolation between users.

```

### ⚙️ Setup Instructions (Local Development)
1️⃣ Clone the Repository
git clone https://github.com/yugalhemane/smart-bookmark-app.git
cd smart-bookmark-app

2️⃣ Install Dependencies
npm install

3️⃣ Create .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4️⃣ Run Development Server
npm run dev


Visit:

http://localhost:3000

### 🚀 Deployment

The application is deployed using Vercel.

Steps:

Push project to GitHub

Import repository into Vercel

Add environment variables

Deploy

### 🧠 Challenges Faced & Solutions
1️⃣ Supabase RLS Policy Errors

Initially, the table schema was incomplete, which caused policy failures.
Solution: Dropped and recreated the table using correct SQL with foreign key reference.

2️⃣ Realtime Not Triggering

Realtime did not work initially because the table was not added to the supabase_realtime publication.
Solution: Enabled realtime via table settings / SQL:

ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

3️⃣ Hydration Mismatch Warning

Next.js showed hydration mismatch warnings during development.
Cause: Browser extensions modifying DOM before React hydration.
Solution: Tested in incognito mode and confirmed no production impact.

4️⃣ Environment Variable Issues

Supabase requests failed due to incorrect .env.local configuration.
Solution: Corrected environment variables and restarted dev server.

5️⃣ Mobile Navbar UX

Initial navbar was not optimized for mobile view.
Solution: Implemented hamburger menu for small screens.

### 🔥 What Makes This Production-Ready

Proper RLS enforcement

Secure OAuth-only authentication

Realtime synchronization

Responsive professional UI

Clean component structure

Error handling & feedback

Loading states

### 📌 Future Improvements

Edit bookmark feature

Folder categorization

Drag & drop reordering

Persistent dark mode (localStorage)

Unit tests
```