import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", organization: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-custom mb-6">
            Get Started with T-Dent Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your practice with our financial solutions?
            Contact us for a demo or to discuss partnership opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-primary-custom">
                Contact Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <Input
                    name="organization"
                    placeholder="Healthcare Organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your requirements"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent-custom hover:bg-accent-custom/90 text-white font-semibold h-12 text-lg"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-primary-custom mb-6">
                  Quick Connect
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent-custom/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent-custom text-xl">📧</span>
                    </div>
                    <div>
                      <div className="font-semibold text-primary-custom">
                        Email
                      </div>
                      <div className="text-gray-600">
                        support@tdent.healthcare
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent-custom/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent-custom text-xl">📱</span>
                    </div>
                    <div>
                      <div className="font-semibold text-primary-custom">
                        Phone
                      </div>
                      <div className="text-gray-600">+91 98765 43210</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent-custom/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent-custom text-xl">💬</span>
                    </div>
                    <div>
                      <div className="font-semibold text-primary-custom">
                        WhatsApp
                      </div>
                      <div className="text-gray-600">+91 98765 43210</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-primary-custom to-accent-custom text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">
                  Why Healthcare Providers Choose Us
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
                    Industry-specific expertise in healthcare finance
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
                    Proven track record with medical providers
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
                    Dedicated support team understanding medical workflows
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
