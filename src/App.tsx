import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Index from './pages/Index';
import Product from './pages/Product';
import Gallery from './pages/Gallery';

import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import BulkImport from "./pages/admin/BulkImport";
import BulkLocationUpdate from "./pages/admin/BulkLocationUpdate";
import QRLabels from "./pages/admin/QRLabels";
import QRScanner from "./pages/QRScanner";
import InventoryAnalytics from "./pages/admin/InventoryAnalytics";
import Bills from "./pages/admin/Bills";
import CreateBill from "./pages/admin/CreateBill";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogList from "./pages/admin/BlogList";
import BlogEditor from "./pages/admin/BlogEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Product /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes - Protected */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><Products /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/new" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><ProductForm /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/edit/:id" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><ProductForm /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/bulk-import" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><BulkImport /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/bulk-location-update" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><BulkLocationUpdate /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/qr-labels" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><QRLabels /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/qr-scanner" 
          element={<PageTransition><QRScanner /></PageTransition>} 
        />
        <Route 
          path="/admin/inventory-analytics" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><InventoryAnalytics /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/bills"
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><Bills /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/bills/new" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><CreateBill /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/blog" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><BlogList /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/blog/new" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><BlogEditor /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/blog/edit/:id" 
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition><BlogEditor /></PageTransition>
            </ProtectedRoute>
          } 
        />
        
        {/* 404 - ADD ALL CUSTOM ROUTES ABOVE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AnimatedRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
