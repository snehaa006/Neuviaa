import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award,
  Clock,
  Calendar,
  Languages,
  BookOpen,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Star,
  GraduationCap,
  Building,
  FileText,
  CheckCircle,
  Copy,
  Check,
  IdCard,
  MessageSquare,
  TrendingUp,
  Users,
  Activity,
  Heart
} from 'lucide-react';

interface DoctorData {
  doctorId?: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  registrationNumber: string;
  specialization: string[];
  ayurvedicSpecialization: string[];
  qualifications: string[];
  experience: string;
  currentWorkplace: string;
  
  consultationFee: string;
  consultationDuration: string;
  languages: string[];
  availableDays: string[];
  availableTimeSlots: string[];
  
  bio: string;
  expertise: string[];
  achievements: string[];
  publications: string[];
  
  totalPatients: number;
  averageRating: number;
  totalReviews: number;
  joinDate: string;
  registrationDate?: string;
  status?: string;
  
  acceptingNewPatients: boolean;
  onlineConsultation: boolean;
  inPersonConsultation: boolean;
  
  photoURL: string;
  profileCompleted?: boolean;
  updatedAt?: string;
}

const DoctorProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [doctorIdCopied, setDoctorIdCopied] = useState(false);
  
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [originalData, setOriginalData] = useState<DoctorData | null>(null);

  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    message: "",
    category: "general" as "general" | "features" | "bug" | "suggestion"
  });

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching doctor data for user:', user.uid);
      
      const doctorRef = doc(db, 'doctors', user.uid);
      const doctorSnap = await getDoc(doctorRef);
      
      if (doctorSnap.exists()) {
        const data = doctorSnap.data();
        console.log('Doctor data retrieved:', data);
        
        const profileData: DoctorData = {
          doctorId: data.doctorId || user.uid,
          name: data.name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          
          registrationNumber: data.registrationNumber || '',
          specialization: data.specialization || [],
          ayurvedicSpecialization: data.ayurvedicSpecialization || [],
          qualifications: data.qualifications || [],
          experience: data.experience || '',
          currentWorkplace: data.currentWorkplace || '',
          
          consultationFee: data.consultationFee || '',
          consultationDuration: data.consultationDuration || '30',
          languages: data.languages || ['English', 'Hindi'],
          availableDays: data.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          availableTimeSlots: data.availableTimeSlots || ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'],
          
          bio: data.bio || '',
          expertise: data.expertise || [],
          achievements: data.achievements || [],
          publications: data.publications || [],
          
          totalPatients: data.totalPatients || 0,
          averageRating: data.averageRating || 4.8,
          totalReviews: data.totalReviews || 0,
          joinDate: data.joinDate || new Date().toISOString().split('T')[0],
          registrationDate: data.registrationDate || data.createdAt,
          status: data.status || 'active',
          
          acceptingNewPatients: data.acceptingNewPatients !== false,
          onlineConsultation: data.onlineConsultation !== false,
          inPersonConsultation: data.inPersonConsultation !== false,
          
          photoURL: data.photoURL || user.photoURL || '',
          profileCompleted: data.profileCompleted || false,
          updatedAt: data.updatedAt
        };
        
        setDoctorData(profileData);
        setOriginalData(profileData);
      } else {
        console.log('No doctor document found');
        toast({
          title: "Profile Not Found",
          description: "Your doctor profile could not be found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!doctorData) return;
    
    setIsSaving(true);
    const user = auth.currentUser;
    
    if (user) {
      try {
        const doctorRef = doc(db, 'doctors', user.uid);
        const updateData = {
          ...doctorData,
          updatedAt: new Date().toISOString(),
          profileCompleted: true
        };
        
        await updateDoc(doctorRef, updateData);
        
        if (doctorData.name !== user.displayName) {
          await updateProfile(user, { displayName: doctorData.name });
        }
        
        setOriginalData(doctorData);
        setIsEditing(false);
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    setIsSaving(false);
  };

  const handleCancel = () => {
    if (originalData) {
      setDoctorData(originalData);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof DoctorData, value: any) => {
    if (!doctorData) return;
    setDoctorData({
      ...doctorData,
      [field]: value
    });
  };

  const handleCopyDoctorId = async () => {
    if (doctorData?.doctorId) {
      try {
        await navigator.clipboard.writeText(doctorData.doctorId);
        setDoctorIdCopied(true);
        toast({
          title: "Doctor ID Copied",
          description: "Your Doctor ID has been copied to clipboard.",
        });
        setTimeout(() => setDoctorIdCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy doctor ID:", error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy Doctor ID. Please try again.",
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            Your doctor profile could not be loaded. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="space-y-8 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-indigo-100 shadow-lg">
                    <AvatarImage src={doctorData.photoURL} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                      {getInitials(doctorData.name || 'Doctor')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Dr. {doctorData.name}</h1>
                  <p className="text-lg text-gray-600 mb-1">{doctorData.email}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    {doctorData.doctorId && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-2 px-3 py-1 text-sm font-mono">
                          <IdCard className="w-4 h-4" />
                          ID: {doctorData.doctorId}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1"
                            onClick={handleCopyDoctorId}
                          >
                            {doctorIdCopied ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </Badge>
                      </div>
                    )}
                    {doctorData.registrationNumber && (
                      <Badge variant="outline" className="gap-1">
                        <Shield className="w-3 h-3" />
                        Reg: {doctorData.registrationNumber}
                      </Badge>
                    )}
                    {doctorData.experience && (
                      <Badge variant="outline" className="gap-1">
                        <Briefcase className="w-3 h-3" />
                        {doctorData.experience} years
                      </Badge>
                    )}
                  </div>
                  {doctorData.registrationDate && (
                    <p className="text-sm text-gray-500 mt-2">
                      Member since {formatDate(doctorData.registrationDate)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                      <Save className="w-5 h-5" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="lg" className="gap-2">
                      <X className="w-5 h-5" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor ID Information Card */}
        {doctorData.doctorId && (
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-full bg-indigo-100">
                  <IdCard className="w-6 h-6 text-indigo-600" />
                </div>
                Doctor Information
              </CardTitle>
              <CardDescription>Your unique doctor identification and account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Doctor ID</p>
                    <p className="text-2xl font-mono font-bold text-indigo-600">{doctorData.doctorId}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyDoctorId}
                    className="gap-2"
                  >
                    {doctorIdCopied ? (
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
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Account Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <Badge variant="outline" className="capitalize">
                      {doctorData.status || 'Active'}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Profile Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${doctorData.profileCompleted ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <Badge variant="outline" className="capitalize">
                      {doctorData.profileCompleted ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{doctorData.totalPatients}</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </Card>
          <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-100">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{doctorData.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </Card>
          <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-green-100">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{doctorData.totalReviews}</div>
            <div className="text-sm text-gray-600">Reviews</div>
          </Card>
          <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{doctorData.consultationFee || 'N/A'}</div>
            <div className="text-sm text-gray-600">Consultation Fee</div>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Personal Information */}
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-full bg-blue-100">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={doctorData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-base h-12"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-base">{doctorData.name}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Email</Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-base">{doctorData.email}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={doctorData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="text-base h-12"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-base">{doctorData.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="dob" className="text-base font-medium">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="dob"
                    type="date"
                    value={doctorData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="text-base h-12"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-base">{doctorData.dateOfBirth ? `${doctorData.dateOfBirth} (${calculateAge(doctorData.dateOfBirth)})` : 'Not specified'}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="gender" className="text-base font-medium">Gender</Label>
                {isEditing ? (
                  <Select
                    value={doctorData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-base capitalize">{doctorData.gender?.replace('-', ' ') || 'Not specified'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Details */}
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-full bg-green-100">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                Address Details
              </CardTitle>
              <CardDescription>Your location information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="address" className="text-base font-medium">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={doctorData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address"
                    rows={3}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-base">{doctorData.address || 'Not provided'}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="city" className="text-base font-medium">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={doctorData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="text-base h-12"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-base">{doctorData.city || 'Not provided'}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="state" className="text-base font-medium">State</Label>
                  {isEditing ? (
                    <Input
                      id="state"
                      value={doctorData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="text-base h-12"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-base">{doctorData.state || 'N/A'}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="pincode" className="text-base font-medium">Pincode</Label>
                  {isEditing ? (
                    <Input
                      id="pincode"
                      value={doctorData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="text-base h-12"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-base">{doctorData.pincode || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Information */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-purple-100">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              Professional Information
            </CardTitle>
            <CardDescription>Your qualifications and expertise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-medium">Registration Number</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="gap-1">
                    <Shield className="w-4 h-4" />
                    {doctorData.registrationNumber || 'Not provided'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Experience</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="gap-1">
                    <Briefcase className="w-4 h-4" />
                    {doctorData.experience || '0'} years
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Current Workplace</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-base">{doctorData.currentWorkplace || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Qualifications</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {doctorData.qualifications.length > 0 ? (
                      doctorData.qualifications.map((qual, idx) => (
                        <Badge key={idx} variant="secondary">{qual}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <Label className="text-base font-medium">Ayurvedic Specialization</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {doctorData.ayurvedicSpecialization.length > 0 ? (
                      doctorData.ayurvedicSpecialization.map((spec, idx) => (
                        <Badge key={idx} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">{spec}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <Label className="text-base font-medium">Areas of Expertise</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {doctorData.expertise.length > 0 ? (
                      doctorData.expertise.map((exp, idx) => (
                        <Badge key={idx} variant="outline">{exp}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Details */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              Consultation Details
            </CardTitle>
            <CardDescription>Your consultation settings and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-medium">Consultation Fee (₹)</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl font-bold text-indigo-600">₹{doctorData.consultationFee || 'Not set'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Duration (minutes)</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl font-bold text-indigo-600">{doctorData.consultationDuration}</span>
                  <span className="text-gray-600 ml-2">minutes</span>
                </div>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <Label className="text-base font-medium">Languages</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {doctorData.languages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        <Languages className="w-3 h-3" />
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <Label className="text-base font-medium">Available Days</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {doctorData.availableDays.map((day, idx) => (
                      <Badge key={idx} variant="outline">{day}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <Label className="text-base font-medium">Time Slots</Label>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  {doctorData.availableTimeSlots.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{slot}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Bio */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-teal-100">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              Professional Bio
            </CardTitle>
            <CardDescription>Tell patients about yourself and your approach</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={doctorData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={6}
                placeholder="Write a brief introduction about yourself, your approach to Ayurveda, and what patients can expect..."
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-base whitespace-pre-wrap">
                  {doctorData.bio || 'No bio added yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements & Publications */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                Achievements & Awards
              </CardTitle>
              <CardDescription>Your professional accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              {doctorData.achievements.length > 0 ? (
                <ul className="space-y-3">
                  {doctorData.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-base">{achievement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">No achievements added yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-full bg-pink-100">
                  <FileText className="w-6 h-6 text-pink-600" />
                </div>
                Publications & Research
              </CardTitle>
              <CardDescription>Your published work and research</CardDescription>
            </CardHeader>
            <CardContent>
              {doctorData.publications.length > 0 ? (
                <ul className="space-y-3">
                  {doctorData.publications.map((pub, idx) => (
                    <li key={idx} className="p-3 bg-gray-50 rounded-lg text-base">
                      • {pub}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">No publications added yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-indigo-100">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              Share Your Feedback
            </CardTitle>
            <CardDescription>Help us improve your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Overall Rating</Label>
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
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-200'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-medium">{feedbackData.rating}/5</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-base font-medium">Feedback Category</Label>
                <Select
                  value={feedbackData.category}
                  onValueChange={(value: "general" | "features" | "bug" | "suggestion") => 
                    setFeedbackData({ ...feedbackData, category: value })
                  }
                >
                  <SelectTrigger className="h-12">
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
                <Label className="text-base font-medium">Your Message</Label>
                <Textarea
                  value={feedbackData.message}
                  onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                  placeholder="Share your thoughts, suggestions, or report any issues..."
                  className="min-h-[120px] resize-none"
                />
              </div>
              <Button onClick={handleFeedbackSubmit} className="w-full h-12 gap-2 bg-indigo-600 hover:bg-indigo-700">
                <MessageSquare className="w-5 h-5" />
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-green-100">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              Contact & Support
            </CardTitle>
            <CardDescription>Get in touch with our team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">support@ayurvedaapp.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;