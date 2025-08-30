# Airbnb

A full-featured Airbnb built with Next.js 14, TypeScript, Prisma, NextAuth, and Tailwind CSS.

## 🚀 Features

- **Authentication**: Sign up, sign in, and sign out with NextAuth
- **Listings**: Create, view, and manage property listings
- **Reservations**: Book properties with date selection and pricing
- **Favorites**: Save and manage favorite listings
- **Search & Filters**: Search by location, dates, guests, and categories
- **Image Upload**: Azure Blob Storage integration for property images
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Optimistic UI updates for better UX
- **Property Management**: Property owners can manage their listings and view all bookings
- **Smart Booking System**: Property owners cannot book their own properties
- **Enhanced Date Selection**: Intuitive date range picker with visual feedback
- **Currency Support**: INR currency formatting with proper localization
- **Country Selection**: Enhanced country picker with search functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Storage**: Azure Blob Storage (with connection string support)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+
- Git
- PostgreSQL database (local or hosted)
- Azure Storage account (optional)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ramankumar7c/Airbnb.git
cd airbnb
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/airbnb_clone"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Azure Storage (optional - will fallback to placeholder images if not set)
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=your_account;AccountKey=your_key;EndpointSuffix=core.windows.net"
AZURE_STORAGE_CONTAINER="airbnb-images"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses the following Prisma models:

- **User**: Authentication and user management
- **Listing**: Property listings with details (title, description, images, pricing, location)
- **Reservation**: Booking information with dates, guest counts, and pricing

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (my-pages)/        # User dashboard pages (bookings, favorites, properties)
│   ├── api/               # API routes
│   ├── listings/          # Listing detail pages
│   └── become-a-host/     # Host onboarding
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Custom components (navbar, listings, forms)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries (auth, prisma)
├── utils/                  # Helper functions (formatMoney, uploadToBlob)
└── prisma/                 # Database schema and migrations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
2. **Go to [vercel.com](https://vercel.com) and sign in**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure project settings and deploy**

### Database Setup for Production

#### **Option 1: Supabase (Recommended)**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

#### **Option 2: Neon**
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Get connection string from dashboard

#### **Option 3: PlanetScale**
1. Create account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string

### Environment Variables Setup in Vercel Dashboard

1. **Go to your project in Vercel dashboard**
2. **Click on "Settings" tab**
3. **Click "Environment Variables" in the left sidebar**
4. **Add these variables one by one:**

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth (Required)
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Azure Storage (Optional)
AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
AZURE_STORAGE_CONTAINER="airbnb-images"
```

5. **Click "Save" after adding each variable**
6. **Redeploy your project** (Vercel will automatically redeploy when you add environment variables)

### Post-Deployment Steps

1. **Verify Environment Variables:**
   - Go to your project → Settings → Environment Variables
   - Ensure all variables are listed and have correct values

2. **Check Deployment Status:**
   - Go to "Deployments" tab
   - Look for any build errors
   - Check function logs if there are issues

3. **Test Your App:**
   - Visit your live URL
   - Test authentication
   - Test creating listings and reservations

### Automatic Database Operations

✅ **Database operations happen automatically during deployment:**
- **Prisma client generation** (`prisma generate`)
- **Database migrations** (`prisma migrate deploy`)
- **No manual intervention needed**

**Requirements:**
- `DATABASE_URL` must be set in Vercel environment variables
- Production database must be accessible from Vercel build environment
- All migrations must be committed to your repository

### Troubleshooting

- **Build Errors**: Check the build logs in Vercel dashboard
- **Database Connection Issues**: Verify DATABASE_URL format and network access
- **Environment Variables**: Ensure all required variables are set and saved
- **Function Errors**: Check function logs in the "Functions" tab

### Dashboard Tips

- **Environment Variables**: You can set different values for Production, Preview, and Development
- **Automatic Deployments**: Vercel automatically redeploys when you push to GitHub
- **Function Logs**: Use the "Functions" tab to debug API issues
- **Analytics**: Monitor your app's performance in the "Analytics" tab

## 🎨 Customization

### Styling

The app uses Tailwind CSS with shadcn/ui components. You can customize:

- Colors in `tailwind.config.ts`
- Component styles in `src/components/ui/`
- Global styles in `src/app/globals.css`

### Adding New Features

1. Create new API routes in `src/app/api/`
2. Add new pages in `src/app/`
3. Create components in `src/components/`
4. Update Prisma schema if needed

## 🔐 Security Features

- **Property Owner Protection**: Property owners cannot book their own properties
- **User Authentication**: Secure login/signup with NextAuth
- **Data Validation**: Input validation and sanitization
- **Protected Routes**: Authentication-required pages and API endpoints

## 📱 User Experience

- **Smart Date Selection**: Visual date range picker with availability checking
- **Real-time Pricing**: Automatic price calculation based on selected dates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Intuitive Navigation**: Clear user flows for guests and hosts
- **Booking Management**: Property owners can view all reservations on their properties

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/ramankumar7c/Airbnb/issues) page
2. Create a new issue with detailed information
3. Check the console for error messages

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)

## 📍 Repository

This project is hosted at: [https://github.com/ramankumar7c/Airbnb.git](https://github.com/ramankumar7c/Airbnb.git)
