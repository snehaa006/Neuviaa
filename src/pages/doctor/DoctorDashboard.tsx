import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  BarChart3,
  Search,
  ChefHat,
  ClipboardList,
  User,
  Calendar,
  Bell,
  MessageCircle,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import PregnancyChatbot from "../neuvia/PregnancyChatbot";

type ScheduleItem = {
  time: string;
  patient: string;
  type: string;
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: 'Loading...',
    specialization: 'Loading...',
    initials: 'DR',
    loading: true
  });

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    if (!name || name === 'Loading...') return 'DR';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to fetch doctor data from Firebase
  useEffect(() => {
    const fetchDoctorData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const doctorRef = doc(db, "doctors", user.uid);
            const doctorSnap = await getDoc(doctorRef);
            
            if (doctorSnap.exists()) {
              const data = doctorSnap.data();
              setDoctorData({
                name: data.name || 'Dr. Unknown',
                specialization: data.ayurvedicSpecialization?.join(', ') || 'Ayurvedic Practitioner',
                initials: getInitials(data.name || 'Dr Unknown'),
                loading: false
              });
            } else {
              setDoctorData({
                name: 'Dr. Meera Nair',
                specialization: 'Nutrition Therapy, Digestive Health, Weight Management',
                initials: 'MN',
                loading: false
              });
            }
          } catch (error) {
            console.error('Error fetching doctor data:', error);
            setDoctorData({
              name: 'Dr. Meera Nair',
              specialization: 'Nutrition Therapy, Digestive Health, Weight Management',
              initials: 'MN',
              loading: false
            });
          }
        } else {
          setDoctorData({
            name: 'Please Login',
            specialization: 'Ayurvedic Practitioner',
            initials: 'PL',
            loading: false
          });
        }
      });

      return () => unsubscribe();
    };

    fetchDoctorData();
  }, []);

  const features = [
    {
      icon: Users,
      title: "My Patients",
      description: "View and manage your patient list",
      path: "/doctor/patients",
      iconBgColor: "bg-mauve-light",
    },
    {
      icon: UserPlus,
      title: "Add New Patient",
      description: "Register a new patient into the system",
      path: "/doctor/add-patient",
      iconBgColor: "bg-dusty-rose",
    },
    // {
    //   icon: BarChart3,
    //   title: "Health Analytics",
    //   description: "Monitor vital stats and health reports",
    //   path: "/doctor/health-analytics",
    //   iconBgColor: "bg-sage-light",
    // },
    {
      icon: Search,
      title: "Food Explorer",
      description: "Explore nutritional food suggestions",
      path: "/doctor/food-explorer",
      iconBgColor: "bg-sage",
    },
    {
      icon: ChefHat,
      title: "Recipe Builder",
      description: "Create and share healthy recipes for patients",
      path: "/doctor/recipes",
      iconBgColor: "bg-blush",
    },
    {
      icon: ClipboardList,
      title: "Diet Charts",
      description: "Access and manage diet charts",
      path: "/doctor/diet-charts",
      iconBgColor: "bg-terracotta",
    },
    // {
    //   icon: User,
    //   title: "My Profile",
    //   description: "View and edit your profile details",
    //   path: "/doctor/profile",
    //   iconBgColor: "bg-mauve",
    // },
  ];

  const todaySchedule: ScheduleItem[] = [
    { time: "9:00 AM", patient: "Priya Sharma", type: "Prenatal Checkup" },
    { time: "10:00 AM", patient: "Anita Desai", type: "Nutrition Consultation" },
    { time: "11:30 AM", patient: "Meera Patel", type: "Follow-up Visit" },
    { time: "2:00 PM", patient: "Kavita Singh", type: "Ultrasound Review" },
    { time: "3:30 PM", patient: "Neha Gupta", type: "First Trimester Consult" },
    { time: "5:00 PM", patient: "Ritu Verma", type: "Diet Plan Discussion" },
  ];

  const resources = [
    {
      title: "Ayurvedic Nutrition Guide",
      desc: "Comprehensive guide for dosha-based diets.",
      problem: "Personalized nutrition planning",
      link: "#",
    },
    {
      title: "Pregnancy Care Best Practices",
      desc: "Evidence-based prenatal care protocols.",
      problem: "Standard care guidelines",
      link: "#",
    },
    {
      title: "Herbal Medicine Database",
      desc: "Complete reference for Ayurvedic herbs.",
      problem: "Safe herbal prescriptions",
      link: "#",
    },
    {
      title: "Patient Communication Tips",
      desc: "Building trust and effective counseling.",
      problem: "Better patient relationships",
      link: "#",
    },
  ];

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
        
        .bg-schedule { 
          background-color: rgba(255, 255, 255, 0.5);
        }
        .hover\\:bg-schedule-hover:hover { 
          background-color: rgba(240, 235, 219, 0.6);
        }
        
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
        .stagger-7 { animation-delay: 0.4s; }
        .stagger-8 { animation-delay: 0.45s; }
        .stagger-9 { animation-delay: 0.5s; }

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

        /* Floating Buttons - Closer together */
        .floating-button {
          position: fixed;
          right: 2rem;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          z-index: 40;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .floating-chatbot-button {
          bottom: 7rem;
        }

        .floating-profile-button {
          bottom: 2rem;
        }

        .floating-button:hover {
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

        /* Chatbot Modal - Smaller size */
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
              <span className="text-white font-semibold text-lg">{doctorData.initials}</span>
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
              onClick={() => navigate("/doctor/schedule")}
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Schedule
            </Button>
            <Button
              size="sm"
              className="bg-terracotta text-white hover:bg-dusty-rose-hover border-0 card-shadow"
              onClick={() => navigate("/doctor/alerts")}
            >
              <Bell className="w-3.5 h-3.5 mr-1.5" />
              Alerts
            </Button>
            <Button
              size="sm"
              className="bg-mauve-light text-primary hover:bg-mauve-hover border-0 card-shadow"
              onClick={() => navigate("/doctor/profile")}
            >
              My Profile
            </Button>
            <Button 
              size="sm"
              className="bg-warm-white text-secondary hover:bg-cream border border-warm"
              onClick={() => navigate("/")}
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
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
            Welcome back, {doctorData.name} 👋
          </h2>
          <p className="text-secondary text-lg">
            {doctorData.specialization} • Ready to help patients
          </p>
        </div>

        {/* Resources Section */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm animate-slide-up">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-primary">Professional Resources</h3>
              <p className="text-sm text-muted">
                Quick access to clinical guidelines and references
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sage/50">
              {resources.map((resource, idx) => (
                <div
                  key={idx}
                  className="min-w-[240px] p-4 rounded-lg bg-gradient-to-br from-sage/10 to-sage-light/10 cursor-pointer hover:scale-105 transition-transform hover:shadow-md"
                  onClick={() => window.open(resource.link, "_blank")}
                >
                  <div className="font-semibold text-primary">{resource.title}</div>
                  <div className="text-sm text-secondary">{resource.desc}</div>
                  <div className="text-xs text-muted mt-1">Helps with: {resource.problem}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule
        <Card className="mb-8 bg-warm-white border-warm card-shadow animate-fade-in">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-primary mb-1">
                Today's Schedule
              </h3>
              <p className="text-sm text-muted">Thursday, November 13, 2025</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {todaySchedule.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-schedule cursor-pointer hover:bg-schedule-hover transition-all card-shadow-hover border border-warm"
                >
                  <div className="font-semibold text-sage text-sm mb-1.5">{item.time}</div>
                  <div className="text-sm text-primary font-medium mb-1">{item.patient}</div>
                  <div className="text-xs text-secondary">{item.type}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-warm-white border-warm card-shadow card-shadow-hover transition-all duration-300 cursor-pointer group animate-fade-in stagger-${index + 1}`}
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.iconBgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform card-shadow`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary mb-2 text-base">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Action Buttons */}
        {/* <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
          <Button
            className="bg-dusty-rose text-white hover:bg-blush px-8 py-6 text-base border-0 card-shadow card-shadow-hover"
            onClick={() => navigate("/doctor/analytics")}
          >
            View Analytics Dashboard
          </Button>

          <Button
            className="bg-mauve-light text-primary hover:bg-mauve px-8 py-6 text-base border-0 card-shadow card-shadow-hover"
            onClick={() => navigate("/doctor/settings")}
          >
            Practice Settings
          </Button>
        </div> */}
      </div>

      {/* Floating Chatbot Button */}
      <div
        className="floating-button floating-chatbot-button bg-sage card-shadow pulse-animation flex items-center justify-center"
        onClick={() => setIsChatbotOpen(true)}
        title="Medical Assistant"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </div>

      {/* Floating Profile Button */}
      <div
        className="floating-button floating-profile-button bg-warm-beige card-shadow pulse-animation flex items-center justify-center"
        onClick={() => navigate("/doctor/profile")}
        title="My Profile"
      >
        <User className="w-7 h-7 text-white" />
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
            <PregnancyChatbot />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;