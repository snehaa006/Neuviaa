import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmergencyAlert = () => {
  const navigate = useNavigate();

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", type: "primary" },
    { name: "Poison Control", number: "1-800-222-1222", type: "secondary" },
    { name: "Pregnancy Helpline", number: "1-800-PREGNANT", type: "secondary" },
    { name: "Your Doctor", number: "9345678102", type: "primary" }
  ]; 

  const nearbyHospitals = [
    { name: "City General Hospital", distance: "2.3 miles", eta: "8 min" },
    { name: "Women's Medical Center", distance: "3.1 miles", eta: "12 min" },
    { name: "Emergency Care Center", distance: "4.2 miles", eta: "15 min" }
  ];

  return (
    <div className="min-h-screen bg-gradient-warm py-8 px-4">
      <style>{`
        /* Warm Earthy Color Palette */
        :root {
          --cream: #F0EBDB;
          --dusty-rose: #C9A6A1;
          --warm-white: #FDFBF7;
          --blush: #D4B5B0;
          --mauve: #B89690;
          --mauve-light: #D2BFB9;
          --terracotta: #C88B84;
          --sage: #B5BFA8;
          --sage-light: #CDD6C0;
          --text-primary: #5D4E47;
          --text-secondary: #8B7D73;
          --text-muted: #A69A8E;
          --border-warm: #E3D8C8;
          --shadow-warm: rgba(201, 166, 161, 0.08);
        }

        .bg-gradient-warm {
          background: linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%);
        }

        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-muted { color: var(--text-muted); }
        
        .card-shadow {
          box-shadow: 0 2px 12px var(--shadow-warm);
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.95); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .bg-terracotta-gradient {
          background: linear-gradient(135deg, #C88B84 0%, #C9A6A1 100%);
        }

        .bg-terracotta { background-color: #C88B84; }
        .bg-dusty-rose { background-color: #C9A6A1; }
        .hover\\:bg-terracotta-hover:hover { background-color: #D4B5B0; }
      `}</style>
      
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-terracotta-gradient flex items-center justify-center card-shadow">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Emergency Alert</h1>
          <p className="text-secondary">Quick access to emergency services and nearby facilities</p>
        </div>

        {/* SOS Button */}
        <Card className="mb-8 bg-terracotta-gradient text-white animate-bounce-in border-0 card-shadow">
          <CardContent className="p-8 text-center">
            <Button 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-2xl font-bold py-8 px-12 rounded-full border-0"
              style={{color: '#C88B84'}}
              onClick={() => window.open('tel:911')}
            >
              <Phone className="w-8 h-8 mr-4" />
              SOS - CALL 911
            </Button>
            <p className="mt-4 text-lg">Press for immediate emergency assistance</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Contacts */}
          <Card className="bg-white/90 backdrop-blur-sm animate-slide-up border-0 card-shadow">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${contact.type === 'primary' ? 'border-2' : ''}`}
                  style={{
                    backgroundColor: contact.type === 'primary' ? 'rgba(200, 139, 132, 0.1)' : 'rgba(201, 166, 161, 0.1)',
                    borderColor: contact.type === 'primary' ? 'rgba(200, 139, 132, 0.3)' : 'transparent'
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-primary">{contact.name}</h4>
                      <p className="text-secondary">{contact.number}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className={`text-white border-0 ${contact.type === 'primary' ? 'bg-terracotta' : 'bg-dusty-rose'} hover:bg-terracotta-hover`}
                      onClick={() => window.open(`tel:${contact.number}`)}
                    >
                      Call
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Nearby Hospitals */}
          <Card className="bg-white/90 backdrop-blur-sm animate-slide-up border-0 card-shadow" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Nearby Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyHospitals.map((hospital, index) => (
                <div key={index} className="p-4 rounded-lg" style={{backgroundColor: 'rgba(201, 166, 161, 0.1)'}}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-primary">{hospital.name}</h4>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-primary hover:bg-dusty-rose hover:text-white"
                      style={{borderColor: '#C9A6A1'}}
                      onClick={() => window.open(`https://maps.google.com/?q=${hospital.name}`)}
                    >
                      Directions
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-secondary">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hospital.distance}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {hospital.eta}
                    </span>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full text-primary hover:bg-dusty-rose hover:text-white"
                style={{borderColor: '#C9A6A1'}}
                onClick={() => window.open('https://maps.google.com/?q=hospitals+near+me')}
              >
                View All on Map
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Button 
            className="bg-dusty-rose text-white hover:bg-terracotta-hover py-6 border-0"
            onClick={() => navigate('/consult-doctor')}
          >
            <Phone className="w-5 h-5 mr-2" />
            Consult Doctor
          </Button>
          <Button 
            className="bg-dusty-rose text-white hover:bg-terracotta-hover py-6 border-0"
            onClick={() => navigate('/family-alerts')}
          >
            <Phone className="w-5 h-5 mr-2" />
            Alert Family
          </Button>
          <Button 
            variant="outline" 
            className="text-primary hover:bg-dusty-rose hover:text-white py-6"
            style={{borderColor: '#C9A6A1'}}
            onClick={() => navigate('/patient/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;