# Gulmohar

Gulmohar is the official digital art gallery and creative platform for Bharata Mata College. It serves as a space for students to showcase their artistic talents, including paintings, sketches, digital art, short films and editorial content. It has an admin dashboard for managing submissions and users (different repo).
<br />
<br />
Fork and **contribute** to help us enhance the platform!

Live Deployment: <https://gulmohar.bharatamatacollege.in>

## Tech Stack

This project is built as a universal application (Web, Android, iOS) using the following technologies:

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Styling**: NativeWind v4 (Tailwind CSS)
- **Package Manager**: pnpm
- **Deployment**: EAS (Expo Application Services) and github pages

## Build

### Web

```
npx expo export --platform web

eas deploy
```

### Android

```
# Use profile with your own
 eas build --profile development --platform android --local
```

## TODO

    [] Sort content (improved filtering and sorting options).

    [] Student verification system.

    [] Add Blog category for written submissions.

    [] Publish mobile application to Google Play Store.

## Getting Started

To run this project locally:

```
# Clone the repository
git clone https://github.com/jude7733/Gulmohar.git

# Install dependencies
pnpm install

# Start the development server
npx expo start
```
