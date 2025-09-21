# ServMe Frontend

A modern Vue.js frontend for the ServMe restaurant management system.

## Features

- 🚀 **Vue 3** with Composition API
- 🎨 **Tailwind CSS** for styling
- 🗂 **Vue Router** for navigation
- 🏪 **Pinia** for state management
- 🔐 **JWT Authentication** with automatic token refresh
- 🏢 **Multi-tenant** support with tenant switching
- 📱 **Responsive design** for all devices
- 🔄 **Axios** with request/response interceptors

## Project Structure

```
src/
├── components/
│   ├── admin/           # Admin-specific components
│   ├── customer/        # Customer-facing components
│   └── shared/          # Reusable components
├── views/
│   ├── admin/           # Admin pages
│   └── customer/        # Customer pages
├── stores/              # Pinia stores
├── utils/               # Utility functions
├── assets/              # Static assets
└── router/              # Vue Router configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Laravel backend running on `http://localhost:8000`

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd servme-frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Integration

### Authentication

The frontend uses JWT tokens stored in localStorage:

```javascript
// Login
const authStore = useAuthStore()
await authStore.login({ email, password })

// Check authentication status
if (authStore.isAuthenticated) {
  // User is logged in
}

// Logout
await authStore.logout()
```

### Tenant Management

Multi-tenant support with automatic header injection:

```javascript
// Select tenant
const tenantStore = useTenantStore()
tenantStore.selectTenant(tenant)

// API calls automatically include X-Tenant-ID header
const response = await api.get('/v1/admin/tenant/dashboard')
```

### API Client

Pre-configured axios instance with interceptors:

```javascript
import api from '@/utils/api.js'

// Automatic token and tenant header injection
const response = await api.get('/v1/admin/products')
const newProduct = await api.post('/v1/admin/tenant/products', productData)
```

## Routing

### Admin Routes

- `/admin` - Dashboard
- `/admin/login` - Login page
- `/admin/orders` - Order management
- `/admin/products` - Product management
- `/admin/categories` - Category management

### Customer Routes

- `/menu/:qr` - Restaurant menu (QR code based)
- `/order/:orderNumber` - Order status tracking

## State Management

### Auth Store

```javascript
const authStore = useAuthStore()

// State
authStore.user          // Current user object
authStore.token         // JWT token
authStore.loading       // Loading state
authStore.isAuthenticated // Computed authentication status

// Actions
authStore.login(credentials)
authStore.logout()
authStore.checkAuth()
```

### Tenant Store

```javascript
const tenantStore = useTenantStore()

// State
tenantStore.tenants      // Available tenants
tenantStore.currentTenant // Selected tenant
tenantStore.loading      // Loading state

// Actions
tenantStore.fetchTenants()
tenantStore.selectTenant(tenant)
tenantStore.clearTenant()
```

## Styling

### Tailwind CSS

Pre-configured with custom utility classes:

```css
.btn              /* Base button styles */
.btn-primary      /* Primary button */
.btn-secondary    /* Secondary button */
.input            /* Form input styles */
.card             /* Card container */
```

### Custom Colors

```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  }
}
```

## Development Guidelines

### Component Structure

```vue
<template>
  <!-- Template with Tailwind classes -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// Component logic
</script>
```

### API Calls

```javascript
// Use the configured API client
import api from '@/utils/api.js'

// For tenant-specific operations
const response = await api.get('/v1/admin/tenant/products')

// For global admin operations  
const response = await api.get('/v1/admin/tenants')
```

### Error Handling

```javascript
try {
  const response = await api.post('/v1/admin/products', data)
  // Success handling
} catch (error) {
  if (error.response?.status === 422) {
    // Validation errors
    const errors = error.response.data.errors
  } else if (error.response?.status === 401) {
    // Authentication error (handled by interceptor)
  } else {
    // General error
    console.error('API Error:', error)
  }
}
```

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Production environment variables:

```bash
VITE_API_URL=https://api.yourservme.com/api
VITE_APP_NAME=ServMe
VITE_APP_ENV=production
```

### Deploy to Netlify/Vercel

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure redirects for SPA routing:

**Netlify** (`_redirects`):
```
/*    /index.html   200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Backend Integration

### Required Laravel Backend

This frontend requires the ServMe Laravel backend with:

- JWT authentication endpoints
- Tenant-aware API routes
- CORS configuration for frontend domain
- Multi-tenant database setup

### API Endpoints Used

**Authentication:**
- `POST /api/v1/admin/login`
- `GET /api/v1/admin/auth-check`
- `POST /api/v1/admin/logout`

**Admin (Global):**
- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/tenants`

**Admin (Tenant-specific):**
- `GET /api/v1/admin/tenant/dashboard`
- `GET /api/v1/admin/tenant/products`
- `GET /api/v1/admin/tenant/categories`
- `GET /api/v1/admin/tenant/orders`

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure Laravel backend has CORS middleware configured
   - Check that frontend URL is in allowed origins

2. **Authentication Issues:**
   - Verify JWT tokens are being stored in localStorage
   - Check that Authorization header is being sent

3. **Tenant Context Issues:**
   - Ensure X-Tenant-ID header is being sent
   - Verify tenant middleware is working on backend

### Debug Mode

Enable debug logging:

```javascript
// In main.js
if (import.meta.env.DEV) {
  console.log('Debug mode enabled')
}
```

## Contributing

1. Follow Vue 3 Composition API patterns
2. Use TypeScript for type safety (optional)
3. Follow Tailwind CSS utility-first approach
4. Write meaningful commit messages
5. Test authentication and tenant switching flows

## License

This project is part of the ServMe restaurant management system.
