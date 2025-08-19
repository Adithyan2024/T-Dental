import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Calendar, CreditCard, CheckCircle } from 'lucide-react';

const ModernHero = () => {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Quality Healthcare
              <span className="block text-blue-600">Made Affordable</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Comprehensive healthcare membership with premium treatments, 
              flexible payment options, and 24/7 support for you and your family.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 bg-blue-50 rounded-xl">
              <Shield className="h-12 w-12 text-blue-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10-20%</div>
                <div className="text-sm text-gray-600">Treatment Discount</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-green-50 rounded-xl">
              <CreditCard className="h-12 w-12 text-green-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">0% EMI</div>
                <div className="text-sm text-gray-600">No Interest Plans</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-orange-50 rounded-xl">
              <Calendar className="h-12 w-12 text-orange-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">₹2000</div>
                <div className="text-sm text-gray-600">Annual Plan</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/booking">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg w-full sm:w-auto">
                Book Consultation
              </Button>
            </Link>
            <Link to="/membership">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg w-full sm:w-auto">
                View Plans
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-600">Trusted by 10,000+ patients</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-600">24/7 Emergency Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-600">30+ Clinics Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
