// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Menu, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Link, useLocation } from 'react-router-dom';
// import razzaqLogo from '@/assets/razzaq-logo.png';
// const Navigation = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const location = useLocation();
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({
//         behavior: 'smooth'
//       });
//       setIsOpen(false);
//     }
//   };
//   const navItems = [{
//     label: 'Home',
//     id: 'hero',
//     isRoute: false
//   }, {
//     label: 'Legacy',
//     id: 'legacy',
//     isRoute: false
//   }, {
//     label: 'Capabilities',
//     id: 'capabilities',
//     isRoute: false
//   }, {
//     label: 'Partnerships',
//     id: 'partnerships',
//     isRoute: false
//   }, {
//     label: 'Advantage',
//     id: 'advantage',
//     isRoute: false
//   }, {
//     label: 'Gallery',
//     id: '/gallery',
//     isRoute: true
//   }, {
//     label: 'Contact',
//     id: 'contact',
//     isRoute: false
//   }];

//   const handleNavClick = (item: typeof navItems[0]) => {
//     if (item.isRoute) {
//       setIsOpen(false);
//     } else {
//       scrollToSection(item.id);
//     }
//   };
//   return <motion.nav initial={{
//     y: -100
//   }} animate={{
//     y: 0
//   }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border/20' : 'bg-transparent'}`}>
//       <div className="container mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/">
//             <motion.div whileHover={{
//             scale: 1.05
//           }} className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
//                 <img src={razzaqLogo} alt="Razzaq Automotives" className="w-full h-full object-contain" />
//               </div>
//               <div>
//                 <h2 className="font-heading font-bold text-xl text-foreground">Razzaq Automotives</h2>
//                 <p className="text-accent text-xs font-medium">Estd. 1976</p>
//               </div>
//             </motion.div>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-8">
//             {navItems.map(item => (
//               item.isRoute ? (
//                 <Link key={item.id} to={item.id} className="nav-link font-medium">
//                   {item.label}
//                 </Link>
//               ) : (
//                 <button key={item.id} onClick={() => handleNavClick(item)} className="nav-link font-medium">
//                   {item.label}
//                 </button>
//               )
//             ))}
//             <Button onClick={() => scrollToSection('contact')} variant="default" className="btn-hero">
//               Get Quote
//             </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </Button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && <motion.div initial={{
//         opacity: 0,
//         height: 0
//       }} animate={{
//         opacity: 1,
//         height: 'auto'
//       }} exit={{
//         opacity: 0,
//         height: 0
//       }} className="lg:hidden mt-4 pb-4 border-t border-border/20 bg-background/95 backdrop-blur-sm rounded-b-lg">
//             <div className="flex flex-col space-y-4 pt-4">
//               {navItems.map(item => (
//                 item.isRoute ? (
//                   <Link key={item.id} to={item.id} onClick={() => setIsOpen(false)} className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors">
//                     {item.label}
//                   </Link>
//                 ) : (
//                   <button key={item.id} onClick={() => handleNavClick(item)} className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors">
//                     {item.label}
//                   </button>
//                 )
//               ))}
//               <Button onClick={() => scrollToSection('contact')} className="btn-hero mx-4 mt-2">
//                 Get Quote
//               </Button>
//             </div>
//           </motion.div>}
//       </div>
//     </motion.nav>;
// };
// export default Navigation;








// src/components/Navigation.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, User, Map, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import razzaqLogo from "@/assets/razzaq-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useTreasureHunt } from "@/hooks/useTreasureHunt";
import TreasureHunt from "./TreasureHunt";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", id: "/", isRoute: true },
  { 
    label: "Partnerships", 
    id: "partnerships", 
    isRoute: false,
    dropdown: [
      { label: "Partnerships", id: "partnerships", isRoute: false },
      { label: "Advantage", id: "advantage", isRoute: false }
    ]
  },
  { label: "Products", id: "/products", isRoute: true },
  { label: "Gallery", id: "/gallery", isRoute: true },
  { label: "Blogs", id: "/blog", isRoute: true },
  { label: "Contact", id: "contact", isRoute: false },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showTreasureMap, setShowTreasureMap] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { updateProgress } = useTreasureHunt();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logo click easter egg
  useEffect(() => {
    if (logoClicks >= 5) {
      updateProgress('clue1');
      setLogoClicks(0);
    }
  }, [logoClicks, updateProgress]);

  const handleLogoClick = () => {
    setLogoClicks((prev) => prev + 1);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isRoute) {
      // Route navigation (e.g., Gallery)
      setIsOpen(false);
      navigate(item.id);
    } else {
      // Anchor navigation
      if (location.pathname === "/") {
        // Same page scroll
        scrollToSection(item.id);
      } else {
        // Navigate to home first then scroll
        navigate("/", { state: { scrollTo: item.id } });
        setIsOpen(false);
        setTimeout(() => scrollToSection(item.id), 350); // wait for DOM to mount
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={razzaqLogo}
                  alt="Razzaq Automotives"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground">
                  Razzaq Automotives
                </h2>
                <p className="text-accent text-xs font-medium">Estd. 1976</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) =>
              item.dropdown ? (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger className="nav-link font-medium flex items-center gap-1 hover:text-accent transition-colors">
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background border-border">
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem
                        key={subItem.id}
                        onClick={() => handleNavClick(subItem)}
                        className="cursor-pointer hover:bg-muted"
                      >
                        {subItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.isRoute ? (
                <Link
                  key={item.id}
                  to={item.id}
                  className="nav-link font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="nav-link font-medium"
                >
                  {item.label}
                </button>
              )
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTreasureMap(true)}
              className="nav-link font-medium gap-2"
              title="Treasure Hunt Map"
            >
              <Map className="w-4 h-4" />
              <span className="hidden xl:inline">Map</span>
            </Button>
            <ThemeToggle />
            {isAdmin && (
              <Link to="/admin" className="nav-link font-medium text-accent">
                Admin
              </Link>
            )}
            {user ? (
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
            <Button
              onClick={() => handleNavClick({ label: "Get Quote", id: "contact", isRoute: false })}
              variant="default"
              className="btn-hero"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pb-4 border-t border-border/20 bg-background/95 backdrop-blur-sm rounded-b-lg"
          >
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div key={item.id} className="space-y-2">
                    <div className="text-left py-2 px-4 font-medium text-muted-foreground">
                      {item.label}
                    </div>
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleNavClick(subItem)}
                        className="text-left py-2 px-8 rounded-lg hover:bg-card transition-colors w-full"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                ) : item.isRoute ? (
                  <Link
                    key={item.id}
                    to={item.id}
                    onClick={() => setIsOpen(false)}
                    className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors"
                  >
                    {item.label}
                  </button>
                )
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors text-accent font-medium"
                >
                  Admin
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/qr-scanner"
                  onClick={() => setIsOpen(false)}
                  className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors"
                >
                  QR Scanner
                </Link>
              )}
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Account
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="text-left py-2 px-4 rounded-lg hover:bg-card transition-colors"
                >
                  Login
                </Link>
              )}
              <Button
                onClick={() => handleNavClick({ label: "Get Quote", id: "contact", isRoute: false })}
                className="btn-hero mx-4 mt-2"
              >
                Get Quote
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Treasure Hunt Modal */}
      <TreasureHunt isOpen={showTreasureMap} onClose={() => setShowTreasureMap(false)} />
    </motion.nav>
  );
};

export default Navigation;
