import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import LowStockAlerts from "./pages/admin/LowStockAlerts";
import Bills from "./pages/admin/Bills";
import CreateBill from "./pages/admin/CreateBill";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogList from "./pages/admin/BlogList";
import BlogEditor from "./pages/admin/BlogEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Product />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes - Protected */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Products />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products/new" 
                element={
                  <ProtectedRoute requireAdmin>
                    <ProductForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products/edit/:id" 
                element={
                  <ProtectedRoute requireAdmin>
                    <ProductForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products/bulk-import" 
                element={
                  <ProtectedRoute requireAdmin>
                    <BulkImport />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products/bulk-location-update" 
                element={
                  <ProtectedRoute requireAdmin>
                    <BulkLocationUpdate />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products/qr-labels" 
                element={
                  <ProtectedRoute requireAdmin>
                    <QRLabels />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/qr-scanner" 
                element={<QRScanner />} 
              />
              <Route 
                path="/admin/inventory-analytics" 
                element={
                  <ProtectedRoute requireAdmin>
                    <InventoryAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/low-stock" 
                element={
                  <ProtectedRoute requireAdmin>
                    <LowStockAlerts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/bills"
                element={
                  <ProtectedRoute requireAdmin>
                    <Bills />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin/bills/new" 
                element={
                  <ProtectedRoute requireAdmin>
                    <CreateBill />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog" 
                element={
                  <ProtectedRoute requireAdmin>
                    <BlogList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog/new" 
                element={
                  <ProtectedRoute requireAdmin>
                    <BlogEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog/edit/:id" 
                element={
                  <ProtectedRoute requireAdmin>
                    <BlogEditor />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 - ADD ALL CUSTOM ROUTES ABOVE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
