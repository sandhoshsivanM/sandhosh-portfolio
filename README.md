# Sandhoshsivan M - Personal Portfolio

A modern, interactive personal portfolio website showcasing my backend development expertise and ERP architecture projects.

## 🚀 Features

- **Immersive Hero Section:** Animated profile photo with dynamic background effects
- **Professional Timeline:** Interactive experience and education timeline
- **ERP Modules Showcase:** 12+ comprehensive project cards with detailed descriptions
- **Skills Visualization:** Animated skill bars across 8+ technology categories
- **Contact Form:** Fully functional contact form with email integration
- **Responsive Design:** Optimized for all devices and screen sizes
- **Smooth Animations:** Powered by Framer Motion and CSS animations
- **Modern UI:** Built with Tailwind CSS and custom design system

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion, CSS Animations
- **Email:** Nodemailer
- **Icons:** Lucide React
- **Deployment:** Vercel (recommended)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sandhoshsivan/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your email credentials:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

   **For Gmail:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification
   - Scroll down to "App passwords"
   - Generate a new app password for "Mail"
   - Use this password in `.env.local`

4. **Add your profile photo:**
   
   Replace `/public/profile.jpg` with your own photo.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** to view the portfolio.

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/contact/      # Contact form API endpoint
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/
│   │   ├── Navigation.tsx     # Navigation bar
│   │   ├── Hero.tsx           # Hero section with profile
│   │   ├── About.tsx          # About section
│   │   ├── Experience.tsx     # Timeline
│   │   ├── Projects.tsx       # ERP modules showcase
│   │   ├── Skills.tsx         # Skills visualization
│   │   └── Contact.tsx        # Contact form
│   └── styles/
│       └── globals.css        # Global styles
├── public/
│   └── profile.jpg            # Your profile photo
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
└── package.json               # Dependencies
```

## 🎨 Customization

### Update Personal Information

1. **Hero Section** (`src/components/Hero.tsx`):
   - Update name, title, bio, and stats
   - Modify social links

2. **About Section** (`src/components/About.tsx`):
   - Update professional summary
   - Modify achievements and key strengths

3. **Experience** (`src/components/Experience.tsx`):
   - Add/edit work experience
   - Update education details

4. **Projects** (`src/components/Projects.tsx`):
   - Customize ERP modules or add your own projects
   - Change colors and descriptions

5. **Skills** (`src/components/Skills.tsx`):
   - Update skill categories and proficiency levels

6. **Contact** (`src/components/Contact.tsx`):
   - Update contact information
   - Modify collaboration areas

### Color Scheme

The portfolio uses a blue-purple gradient theme. To customize:

1. Edit color values in `tailwind.config.ts`
2. Update gradient classes in `src/styles/globals.css`

### Fonts

Current fonts:
- **Headings:** Raleway
- **Monospace:** Space Mono

To change fonts, update the Google Fonts import in `src/styles/globals.css`.

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `EMAIL_USER`
   - `EMAIL_PASS`
5. Deploy!

### Other Platforms

The portfolio can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Azure Static Web Apps
- DigitalOcean App Platform

## 🔒 Environment Variables

Required environment variables for contact form:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Security Notes:**
- Never commit `.env.local` to version control
- Use app-specific passwords, not your main email password
- In production, set these in your hosting platform's environment settings

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

**Sandhoshsivan M**
- Email: sandhoshsivan007@gmail.com
- Location: Abu Dhabi, UAE
- LinkedIn: [linkedin.com/in/sandhoshsivan](https://linkedin.com/in/sandhoshsivan)
- GitHub: [github.com/sandhoshsivan](https://github.com/sandhoshsivan)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
