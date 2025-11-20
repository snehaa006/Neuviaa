import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X, User, Heart, Star, MessageSquare, Phone, Mail, Calendar, Activity, Droplet, Target, MapPin, Sun, Apple, HeartPulse, Thermometer, Moon, IdCard, Copy, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AssessmentData {
  // Personal Information
  name: string;
  dob: string;
  gender: string;
  location: string;
  // Lifestyle & Habits
  dailyRoutine: string;
  physicalActivity: string;
  sleepDuration: string;
  waterIntake: number;
  // Dietary Habits
  dietaryPreferences: string;
  cravings: string[];
  cravingsOther: string;
  digestionIssues: string[];
  // Health & Wellness
  currentConditions: string[];
  currentConditionsOther: string;
  familyHistory: string[];
  familyHistoryOther: string;
  medications: string;
  labReports: string;
  energyLevels: number;
  stressLevels: number;
  // Ayurvedic Constitutional Assessment
  bodyFrame: string;
  skinType: string;
  hairType: string;
  appetitePattern: string;
  personalityTraits: string[];
  weatherPreference: string;
  // Goals & Preferences
  healthGoals: string[];
  healthGoalsOther: string;
  mealPrepTime: string;
  budgetPreference: string;
  additionalNotes: string;
}

interface PatientData {
  patientId?: string;
  name: string;
  email: string;
  uid: string;
  role: string;
  questionnaireCompleted?: boolean;
  createdAt: string;
  profileCompleted?: boolean;
  registrationDate?: string;
  status?: string;
  assessmentData?: AssessmentData;
  updatedAt?: string;
}

