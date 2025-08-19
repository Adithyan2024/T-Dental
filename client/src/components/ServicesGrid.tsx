
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CreditCard, Heart, Calendar, Users, Stethoscope } from 'lucide-react';

const ServicesGrid = () => {
  const services = [
    {
      icon: Shield,
      title: "Insurance Integration",
      description: "Seamless insurance processing with cashless treatment options and direct billing.",
      features: ["Cashless Treatment", "Quick Claims Processing", "All Major Insurance Accepted"]
    },
    {
      icon: CreditCard,
      title: "Flexible Payment Plans",
      description: "No-cost EMI options with instant approval to make healthcare accessible to everyone.",
      features: ["0% Interest EMI", "Instant Approval", "Flexible Terms"]
    },
    {
      icon: Heart,
      title: "Preventive Care",
      description: "Comprehensive wellness programs focused on early detection and health maintenance.",
      features: ["Regular Health Checkups", "Screening Programs", "Health Monitoring"]
    },
    {
      icon: Calendar,
      title: "Easy Appointment Booking",
      description: "Book appointments online or via phone with our user-friendly scheduling system.",
      features: ["Online Booking", "Same-day Appointments", "Appointment Reminders"]
    },
    {
      icon: Users,
      title: "Family Healthcare Plans",
      description: "Special membership plans designed to cover your entire family's healthcare needs.",
      features: ["Family Discounts", "Multiple Members", "Shared Benefits"]
    },
    {
      icon: Stethoscope,
      title: "Specialist Consultations",
      description: "Access to experienced specialists across various medical disciplines.",
      features: ["Expert Doctors", "Multiple Specialties", "Second Opinions"]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Healthcare Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive medical services designed to meet all your healthcare needs under one roof.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
