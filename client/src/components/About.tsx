
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const features = [
    {
      title: "Insurance Support",
      description: "Comprehensive insurance integration to maximize patient coverage and reduce out-of-pocket expenses.",
      icon: "🛡️"
    },
    {
      title: "EMI Solutions", 
      description: "Flexible payment plans with no-cost EMI options to make treatments accessible to all patients.",
      icon: "💳"
    },
    {
      title: "Seamless Integration",
      description: "Easy integration into existing clinic workflows without disrupting daily operations.",
      icon: "⚙️"
    },
    {
      title: "Patient Satisfaction",
      description: "Improve patient experience with affordable payment options and transparent pricing.",
      icon: "😊"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-custom mb-6">
            Why Choose T-Dent HealthCare Solutions?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialize in providing financial solutions that make healthcare more accessible 
            while helping medical providers improve their patient satisfaction and operational efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary-custom mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Us Content with Images */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-primary-custom mb-6">
              About Us
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>
                We specialize in providing EMI and insurance support for clinics, doctors, and patients, 
                ensuring flexible and accessible healthcare payment solutions. Our insurance support 
                system covers both dental and medical expenses, offering two key features:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-primary-custom">Reimbursement-Based and Cashless Facility</h4>
                  <p className="text-sm">
                    Patients can pay upfront and claim reimbursement from their insurance provider or benefit 
                    from a hassle-free cashless transaction through direct integration with major insurance companies. 
                    This minimizes financial stress for patients and expedites treatment procedures while reducing 
                    administrative burdens for clinics and doctors.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-custom">EMI Options</h4>
                  <p className="text-sm">
                    We partner with leading financial technology providers to offer EMI POS machines, enabling 
                    patients to convert medical bills into no-cost EMIs for easier payment. Quick approvals and 
                    digital processing ensure a smooth, paperless experience. We also offer EMI payment options 
                    through our software instead of using an EMI machine, making it easier for our customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Healthcare Team" 
              className="rounded-xl shadow-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Modern Healthcare" 
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
