import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"patient" | "doctor">("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      toast({
        title: "✅ Login successful!",
        description: `Welcome back, ${user.email}`,
      });
      
      // Navigate based on login type
      if (loginType === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      let errorMessage = "Login failed. Please try again.";
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String((error as { message?: unknown }).message);
      }
      toast({
        title: "❌ Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0EBDB] to-[#E8DDD4] flex items-center justify-center p-4">
      <div className="absolute inset-0 logo-bg opacity-5"></div>
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C9A6A1] to-[#B89490] flex items-center justify-center">
            <img
              src="lovable-uploads/logoo.png"
              alt="Neuvia Logo"
              className="w-17 h-17 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#6A452C]">
            Welcome Back
          </CardTitle>
          <p className="text-[#976841]">Sign in to your Neuvia account</p>
        </CardHeader>
        <CardContent>
          {/* Login Type Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-[#F0EBDB] rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType("patient")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginType === "patient"
                  ? "bg-white text-[#6A452C] shadow-sm"
                  : "text-[#976841] hover:text-[#6A452C]"
              }`}
            >
              Patient Login
            </button>
            <button
              type="button"
              onClick={() => setLoginType("doctor")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginType === "doctor"
                  ? "bg-white text-[#6A452C] shadow-sm"
                  : "text-[#976841] hover:text-[#6A452C]"
              }`}
            >
              Doctor Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#6A452C] font-medium">
                {loginType === "doctor" ? "Doctor Email" : "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={`Enter your ${loginType === "doctor" ? "doctor " : ""}email`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="border-[#C9A6A1]/30 focus:border-[#C9A6A1]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#6A452C] font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="border-[#C9A6A1]/30 focus:border-[#C9A6A1] pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-[#976841]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#976841]" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#C9A6A1] to-[#B89490] text-white hover:opacity-90"
            >
              Sign In as {loginType === "doctor" ? "Doctor" : "Patient"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[#976841]">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="text-[#C9A6A1] hover:text-[#6A452C] p-0"
                onClick={() => navigate("/signup")}
              >
                Sign up here
              </Button>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              className="text-[#976841] hover:text-[#6A452C]"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;