# Timeless Dimension Portal

A professional, production-ready ecommerce platform for luxury wristwatches, built with Next.js, React Three Fiber, and MERN stack. Features 3D product visualization, Nigerian cultural elements, and modern ecommerce functionality.

## 🚀 Features

- **3D Product Visualization**: Interactive 3D models using React Three Fiber
- **Nigerian Cultural Integration**: Design elements inspired by Nigerian heritage
- **Modern Ecommerce**: Full shopping cart, checkout, and order management
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Authentication**: JWT-based user authentication
- **Payment Integration**: Stripe and Nigerian payment gateways
- **Admin Dashboard**: Product and order management
- **SEO Optimized**: Meta tags, structured data, and performance optimization

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **TailwindCSS** - Utility-first CSS framework
- **React Three Fiber** - 3D graphics library
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Stripe** - Payment processing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd timeless-dimension-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   - MongoDB connection string
   - JWT secret
   - Stripe keys
   - Other service credentials

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in your `.env.local`

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately
   npm run dev        # Frontend (port 3000)
   npm run server     # Backend (port 4000)
   ```

## 🎨 Design System

### Color Palette
- **Primary Midnight**: `#0B1020` → `#121827`
- **Accent Electric Teal**: `#00E5C4`
- **Rich Gold**: `#D4AF37`
- **Soft Silver**: `#E6EEF6`
- **Nigerian Colors**: Green `#008751`, White `#FFFFFF`, Red `#E31E24`

### Typography
- **Display Font**: Poppins (headings)
- **Body Font**: Inter (content)

## 🏗️ Project Structure

```
timeless-dimension-portal/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── product/[slug]/
│   │   ├── shop/
│   │   └── checkout/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductShowcase3D.tsx
│   │   ├── ProductCard.tsx
│   │   └── CartDrawer.tsx
│   ├── lib/                 # Utility functions
│   └── styles/              # Global styles
├── server/                  # Express backend
│   ├── routes/              # API routes
│   ├── models/              # MongoDB models
│   └── index.js
├── public/
│   └── assets/
│       ├── models/          # 3D model files (.glb)
│       └── images/          # Product images
└── package.json
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

## 🎯 3D Models

The project supports GLTF/GLB 3D models for product visualization:

1. Place your `.glb` files in `public/assets/models/`
2. Update product data with the model path
3. Models are automatically loaded in the 3D viewer

### Model Requirements
- Format: GLTF/GLB
- Polygons: 20k-50k recommended
- Size: < 5MB for web performance
- Use DRACO compression for smaller files

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Connect your repository
2. Set environment variables
3. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in production environment
3. Configure IP whitelist and database user

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly 3D controls
- Optimized images and models
- Progressive Web App (PWA) ready

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)

## 🎨 Customization

### Adding New Product Categories
1. Update the `category` enum in `Product.js`
2. Add category to the categories array in shop page
3. Update filtering logic as needed

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `globals.css` for custom styles
- Use CSS variables for dynamic theming

## 📊 Performance

- Image optimization with Next.js Image
- 3D model lazy loading
- Code splitting and dynamic imports
- CDN-ready static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@timeless.ng
- Documentation: [Link to docs]

## 🙏 Acknowledgments

- Nigerian cultural inspiration
- React Three Fiber community
- Next.js and Vercel team
- Open source contributors

---

**Built with ❤️ for the Nigerian market**
