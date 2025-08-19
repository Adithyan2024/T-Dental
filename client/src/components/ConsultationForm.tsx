import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FormData {
  fullName: string;
  phoneNumber: string;
  consultationTime: string;
  purpose: string;
}

const MediCoConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    consultationTime: '',
    purpose: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      consultationTime: timeSlot
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Consultation request submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-6 h-6 bg-black rounded-sm mr-3"></div>
              <span className="text-xl font-semibold text-gray-900">TDent</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">Services</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">Doctors</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">Contact</a>
            </nav>

            {/* Book Appointment Button */}
            <button className="bg-blue-200 hover:bg-blue-300 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Book Appointment
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Consultation Details</h1>
          <p className="text-gray-600 mb-8">Please provide your information for the consultation.</p>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400"
              />
            </div>

            {/* Preferred Consultation Time */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Preferred Consultation Time
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-left flex items-center justify-between bg-white"
                >
                  <span className={formData.consultationTime ? 'text-gray-900' : 'text-gray-400'}>
                    {formData.consultationTime || 'Select Date and Time'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleTimeSlotSelect(slot)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Purpose of Consultation */}
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-900 mb-2">
                Purpose of Consultation
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                placeholder="Describe the purpose of your consultation"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-200 hover:bg-blue-300 text-blue-800 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MediCoConsultationForm;