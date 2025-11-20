import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Phone, MessageCircle, MapPin, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  city: string;
  phone: string;
  experience: string;
  consultationFee: number;
  photoUrl: string;
};

const ConsultDoctor = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "doctors"));
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unknown Doctor",
            specialization: data.specialization || "Not specified",
            city: data.city || "N/A",
            phone: data.phone || "",
            experience: data.experience || "0 years",
            consultationFee: data.consultationFee || 0,
            photoUrl: data.photoUrl || "",
          } as Doctor;
        });
        setDoctors(list);
        console.log("Fetched doctors:", list);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        toast({ title: "Error", description: "Failed to load doctor data." });
      }
    };
    fetchDoctors();
  }, []);

  // ✅ Safe filtering with null-checks
  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase();
    return (
      (doc.name?.toLowerCase() || "").includes(q) ||
      (doc.specialization?.toLowerCase() || "").includes(q) ||
      (doc.city?.toLowerCase() || "").includes(q)
    );
  });

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
        .hover\\:bg-dusty-rose:hover { background-color: #C9A6A1; }
        .hover\\:text-white:hover { color: white; }
        .card-shadow {
          box-shadow: 0 2px 12px rgba(201, 166, 161, 0.08);
        }
        .card-shadow-hover:hover {
          box-shadow: 0 4px 20px rgba(201, 166, 161, 0.15);
        }
      `}</style>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Consult a Doctor</h1>
          <p className="text-secondary text-lg">
            Find and instantly chat or call a doctor near you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-warm-white backdrop-blur-sm p-6 rounded-xl border border-warm card-shadow">
          <div className="flex items-center gap-4">
            <Search className="text-secondary w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, or specialization..."
              className="border-warm focus:border-dusty-rose"
            />
          </div>
        </div>

        {/* Doctor Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-warm-white rounded-xl mb-6 border border-warm card-shadow">
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-dusty-rose data-[state=active]:text-white"
            >
              Available Doctors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Doctor List */}
              <div className="lg:col-span-2 space-y-6">
                {filteredDoctors.length === 0 && (
                  <p className="text-secondary text-center py-8">
                    No doctors found for your search.
                  </p>
                )}

                {filteredDoctors.map((doc) => (
                  <Card
                    key={doc.id}
                    className="bg-warm-white backdrop-blur-sm border-warm card-shadow card-shadow-hover transition-all duration-300"
                  >
                    <CardContent className="flex gap-4 p-6">
                      {/* Profile Image */}
                      {doc.photoUrl ? (
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="w-24 h-24 rounded-full object-cover border-2 border-warm"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full border-2 border-warm flex items-center justify-center bg-cream">
                          <User className="w-10 h-10 text-dusty-rose" />
                        </div>
                      )}

                      {/* Doctor Info */}
                      <div className="flex-1 ml-2">
                        <h3 className="text-primary font-semibold text-lg mb-1">
                          {doc.name}
                        </h3>
                        <p className="text-secondary text-sm mb-1">
                          {doc.specialization}
                        </p>
                        <p className="text-sm text-secondary flex items-center">
                          <MapPin className="inline w-4 h-4 mr-1" />
                          {doc.city}
                        </p>
                        <p className="text-sm text-muted mt-1">
                          Experience: {doc.experience}
                        </p>
                        <p className="text-sm text-muted mt-1">
                          Fee: ₹{doc.consultationFee}
                        </p>

                        {/* Contact Buttons */}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-warm text-secondary hover:bg-mauve-light hover:text-white"
                            onClick={() => window.open(`tel:${doc.phone}`)}
                          >
                            <Phone className="w-4 h-4 mr-1" /> Call
                          </Button>
                          <Button
                            size="sm"
                            className="bg-dusty-rose text-white hover:bg-mauve-light border-0"
                            onClick={() =>
                              window.open(
                                `https://wa.me/${doc.phone.replace(/\D/g, "")}?text=Hello%20Dr.%20${encodeURIComponent(
                                  doc.name
                                )}`,
                                "_blank"
                              )
                            }
                          >
                            <MessageCircle className="w-4 h-4 mr-1" /> Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="bg-warm-white backdrop-blur-sm p-6 border-warm card-shadow">
                  <CardTitle className="text-primary mb-4">Quick Actions</CardTitle>
                  <Button
                    className="w-full bg-dusty-rose text-white hover:bg-mauve-light mb-3 border-0"
                    onClick={() => navigate("/emergency-alert")}
                  >
                    🚨 Emergency Alert
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mb-3 border-warm text-secondary hover:bg-cream"
                    onClick={() => navigate("/medical-record")}
                  >
                    🗂 View Medical Records
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-warm text-secondary hover:bg-cream"
                    onClick={() => navigate("/dashboard")}
                  >
                    🔙 Back to Dashboard
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsultDoctor;
