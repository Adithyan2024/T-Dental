
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const partners = ["DDRC", "HindLabs", "PineLabs", "HDFC"];

  return (
    <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-20 lg:py-32 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Dental Health Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-custom leading-tight">
              Empowering Health
              <span className="text-accent-custom block">For All</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive financial solutions designed specifically for medical care providers. 
              Enhance patient accessibility with our insurance support and flexible EMI options.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/membership">
                <Button 
                  size="lg" 
                  className="bg-accent-custom hover:bg-accent-custom/90 text-white font-semibold px-8 py-4 text-lg w-full sm:w-auto"
                >
                  View Membership Plans
                </Button>
              </Link>
              <Link to="/booking">
                <Button 
                  size="lg" 
                  className="bg-accent-custom hover:bg-accent-custom/90 text-white font-semibold px-8 py-4 text-lg w-full sm:w-auto"
                >
                  Book Appointment
                </Button>
              </Link>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-custom">35-40%</div>
                <div className="text-sm text-gray-600">Discount on Packages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-custom">₹1200</div>
                <div className="text-sm text-gray-600">Annual Membership</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-custom">0%</div>
                <div className="text-sm text-gray-600">Interest EMI</div>
              </div>
            </div>

            {/* Partners Scrollable */}
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4">Trusted Partners</p>
              <div className="flex space-x-6 overflow-x-auto">
                {partners.map((partner, index) => (
                  <div key={index} className="bg-white px-6 py-3 rounded-lg shadow-md min-w-max">
                    <span className="text-primary-custom font-medium">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Logo and Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 hover-lift">
              <img 
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Healthy Teeth Inspection" 
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="mt-6 text-center">
                <img 
                  src="/lovable-uploads/eb604976-7bba-4202-8b4c-cd2ef03c966f.png" 
                  alt="T-DENT HEALTHCARE Logo" 
                  className="h-16 w-auto mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-primary-custom mb-2">
                  Professional Healthcare Solutions
                </h3>
                <p className="text-gray-600">
                  Streamlined financial processes for enhanced patient care and clinic efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
