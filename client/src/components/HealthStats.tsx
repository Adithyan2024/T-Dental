
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Shield, Star } from 'lucide-react';

const HealthStats = () => {
  const stats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Happy Members",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      number: "95%",
      label: "Satisfaction Rate",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Shield,
      number: "₹2Cr+",
      label: "Savings Generated",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Member Rating",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join a growing community of health-conscious individuals who've made the smart choice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-gray-50 to-white hover:-translate-y-1">
              <CardContent className="p-8">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="text-2xl md:text-3xl font-medium text-gray-800 mb-6 leading-relaxed">
                  "T-Dent Healthcare transformed how my family approaches healthcare. The membership pays for itself within months, and the peace of mind is priceless."
                </div>
                <div className="text-gray-600">
                  <div className="font-semibold">Priya Sharma</div>
                  <div className="text-sm">Member since 2023</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HealthStats;
