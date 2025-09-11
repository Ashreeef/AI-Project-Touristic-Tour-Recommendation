# 7wess Frontend - Discover Algeria

A modern, responsive React application for discovering and planning trips to Algeria. Built with TypeScript, React Router, and Tailwind CSS.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, TypeScript, and modern hooks
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Routing**: Multi-page application with React Router
- **Interactive Components**: Enhanced UI with Radix UI primitives
- **Search & Filtering**: Advanced search and filter capabilities
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG compliant components

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   ├── layout/          # Layout components (Header, Footer, Layout)
│   ├── sections/        # Page sections (Hero, Destinations, etc.)
│   ├── common/          # Common components (PageHeader)
│   ├── destinations/    # Destination-specific components
│   ├── hotels/          # Hotel-specific components
│   ├── itinerary/       # Itinerary planning components
│   ├── about/           # About page components
│   └── contact/         # Contact page components
├── pages/               # Page components
│   ├── HomePage.tsx
│   ├── DestinationsPage.tsx
│   ├── HotelsPage.tsx
│   ├── ItinerariesPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   └── NotFoundPage.tsx
├── lib/                 # Utility functions
└── App.tsx             # Main application component
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

## 🎨 Design System

### Colors
- **Primary**: `#062546` (Dark Blue)
- **Secondary**: `#1e6f9f` (Light Blue)
- **Accent**: Various gradients and hover states

### Typography
- **Font Family**: Outfit (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Components
- Consistent spacing and sizing
- Hover effects and transitions
- Responsive grid layouts
- Accessible form controls

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 📱 Pages

### Home Page
- Hero section with call-to-action
- Search form for trip planning
- Featured destinations grid
- Featured hotels section
- Mission statement
- Statistics section

### Destinations Page
- Filterable destinations grid
- Advanced filtering sidebar
- Sort and view options
- Destination details

### Hotels Page
- Hotel listings with filters
- Price and rating filters
- Amenity-based filtering
- Booking integration ready

### Itineraries Page
- Trip planning form
- Popular itinerary gallery
- AI-powered recommendations
- Custom itinerary creation

### About Page
- Company information
- Mission and values
- Team section
- Company story

### Contact Page
- Contact form
- Contact information
- Interactive map placeholder
- Business hours

## 🎯 Key Improvements Made

### 1. **Modern Architecture**
- Replaced single-page component with proper routing
- Organized components by feature and type
- Implemented proper TypeScript interfaces

### 2. **Enhanced UX**
- Added responsive navigation with mobile menu
- Implemented smooth scrolling and animations
- Added interactive hover effects
- Improved form interactions

### 3. **Better Organization**
- Separated concerns (layout, pages, components)
- Created reusable component library
- Implemented consistent naming conventions

### 4. **Interactive Features**
- Advanced search and filtering
- Dynamic content loading
- Form validation ready
- State management prepared

### 5. **Accessibility**
- Proper ARIA labels
- Keyboard navigation
- Screen reader friendly
- Color contrast compliance

## 🔧 Customization

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/layout/Header.tsx`

### Adding New Components
1. Create component in appropriate folder
2. Export from component file
3. Import and use in pages

### Styling
- Use Tailwind CSS classes
- Follow existing color scheme
- Maintain responsive design
- Add hover and focus states

## 🚀 Future Enhancements

- [ ] Backend integration
- [ ] User authentication
- [ ] Real-time search
- [ ] Interactive maps
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Progressive Web App features
- [ ] Advanced animations
- [ ] Dark mode support

## 📄 License

This project is part of the 7wess tourism platform for Algeria.

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Maintain responsive design
4. Test on multiple devices
5. Follow accessibility guidelines