import { useState } from 'react';
import Header from '@/components/Header';
import ModernFooter from '@/components/ModernFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const InsurancePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobileNumber: '',
    email: '',
    dob: '',
    maritalStatus: '',
    sex: ''
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Insurance form submitted:', formData);
    toast({
      title: "Information Submitted!",
      description: "We'll contact you soon regarding health insurance options.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Health Protection</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Secure Your Health
              <span className="block text-blue-600">With Comprehensive Coverage</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get personalized health insurance solutions that fit your needs. Our specialists will help you find the perfect coverage plan for you and your family.
            </p>
          </div>
        </div>
      </section>

      {/* Insurance Form Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="text-center space-y-2 pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Get Your Insurance Quote
                </CardTitle>
                <p className="text-gray-600">
                  Share your details and our insurance specialists will contact you within 24 hours
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Full Name *
                    </label>
                    <Input
                      placeholder="Enter your name as per official documents"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Residential Address *
                    </label>
                    <Input
                      placeholder="Your complete residential address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="h-12 bg-white"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="Your active mobile number"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                        className="h-12 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address (Optional)
                      </label>
                      <Input
                        type="email"
                        placeholder="Your email for updates"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-12 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <Input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="h-12 bg-white"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marital Status *
                      </label>
                      <Select onValueChange={(value) => setFormData({...formData, maritalStatus: value})}>
                        <SelectTrigger className="h-12 bg-white">
                          <SelectValue placeholder="Select your marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <Select onValueChange={(value) => setFormData({...formData, sex: value})}>
                        <SelectTrigger className="h-12 bg-white">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl"
                    >
                      Get Insurance Quote
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
};

export default InsurancePage;
