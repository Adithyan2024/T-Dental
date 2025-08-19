import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ModernFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white rounded-lg p-2">
                <img 
                  src="/images/logo.png" 
                  alt="T-DENT Healthcare" 
                  className="h-16 w-auto"
                />
              </div>
              <div>
                <div className="text-xl font-bold">T-DENT HEALTHCARE</div>
                <div className="text-sm text-gray-400">Your Health, Our Priority</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>Emergency: +91 8590621417</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>info@tdent-healthcare.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>Multiple locations across the city</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>24/7 Emergency Services Available</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Patient Services</h4>
            <div className="space-y-3">
              <Link to="/booking" className="block text-gray-300 hover:text-white transition-colors">
                Book Appointment
              </Link>
              <Link to="/membership" className="block text-gray-300 hover:text-white transition-colors">
                Membership Plans
              </Link>
              <Link to="/insurance" className="block text-gray-300 hover:text-white transition-colors">
                Insurance Support
              </Link>
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
                Emergency Services
              </Link>
            </div>
          </div>

          {/* Medical Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Medical Services</h4>
            <div className="space-y-3 text-gray-300">
              <div>Dental Care</div>
              <div>General Medicine</div>
              <div>Preventive Care</div>
              <div>Specialist Consultations</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} T-DENT HEALTHCARE. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/privacypolicy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Patient Rights</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
