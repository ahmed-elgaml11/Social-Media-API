# Social Media API

A robust backend for a social media application built with [NestJS](https://nestjs.com/). This API supports real-time features using Socket.io and handles complex relationships including friendships, groups, and media uploads.

## 🚀 Features

- **Authentication**: JWT-based auth with Sign Up/Sign In.
- **Real-time Communication**: Socket.io integration for instant messaging, notifications, and updates.
- **Media Handling**: Cloudinary integration for image/media uploads.
- **Social Features**:
    - **Friendships**: Send, accept, reject, and cancel friend requests.
    - **Conversations**: Private and Group chats.
    - **Posts**: Create, update, delete posts with reactions and comments.
    - **Comments**: Add ,update and delete comments to posts.
    - **Reactions**: Add ,update and delete reactions to posts.
    - **Notifications**: Real-time system notifications.

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB (via Mongoose)
- **Real-time**: Socket.io
- **Media Storage**: Cloudinary
- **Language**: TypeScript

## 📦 Getting Started

### Prerequisites

- Node.js (v16+)
- npm 
- MongoDB Instance
- Cloudinary Account

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/ahmed-elgaml11/Social-Media-API.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    Create a `.env` file in the root directory and configure the following:
    ```env
    PORT=3000
    DATABASE_URI=mongodb://localhost:27017/social-media
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

### Running the App

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```


## 🔌 Socket.io Events

The API uses WebSockets for real-time updates. Connect to the root URL (e.g., `http://localhost:3000`).

### Connection
- **Namespace**: `/`
- **Auth**: Sent via headers or query params (depending on guard implementation).

### Emitters (Server -> Client)

| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `post_created` | `ResponsePostDto` | New post created. |
| `post_update` | `{ postId, content, ... }` | Post updated. |
| `post_add_reaction` | `ResponsePostDto` | Reaction added. |
| `send_friend_request` | `ResponseFriendRequestDto` | Received friend request. |
| `accept_friend_request`| `ResponseFriendRequestDto` | Friend request accepted. |
| `new_message` | `ResponseMessagesDto` | New message in conversation. |
| `notification_created` | `ResponseNotificationDto` | New notification. |
| `comment_created` | `ResponseCommentDto` | New comment on a post. |

### Listeners (Client -> Server)
- `join` / `join_room` - Join specific rooms (e.g., user ID or conversation ID) to receive private events.