export default function Profile() {
  const { user, setUser } = useApp();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [originalData, setOriginalData] = useState<AssessmentData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [patientIdCopied, setPatientIdCopied] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    message: "",
    category: "general" as "general" | "features" | "bug" | "suggestion"
  });

  // Fetch patient data including patient ID and assessment data from Firebase
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        console.log("Fetching patient data for user:", user.id);
        const patientDocRef = doc(db, "patients", user.id);
        const patientDoc = await getDoc(patientDocRef);

        if (patientDoc.exists()) {
          const data = patientDoc.data() as PatientData;
          console.log("Patient data fetched:", data);
          
          // Set the complete patient data
          setPatientData(data);
          
          // Extract assessment data if it exists
          const assessment = data.assessmentData as AssessmentData;
          if (assessment) {
            setAssessmentData(assessment);
            setOriginalData(assessment);
          } else {
            console.log("No assessment data found for patient");
          }
        } else {
          console.log("Patient document not found");
          toast({
            title: "Profile Not Found",
            description: "Your profile could not be found. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user, toast]);

  const handleSave = async () => {
    if (!user?.id || !assessmentData || !patientData) return;

    try {
      const patientDocRef = doc(db, "patients", user.id);
      
      // Update both assessment data and patient info
      const updateData = {
        ...patientData,
        assessmentData: assessmentData,
        updatedAt: new Date().toISOString(),
        profileCompleted: true, // Mark profile as completed when saved
      };

      await updateDoc(patientDocRef, updateData);

      // Update user context if name changed
      if (user.name !== assessmentData.name) {
        setUser({
          ...user,
          name: assessmentData.name,
        });
      }

      // Update local state
      setPatientData(prev => prev ? { ...prev, ...updateData } : null);
      setOriginalData(assessmentData);
      setIsEditing(false);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setAssessmentData(originalData);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof AssessmentData, value: unknown) => {
    if (!assessmentData) return;
    setAssessmentData({
      ...assessmentData,
      [field]: value
    });
  };

  const handleCopyPatientId = async () => {
    if (patientData?.patientId) {
      try {
        await navigator.clipboard.writeText(patientData.patientId);
        setPatientIdCopied(true);
        toast({
          title: "Patient ID Copied",
          description: "Your Patient ID has been copied to clipboard.",
        });
        setTimeout(() => setPatientIdCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy patient ID:", error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy Patient ID. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFeedbackSubmit = () => {
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your valuable feedback. We appreciate your input!",
    });
    setFeedbackData({
      rating: 5,
      message: "",
      category: "general"
    });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "Not specified";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const formatArrayToString = (arr: string[], other?: string) => {
    if (!arr || arr.length === 0) return other || "Not specified";
    const items = arr.filter(item => item !== "none");
    if (arr.includes("none")) return "None";
    const result = items.join(", ");
    return other ? `${result}${result ? ", " : ""}${other}` : result;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-warm">
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

          .text-primary { color: var(--text-primary); }
          .text-secondary { color: var(--text-secondary); }
          .text-muted { color: var(--text-muted); }
        `}</style>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A6A1] mx-auto mb-4"></div>
          <p className="text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
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

          .text-primary { color: var(--text-primary); }
          .text-secondary { color: var(--text-secondary); }
          .text-muted { color: var(--text-muted); }
        `}</style>
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <HeartPulse className="w-16 h-16 text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-primary">Profile Not Found</h2>
            <p className="text-secondary mb-4">
              Your patient profile could not be loaded. Please contact support.
            </p>
            <Button onClick={() => window.location.href = '/patient/questionnaire'} className="bg-[#C9A6A1] hover:bg-[#D4B5B0]">
              Complete Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <style>{`
        /* Warm Earthy Color Palette - Same as Dashboard */
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

        .bg-grid-pattern {
          background-image: 
            linear-gradient(var(--border-warm) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-warm) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      <div className="space-y-8 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-warm-white border border-warm card-shadow">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-dusty-rose/20 card-shadow">
                    <AvatarFallback className="bg-dusty-rose text-white text-2xl font-bold">
                      {patientData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-sage rounded-full border-4 border-warm-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-primary mb-2">{patientData.name}</h1>
                  <p className="text-lg text-secondary mb-1">{patientData.email}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Patient ID Badge */}
                    {patientData.patientId && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-2 px-3 py-1 text-sm font-mono border-warm">
                          <IdCard className="w-4 h-4" />
                          ID: {patientData.patientId}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1 hover:bg-mauve-light/20"
                            onClick={handleCopyPatientId}
                          >
                            {patientIdCopied ? (
                              <Check className="w-3 h-3 text-sage" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </Badge>
                      </div>
                    )}
                    {assessmentData?.location && (
                      <Badge variant="outline" className="gap-1 border-warm">
                        <MapPin className="w-3 h-3" />
                        {assessmentData.location}
                      </Badge>
                    )}
                    {assessmentData?.dob && (
                      <Badge variant="outline" className="gap-1 border-warm">
                        <Calendar className="w-3 h-3" />
                        {calculateAge(assessmentData.dob)}
                      </Badge>
                    )}
                  </div>
                  {/* Registration Date */}
                  {patientData.registrationDate && (
                    <p className="text-sm text-muted mt-2">
                      Member since {formatDate(patientData.registrationDate)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="lg" className="gap-2 bg-sage text-white hover:bg-sage-light border-0 card-shadow">
                      <Save className="w-5 h-5" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="lg" className="gap-2 border-warm hover:bg-cream">
                      <X className="w-5 h-5" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} size="lg" className="gap-2 bg-dusty-rose text-white hover:bg-blush border-0 card-shadow">
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patient ID Information Card */}
        {patientData.patientId && (
          <Card className="border-warm card-shadow bg-warm-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl text-primary">
                <div className="p-2 rounded-full bg-mauve-light">
                  <IdCard className="w-6 h-6 text-white" />
                </div>
                Patient Information
              </CardTitle>
              <CardDescription className="text-secondary">Your unique patient identification and account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
                  <div>
                    <p className="font-medium text-primary">Patient ID</p>
                    <p className="text-2xl font-mono font-bold text-dusty-rose">{patientData.patientId}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPatientId}
                    className="gap-2 border-warm hover:bg-mauve-light/20"
                  >
                    {patientIdCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy ID
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-4 bg-cream rounded-lg">
                  <p className="font-medium text-primary">Account Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-sage rounded-full"></div>
                    <Badge variant="outline" className="capitalize border-warm">
                      {patientData.status || 'Active'}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-cream rounded-lg">
                  <p className="font-medium text-primary">Profile Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${patientData.profileCompleted ? 'bg-sage' : 'bg-terracotta'}`}></div>
                    <Badge variant="outline" className="capitalize border-warm">
                      {patientData.profileCompleted ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-sage-light/30 border border-sage-light rounded-lg">
                <p className="text-sm text-primary">
                  <strong>Note:</strong> Please keep your Patient ID safe. You'll need it for appointments, 
                  medical records, and when contacting support.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show message if no assessment data */}
        {!assessmentData ? (
          <Card className="border-terracotta bg-blush/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <HeartPulse className="w-16 h-16 text-terracotta mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-primary">Complete Your Health Assessment</h3>
                <p className="text-secondary mb-4">
                  To get personalized recommendations, please complete your health assessment questionnaire.
                </p>
                <Button onClick={() => window.location.href = '/patient/questionnaire'} className="bg-dusty-rose text-white hover:bg-blush">
                  Start Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-6 text-center border-warm card-shadow card-shadow-hover bg-warm-white">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-sage-light">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{assessmentData.energyLevels || 0}/5</div>
                <div className="text-sm text-secondary">Energy Levels</div>
              </Card>
              <Card className="p-6 text-center border-warm card-shadow card-shadow-hover bg-warm-white">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-terracotta">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{assessmentData.stressLevels || 0}/5</div>
                <div className="text-sm text-secondary">Stress Levels</div>
              </Card>
              <Card className="p-6 text-center border-warm card-shadow card-shadow-hover bg-warm-white">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-mauve-light">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{assessmentData.waterIntake || 0}L</div>
                <div className="text-sm text-secondary">Daily Water</div>
              </Card>
              <Card className="p-6 text-center border-warm card-shadow card-shadow-hover bg-warm-white">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-dusty-rose">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{assessmentData.sleepDuration || "N/A"}</div>
                <div className="text-sm text-secondary">Sleep Duration</div>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Personal Information */}
              <Card className="border-warm card-shadow bg-warm-white">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl text-primary">
                    <div className="p-2 rounded-full bg-dusty-rose">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-secondary">Your basic profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-medium text-primary">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={assessmentData.name || patientData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="text-base h-12 border-warm"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                          <User className="w-4 h-4 text-muted" />
                          <span className="text-base text-primary">{assessmentData.name || patientData.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="dob" className="text-base font-medium text-primary">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dob"
                          type="date"
                          value={assessmentData.dob}
                          onChange={(e) => handleInputChange('dob', e.target.value)}
                          className="text-base h-12 border-warm"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                          <Calendar className="w-4 h-4 text-muted" />
                          <span className="text-base text-primary">{assessmentData.dob || "Not specified"} ({calculateAge(assessmentData.dob)})</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="text-base font-medium text-primary">Gender</Label>
                      {isEditing ? (
                        <Select
                          value={assessmentData.gender}
                          onValueChange={(value) => handleInputChange('gender', value)}
                        >
                          <SelectTrigger className="h-12 border-warm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                          <User className="w-4 h-4 text-muted" />
                          <span className="text-base capitalize text-primary">{assessmentData.gender?.replace('-', ' ') || "Not specified"}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-base font-medium text-primary">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={assessmentData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="text-base h-12 border-warm"
                          placeholder="City, State"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                          <MapPin className="w-4 h-4 text-muted" />
                          <span className="text-base text-primary">{assessmentData.location || "Not specified"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lifestyle & Habits */}
              <Card className="border-warm card-shadow bg-warm-white">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl text-primary">
                    <div className="p-2 rounded-full bg-terracotta">
                      <Sun className="w-6 h-6 text-white" />
                    </div>
                    Lifestyle & Habits
                  </CardTitle>
                  <CardDescription className="text-secondary">Your daily routine and lifestyle patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-primary">Physical Activity Level</Label>
                      <div className="p-3 bg-cream rounded-lg">
                        <Badge variant="outline" className="capitalize border-warm">
                          {assessmentData.physicalActivity || "Not specified"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-primary">Sleep Duration</Label>
                      <div className="p-3 bg-cream rounded-lg">
                        <span className="text-base text-primary">{assessmentData.sleepDuration || "Not specified"}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-primary">Daily Water Intake</Label>
                      <div className="p-3 bg-cream rounded-lg">
                        <span className="text-base text-primary">{assessmentData.waterIntake || 0}L per day</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-primary">Daily Routine</Label>
                      <div className="p-3 bg-cream rounded-lg">
                        <p className="text-base text-primary">{assessmentData.dailyRoutine || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dietary Information */}
            <Card className="border-warm card-shadow bg-warm-white">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl text-primary">
                  <div className="p-2 rounded-full bg-sage">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  Dietary Habits & Preferences
                </CardTitle>
                <CardDescription className="text-secondary">Your dietary choices and eating patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Dietary Preference</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <Badge variant="outline" className="capitalize border-warm">
                        {assessmentData.dietaryPreferences || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Food Cravings</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {assessmentData.cravings && assessmentData.cravings.length > 0 ? (
                          assessmentData.cravings.map((craving, index) => (
                            <Badge key={index} variant="secondary" className="capitalize bg-blush/30 border-warm">
                              {craving}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted">Not specified</span>
                        )}
                      </div>
                      {assessmentData.cravingsOther && (
                        <p className="text-sm mt-2 text-secondary">Other: {assessmentData.cravingsOther}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-base font-medium text-primary">Digestive Issues</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-base text-primary">{formatArrayToString(assessmentData.digestionIssues)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card className="border-warm card-shadow bg-warm-white">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl text-primary">
                  <div className="p-2 rounded-full bg-mauve">
                    <HeartPulse className="w-6 h-6 text-white" />
                  </div>
                  Health & Wellness
                </CardTitle>
                <CardDescription className="text-secondary">Your health status and medical information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Current Health Conditions</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-base text-primary">{formatArrayToString(assessmentData.currentConditions, assessmentData.currentConditionsOther)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Family History</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-base text-primary">{formatArrayToString(assessmentData.familyHistory, assessmentData.familyHistoryOther)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Energy Levels (1-5)</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-soft-beige rounded-full h-2">
                          <div 
                            className="bg-sage h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${((assessmentData.energyLevels || 0) / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-primary">{assessmentData.energyLevels || 0}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Stress Levels (1-5)</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-soft-beige rounded-full h-2">
                          <div 
                            className="bg-terracotta h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${((assessmentData.stressLevels || 0) / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-primary">{assessmentData.stressLevels || 0}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-base font-medium text-primary">Current Medications & Supplements</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-base text-primary">{assessmentData.medications || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-base font-medium text-primary">Recent Lab Reports</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-base text-primary">{assessmentData.labReports || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ayurvedic Constitution */}
            <Card className="border-warm card-shadow bg-warm-white">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl text-primary">
                  <div className="p-2 rounded-full bg-blush">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  Ayurvedic Constitution Assessment
                </CardTitle>
                <CardDescription className="text-secondary">Your body constitution and characteristics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Body Frame</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <Badge variant="outline" className="capitalize border-warm">
                        {assessmentData.bodyFrame || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Skin Type</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <Badge variant="outline" className="capitalize border-warm">
                        {assessmentData.skinType || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Hair Type</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <Badge variant="outline" className="capitalize border-warm">
                        {assessmentData.hairType || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Appetite Pattern</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <Badge variant="outline" className="capitalize border-warm">
                        {assessmentData.appetitePattern || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Weather Preference</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <Badge variant="outline" className="capitalize border-warm">
                        {assessmentData.weatherPreference || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Personality Traits</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <div className="flex flex-wrap gap-1">
                        {assessmentData.personalityTraits && assessmentData.personalityTraits.length > 0 ? (
                          assessmentData.personalityTraits.map((trait, index) => (
                            <Badge key={index} variant="secondary" className="capitalize text-xs bg-mauve-light/30 border-warm">
                              {trait.replace('-', ' ')}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted">Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Goals & Preferences */}
            <Card className="border-warm card-shadow bg-warm-white">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl text-primary">
                  <div className="p-2 rounded-full bg-sage-light">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  Health Goals & Lifestyle Preferences
                </CardTitle>
                <CardDescription className="text-secondary">Your wellness objectives and lifestyle choices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Health Goals</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {assessmentData.healthGoals && assessmentData.healthGoals.length > 0 ? (
                          assessmentData.healthGoals.map((goal, index) => (
                            <Badge key={index} variant="secondary" className="capitalize bg-sage/30 border-warm">
                              {goal.replace('-', ' ')}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted">Not specified</span>
                        )}
                      </div>
                      {assessmentData.healthGoalsOther && (
                        <p className="text-sm text-secondary">Other: {assessmentData.healthGoalsOther}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Meal Prep Time</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <Badge variant="outline" className="capitalize border-warm">
                        {assessmentData.mealPrepTime || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-primary">Budget Preference</Label>
                    <div className="p-3 bg-cream rounded-lg">
                      <Badge variant="outline" className="capitalize border-warm">
                        {assessmentData.budgetPreference || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-base font-medium text-primary">Additional Notes</Label>
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-base text-primary">{assessmentData.additionalNotes || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Feedback Section */}
        <Card className="border-warm card-shadow bg-warm-white">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-primary">
              <div className="p-2 rounded-full bg-mauve-light">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              Share Your Feedback
            </CardTitle>
            <CardDescription className="text-secondary">Help us improve your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium text-primary">Overall Rating</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= feedbackData.rating 
                            ? 'fill-terracotta text-terracotta' 
                            : 'text-soft-beige hover:text-blush'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-medium text-primary">{feedbackData.rating}/5</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-base font-medium text-primary">Feedback Category</Label>
                <Select
                  value={feedbackData.category}
                  onValueChange={(value: "general" | "features" | "bug" | "suggestion") => 
                    setFeedbackData({ ...feedbackData, category: value })
                  }
                >
                  <SelectTrigger className="h-12 border-warm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Feedback</SelectItem>
                    <SelectItem value="features">Feature Request</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-base font-medium text-primary">Your Message</Label>
                <Textarea
                  value={feedbackData.message}
                  onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                  placeholder="Share your thoughts, suggestions, or report any issues..."
                  className="min-h-[120px] resize-none border-warm"
                />
              </div>
              <Button onClick={handleFeedbackSubmit} className="w-full h-12 gap-2 bg-dusty-rose text-white hover:bg-blush border-0 card-shadow">
                <MessageSquare className="w-5 h-5" />
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-warm card-shadow bg-warm-white">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-primary">
              <div className="p-2 rounded-full bg-sage">
                <Phone className="w-6 h-6 text-white" />
              </div>
              Contact & Support
            </CardTitle>
            <CardDescription className="text-secondary">Get in touch with our team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-4 bg-cream rounded-lg">
                <Mail className="w-5 h-5 text-muted" />
                <div>
                  <p className="font-medium text-primary">Email Support</p>
                  <p className="text-sm text-secondary">support@ayurvedaapp.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-cream rounded-lg">
                <Phone className="w-5 h-5 text-muted" />
                <div>
                  <p className="font-medium text-primary">Phone Support</p>
                  <p className="text-sm text-secondary">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}