import Header from '@/components/Header';
import ModernFooter from '@/components/ModernFooter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Shield, Heart, Users } from 'lucide-react';

const MembershipPage = () => {
   const benefits = [
    { 
      icon: "💳", 
      title: "Discount on DDRC Health packages", 
      description: "For all treatments and services"
    },
    { 
      icon: "🎯", 
      title: "35-40% Off", 
      description: "On health packages"
    },
    { 
      icon: "🦷", 
      title: "10-20% Off", 
      description: "On dental treatments"
    },
    { 
      icon: "💊", 
      title: "Free Medicine Delivery", 
      description: "From our affiliated pharmacies"
    },
    { 
      icon: "💉", 
      title: "Discounted Medicine", 
      description: "Special prices on medicines"
    },
    { 
      icon: "🎁", 
      title: "Discounts on PTA screening", 
      description: "Complimentary oral health kit"
    },
    { 
      icon: "🔊", 
      title: "Discounts on at home lab collection", 
      description: "Hearing test and consultation"
    },
    { 
      icon: "🦻", 
      title: "Discounts on Hearing Aid", 
      description: "Special prices on hearing aids"
    },
    { 
      icon: "👁️", 
      title: "Free Eye Check", 
      description: "Optical/Ophthalmology examination"
    },
    { 
      icon: "👓", 
      title: "10% Off on Opticals", 
      description: "Discount on frames and lenses"
    },
    { 
      icon: "🧘", 
      title: "Discounts on Yoga", 
      description: "Special rates for yoga sessions"
    },
    { 
      icon: "😬", 
      title: "10-20% Off on Aligners", 
      description: "Discount on dental aligners"
    },
    { 
      icon: "🦷", 
      title: "Root Canal Offer", 
      description: "Discounted root canal treatment"
    },
    { 
      icon: "🦷", 
      title: "10-20% Off Implants", 
      description: "Discount on dental implants"
    },
    { 
      icon: "🏥", 
      title: "Free Dental OP", 
      description: "Free dental OP consultation"
    }
  ];

  const steps = [
    {
      icon: Users,
      title: "Sign Up",
      description: "Complete your membership registration with a one-time payment"
    },
    {
      icon: Shield,
      title: "Activate Benefits",
      description: "Receive your membership kit and activate all exclusive benefits"
    },
    {
      icon: Heart,
      title: "Enjoy Savings",
      description: "Start using your benefits for treatments and services"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Premium Membership</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Comprehensive Healthcare
              <span className="block text-blue-600">Membership</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock exceptional healthcare benefits with our affordable membership plan. 
              Access premium services, significant savings, and priority care.
            </p>
          </div>
          
          {/* Pricing Card */}
          <div className="max-w-sm mx-auto mb-10">
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <div className="space-y-4">
                <div className="text-5xl font-bold text-gray-900">₹2000</div>
                <div>
                  <div className="text-lg font-medium text-gray-900">Annual Membership</div>
                  <div className="text-sm text-gray-600">One-time payment • No hidden fees</div>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  Save up to ₹50,000 annually
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl"
            >
              Join Now - Limited Time Offer
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Your Membership Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience comprehensive healthcare with exclusive member advantages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} 
                   className="bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl p-6">
                <div className="flex gap-4 items-start">
                  <div className="text-2xl">{benefit.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Getting started is simple and takes just a few minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} 
                   className="bg-blue-50 hover:bg-blue-100 transition-all duration-300 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of satisfied members who are saving money while accessing premium healthcare services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-6 rounded-xl text-lg font-medium"
              >
                Become a Member
              </Button>
              <Link to="/booking">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 rounded-xl text-lg font-medium w-full sm:w-auto"
                >
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
};

export default MembershipPage;
