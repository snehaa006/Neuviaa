import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Stethoscope,
  Apple,
  Baby,
  FileText,
  Pill,
  Users,
  Phone,
  Brain,
  MessageCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PregnancyChatbot from "../neuvia/PregnancyChatbot";


type ScheduleItem = {
  day: string;
  activity: string;
  time: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "Neurological Health",
      description: "Monitor cognitive wellness and mental clarity",
      path: "http://localhost:8502",
      iconBgColor: "bg-mauve-light",
    },
    {
      icon: Brain,
      title: "Early AI Powered Detection",
      description: "Monitor cognitive wellness and mental clarity",
      path: "http://localhost:8501",
      iconBgColor: "bg-mauve-light",
    },
    {
      icon: Activity,
      title: "Daily Symptom Tracker",
      description: "Track your daily symptoms and health",
      path: "/symptom-tracker",
      iconBgColor: "bg-dusty-rose",
    },
    {
      icon: Stethoscope,
      title: "Consult a Doctor",
      description: "Find and book appointments with specialists",
      path: "/patient/consult-doctor",
      iconBgColor: "bg-sage-light",
    },
    {
      icon: Apple,
      title: "Personalized Diet Plan",
      description: "Custom nutrition plans for your pregnancy",
      path: "/diet-plan",
      iconBgColor: "bg-sage",
    },
    {
      icon: Baby,
      title: "Ultrasound Tracker",
      description: "Track your baby's development",
      path: "/ultrasound-tracker",
      iconBgColor: "bg-blush",
    },
    {
      icon: FileText,
      title: "Medical Records",
      description: "Access your complete medical history",
      path: "/medical-record",
      iconBgColor: "bg-dusty-rose",
    },
    {
      icon: Pill,
      title: "Medicine Reminder",
      description: "Never miss your medications",
      path: "/medicine-reminder",
      iconBgColor: "bg-mauve",
    },
  ];

  const weeklySchedule: ScheduleItem[] = [
    { day: "Monday", activity: "Prenatal Yoga", time: "10:00 AM" },
    { day: "Tuesday", activity: "Dr. Priya Sharma", time: "2:00 PM" },
    { day: "Wednesday", activity: "Nutrition Class", time: "11:00 AM" },
    { day: "Thursday", activity: "Ultrasound", time: "3:00 PM" },
    { day: "Friday", activity: "Rest Day", time: "All Day" },
    { day: "Saturday", activity: "Prenatal Massage", time: "4:00 PM" },
    { day: "Sunday", activity: "Family Time", time: "All Day" },
  ];
  const exercises = [
    {
      title: "Prenatal Yoga (22-Min)",
      desc: "Full-body, gentle prenatal flow.",
      problem: "Stress relief & improved flexibility",
      link: "https://www.youtube.com/watch?v=-3bvlFKeLRE",
    },
    {
      title: "15-Min Pregnancy Yoga",
      desc: "Gentle routine for all trimesters.",
      problem: "Mobility & relaxation",
      link: "https://www.youtube.com/watch?v=zmUJWKM98hM",
    },
    {
      title: "Pelvic Floor Exercises",
      desc: "Targeted pelvic floor strengthening.",
      problem: "Prevents urinary incontinence",
      link: "https://m.youtube.com/watch?t=24s&v=z8ik-Oje-k4",
    },
    {
      title: "Core & Delivery Prep",
      desc: "Pelvic & abdominal support routine.",
      problem: "Eases delivery & recovery",
      link: "https://www.youtube.com/watch?pp=0gcJCRsBo7VqN5tD&v=Ilg-gQY2Rxc",
    },
    {
      title: "Cat-Cow Stretch",
      desc: "Gentle spinal flexion & extension.",
      problem: "Lower back pain relief",
      link: "https://www.youtube.com/watch?pp=ygUMI3ByZXlvZ2FmbG93&v=Wlu6HsO-pEM",
    },
    {
      title: "Sciatica & Back Pain Yoga",
      desc: "Carefully designed to relieve sciatica.",
      problem: "Eases nerve and back pain",
      link: "https://www.youtube.com/watch?pp=ygUHI3lvZ290dg%3D%3D&v=VKIGqEEtW4o",
    },
  ];


  const handleScheduleClick = (item: ScheduleItem) => {
    if (item.activity.includes("Dr.")) navigate("/consult-doctor");
    else if (item.activity === "Ultrasound") navigate("/ultrasound-tracker");
    else if (item.activity === "Nutrition Class") navigate("/diet-plan");
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

        .floating-family-button {
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
              <img
                src="../lovable-uploads/logoo.png"
                alt="Neuvia Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Neuvia</h1>
              <p className="text-xs text-muted">Care Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              className="bg-sage text-white hover:bg-sage-light border-0 card-shadow"
              onClick={() => navigate("/community")}
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Community
            </Button>
            <Button
              size="sm"
              className="bg-terracotta text-white hover:bg-dusty-rose-hover border-0 card-shadow"
              onClick={() => navigate("/emergency-alert")}
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              SOS
            </Button>
            <Button
              size="sm"
              className="bg-mauve-light text-primary hover:bg-mauve-hover border-0 card-shadow"
              onClick={() => navigate("/patient/profile")}
            >
              My Profile
            </Button>
            <Button 
              size="sm"
              className="bg-warm-white text-secondary hover:bg-cream border border-warm"
              onClick={() => navigate("/")}
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
            NAMASTE 🙏
          </h2>
          <p className="text-secondary text-lg">Track your journey to motherhood with care and confidence</p>
        </div>
         {/* Exercises Section */}
         <Card className="mb-8 bg-white/90 backdrop-blur-sm animate-slide-up">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-[#6A452C]">Pregnancy Exercises</h3>
              <p className="text-sm text-[#976841]">
                Scroll to explore safe video routines and their benefits
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#AE794B]/50">
              {exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="min-w-[240px] p-4 rounded-lg bg-gradient-to-br from-[#DB9C60]/10 to-[#AE794B]/10 cursor-pointer hover:scale-105 transition-transform hover:shadow-md"
                  onClick={() => window.open(exercise.link, "_blank")}
                >
                  <div className="font-semibold text-[#6A452C]">{exercise.title}</div>
                  <div className="text-sm text-[#976841]">{exercise.desc}</div>
                  <div className="text-xs text-[#AE794B] mt-1">Helps with: {exercise.problem}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card className="mb-8 bg-warm-white border-warm card-shadow animate-fade-in">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-primary mb-1">
                Weekly Schedule
              </h3>
              <p className="text-sm text-muted">Your personalized care plan</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
              {weeklySchedule.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-schedule cursor-pointer hover:bg-schedule-hover transition-all card-shadow-hover border border-warm"
                  onClick={() => handleScheduleClick(item)}
                >
                  <div className="font-semibold text-primary text-sm mb-1.5">{item.day}</div>
                  <div className="text-xs text-secondary mb-1">{item.activity}</div>
                  <div className="text-xs text-muted">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-warm-white border-warm card-shadow card-shadow-hover transition-all duration-300 cursor-pointer group animate-fade-in stagger-${index + 1}`}
              onClick={() => {
                if (feature.path.startsWith("http")) {
                  window.open(feature.path, "_blank"); // opens new tab
                } else {
                  navigate(feature.path);
                }
              }}
              
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
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
          <Button
            className="bg-dusty-rose text-white hover:bg-blush px-8 py-6 text-base border-0 card-shadow card-shadow-hover"
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              navigate(`/weekly-trends?date=${today}`);
            }}
          >
            📈 View Trend Dashboard
          </Button>

          <Button
            className="bg-mauve-light text-primary hover:bg-mauve px-8 py-6 text-base border-0 card-shadow card-shadow-hover"
            onClick={() => navigate("/feedback")}
          >
            📝 Share Feedback
          </Button>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <div
        className="floating-button floating-chatbot-button bg-sage card-shadow pulse-animation flex items-center justify-center"
        onClick={() => setIsChatbotOpen(true)}
        title="Pregnancy Wellness Assistant"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </div>

      {/* Floating Family Alerts Button */}
      <div
        className="floating-button floating-family-button bg-warm-beige card-shadow pulse-animation flex items-center justify-center"
        onClick={() => navigate("/family-alerts")}
        title="Family Alerts"
      >
        <Users className="w-7 h-7 text-white" />
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

export default Dashboard;