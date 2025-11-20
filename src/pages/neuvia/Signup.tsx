import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [signupType, setSignupType] = useState<"patient" | "doctor">("patient");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    // Doctor-specific fields
    specialization: "",
    licenseNumber: "",
    hospital: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Prepare user data based on signup type
      const userData: any = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        userType: signupType,
        createdAt: new Date().toISOString(),
      };

      // Add doctor-specific fields if signing up as doctor
      if (signupType === "doctor") {
        userData.specialization = formData.specialization;
        userData.licenseNumber = formData.licenseNumber;
        userData.hospital = formData.hospital;
      }

      // Store in appropriate collection
      // Store in appropriate collection
      const collection = signupType === "doctor" ? "doctors" : "users";

      // Add questionnaireCompleted field for patients
      // Inside handleSubmit after preparing userData
    if (signupType === "patient") {
      userData.questionnaireCompleted = false; // important for new patients
    }


      await setDoc(doc(db, collection, user.uid), userData);

      toast({
        title: "✅ Signup Successful",
        description: `Welcome to Neuvia${
          signupType === "doctor" ? ", Doctor" : ""
        }!`,
      });

      // Navigate based on signup type
      // Navigate based on signup type
      // Navigate after signup
    if (signupType === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/patient/questionnaire"); // <-- redirect to questionnaire
    }

    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String((error as { message?: unknown }).message);
      }

      if (errorMessage.includes("auth/email-already-in-use")) {
        toast({
          title: "⚠️ Account Already Exists",
          description: "Redirecting to login...",
          variant: "destructive",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      toast({
        title: "❌ Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <style>{`
        .bg-gradient-warm {
          background: linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%);
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <Card className="w-full max-w-md bg-warm-white backdrop-blur-sm shadow-xl animate-fade-in border-warm">
        <style>{`
          .bg-warm-white { background-color: rgba(253, 251, 247, 0.95); }
          .border-warm { border-color: #E3D8C8; }
          .bg-dusty-rose { background-color: #C9A6A1; }
          .text-primary { color: #5D4E47; }
          .text-secondary { color: #8B7D73; }
          .card-shadow {
            box-shadow: 0 4px 20px rgba(201, 166, 161, 0.15);
          }
        `}</style>
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dusty-rose flex items-center justify-center card-shadow">
            <img
              src="lovable-uploads/logoo.png"
              alt="Neuvia Logo"
              className="w-17 h-17 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Join Neuvia
          </CardTitle>
          <p className="text-secondary">Create your pregnancy care account</p>
        </CardHeader>
        <CardContent>
          {/* Signup Type Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gradient-to-br from-[#F0EBDB] to-[#E8DDD4] rounded-lg">
            <button
              type="button"
              onClick={() => setSignupType("patient")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                signupType === "patient"
                  ? "bg-white text-primary shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Patient Signup
            </button>
            <button
              type="button"
              onClick={() => setSignupType("doctor")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                signupType === "doctor"
                  ? "bg-white text-primary shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Doctor Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-primary">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                className="border-warm focus:border-dusty-rose"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="border-warm focus:border-dusty-rose"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="pr-10 border-warm focus:border-dusty-rose"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-secondary hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-primary">
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
                className="border-warm focus:border-dusty-rose"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-primary">
                Location *
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter your city/location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                className="border-warm focus:border-dusty-rose"
              />
            </div>

            {/* Doctor-specific fields */}
            {signupType === "doctor" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-primary">
                    Specialization *
                  </Label>
                  <Input
                    id="specialization"
                    type="text"
                    placeholder="e.g., Obstetrician, Gynecologist"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                    required
                    className="border-warm focus:border-dusty-rose"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-primary">
                    Medical License Number *
                  </Label>
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder="Enter your license number"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licenseNumber: e.target.value,
                      })
                    }
                    required
                    className="border-warm focus:border-dusty-rose"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital" className="text-primary">
                    Hospital/Clinic *
                  </Label>
                  <Input
                    id="hospital"
                    type="text"
                    placeholder="Enter your hospital or clinic name"
                    value={formData.hospital}
                    onChange={(e) =>
                      setFormData({ ...formData, hospital: e.target.value })
                    }
                    required
                    className="border-warm focus:border-dusty-rose"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
                className="border-warm data-[state=checked]:bg-dusty-rose"
              />
              <Label htmlFor="rememberMe" className="text-sm text-secondary">
                Remember me and keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-dusty-rose text-white hover:bg-mauve-light border-0 card-shadow"
              disabled={loading}
            >
              <style>{`
                .bg-mauve-light { background-color: #D2BFB9; }
              `}</style>
              {loading
                ? "Creating Account..."
                : `Create ${
                    signupType === "doctor" ? "Doctor" : "Patient"
                  } Account`}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary">
              Already have an account?{" "}
              <Button
                variant="link"
                className="text-dusty-rose hover:text-primary p-0"
                onClick={() => navigate("/login")}
              >
                Sign in here
              </Button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              className="text-secondary hover:text-primary hover:bg-warm-beige"
              onClick={() => navigate("/")}
            >
              <style>{`
                .hover\\:bg-warm-beige:hover { background-color: #F0EBDB; }
              `}</style>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
