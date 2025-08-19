import React, { useState } from 'react';

const PolicyTabs = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">T-DENT Health Policies</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-3 font-semibold text-lg transition-all duration-200 ${
              activeTab === 'privacy' 
                ? 'border-b-3 border-blue-500 text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-6 py-3 font-semibold text-lg transition-all duration-200 ${
              activeTab === 'terms' 
                ? 'border-b-3 border-blue-500 text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Terms & Conditions
          </button>
        </div>

        {/* Privacy Policy Content */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="max-h-100 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-600">T-DENT Health – Privacy Policy</h2>
                <p className="text-sm text-gray-600 mb-6">Effective Date: [DD/MM/YYYY]</p>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  T-DENT Health Care Pvt Ltd ("T-DENT Health", "we", "our", or "us") is dedicated to protecting your privacy. This Privacy Policy explains how we receive, use, share, and protect personal data when you use our website, mobile apps, or access services through our platform.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">1. Information We Collect</h3>
                
                <h4 className="text-lg font-medium mb-2 text-gray-800">1.1 Information Provided by Users</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li><strong>Personal Information:</strong> Name, Gender, Date of Birth, Address, Email, Phone Number</li>
                  <li><strong>Medical Information:</strong> Health issues, medical history, medicines, test reports, treatment procedures</li>
                  <li><strong>Account Details:</strong> Username, password, settings</li>
                  <li><strong>Payment Information:</strong> Payment details (Note: We don't store sensitive payment details such as credit/debit card numbers)</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.2 Information Automatically Collected</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Device details (IP address, browser, operating system)</li>
                  <li>Usage data (pages viewed, duration, clicks, and interactions)</li>
                  <li>Location data (with user's permission)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">2. How We Use Your Information</h3>
                <p className="mb-3 text-gray-700">We utilize the information gathered for the below purposes:</p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>To enable appointments booking, teleconsultations, diagnostics, and other health services</li>
                  <li>To send critical updates, confirmations, and reminders</li>
                  <li>To customize user experience and enhance our services</li>
                  <li>For billing, payment processing, and transaction management</li>
                  <li>For analytical reasons to better comprehend platform use and optimize functionality</li>
                  <li>To abide by legal and regulatory requirements</li>
                  <li>To send health information, promotional offers, and updates (only upon user consent)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">3. Information Sharing & Disclosure</h3>
                <p className="mb-3 text-gray-700">We DON'T sell or share user data with third parties. But, information can be shared subject to the conditions below:</p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li><strong>Partner Clinics/Hospitals & Healthcare Providers:</strong> To provide consultations, diagnostic services, and treatment according to user bookings</li>
                  <li><strong>Service Providers:</strong> To trusted third-party vendors that help us process payments, store data, provide customer support, etc., under strict confidentiality agreements</li>
                  <li><strong>Legal Requirements:</strong> To comply with relevant laws, regulations, legal procedures, or government requests that are enforceable</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data can be transferred on terms of confidentiality</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">4. Data Protection & Security Measures</h3>
                <p className="mb-3 text-gray-700">We utilize industry-standard security practices to safeguard your personal details from unauthorized use, modification, disclosure, or destruction, including:</p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Secure Sockets Layer (SSL) encryption</li>
                  <li>Access control methods</li>
                  <li>Routine security audits</li>
                  <li>Limited access to sensitive information to authorized staff only</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">5. Data Retention</h3>
                <p className="mb-4 text-gray-700">
                  We hold user information for as long as it takes to deliver services, meet legal requirements, settle disputes, and implement policies. Personal data can be deleted upon request where there is compliance with regulation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">6. User Rights</h3>
                <p className="mb-3 text-gray-700">You have the following rights as a user:</p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Access your personal data</li>
                  <li>Make requests to correct inaccuracy of data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Withdraw consent from processing (may impact availability of services)</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
                <p className="text-gray-700">Inquiries about your information can be directed to: <a href="mailto:support@tdenthealth.com" className="text-blue-600 underline">support@tdenthealth.com</a></p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">7. Cookies & Tracking Technologies</h3>
                <p className="mb-4 text-gray-700">
                  Cookies and tracking technologies are employed by T-DENT Health to optimize user experience, traffic analysis on the site, and content customization. Users have control over cookie options via their web browser settings.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">8. Third-Party Links</h3>
                <p className="mb-4 text-gray-700">
                  Our site may include third-party links. We do not manage the privacy policies or website content of such third parties.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">9. Children's Privacy</h3>
                <p className="mb-4 text-gray-700">
                  T-DENT Health does not intentionally collect children's personal information under 18 years old with parental consent. If you feel a child has sent us personal data, please notify us for immediate deletion.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">10. Changes to This Privacy Policy</h3>
                <p className="mb-4 text-gray-700">
                  We may update this Privacy Policy from time to time. Any changes will be notified through our website or via email. Continued use of the platform after changes implies acceptance of the revised policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">11. Contact Us</h3>
                <p className="text-gray-700">
                  For any questions, concerns, or feedback regarding this Privacy Policy, please contact us at: <a href="mailto:support@tdenthealth.com" className="text-blue-600 underline">support@tdenthealth.com</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Conditions Content */}
        {activeTab === 'terms' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="max-h-100 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-600">T-DENT HEALTH - TERMS & CONDITIONS</h2>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">1. Terms & Conditions for Clinics/Hospitals (Partners)</h3>
                
                <h4 className="text-lg font-medium mb-2 text-gray-800">1.1 Acceptance of Terms</h4>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Through registration as a Partner Clinic/Hospital on the T-DENT Health platform, you accept to be bound by these Terms & Conditions, in addition to T-DENT Health's Policies, Privacy Policy, and any subsequent amendment.
                </p>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.2 Partner Registration & Verification</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Partner Clinics/Hospitals are required to provide correct and full information at the time of registration</li>
                  <li>T-DENT Health retains the right to authenticate and accept/reject partner registrations based on internal testing standards</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.3 Subscription Charges & Payment Policy</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Partners need to subscribe to the monthly subscription plan of T-DENT Health in order to keep themselves listed</li>
                  <li>Subscription Charge: ₹X,XXX per month (as specified in the Partner Agreement)</li>
                  <li>Subscription charges are prepaid. Failure to pay will result in suspension or cancellation of services</li>
                  <li>T-DENT has the right to amend subscription fees with 30 days' advance notice</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.4 Service Delivery Commitments</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Partners shall provide timely and quality service delivery for scheduled appointments made using T-DENT Health</li>
                  <li>Clinics are required to update precise service listings, available time slots, and staff details on the platform</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.5 Compliance & Legal Commitments</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Clinics are responsible for adhering to all relevant laws, medical guidelines, licensing conditions, and standards of patient care</li>
                  <li>T-DENT Health is not responsible for illegal conduct by partner clinics/hospitals</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.6 Transparency in Billing</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>All charges, discounts, and offers should be clearly communicated to patients ahead of time</li>
                  <li>Hidden charges from clinics booked via T-DENT Health are not allowed to be imposed on patients</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.7 Confidentiality of Patient Data</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Patient data needs to be managed responsibly by clinics with adherences to data protection acts (GDPR, HIPAA, IT Act, etc.)</li>
                  <li>Patient data misuse, unauthorized sharing, or sale is strictly forbidden</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.8 Termination of Partnership</h4>
                <p className="mb-2 text-gray-700">T-DENT Health may suspend or terminate partnership under the following circumstances:</p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Terms & Conditions breach</li>
                  <li>Default in paying subscription fees</li>
                  <li>Ethical misconduct or malpractice</li>
                  <li>Recurring patient complaints</li>
                  <li>Defiance of T-DENT Health operational policies</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">1.9 Limitation of Liability</h4>
                <p className="mb-2 text-gray-700">T-DENT Health acts as a facilitator among clinics and patients. The platform cannot be held liable for:</p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Medical negligence</li>
                  <li>Treatment results</li>
                  <li>Disputes over bills between patients and clinics</li>
                  <li>Legal disputes emerging from clinic operations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">2. Terms & Conditions for Patients/Users</h3>
                
                <h4 className="text-lg font-medium mb-2 text-gray-800">2.1 Acceptance of Terms</h4>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  By becoming a member on T-DENT Health, users acknowledge these Terms & Conditions, Privacy Policy, and site policies.
                </p>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.2 User Registration & Account Security</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Users are required to enter true and current information while registering for an account</li>
                  <li>Users are held accountable for keeping their account credentials confidential and for all activities performed through their account</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.3 Platform Usage</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>T-DENT Health is to be used exclusively for scheduling appointments, teleconsultations, and healthcare services</li>
                  <li>Users commit not to abuse the platform for fraudulent purposes</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.4 Payment & Refunds</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Service fees will be clearly indicated prior to confirmation</li>
                  <li>Payment must be made via the platform's secure payment gateway</li>
                  <li>Refunds, if any, will be made based on the refund policy of the respective clinic/hospital and T-DENT's assessment</li>
                  <li>No refunds will be given for services already utilized unless through technical failure</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.5 Cancellations & Rescheduling</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Appointments can be cancelled or postponed according to the policy of respective clinics</li>
                  <li>Late cancellations (within less than 24 hours) might attract a cancellation fee</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.6 Conduct & Behavior</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Users are to be respectful in their interactions with medical practitioners and staff</li>
                  <li>Any abusive, threatening, or harassing conduct towards medical personnel will lead to the immediate suspension of an account and may attract legal action</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.7 Medical Disclaimer</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>T-DENT Health is an intermediary and not a medical service provider</li>
                  <li>Any treatment, diagnosis, or medical guidance is the sole responsibility of the concerned healthcare professional</li>
                  <li>Online consultation should not replace physical examination or emergency services</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.8 Data Privacy</h4>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>T-DENT Health will safeguard user data in accordance with its Privacy Policy and data protection regulations</li>
                  <li>User data will not be transferred to a third party without specific consent unless mandatory under law</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.9 Termination of User Account</h4>
                <p className="mb-2 text-gray-700">T-DENT Health can terminate user accounts on the following grounds:</p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Violation of Terms & Conditions</li>
                  <li>Misbehavior against medical personnel</li>
                  <li>Fraudulent conduct</li>
                  <li>Any abuse of the website or its services</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 text-gray-800">2.10 Limitation of Liability</h4>
                <p className="mb-2 text-gray-700">T-DENT Health disclaims liability for:</p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4">
                  <li>Medical treatment results</li>
                  <li>Quality of service or experience at partner clinics</li>
                  <li>Mistakes or inaccuracies committed by medical professionals</li>
                  <li>Technical disturbances outside reasonable control</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyTabs;