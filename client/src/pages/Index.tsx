
import Header from '@/components/Header';
import ModernHero from '@/components/ModernHero';
import ServicesGrid from '@/components/ServicesGrid';
import MembershipHighlight from '@/components/MembershipHighlight';
import FeedbackSection from '@/components/FeedbackSection';
import ModernFooter from '@/components/ModernFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ModernHero />
      <ServicesGrid />
      <MembershipHighlight />
      <FeedbackSection />
      <ModernFooter />
    </div>
  );
};

export default Index;
