import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationLinks = [
    { path: "/", label: "Home" },
    { path: "/membership", label: "Membership Plans" },
    { path: "/booking", label: "Book Appointment" },
    { path: "/insurance", label: "Insurance" },
  ];

  return (
   <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
  {/* Top bar with contact info */}
  <div className="bg-blue-600 text-white text-sm py-2">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>Emergency: +91 8590621417</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>24/7 Available</span>
        </div>
      </div>
      <div className="hidden md:block">
        <span>Patient Portal | Online Services</span>
      </div>
    </div>
  </div>

  {/* Main navigation */}
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/images/logo.png"
          alt="T-DENT Healthcare"
          className="h-12 w-auto"
        />
        <div>
          <div className="text-xl font-bold text-gray-800">
            T-DENT HEALTHCARE
          </div>
          <div className="text-xs text-gray-500">
            Your Health, Our Priority
          </div>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        {navigationLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "text-gray-700 transition-colors duration-200 font-medium py-2 px-3 rounded-md",
              isActive(link.path)
                ? "text-blue-600 bg-blue-50"
                : "hover:text-blue-600 hover:bg-blue-50"
            )}
          >
            {link.label}
          </Link>
        ))}

        {/* 🔽 Added Clinic and User Links */}
        <Link
          to="/cliniclog"
          className="text-gray-700 transition-colors duration-200 font-medium py-2 px-3 rounded-md hover:text-blue-600 hover:bg-blue-50"
        >
          Clinic
        </Link>
        <Link
          to="/userlog"
          className="text-gray-700 transition-colors duration-200 font-medium py-2 px-3 rounded-md hover:text-blue-600 hover:bg-blue-50"
        >
          User
        </Link>
      </nav>

      {/* CTA Buttons */}
      <div className="hidden lg:flex items-center gap-3">
        <Link to="/booking">
         <Button
  variant="outline"
  className="border border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
>
  Book Now
</Button>

        </Link>
        <Link to="/membership">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Membership
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-gray-700 p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200">
        <div className="flex flex-col space-y-2 pt-4">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "transition-colors duration-200 py-3 px-4 rounded-md",
                isActive(link.path)
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* 🔽 Added Clinic and User Links for Mobile */}
          <Link
            to="/cliniclog"
            className="transition-colors duration-200 py-3 px-4 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Clinic
          </Link>
          <Link
            to="/userlog"
            className="transition-colors duration-200 py-3 px-4 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => setIsMenuOpen(false)}
          >
            User
          </Link>

          <div className="flex flex-col gap-2 mt-4 px-4">
            <Link to="/booking">
              <Button
                className="w-full border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Appointment
              </Button>
            </Link>
            <Link to="/membership">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Membership
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    )}
  </div>
</header>

  );
};

export default Header;
