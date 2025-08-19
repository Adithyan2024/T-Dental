
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CreditCard, User, MapPin, FileText, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  service: string;
  amount: string;
  notes: string;
}

const PaymentPage = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'INDIA',
    service: '',
    amount: '',
    notes: ''
  });

  const services = [
    { value: 'dental-checkup', label: 'Dental Checkup', price: 500 },
    { value: 'root-canal', label: 'Root Canal Treatment', price: 5000 },
    { value: 'teeth-whitening', label: 'Teeth Whitening', price: 3000 },
    { value: 'teeth-cleaning', label: 'Professional Cleaning', price: 1500 },
    { value: 'orthodontics', label: 'Orthodontic Treatment', price: 15000 },
    { value: 'extraction', label: 'Tooth Extraction', price: 2000 },
    { value: 'custom', label: 'Custom Amount', price: 0 }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleServiceChange = (serviceValue: string) => {
    const selectedService = services.find(s => s.value === serviceValue);
    setFormData(prev => ({
      ...prev,
      service: serviceValue,
      amount: selectedService?.price ? selectedService.price.toString() : prev.amount
    }));
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, mobile } = formData;
    
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile.trim() || !mobileRegex.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    const { service, amount } = formData;
    
    if (!service) {
      setError('Please select a service');
      return false;
    }
    
    if (!amount || parseInt(amount) < 100) {
      setError('Please enter a valid amount (minimum ₹100)');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      merchant_order_reference: "TDENT-" + Date.now(),
      order_amount: {
        value: parseInt(formData.amount),
        currency: "INR"
      },
      pre_auth: false,
      allowed_payment_methods: ["CARD", "UPI", "NETBANKING", "WALLET"],
      notes: formData.notes || 'T-Dent Healthcare Payment',
      purchase_details: {
        customer: {
          email_id: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          customer_id: "TDENT" + Date.now().toString().slice(-6),
          mobile_number: formData.mobile,
          billing_address: {
            address1: formData.address || 'Not provided',
            pincode: formData.pincode || "400001",
            city: formData.city || "Mumbai",
            state: formData.state || "Maharashtra",
            country: formData.country
          }
        }
      }
    };

    try {
      const response = await fetch('https://plural-payment-gateway-161967564992.asia-south1.run.app/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === 'success' && data.data.redirect_url) {
        window.location.href = data.data.redirect_url;
      } else {
        setError('Payment initialization failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressValue = () => {
    return (step / 3) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">T-Dent Healthcare</h1>
              <p className="text-sm text-gray-600">Secure Payment Portal</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                <User className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Patient Details</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Payment Details</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Confirmation</span>
            </div>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Patient Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address Line 1</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter address"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Postal Code</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Enter pincode"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INDIA">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CANADA">Canada</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  Continue to Payment Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Payment Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="service">Select Service *</Label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a service</option>
                  {services.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label} {service.price > 0 && `- ₹${service.price}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (₹) *</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="Enter amount"
                    className="pl-8"
                    min="100"
                    disabled={formData.service !== 'custom' && formData.service !== ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special instructions or notes"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  Review Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Patient Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                  <p><span className="font-medium">Email:</span> {formData.email}</p>
                  <p><span className="font-medium">Mobile:</span> {formData.mobile}</p>
                  <p><span className="font-medium">Service:</span> {services.find(s => s.value === formData.service)?.label}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Payment Summary</h3>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{formData.amount}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !acceptedTerms}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
