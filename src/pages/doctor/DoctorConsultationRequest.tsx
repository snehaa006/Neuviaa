import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { User, CheckCircle, Clock, MessageCircle, Calendar, AlertCircle } from "lucide-react";

interface ConsultationRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  requestType: "consultation" | "follow-up" | "emergency";
  mode: "in-person" | "video-call" | "phone";
  urgency: "low" | "medium" | "high" | "emergency";
  message?: string;
  date: Date;
  status: "pending" | "accepted" | "rejected";
}

const DoctorConsultationRequests = () => {
  const { doctor, consultationRequests } = useApp();
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (consultationRequests && doctor) {
      setRequests(
        consultationRequests.filter((req: ConsultationRequest) => req.doctorId === doctor.id)
      );
    }
  }, [consultationRequests, doctor]);

  const openChat = (patientId: string) => {
    navigate(`/doctor/chat/${patientId}`);
  };

  const formatPatientName = (name: string) => {
    if (!name) return "Unknown";
    return name;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-terracotta text-white";
      case "high":
        return "bg-dusty-rose text-white";
      case "medium":
        return "bg-mauve-light text-primary";
      case "low":
        return "bg-sage-light text-primary";
      default:
        return "bg-warm-beige text-primary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-sage" />;
      case "pending":
        return <Clock className="w-4 h-4 text-mauve" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <style>{`
        /* Warm Earthy Color Palette */
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

        .hover\\:bg-sage-hover:hover {
          background-color: #A5AF98;
        }

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
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
      `}</style>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold text-primary mb-2">
            Consultation Requests
          </h1>
          <p className="text-secondary">
            Manage and respond to patient consultation requests
          </p>
        </div>

        {/* Content */}
        {requests.length === 0 ? (
          <Card className="bg-warm-white border-warm card-shadow animate-fade-in">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-sage" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                No Consultation Requests
              </h3>
              <p className="text-muted">
                You don't have any pending consultation requests at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5">
            {requests.map((req, index) => (
              <Card
                key={req.id}
                className={`bg-warm-white border-warm card-shadow card-shadow-hover transition-all duration-300 animate-fade-in stagger-${Math.min(index + 1, 5)}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-dusty-rose flex items-center justify-center card-shadow flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-primary mb-2">
                          {formatPatientName(req.patientName)}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-mauve text-white border-0 text-xs px-2 py-1">
                            {req.requestType}
                          </Badge>
                          <Badge className={`${getUrgencyColor(req.urgency)} border-0 text-xs px-2 py-1`}>
                            {req.urgency}
                          </Badge>
                          <Badge className="bg-warm-beige text-primary border-0 text-xs px-2 py-1">
                            {req.mode.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(req.status)}
                      {req.status === "accepted" && (
                        <Button
                          size="sm"
                          className="bg-sage text-white hover:bg-sage-hover border-0 card-shadow"
                          onClick={() => openChat(req.patientId)}
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                          Chat
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {req.message && (
                    <div className="mb-3 p-3 rounded-lg bg-cream">
                      <p className="text-sm text-secondary leading-relaxed">
                        {req.message}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(req.date).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorConsultationRequests;