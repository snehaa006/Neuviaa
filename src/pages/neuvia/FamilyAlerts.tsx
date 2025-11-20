import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Phone, Mail, Plus, Send, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FamilyAlerts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([
    { id: 1, name: "John (Husband)", phone: "+91 98765 43210", email: "john@email.com", relationship: "Spouse", priority: "Primary" },
    { id: 2, name: "Mom", phone: "+91 98765 43211", email: "mom@email.com", relationship: "Mother", priority: "Emergency" },
    { id: 3, name: "Sarah (Sister)", phone: "+91 98765 43212", email: "sarah@email.com", relationship: "Sister", priority: "Secondary" }
  ]);

  const [newContact, setNewContact] = useState({
    name: "", phone: "", email: "", relationship: "", priority: "Secondary"
  });

  const [alertMessage, setAlertMessage] = useState("");

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = { id: Date.now(), ...newContact };
      setContacts([...contacts, contact]);
      setNewContact({ name: "", phone: "", email: "", relationship: "", priority: "Secondary" });
      toast({ title: "Contact Added", description: "New emergency contact has been added successfully." });
    }
  };

  const sendAlert = (type: string, message: string) => {
    console.log(`Sending ${type} alert:`, message);
    toast({
      title: "Alert Sent Successfully",
      description: `Your ${type} alert has been sent to all ${contacts.length} emergency contacts.`,
    });
  };

  const quickAlerts = [
    { type: "emergency", title: "Emergency Alert", message: "I need immediate assistance.", color: "bg-dusty-rose text-white" },
    { type: "hospital", title: "Going to Hospital", message: "I'm heading to the hospital.", color: "bg-mauve-light text-primary" },
    { type: "checkup", title: "Doctor Visit", message: "At the doctor for checkup.", color: "bg-cream text-primary" },
    { type: "update", title: "Health Update", message: "Sharing a health update.", color: "bg-warm-white text-primary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm py-8 px-4">
      <style>{`
        /* Warm Earthy Color Palette */
        .bg-gradient-warm {
          background: linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%);
        }
        .bg-warm-white { background-color: #FDFBF7; }
        .bg-dusty-rose { background-color: #C9A6A1; }
        .bg-cream { background-color: #F0EBDB; }
        .bg-mauve-light { background-color: #D2BFB9; }
        .text-primary { color: #5D4E47; }
        .text-secondary { color: #8B7D73; }
        .text-muted { color: #A69A8E; }
        .border-warm { border-color: #E3D8C8; }
        .card-shadow { box-shadow: 0 2px 12px rgba(201,166,161,0.08); }
        .card-shadow-hover:hover { box-shadow: 0 4px 20px rgba(201,166,161,0.15); }
      `}</style>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dusty-rose flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Family Alerts</h1>
          <p className="text-secondary">Keep your loved ones informed about your health</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Alerts */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-warm-white border-warm card-shadow backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Quick Alerts</CardTitle>
                <p className="text-secondary text-sm">Send instant updates to your family</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {quickAlerts.map((alert, i) => (
                    <Card key={i} className={`${alert.color} border-warm card-shadow-hover cursor-pointer transition-transform hover:scale-[1.02]`}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{alert.title}</h4>
                        <p className="text-sm mb-3 opacity-90">{alert.message}</p>
                        <Button 
                          size="sm"
                          className="border-warm bg-white/20 hover:bg-white/30 text-white"
                          onClick={() => sendAlert(alert.type, alert.message)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Alert
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Custom Message */}
                <div className="border-t border-warm pt-6">
                  <h4 className="font-semibold text-primary mb-3">Custom Message</h4>
                  <Textarea
                    placeholder="Type your custom message here..."
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className="mb-4 border-warm focus:border-dusty-rose"
                  />
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-dusty-rose text-white hover:bg-mauve-light"
                      onClick={() => {
                        if (alertMessage.trim()) {
                          sendAlert('custom', alertMessage);
                          setAlertMessage("");
                        } else {
                          toast({
                            title: "Message Required",
                            description: "Please enter a message before sending.",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" /> Send Custom Alert
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-warm text-secondary hover:bg-cream"
                      onClick={() => sendAlert('location', 'Sharing my current location.')}
                    >
                      Share Location
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="bg-warm-white border-warm card-shadow backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-primary">Emergency Contacts</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-dusty-rose text-white hover:bg-mauve-light">
                        <Plus className="w-4 h-4 mr-2" /> Add Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-warm-white border-warm">
                      <DialogHeader>
                        <DialogTitle className="text-primary">Add Emergency Contact</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="contactName" className="text-primary">Name & Relationship</Label>
                          <Input
                            id="contactName"
                            value={newContact.name}
                            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                            placeholder="e.g., John (Husband)"
                            className="border-warm focus:border-dusty-rose"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactPhone" className="text-primary">Phone Number</Label>
                          <Input
                            id="contactPhone"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                            placeholder="+91 98765 43210"
                            className="border-warm focus:border-dusty-rose"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail" className="text-primary">Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={newContact.email}
                            onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                            placeholder="email@example.com"
                            className="border-warm focus:border-dusty-rose"
                          />
                        </div>
                        <Button 
                          onClick={addContact}
                          className="w-full bg-dusty-rose text-white hover:bg-mauve-light"
                          disabled={!newContact.name || !newContact.phone}
                        >
                          Add Contact
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="p-4 rounded-lg border border-warm bg-cream/30">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-primary">{contact.name}</h4>
                          <p className="text-sm text-secondary">{contact.relationship}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          contact.priority === 'Primary' ? 'bg-dusty-rose text-white' :
                          contact.priority === 'Emergency' ? 'bg-mauve-light text-primary' :
                          'bg-cream text-primary'
                        }`}>
                          {contact.priority}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-warm text-secondary hover:bg-cream"
                          onClick={() => window.open(`tel:${contact.phone}`)}
                        >
                          <Phone className="w-3 h-3 mr-1" /> Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-warm text-secondary hover:bg-cream"
                          onClick={() => window.open(`mailto:${contact.email}`)}
                        >
                          <Mail className="w-3 h-3 mr-1" /> Email
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Actions */}
            <Card className="bg-dusty-rose text-white card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Emergency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="secondary"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => {
                    window.open('tel:112');
                    sendAlert('emergency', 'Emergency call made to 112');
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" /> Call 112
                </Button>
                <Button 
                  variant="secondary"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => sendAlert('emergency', 'I need immediate assistance!')}
                >
                  <Send className="w-4 h-4 mr-2" /> Alert All Contacts
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-warm-white border-warm card-shadow backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-dusty-rose text-white hover:bg-mauve-light"
                  onClick={() => navigate('/medical-record')}
                >
                  Share Medical Records
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-warm text-secondary hover:bg-cream"
                  onClick={() => navigate('/ultrasound-tracker')}
                >
                  Share Baby Updates
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-warm text-secondary hover:bg-cream"
                  onClick={() => navigate('/patient/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyAlerts;