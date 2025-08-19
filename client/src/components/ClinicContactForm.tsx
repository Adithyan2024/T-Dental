
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ClinicContactForm = () => {
  const [formData, setFormData] = useState({
    contactNumber: '',
    clinicEmail: '',
    message: ''
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // In a real implementation, this would send to tdenthealth@gmail.com
    toast({
      title: "Form Submitted!",
      description: "We'll contact you soon to discuss partnership opportunities.",
    });
    
    setFormData({
      contactNumber: '',
      clinicEmail: '',
      message: ''
    });
  };

  return (
    <section className="py-20 bg-gradient-to-r from-accent-custom to-primary-custom text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              Get Started with T-Dent HealthCare - For Clinics/Hospitals
            </h2>
            <p className="text-xl opacity-90">
              Ready to transform your practice with our financial solutions? Contact us for a demo or to discuss partnership opportunities.
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">
                Partner With Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-medium">
                    Contact Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="Your clinic contact number"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">
                    Clinic Email ID *
                  </label>
                  <Input
                    type="email"
                    placeholder="clinic@example.com"
                    value={formData.clinicEmail}
                    onChange={(e) => setFormData({...formData, clinicEmail: e.target.value})}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your clinic and how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 min-h-[120px]"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-white text-primary-custom hover:bg-gray-100 font-semibold py-4"
                >
                  Submit Partnership Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ClinicContactForm;
