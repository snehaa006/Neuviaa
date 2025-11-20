import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  Phone,
  MessageCircle,
  Search,
  Clock,
  Activity,
  Brain,
  Droplet,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Appointment = {
  id: string;
  patientName: string;
  time: string;
  purpose: string;
  phone: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

type PatientUpdate = {
  id: string;
  patientName: string;
  update: string;
  timestamp: string;
  severity: 'normal' | 'warning' | 'urgent';
};

const DoctorDashboard = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  // Logout function - navigates to landing page
  const handleLogout = () => {
    window.location.href = "/";
  };

  const overviewStats = [
    {
      icon: Users,
      title: "Total Patients",
      value: "127",
      change: "+8 this month",
      iconBgColor: "bg-sage",
    },
    {
      icon: Calendar,
      title: "Today's Appointments",
      value: "12",
      change: "3 remaining",
      iconBgColor: "bg-blush",
    },
    {
      icon: FileText,
      title: "Pending Reports",
      value: "24",
      change: "8 need review",
      iconBgColor: "bg-mauve-light",
    },
    {
      icon: AlertTriangle,
      title: "Urgent Alerts",
      value: "3",
      change: "Requires attention",
      iconBgColor: "bg-terracotta",
    },
  ];

  const appointments: Appointment[] = [
    { id: "1", patientName: "Priya Sharma", time: "09:00 AM", purpose: "Routine Checkup", phone: "+91-9876543210", status: 'upcoming' },
    { id: "2", patientName: "Anita Verma", time: "10:30 AM", purpose: "Ultrasound Review", phone: "+91-9876543211", status: 'upcoming' },
    { id: "3", patientName: "Meera Patel", time: "11:45 AM", purpose: "Blood Test Results", phone: "+91-9876543212", status: 'upcoming' },
    { id: "4", patientName: "Kavita Singh", time: "02:00 PM", purpose: "Neurological Assessment", phone: "+91-9876543213", status: 'upcoming' },
    { id: "5", patientName: "Rina Gupta", time: "03:30 PM", purpose: "Follow-up Consultation", phone: "+91-9876543214", status: 'upcoming' },
  ];

  const patientUpdates: PatientUpdate[] = [
    { id: "1", patientName: "Priya S.", update: "New symptom entry: Severe headache", timestamp: "10 mins ago", severity: 'urgent' },
    { id: "2", patientName: "Anita V.", update: "Completed daily symptom tracker", timestamp: "25 mins ago", severity: 'normal' },
    { id: "3", patientName: "Meera P.", update: "Blood pressure reading: 140/90", timestamp: "1 hour ago", severity: 'warning' },
    { id: "4", patientName: "Kavita S.", update: "Uploaded ultrasound report", timestamp: "2 hours ago", severity: 'normal' },
    { id: "5", patientName: "Rina G.", update: "Medication reminder missed", timestamp: "3 hours ago", severity: 'warning' },
  ];

  const hemoglobinData = [
    { week: 'Week 1', level: 11.2 },
    { week: 'Week 2', level: 11.5 },
    { week: 'Week 3', level: 11.8 },
    { week: 'Week 4', level: 12.0 },
    { week: 'Week 5', level: 12.3 },
    { week: 'Week 6', level: 12.5 },
  ];

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <style>{`
        /* Warm Earthy Color Palette - Based on C9A6A1 and F0EBDB */
        :root {
          --cream: #F0EBDB;
          --dusty-rose: #C9A6A1;
          --warm-white: #FDFBF7;
          --soft-beige: #E8E0D0;
          --blush: #D4B5B0;
          --mauve: #B89690;
          --mauve-light: #D2BFB9;
          --terracotta: #C88B84;
          --sage: #B5BFA8;
          --sage-light: #CDD6C0;
          --warm-beige: #DBC9B8;
          
          --text-primary: #5D4E47;
          --text-secondary: #8B7D73;
          --text-muted: #A69A8E;
          
          --border-warm: #E3D8C8;
          --shadow-warm: rgba(201, 166, 161, 0.08);
        }

        .bg-gradient-warm {
          background: linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%);
        }

        .bg-cream { background-color: var(--cream); }
        .bg-warm-white { background-color: var(--warm-white); }
        .bg-dusty-rose { background-color: var(--dusty-rose); }
        .bg-blush { background-color: var(--blush); }
        .bg-mauve { background-color: var(--mauve); }
        .bg-mauve-light { background-color: var(--mauve-light); }
        .bg-terracotta { background-color: var(--terracotta); }
        .bg-sage { background-color: var(--sage); }
        .bg-sage-light { background-color: var(--sage-light); }
        .bg-warm-beige { background-color: var(--warm-beige); }
        
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-muted { color: var(--text-muted); }
        
        .border-warm { border-color: var(--border-warm); }
        
        .card-shadow {
          box-shadow: 0 2px 12px var(--shadow-warm);
        }
        
        .card-shadow-hover:hover {
          box-shadow: 0 4px 20px rgba(201, 166, 161, 0.15);
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.15s; }
        .stagger-3 { animation-delay: 0.2s; }
        .stagger-4 { animation-delay: 0.25s; }
        .stagger-5 { animation-delay: 0.3s; }
        .stagger-6 { animation-delay: 0.35s; }

        .backdrop-warm {
          backdrop-filter: blur(12px);
          background-color: rgba(253, 251, 247, 0.9);
        }

        .hover\\:bg-dusty-rose-hover:hover {
          background-color: #D4B5B0;
        }

        .hover\\:bg-mauve-hover:hover {
          background-color: #D2BFB9;
        }

        /* Floating Chatbot Button */
        .floating-chatbot-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          z-index: 40;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .floating-chatbot-button:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(219, 201, 184, 0.4);
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.95);
            opacity: 1;
          }
        }

        .pulse-animation {
          animation: pulse-ring 2s ease-in-out infinite;
        }

        /* Chatbot Modal */
        .chatbot-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .chatbot-container {
          width: 85%;
          max-width: 700px;
          height: 75vh;
          max-height: 650px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .chatbot-close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 51;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chatbot-close-button:hover {
          background: white;
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .chatbot-container {
            width: 95%;
            height: 80vh;
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-dusty-rose flex items-center justify-center card-shadow">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Neuvia</h1>
              <p className="text-xs text-muted">Doctor Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              className="bg-sage text-white hover:bg-sage-light border-0 card-shadow"
              onClick={() => setActiveSection("patients")}
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Patients
            </Button>
            <Button
              size="sm"
              className="bg-blush text-white hover:bg-dusty-rose-hover border-0 card-shadow"
              onClick={() => setActiveSection("appointments")}
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Appointments
            </Button>
            <Button
              size="sm"
              className="bg-mauve-light text-primary hover:bg-mauve-hover border-0 card-shadow"
              onClick={() => setActiveSection("messages")}
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Messages
            </Button>
            <Button 
              size="sm"
              className="bg-warm-white text-secondary hover:bg-cream border border-warm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in">
          <h2 className="text-3xl font-semibold text-primary mb-2">
            Good Morning, Dr. Sharma 👋
          </h2>
          <p className="text-secondary text-lg">Here's your patient overview for today</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <Card
              key={index}
              className={`bg-warm-white border-warm card-shadow card-shadow-hover transition-all duration-300 animate-fade-in stagger-${index + 1}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
                    <p className="text-xs text-secondary">{stat.change}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.iconBgColor} flex items-center justify-center card-shadow`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Appointments Section */}
        <Card className="mb-8 bg-warm-white border-warm card-shadow animate-fade-in stagger-5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-1">
                  Today's Appointments
                </h3>
                <p className="text-sm text-muted">Manage your scheduled consultations</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-warm rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-warm hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-dusty-rose flex items-center justify-center text-white font-semibold">
                      {appointment.patientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{appointment.patientName}</h4>
                      <p className="text-sm text-secondary">{appointment.purpose}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right mr-4">
                      <div className="flex items-center text-sm text-primary">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.time}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-sage-light text-primary hover:bg-sage border-0"
                      onClick={() => window.open(`tel:${appointment.phone}`, '_self')}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      className="bg-mauve-light text-primary hover:bg-mauve border-0"
                      onClick={() => setIsChatbotOpen(true)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patient Updates & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Updates */}
          <Card className="bg-warm-white border-warm card-shadow animate-fade-in stagger-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Recent Patient Updates
              </h3>
              <div className="space-y-3">
                {patientUpdates.map((update) => (
                  <div
                    key={update.id}
                    className={`p-4 rounded-xl border ${getSeverityColor(update.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{update.patientName}</h4>
                      <span className="text-xs">{update.timestamp}</span>
                    </div>
                    <p className="text-sm">{update.update}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Section */}
          <Card className="bg-warm-white border-warm card-shadow animate-fade-in stagger-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Average Hemoglobin Trends
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={hemoglobinData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3D8C8" />
                  <XAxis dataKey="week" stroke="#8B7D73" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#8B7D73" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FDFBF7', 
                      border: '1px solid #E3D8C8',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="level" stroke="#B5BFA8" strokeWidth={3} dot={{ fill: '#B5BFA8', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-lg bg-sage-light">
                  <Brain className="w-6 h-6 mx-auto mb-2 text-sage" />
                  <p className="text-xs text-muted mb-1">Avg Neural Score</p>
                  <p className="font-bold text-primary">8.2/10</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blush">
                  <Droplet className="w-6 h-6 mx-auto mb-2 text-white" />
                  <p className="text-xs text-white mb-1">Avg Hemoglobin</p>
                  <p className="font-bold text-white">12.1 g/dL</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-mauve-light">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-mauve" />
                  <p className="text-xs text-muted mb-1">Improvement</p>
                  <p className="font-bold text-primary">+12%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <div
        className="floating-chatbot-button bg-sage card-shadow pulse-animation flex items-center justify-center"
        onClick={() => setIsChatbotOpen(true)}
        title="Neuvia Doctor Assistant"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </div>

      {/* Chatbot Modal */}
      {isChatbotOpen && (
        <div className="chatbot-modal" onClick={() => setIsChatbotOpen(false)}>
          <div className="chatbot-container" onClick={(e) => e.stopPropagation()}>
            <div
              className="chatbot-close-button"
              onClick={() => setIsChatbotOpen(false)}
            >
              <X className="w-4 h-4 text-gray-600" />
            </div>
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-sage" />
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  Neuvia Doctor Assistant
                </h3>
                <p className="text-secondary">
                  AI-powered assistance for patient management and medical insights
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;