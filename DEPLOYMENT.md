# Indian History App - Deployment Guide

## Quick Start

1. **Extract the zip file** to your desired location
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variable**:
   - Create a `.env` file in the root directory
   - Add your Hugging Face API key:
     ```
     HUGGINGFACE_API_KEY=your_api_key_here
     ```
4. **Start the application**:
   ```bash
   npm run dev
   ```

## For Production Deployment

### Option 1: Simple Node.js Hosting
- Upload all files to your server
- Run `npm install`
- Set environment variable `HUGGINGFACE_API_KEY`
- Run `npm run dev` (or create a production script)

### Option 2: Replit Deployment
- Upload the zip to a new Replit project
- Set the Hugging Face API key in Replit Secrets
- The app will automatically start

### Option 3: Vercel/Netlify
- The app includes both frontend and backend
- You may need to separate them or use their full-stack features
- Set the API key in environment variables

## Environment Variables Required
- `HUGGINGFACE_API_KEY`: Get this free from huggingface.co

## Features Included
- ✅ Indian historical facts with fallback system
- ✅ Dark/light theme toggle
- ✅ Category explorer
- ✅ Responsive design
- ✅ Professional UI with Indian cultural elements

The app works even without the API key thanks to the fallback system with curated Indian historical facts!