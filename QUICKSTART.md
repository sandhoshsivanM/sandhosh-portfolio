# Quick Start Guide

## Getting Your Portfolio Live in 5 Minutes

### Step 1: Prerequisites
Make sure you have installed:
- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- Git - [Download here](https://git-scm.com/)

### Step 2: Setup Email (for contact form)

#### For Gmail:
1. Go to your [Google Account](https://myaccount.google.com/)
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Scroll down to **App passwords**
5. Select app: **Mail**
6. Select device: **Other (Custom name)** → Enter "Portfolio"
7. Click **Generate**
8. Copy the 16-character password (you'll need this later)

#### For Other Email Services:
- **Outlook/Hotmail:** Enable 2FA and generate an app password
- **Yahoo:** Enable less secure app access or use app password
- **Custom SMTP:** Get credentials from your email provider

### Step 3: Install & Configure

Open terminal/command prompt and run:

```bash
# 1. Navigate to the portfolio folder
cd sandhosh-portfolio

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Open .env.local in a text editor and add your email credentials
# Replace with your actual email and app password
```

Edit `.env.local`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### Step 4: Add Your Photo

Replace the file at `public/profile.jpg` with your own photo.

**Photo Requirements:**
- Format: JPG, PNG, or WebP
- Recommended size: 800x800 pixels or larger
- Aspect ratio: Square (1:1) works best
- File size: Under 1MB for best performance

### Step 5: Run Locally

```bash
npm run dev
```

Open your browser and visit: [http://localhost:3000](http://localhost:3000)

Your portfolio is now running! 🎉

### Step 6: Customize Content

Edit these files to personalize your portfolio:

1. **Hero Section** - `src/components/Hero.tsx`
   - Update your name, title, bio
   - Change social media links

2. **About** - `src/components/About.tsx`
   - Update professional summary
   - Modify achievements

3. **Experience** - `src/components/Experience.tsx`
   - Add/edit work history
   - Update education

4. **Projects** - `src/components/Projects.tsx`
   - Showcase your projects
   - Add project details

5. **Skills** - `src/components/Skills.tsx`
   - Update your tech stack
   - Adjust skill levels

6. **Contact** - `src/components/Contact.tsx`
   - Update contact information
   - Modify location

### Step 7: Deploy to Production

#### Deploy to Vercel (Free & Easy):

1. Create account at [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository (or upload the folder)
4. Add environment variables:
   - `EMAIL_USER` = your email
   - `EMAIL_PASS` = your app password
5. Click **Deploy**

Your portfolio will be live at: `your-project-name.vercel.app`

You can also add a custom domain in Vercel settings!

## Troubleshooting

### Contact form not working?
- Make sure `.env.local` has correct email credentials
- Check that you're using an **app password**, not your regular password
- Test your email settings by clicking "Send Message" on the contact form

### Page not loading?
- Make sure you ran `npm install`
- Check that Node.js version is 18 or higher: `node --version`
- Try deleting `node_modules` and `.next` folders, then run `npm install` again

### Build errors?
- Run `npm run build` to see detailed error messages
- Make sure all files are saved
- Check for TypeScript errors in your code editor

### Need help?
Feel free to reach out at sandhoshsivan007@gmail.com

## Pro Tips

1. **Test contact form locally** before deploying
2. **Use your own projects** instead of the example ERP modules
3. **Update colors** in `tailwind.config.ts` to match your brand
4. **Add analytics** (Google Analytics, Vercel Analytics) to track visitors
5. **Set up a custom domain** for a professional touch

---

That's it! You now have a fully functional, professional portfolio website. 🚀
