import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Eye, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  AlertCircle,
  Stethoscope,
  Loader2,
  Activity,
  Thermometer,
  Droplet,
  IdCard,
  Copy,
  Check,
  Clock,
  Users,
  Filter
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc, 
  getDoc
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface Patient {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  requestType: string;
  acceptedAt: string;
  fullPatientProfile: {
    name: string;
    age?: number;
    gender?: string;
    phoneNumber?: string;
    address?: string;
    medicalHistory?: string[];
    allergies?: string[];
    currentMedications?: string[];
    bloodGroup?: string;
    emergencyContact?: string;
    assessmentData?: {
      name: string;
      dob: string;
      gender: string;
      location: string;
      dailyRoutine: string;
      physicalActivity: string;
      sleepDuration: string;
      waterIntake: number;
      dietaryPreferences: string;
      cravings: string[];
      digestionIssues: string[];
      currentConditions: string[];
      familyHistory: string[];
      medications: string;
      energyLevels: number;
      stressLevels: number;
      bodyFrame: string;
      skinType: string;
      hairType: string;
      appetitePattern: string;
      personalityTraits: string[];
      weatherPreference: string;
      healthGoals: string[];
      additionalNotes: string;
    };
    patientId?: string;
    registrationDate?: string;
    profileCompleted?: boolean;
    status?: string;
  };
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
}

