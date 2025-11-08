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
import Timeline from './pages/Timeline';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import BulkImport from "./pages/admin/BulkImport";
import Bills from "./pages/admin/Bills";
import CreateBill from "./pages/admin/CreateBill";
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
              <Route path="/product" element={<Product />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/timeline" element={<Timeline />} />
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
