import { useState } from 'react';
import Header from '@/components/Header';
import ModernFooter from '@/components/ModernFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Calendar } from 'lucide-react';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    treatment: '',
    preferredDate: '',
    preferredTime: ''
  });
  
  const { toast } = useToast();

  const locations = [
    'Mumbai Central',
    'Andheri West',
    'Bandra East',
    'Thane',
    'Navi Mumbai',
    'Borivali',
    'Malad',
    'Goregaon'
  ];

  const treatments = [
    'General Dental Checkup',
    'Teeth Cleaning',
    'Root Canal Treatment',
    'Dental Implants',
    'Orthodontics (Braces)',
    'Teeth Whitening',
    'Oral Surgery',
    'Cosmetic Dentistry',
    'Pediatric Dentistry',
    'Emergency Dental Care'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking form submitted:', formData);
    toast({
      title: "Appointment Request Submitted!",
      description: "We'll confirm your appointment soon.",
    });
  };

  const handleWhatsAppBooking = () => {
    const message = `Hi! I'd like to book an appointment.
Name: ${formData.name}
Phone: ${formData.phoneNumber}
Location: ${formData.location}
Treatment: ${formData.treatment}
Preferred Date: ${formData.preferredDate}
Preferred Time: ${formData.preferredTime}`;
    
    const whatsappUrl = `https://wa.me/918590621417?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Easy Scheduling</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Schedule Your Care
              <span className="block text-blue-600">With Expert Professionals</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Book your appointment with our experienced healthcare team. Choose from multiple locations and flexible time slots for your convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="text-center space-y-2 pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Book Your Visit
                </CardTitle>
                <p className="text-gray-600">
                  Complete your booking in minutes. Our team will confirm your appointment within 2 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Full Name *
                    </label>
                    <Input
                      placeholder="Enter your name as per records"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <Input
                      type="tel"
                      placeholder="Your active mobile number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="h-12 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Location *
                    </label>
                    <Select onValueChange={(value) => setFormData({...formData, location: value})}>
                      <SelectTrigger className="h-12 bg-white">
                        <SelectValue placeholder="Select your convenient location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Treatment *
                    </label>
                    <Select onValueChange={(value) => setFormData({...formData, treatment: value})}>
                      <SelectTrigger className="h-12 bg-white">
                        <SelectValue placeholder="Choose your required treatment" />
                      </SelectTrigger>
                      <SelectContent>
                        {treatments.map((treatment) => (
                          <SelectItem key={treatment} value={treatment}>{treatment}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <Input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                        className="h-12 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <Select onValueChange={(value) => setFormData({...formData, preferredTime: value})}>
                        <SelectTrigger className="h-12 bg-white">
                          <SelectValue placeholder="Choose your preferred time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl"
                    >
                      Confirm Booking
                    </Button>
                    <Button 
                      type="button"
                      size="lg"
                      onClick={handleWhatsAppBooking}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12 rounded-xl"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Book via WhatsApp
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

export default BookingPage;