const Patients: React.FC = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedPatientId, setCopiedPatientId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('No authenticated user');
      setIsLoading(false);
      return;
    }

    console.log('Fetching accepted patients for doctor:', currentUser.uid);

    const fetchAcceptedPatients = async () => {
      try {
        const requestsRef = collection(db, 'consultationRequests');
        const q = query(
          requestsRef, 
          where('doctorId', '==', currentUser.uid),
          where('status', '==', 'accepted')
        );

        const snapshot = await getDocs(q);
        console.log('Received accepted requests, documents:', snapshot.size);
        
        const patientsData: Patient[] = [];
        
        for (const docSnapshot of snapshot.docs) {
          const data = docSnapshot.data();
          console.log('Accepted request document:', docSnapshot.id, data);
          
          let enhancedPatientProfile = data.fullPatientProfile || {
            name: data.patientName || 'Unknown Patient',
            age: undefined,
            gender: undefined,
            phoneNumber: data.patientPhone,
            address: undefined,
            medicalHistory: [],
            allergies: [],
            currentMedications: [],
            bloodGroup: undefined,
            emergencyContact: undefined
          };

          try {
            if (data.patientId) {
              const patientDocRef = doc(db, 'patients', data.patientId);
              const patientDoc = await getDoc(patientDocRef);
              
              if (patientDoc.exists()) {
                const patientData = patientDoc.data();
                console.log('Enhanced patient data found:', patientData);
                
                enhancedPatientProfile = {
                  ...enhancedPatientProfile,
                  patientId: patientData.patientId || data.patientId,
                  name: patientData.name || enhancedPatientProfile.name,
                  assessmentData: patientData.assessmentData || enhancedPatientProfile.assessmentData,
                  registrationDate: patientData.registrationDate || patientData.createdAt,
                  profileCompleted: patientData.profileCompleted,
                  status: patientData.status || 'active',
                  ...(patientData.assessmentData && {
                    gender: patientData.assessmentData.gender || enhancedPatientProfile.gender,
                    phoneNumber: enhancedPatientProfile.phoneNumber || patientData.assessmentData.phoneNumber,
                    address: patientData.assessmentData.location || enhancedPatientProfile.address,
                  })
                };
              }
            }
          } catch (patientFetchError) {
            console.warn('Could not fetch enhanced patient data:', patientFetchError);
          }
          
          patientsData.push({
            id: docSnapshot.id,
            patientId: data.patientId || '',
            patientName: data.patientName || 'Unknown Patient',
            patientEmail: data.patientEmail || '',
            patientPhone: data.patientPhone,
            requestType: data.requestType || 'consultation',
            acceptedAt: data.respondedAt || data.requestedAt || new Date().toISOString(),
            doctorId: data.doctorId || '',
            doctorName: data.doctorName || '',
            doctorEmail: data.doctorEmail || '',
            fullPatientProfile: enhancedPatientProfile
          });
        }

        const uniquePatients = patientsData.filter((patient, index, self) => 
          index === self.findIndex((p) => p.patientId === patient.patientId)
        );

        console.log('Processed unique accepted patients:', uniquePatients.length);
        setPatients(uniquePatients);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching accepted patients:', error);
        toast({
          title: 'Error',
          description: 'Failed to load patients. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchAcceptedPatients();

    const interval = setInterval(fetchAcceptedPatients, 60000);
    
    return () => clearInterval(interval);
  }, [toast]);

  useEffect(() => {
    applyFilters();
  }, [patients, searchTerm, genderFilter, ageFilter]);

  const applyFilters = () => {
    let filtered = [...patients];

    if (searchTerm.trim()) {
      filtered = filtered.filter(patient =>
        patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.fullPatientProfile?.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter(patient => {
        const gender = patient.fullPatientProfile?.gender || patient.fullPatientProfile?.assessmentData?.gender;
        return gender?.toLowerCase() === genderFilter.toLowerCase();
      });
    }

    if (ageFilter !== 'all') {
      filtered = filtered.filter(patient => {
        const dob = patient.fullPatientProfile?.assessmentData?.dob;
        if (!dob) return false;
        
        const age = calculateAge(dob);
        if (!age) return false;

        switch (ageFilter) {
          case 'young': return age < 30;
          case 'middle': return age >= 30 && age < 60;
          case 'senior': return age >= 60;
          default: return true;
        }
      });
    }

    filtered.sort((a, b) => a.patientName.localeCompare(b.patientName));

    setFilteredPatients(filtered);
  };

  const handleCopyPatientId = async (patientId: string) => {
    try {
      await navigator.clipboard.writeText(patientId);
      setCopiedPatientId(patientId);
      toast({
        title: "Patient ID Copied",
        description: "Patient ID has been copied to clipboard.",
      });
      setTimeout(() => setCopiedPatientId(null), 2000);
    } catch (error) {
      console.error("Failed to copy patient ID:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy Patient ID. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

  const renderPatientHealthStats = (assessmentData: any) => {
    if (!assessmentData) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center" style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#F5E6DB', color: '#C88B84' }}>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold" style={{ color: '#6B5D54' }}>{assessmentData.energyLevels || 'N/A'}/5</div>
          <div className="text-xs" style={{ color: '#8B7E73' }}>Energy</div>
        </Card>
        <Card className="p-4 text-center" style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#F5E6DB', color: '#C88B84' }}>
            <Thermometer className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold" style={{ color: '#6B5D54' }}>{assessmentData.stressLevels || 'N/A'}/5</div>
          <div className="text-xs" style={{ color: '#8B7E73' }}>Stress</div>
        </Card>
        <Card className="p-4 text-center" style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#F5E6DB', color: '#C9A6A1' }}>
            <Droplet className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold" style={{ color: '#6B5D54' }}>{assessmentData.waterIntake || 'N/A'}L</div>
          <div className="text-xs" style={{ color: '#8B7E73' }}>Water/Day</div>
        </Card>
        <Card className="p-4 text-center" style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#F5E6DB', color: '#C9A6A1' }}>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold" style={{ color: '#6B5D54' }}>{assessmentData.sleepDuration || 'N/A'}</div>
          <div className="text-xs" style={{ color: '#8B7E73' }}>Sleep</div>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6" style={{ background: 'linear-gradient(to bottom, #F0EBDB, #FDFBF7)' }}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#C88B84' }} />
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#6B5D54' }}>Loading Patients</h2>
            <p style={{ color: '#8B7E73' }}>Please wait while we fetch your accepted patients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6" style={{ background: 'linear-gradient(to bottom, #F0EBDB, #FDFBF7)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#6B5D54' }}>My Patients</h1>
          <p style={{ color: '#8B7E73' }}>Manage your accepted patients and their profiles</p>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#8B7E73' }}>
          <Users className="w-4 h-4" />
          {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#F5E6DB', color: '#C88B84' }}>
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#8B7E73' }}>Total Patients</p>
                <p className="text-2xl font-bold" style={{ color: '#6B5D54' }}>{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#F5E6DB', color: '#C88B84' }}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#8B7E73' }}>Active Profiles</p>
                <p className="text-2xl font-bold" style={{ color: '#6B5D54' }}>
                  {patients.filter(p => p.fullPatientProfile?.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#F5E6DB', color: '#C9A6A1' }}>
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#8B7E73' }}>Complete Profiles</p>
                <p className="text-2xl font-bold" style={{ color: '#6B5D54' }}>
                  {patients.filter(p => p.fullPatientProfile?.profileCompleted).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#F5E6DB', color: '#C88B84' }}>
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#8B7E73' }}>With Allergies</p>
                <p className="text-2xl font-bold" style={{ color: '#6B5D54' }}>
                  {patients.filter(p => p.fullPatientProfile?.allergies && p.fullPatientProfile.allergies.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#6B5D54' }}>
            <Filter className="w-4 h-4" />
            Filter Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#8B7E73' }} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients, Patient ID..."
                className="pl-10"
                style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8', color: '#6B5D54' }}
              />
            </div>
            
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8', color: '#6B5D54' }}>
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8', color: '#6B5D54' }}>
                <SelectValue placeholder="Filter by age group" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="young">Under 30</SelectItem>
                <SelectItem value="middle">30-60 years</SelectItem>
                <SelectItem value="senior">60+ years</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm flex items-center" style={{ color: '#8B7E73' }}>
              {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full">
            <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
              <CardContent className="p-12 text-center">
                <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: '#8B7E73' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#6B5D54' }}>No Patients Found</h3>
                <p style={{ color: '#8B7E73' }}>
                  {searchTerm || genderFilter !== 'all' || ageFilter !== 'all'
                    ? 'No patients match your current filters.'
                    : 'No accepted patients yet. Patients will appear here once you accept their consultation requests.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow duration-200" style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12" style={{ borderColor: '#E8DCC8' }}>
                    <AvatarFallback className="text-sm font-medium" style={{ backgroundColor: '#F5E6DB', color: '#6B5D54' }}>
                      {patient.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold" style={{ color: '#6B5D54' }}>{patient.patientName}</h3>
                        
                        {/* Patient ID Display */}
                        {patient.fullPatientProfile?.patientId && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="gap-2 px-3 py-1 text-xs font-mono" style={{ backgroundColor: '#F5E6DB', borderColor: '#E8DCC8', color: '#6B5D54' }}>
                              <IdCard className="w-3 h-3" />
                              {patient.fullPatientProfile.patientId}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                style={{ color: '#C88B84' }}
                                onClick={() => handleCopyPatientId(patient.fullPatientProfile.patientId!)}
                              >
                                {copiedPatientId === patient.fullPatientProfile.patientId ? (
                                  <Check className="w-3 h-3" style={{ color: '#6B9B37' }} />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </Badge>
                          </div>
                        )}

                        <div className="space-y-1 text-sm" style={{ color: '#8B7E73' }}>
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {patient.patientEmail}
                          </div>
                          {patient.patientPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {patient.patientPhone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Patient Status */}
                      <div className="flex flex-col items-end gap-2">
                        {patient.fullPatientProfile?.status && (
                          <Badge variant="outline" className="text-xs capitalize" style={{ backgroundColor: '#F5E6DB', borderColor: '#E8DCC8', color: '#6B5D54' }}>
                            {patient.fullPatientProfile.status}
                          </Badge>
                        )}
                        {patient.fullPatientProfile?.profileCompleted !== undefined && (
                          <Badge variant={patient.fullPatientProfile.profileCompleted ? "default" : "secondary"} className="text-xs" style={{ backgroundColor: patient.fullPatientProfile.profileCompleted ? '#C88B84' : '#E8DCC8', color: patient.fullPatientProfile.profileCompleted ? '#FDFBF7' : '#6B5D54' }}>
                            {patient.fullPatientProfile.profileCompleted ? 'Complete' : 'Incomplete'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Patient Basic Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      {(patient.fullPatientProfile?.assessmentData?.dob) && (
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Age</Label>
                          <p className="font-medium" style={{ color: '#6B5D54' }}>
                            {calculateAge(patient.fullPatientProfile.assessmentData.dob)} years
                          </p>
                        </div>
                      )}
                      {(patient.fullPatientProfile?.gender || patient.fullPatientProfile?.assessmentData?.gender) && (
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Gender</Label>
                          <p className="font-medium capitalize" style={{ color: '#6B5D54' }}>
                            {patient.fullPatientProfile.gender || patient.fullPatientProfile.assessmentData?.gender}
                          </p>
                        </div>
                      )}
                      {patient.fullPatientProfile?.bloodGroup && (
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Blood Group</Label>
                          <p className="font-medium" style={{ color: '#6B5D54' }}>{patient.fullPatientProfile.bloodGroup}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-xs" style={{ color: '#8B7E73' }}>Accepted On</Label>
                        <p className="font-medium text-xs" style={{ color: '#6B5D54' }}>
                          {formatDate(patient.acceptedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Health Indicators */}
                    {patient.fullPatientProfile?.allergies && patient.fullPatientProfile.allergies.length > 0 && (
                      <div className="mb-3">
                        <Label className="text-xs" style={{ color: '#8B7E73' }}>Allergies</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {patient.fullPatientProfile.allergies.slice(0, 3).map((allergy, index) => (
                            <Badge key={index} variant="outline" className="text-xs" style={{ backgroundColor: '#FDE8E8', color: '#B94A48', borderColor: '#F5C6CB' }}>
                              {allergy}
                            </Badge>
                          ))}
                          {patient.fullPatientProfile.allergies.length > 3 && (
                            <Badge variant="outline" className="text-xs" style={{ backgroundColor: '#F5E6DB', borderColor: '#E8DCC8', color: '#6B5D54' }}>
                              +{patient.fullPatientProfile.allergies.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowPatientProfile(true);
                        }}
                        className="gap-1 flex-1"
                        style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8', color: '#C88B84' }}
                      >
                        <Eye className="w-3 h-3" />
                        View Full Profile
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1"
                        style={{ backgroundColor: '#C88B84', color: '#FDFBF7' }}
                      >
                        <Calendar className="w-3 h-3" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && showPatientProfile && (
        <Dialog open={showPatientProfile} onOpenChange={setShowPatientProfile}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#6B5D54' }}>Patient Profile</DialogTitle>
              <DialogDescription style={{ color: '#8B7E73' }}>Complete medical and assessment information for {selectedPatient.patientName}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Patient Header with ID */}
              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F5E6DB' }}>
                <Avatar className="w-16 h-16" style={{ borderColor: '#E8DCC8' }}>
                  <AvatarFallback className="text-lg font-medium" style={{ backgroundColor: '#F5E6DB', color: '#6B5D54' }}>
                    {selectedPatient.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.name}</h3>
                  
                  {/* Patient ID in header */}
                  {selectedPatient.fullPatientProfile?.patientId && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="gap-2 px-3 py-1 text-sm font-mono" style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8', color: '#6B5D54' }}>
                        <IdCard className="w-4 h-4" />
                        Patient ID: {selectedPatient.fullPatientProfile.patientId}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1"
                          style={{ color: '#C88B84' }}
                          onClick={() => handleCopyPatientId(selectedPatient.fullPatientProfile.patientId!)}
                        >
                          {copiedPatientId === selectedPatient.fullPatientProfile.patientId ? (
                            <Check className="w-3 h-3" style={{ color: '#6B9B37' }} />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm" style={{ color: '#8B7E73' }}>
                    {selectedPatient.fullPatientProfile.assessmentData?.dob && (
                      <span>Age: {calculateAge(selectedPatient.fullPatientProfile.assessmentData.dob)} years</span>
                    )}
                    {(selectedPatient.fullPatientProfile.gender || selectedPatient.fullPatientProfile.assessmentData?.gender) && (
                      <span className="capitalize">Gender: {selectedPatient.fullPatientProfile.gender || selectedPatient.fullPatientProfile.assessmentData?.gender}</span>
                    )}
                    {selectedPatient.fullPatientProfile.bloodGroup && (
                      <span>Blood Group: {selectedPatient.fullPatientProfile.bloodGroup}</span>
                    )}
                  </div>

                  {/* Additional patient status info */}
                  <div className="flex items-center gap-2 mt-2">
                    {selectedPatient.fullPatientProfile?.status && (
                      <Badge variant="outline" className="text-xs capitalize" style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8', color: '#6B5D54' }}>
                        Status: {selectedPatient.fullPatientProfile.status}
                      </Badge>
                    )}
                    {selectedPatient.fullPatientProfile?.profileCompleted !== undefined && (
                      <Badge variant={selectedPatient.fullPatientProfile.profileCompleted ? "default" : "secondary"} className="text-xs" style={{ backgroundColor: selectedPatient.fullPatientProfile.profileCompleted ? '#C88B84' : '#E8DCC8', color: selectedPatient.fullPatientProfile.profileCompleted ? '#FDFBF7' : '#6B5D54' }}>
                        Profile {selectedPatient.fullPatientProfile.profileCompleted ? 'Complete' : 'Incomplete'}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs" style={{ backgroundColor: '#F5E6DB', borderColor: '#E8DCC8', color: '#6B5D54' }}>
                      Accepted: {formatDate(selectedPatient.acceptedAt)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Health Stats */}
              {selectedPatient.fullPatientProfile.assessmentData && 
                renderPatientHealthStats(selectedPatient.fullPatientProfile.assessmentData)}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3" style={{ color: '#6B5D54' }}>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" style={{ color: '#8B7E73' }} />
                      <span>{selectedPatient.patientEmail}</span>
                    </div>
                    {(selectedPatient.fullPatientProfile.phoneNumber || selectedPatient.patientPhone) && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" style={{ color: '#8B7E73' }} />
                        <span>{selectedPatient.fullPatientProfile.phoneNumber || selectedPatient.patientPhone}</span>
                      </div>
                    )}
                    {(selectedPatient.fullPatientProfile.address || selectedPatient.fullPatientProfile.assessmentData?.location) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: '#8B7E73' }} />
                        <span>{selectedPatient.fullPatientProfile.address || selectedPatient.fullPatientProfile.assessmentData?.location}</span>
                      </div>
                    )}
                    {selectedPatient.fullPatientProfile?.registrationDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: '#8B7E73' }} />
                        <span>Member since {formatDate(selectedPatient.fullPatientProfile.registrationDate)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: '#6B5D54' }}>
                      {selectedPatient.fullPatientProfile.emergencyContact || 'Not provided'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Medical History */}
              {(selectedPatient.fullPatientProfile.medicalHistory?.length > 0 || 
                selectedPatient.fullPatientProfile.assessmentData?.currentConditions?.length > 0) && (
                <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Medical History & Current Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(selectedPatient.fullPatientProfile.medicalHistory || 
                        selectedPatient.fullPatientProfile.assessmentData?.currentConditions || [])
                        .map((condition, index) => (
                        <Badge key={index} variant="outline" style={{ backgroundColor: '#F5E6DB', borderColor: '#E8DCC8', color: '#6B5D54' }}>{condition}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Allergies */}
              {selectedPatient.fullPatientProfile.allergies?.length > 0 && (
                <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.fullPatientProfile.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1" style={{ backgroundColor: '#FDE8E8', color: '#B94A48', borderColor: '#F5C6CB' }}>
                          <AlertCircle className="w-3 h-3" />
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Current Medications */}
              {(selectedPatient.fullPatientProfile.currentMedications?.length > 0 || 
                selectedPatient.fullPatientProfile.assessmentData?.medications) && (
                <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Current Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPatient.fullPatientProfile.currentMedications?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.fullPatientProfile.currentMedications.map((medication, index) => (
                          <Badge key={index} variant="outline" style={{ backgroundColor: '#F5E6DB', borderColor: '#E8DCC8', color: '#6B5D54' }}>{medication}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData?.medications || 'None reported'}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Ayurvedic Assessment Data */}
              {selectedPatient.fullPatientProfile.assessmentData && (
                <>
                  {/* Lifestyle Information */}
                  <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                    <CardHeader>
                      <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Lifestyle & Routine</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Daily Routine</Label>
                          <p className="text-sm" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.dailyRoutine || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Physical Activity</Label>
                          <p className="text-sm" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.physicalActivity || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Sleep Duration</Label>
                          <p className="text-sm" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.sleepDuration || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Water Intake</Label>
                          <p className="text-sm" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.waterIntake}L per day</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dietary Information */}
                  <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                    <CardHeader>
                      <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Dietary Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs" style={{ color: '#8B7E73' }}>Dietary Preferences</Label>
                        <p className="text-sm mb-3" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.dietaryPreferences || 'Not specified'}</p>
                      </div>
                      
                      {selectedPatient.fullPatientProfile.assessmentData.cravings?.length > 0 && (
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Food Cravings</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedPatient.fullPatientProfile.assessmentData.cravings.map((craving, index) => (
                              <Badge key={index} variant="secondary" style={{ backgroundColor: '#F5E6DB', color: '#6B5D54' }}>{craving}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedPatient.fullPatientProfile.assessmentData.digestionIssues?.length > 0 && (
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Digestion Issues</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedPatient.fullPatientProfile.assessmentData.digestionIssues.map((issue, index) => (
                              <Badge key={index} variant="outline" style={{ backgroundColor: '#FDF3E8', color: '#D97706', borderColor: '#FDE68A' }}>{issue}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <Label className="text-xs" style={{ color: '#8B7E73' }}>Appetite Pattern</Label>
                        <p className="text-sm" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.appetitePattern || 'Not specified'}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Constitutional Information */}
                  <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                    <CardHeader>
                      <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Constitutional Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Body Frame</Label>
                          <p className="text-sm capitalize" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.bodyFrame || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Skin Type</Label>
                          <p className="text-sm capitalize" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.skinType || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Hair Type</Label>
                          <p className="text-sm capitalize" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.hairType || 'Not specified'}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs" style={{ color: '#8B7E73' }}>Weather Preference</Label>
                        <p className="text-sm capitalize" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.weatherPreference || 'Not specified'}</p>
                      </div>

                      {selectedPatient.fullPatientProfile.assessmentData.personalityTraits?.length > 0 && (
                        <div>
                          <Label className="text-xs" style={{ color: '#8B7E73' }}>Personality Traits</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedPatient.fullPatientProfile.assessmentData.personalityTraits.map((trait, index) => (
                              <Badge key={index} variant="secondary" style={{ backgroundColor: '#F5E6DB', color: '#6B5D54' }}>{trait}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Family History */}
                  {selectedPatient.fullPatientProfile.assessmentData.familyHistory?.length > 0 && (
                    <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                      <CardHeader>
                        <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Family History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.fullPatientProfile.assessmentData.familyHistory.map((condition, index) => (
                            <Badge key={index} variant="outline" style={{ backgroundColor: '#F3E8FF', color: '#7C3AED', borderColor: '#DDD6FE' }}>{condition}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Health Goals */}
                  {selectedPatient.fullPatientProfile.assessmentData.healthGoals?.length > 0 && (
                    <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                      <CardHeader>
                        <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Health Goals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.fullPatientProfile.assessmentData.healthGoals.map((goal, index) => (
                            <Badge key={index} variant="outline" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', borderColor: '#C8E6C9' }}>{goal}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Additional Notes */}
                  {selectedPatient.fullPatientProfile.assessmentData.additionalNotes && (
                    <Card style={{ backgroundColor: '#FDFBF7', borderColor: '#E8DCC8' }}>
                      <CardHeader>
                        <CardTitle className="text-lg" style={{ color: '#6B5D54' }}>Additional Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap" style={{ color: '#6B5D54' }}>{selectedPatient.fullPatientProfile.assessmentData.additionalNotes}</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Patients;