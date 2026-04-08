# BuildoHolics Hotel Management System (HMS)

This is a high-performance, Cyber-Noir themed Hotel Management System prototype built with Next.js 15, Firebase, and Genkit AI.

## GitHub Deployment Instructions

To push this project to your GitHub account:

1. **Create a Repository**: Go to [github.com/new](https://github.com/new) and create a new empty repository (do not initialize with README or license).
2. **Open Terminal**: In your local project root directory, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: BuildoHolics HMS"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Local Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file and add your Firebase and Genkit API keys.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/app`: Page routes (Dashboard, Reservations, Rooms, Guests).
- `src/components`: UI components and layout logic.
- `src/firebase`: Firebase SDK initialization and custom hooks.
- `src/ai`: Genkit AI flows for automated upsell suggestions.

## Branding
- **Name**: BuildoHolics
- **System**: Hotel Management System (HMS)
- **Theme**: Cyber-Noir (High Contrast / Industrial)
