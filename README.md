# ChatGPT Clone - Frontend

A modern, responsive React.js frontend for a ChatGPT clone application with real-time chat interface, conversation management, and dark/light theme support.

## 🚀 Live Demo

- **Live Application**: `https://chatgpt-one-khaki.vercel.app`
- **Backend API**: `https://chatgptbe-production.up.railway.app`

## 📋 Features

- **Real-time Chat Interface**: Smooth, responsive chat experience
- **Conversation Management**: Create, view, and delete chat conversations
- **Theme Support**: Dark and light mode toggle
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Redux Toolkit for global state management
- **Persistent Storage**: Redux Persist for maintaining state across sessions
- **Loading States**: Elegant loading animations and states
- **Error Handling**: User-friendly error messages and notifications
- **Modern UI**: Clean, intuitive interface inspired by ChatGPT

## 🛠️ Tech Stack

- **Framework**: React.js 18
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Redux Persist
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Form Handling**: Formik + Yup validation
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Build Tool**: Create React App
- **Deployment**: Vercel

## 📦 Dependencies

### Core Dependencies
- `react` & `react-dom` - React framework
- `@reduxjs/toolkit` - Modern Redux state management
- `react-redux` - React-Redux bindings
- `redux-persist` - State persistence
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls
- `tailwindcss` - Utility-first CSS framework

### UI & UX Dependencies
- `react-icons` - Icon library
- `react-toastify` - Toast notifications
- `formik` - Form handling
- `yup` - Schema validation
- `file-saver` - File download utility

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8003/api/v1
   ```

   For production:
   ```env
   REACT_APP_API_BASE_URL=https://chatgptbe-production.up.railway.app/api/v1
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
FE/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── assets/                 # Static assets (images, icons)
│   │   ├── chatloader.gif
│   │   ├── icon.svg
│   │   ├── logo.svg
│   │   ├── Moon.svg
│   │   └── Sun.svg
│   ├── DarkMode/              # Theme management
│   ├── routes/                # Route configurations
│   │   └── MainRoutes.jsx
│   ├── store/                 # Redux store configuration
│   │   └── store.jsx
│   ├── ui-components/         # Reusable UI components
│   │   └── LandingPage/
│   │       ├── CommonUi/      # Shared components
│   │       └── LandingPageUi/ # Page-specific components
│   ├── utils/                 # Utility functions
│   │   └── apiRequest.jsx     # API service layer
│   ├── views/                 # Page components
│   │   └── pages/
│   │       └── MainPages/
│   ├── index.css              # Global styles
│   └── index.js               # Application entry point
├── tailwind.config.js         # Tailwind configuration
└── package.json               # Dependencies and scripts
```

## 🎨 Design System

### Color Scheme
- **Primary**: Modern blue gradient
- **Dark Mode**: Deep grays and blacks
- **Light Mode**: Clean whites and light grays
- **Accent**: Vibrant colors for CTAs and highlights

### Typography
- **Headings**: Clean, modern font stack
- **Body**: Readable, accessible typography
- **Code**: Monospace font for code blocks

### Components
- **Modular Design**: Reusable component architecture
- **Responsive**: Mobile-first responsive design
- **Accessible**: ARIA labels and keyboard navigation

## 🔧 Design Decisions

### State Management
- **Redux Toolkit**: Simplified Redux with modern patterns
- **Redux Persist**: Automatic state persistence across sessions
- **Normalized State**: Efficient state structure for chat data

### Component Architecture
- **Atomic Design**: Components organized by complexity
- **Container/Presentational**: Separation of logic and UI
- **Custom Hooks**: Reusable logic extraction

### Performance Optimizations
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Dynamic imports for better performance
- **Memoization**: React.memo for expensive components

### User Experience
- **Loading States**: Skeleton screens and spinners
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliance considerations

## 🌐 API Integration

### Service Layer
The application uses a centralized API service layer (`utils/apiRequest.jsx`) for:
- HTTP request configuration
- Error handling
- Request/response interceptors
- Base URL management

### Endpoints Used
```javascript
// Chat endpoints
POST /gpt/chat              // Send chat message
GET /gpt/chat-history       // Get all conversations
GET /gpt/single-chat-history/:id  // Get specific conversation
DELETE /gpt/chat-history/:id      // Delete conversation
DELETE /gpt/delete               // Delete all conversations
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
REACT_APP_API_BASE_URL=https://chatgptbe-production.up.railway.app/api/v1
```

### Build Optimization
- **Bundle Analysis**: Use `npm run build` to analyze bundle size
- **Asset Optimization**: Automatic image and asset optimization
- **Caching**: Proper cache headers for static assets

## 🎯 Features Breakdown

### Chat Interface
- Real-time message display
- Typing indicators
- Message formatting with markdown support
- Copy message functionality
- Conversation threading

### Sidebar Navigation
- Conversation list
- New chat creation
- Conversation deletion
- Search and filter capabilities

### Theme System
- Dark/light mode toggle
- System preference detection
- Persistent theme selection
- Smooth theme transitions

### Responsive Design
- Mobile-optimized interface
- Tablet and desktop layouts
- Touch-friendly interactions
- Adaptive navigation

## 🧪 Testing

### Available Scripts
```bash
npm test          # Run test suite
npm run test:coverage  # Run tests with coverage
npm run test:watch     # Run tests in watch mode
```

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User flow testing (future enhancement)

## 🔍 Performance Monitoring

### Metrics Tracked
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Size**: JavaScript and CSS bundle analysis
- **Load Times**: Page load performance
- **User Interactions**: Click and navigation tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for new components (future enhancement)
- Write tests for new features
- Follow the existing code style
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**API Connection Failed**
- Check if backend is running
- Verify API base URL in environment variables
- Check browser console for CORS errors

**Build Failures**
- Clear node_modules and reinstall dependencies
- Check for TypeScript errors
- Verify all environment variables are set

**Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS rules
- Verify responsive breakpoints

## 🔮 Future Enhancements

- **TypeScript Migration**: Full TypeScript support
- **PWA Features**: Offline support and push notifications
- **Voice Input**: Speech-to-text functionality
- **File Uploads**: Document and image sharing
- **User Authentication**: User accounts and personalization
- **Advanced Formatting**: Rich text editor integration

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ using React.js and modern web technologies.