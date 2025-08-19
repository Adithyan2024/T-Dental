
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, Star, Shield } from 'lucide-react';

const MembershipHighlight = () => {
  const benefits = [
    "10-20% discount on all dental treatments",
    "35-40% discount on health packages", 
    "Zero-cost EMI for all treatments",
    "Free medication delivery service",
    "Complimentary oral health examination kit",
    "Priority appointment scheduling",
    "24/7 medical consultation support",
    "Annual comprehensive health checkup",
    "Access to specialist consultations"
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-blue-600 font-medium text-sm">Most Popular</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Annual Healthcare Membership
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied members who chose affordable, comprehensive healthcare coverage.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Pricing Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-800">Premium Plan</span>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">₹2000</div>
                <div className="text-lg text-gray-600">per year</div>
                <div className="text-sm text-gray-500 mt-2">One-time payment • No renewal fees</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 mb-8 text-center">
                <div className="text-2xl font-bold text-green-700 mb-1">Save up to ₹50,000</div>
                <div className="text-sm text-green-600">on annual healthcare expenses</div>
              </div>

              <Link to="/membership" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold">
                  Join Membership Plan
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Benefits List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Membership Benefits</h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipHighlight;
