import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Building2, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    toast({
      title: "Thank you for your feedback!",
      description: "We appreciate your message and will get back to you soon.",
    });
    setFeedback({ name: '', email: '', message: '' });
  };

  const stats = [
    {
      icon: Building2,
      number: "30+",
      label: "Clinics Onboarded",
      description: "Trusted healthcare providers",
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: Users,
      number: "10,000+",
      label: "Growing Community",
      description: "Active members benefiting",
      color: "from-purple-600 to-pink-600"
    }
  ];

  const partners = [
    { 
      name: "DDRC", 
      logo: "/lovable-uploads/22169a53-addc-420d-8d6e-cb60be0dcfda.png",
      scale: "scale-125"
    },
    { 
      name: "HDFC", 
      logo: "/lovable-uploads/47c31336-42f0-4a4a-9bd9-6ac9457ef851.png",
      scale: "scale-125"
    },
    { 
      name: "HindLabs", 
      logo: "/lovable-uploads/c2fd3606-7505-4570-aca6-b84d172f60ef.png",
      scale: "scale-75"
    },
    { 
      name: "PineLabs", 
      logo: "/lovable-uploads/85ab8e2d-9333-4273-8c12-c23051a8e899.png",
      scale: "scale-125"
    },
    { 
      name: "Hearzap", 
      logo: "/lovable-uploads/05b1871c-0de3-4427-840c-f9473df6fa09.png",
      scale: "scale-75"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      
      <div className="container relative mx-auto max-w-5xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Join Our Growing Network
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're building a community of health-conscious individuals and trusted partners.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
          {stats.map((stat, index) => (
            <div key={index} 
                 className="group bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl">
              <div className="p-6 flex items-center gap-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-base font-medium text-gray-900">{stat.label}</div>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">Our Trusted Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl mx-auto px-4">
            {partners.map((partner, index) => (
              <div key={index} 
                   className="bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px]">
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="h-16 w-full flex items-center justify-center">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`} 
                      className={`h-auto w-full max-h-16 object-contain transform ${partner.scale}`}
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl p-8">
            <div className="text-center space-y-3 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Share Your Feedback
              </h3>
              <p className="text-gray-600 text-sm">We value your thoughts and suggestions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Name</label>
                  <Input
                    placeholder="Your name"
                    value={feedback.name}
                    onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                    required
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Email</label>
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={feedback.email}
                    onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                    required
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Message</label>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={feedback.message}
                  onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                  rows={4}
                  required
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors group"
              >
                <span>Send Feedback</span>
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
