# 📚Bookmark Manager

A full-stack real-time bookmark management application that allows users
to save, delete, and sync bookmarks instantly across multiple tabs and
devices using Supabase Realtime.

## 🛠 Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- Lucide Icons

### Backend / Database

- Supabase
  - PostgreSQL
  - Supabase Auth
  - Supabase Realtime

---

## ✨ Features

- 🔐 User Authentication (Supabase Auth)
- ➕ Add Bookmark
- 🗑 Delete Bookmark
- 🔄 Real-Time Sync Across Tabs
- 🌐 External Link Preview Button
- 📱 Responsive UI

## 🧠 Core Concept

The main focus of this project is real-time synchronization using
Supabase Realtime.

When: - A bookmark is added - A bookmark is deleted

All open tabs update instantly without refreshing.

---

# ⚡ Architecture Overview

    User → Next.js Frontend → Supabase (Postgres)
                                     ↓
                               Realtime Channel
                                     ↓
                         All connected clients update

---

# 🔥 Problems Faced & How I Solved Them

## 1️. Problem: Changes Not Updating in Other Tabs

### Issue

Initially, when adding or deleting a bookmark: - The change was visible
only in the current tab - Other tabs required manual refresh

### Root Cause

No realtime subscription was set up for the bookmarks table.

### Solution

Implemented Supabase Realtime channel and triggered refetch on changes.

---

## 2️. Problem: Memory Leak from Realtime Subscriptions

### Issue

Multiple subscriptions were being created when navigating pages.

### Root Cause

Subscription was not cleaned up on component unmount.

### Solution

Added cleanup logic to remove the channel on unmount to prevent
duplicate listeners.

---

## 3️. Problem: NEXT_PUBLIC Key Safety Concern

### Issue

Environment variable prefixed with NEXT_PUBLIC\_ exposed in frontend.

### Concern

Sensitive keys might be leaked to browser.

### Solution

- Verified Supabase anon public key is safe for frontend.
- Ensured service_role key is NEVER exposed.
- Stored sensitive keys only in backend environment.

---

## 4️. Problem: Realtime Not Triggering

### Issue

Realtime events were not firing.

### Root Cause

Realtime replication was not enabled on the table.

### Solution

Enabled replication for the bookmarks table in Supabase dashboard.

---

## 5️. Problem: Duplicate Data Fetching

### Issue

Realtime event triggered and manual state update both executed.

### Root Cause

State was updated manually AND via re-fetch.

### Solution

Chose single source of truth: - Always re-fetch from DB when realtime
event fires - Removed manual optimistic update

---

# 📂 Project Structure

    /app
      /dashboard
        page.tsx
    /lib
      supabase.ts

---

# 🧪 How to Run Locally

## 1️⃣ Clone Repo

```bash
    git clone https://github.com/Dante-eraa/real-time-bookmark.git
```

## 2️⃣ Install Dependencies

```bash
    npm install
```

## 3️⃣ Setup Environment Variables

Create `.env.local`:

```bash
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 4️⃣ Run Dev Server

```bash
    npm run dev
```
