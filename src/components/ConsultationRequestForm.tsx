import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  User, 
  Stethoscope, 
  Send, 
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  IndianRupee
} from 'lucide-react';
import type { Doctor, CreateConsultationRequest } from '@/types/doctor';

interface ConsultationRequestFormProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: CreateConsultationRequest) => Promise<void>;
  loading?: boolean;
}
 
const ConsultationRequestForm: React.FC<ConsultationRequestFormProps> = ({
  doctor,
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateConsultationRequest>({
    doctorId: doctor.id,
    requestType: 'consultation',
    urgency: 'medium',
    patientDetails: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        doctorId: doctor.id,
        requestType: 'consultation',
        urgency: 'medium',
        patientDetails: {}
      });
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const updateFormData = (field: keyof CreateConsultationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDoctorName = (name: string) => {
    if (name.toLowerCase().startsWith('dr.')) {
      return name;
    }
    return `Dr. ${name}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FDFBF7] border-[#E3D8C8]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#5D4E47]">
            <Stethoscope className="w-5 h-5 text-[#C9A6A1]" />
            Request Consultation
          </DialogTitle>
          <DialogDescription className="text-[#5D4E47]/70">
            Send your consultation request to {formatDoctorName(doctor.name)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Info Summary */}
          <Card className="bg-[#F0EBDB] border-[#E3D8C8]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#C9A6A1]/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#C9A6A1]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#5D4E47]">{formatDoctorName(doctor.name)}</h3>
                  <p className="text-sm text-[#5D4E47]/70">{doctor.clinicName}</p>
                </div>
                {doctor.verificationStatus === 'verified' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {doctor.ayurvedicSpecialization?.slice(0, 3).map((spec, index) => (
                  <Badge key={index} className="text-xs bg-[#E3D8C8] text-[#5D4E47] border-0">
                    {spec}
                  </Badge>
                ))}
                {doctor.consultationFee && (
                  <Badge variant="outline" className="text-xs gap-1 border-[#E3D8C8] text-[#5D4E47]">
                    <IndianRupee className="w-3 h-3" />
                    {doctor.consultationFee} consultation
                  </Badge>
                )}
                {doctor.yearsOfExperience && (
                  <Badge variant="outline" className="text-xs gap-1 border-[#E3D8C8] text-[#5D4E47]">
                    <Clock className="w-3 h-3" />
                    {doctor.yearsOfExperience} years exp.
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Request Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-[#5D4E47]">Consultation Type</Label>
              <Select
                value={formData.requestType}
                onValueChange={(value) => updateFormData('requestType', value)}
              >
                <SelectTrigger className="border-[#E3D8C8] focus:border-[#C9A6A1] focus:ring-[#C9A6A1] text-[#5D4E47]">
                  <SelectValue placeholder="Select consultation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">General Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up Consultation</SelectItem>
                  <SelectItem value="second-opinion">Second Opinion</SelectItem>
                  <SelectItem value="emergency">Emergency Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Consultation Mode */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-[#5D4E47]">Preferred Consultation Mode</Label>
              <Select
                value={formData.preferredConsultationMode}
                onValueChange={(value) => updateFormData('preferredConsultationMode', value)}
              >
                <SelectTrigger className="border-[#E3D8C8] focus:border-[#C9A6A1] focus:ring-[#C9A6A1] text-[#5D4E47]">
                  <SelectValue placeholder="Select consultation mode" />
                </SelectTrigger>
                <SelectContent>
                  {doctor.consultationModes?.map((mode) => (
                    <SelectItem key={mode} value={mode} className="capitalize">
                      {mode === 'online' ? 'Video Call Consultation' : 
                       mode === 'phone' ? 'Phone Call Consultation' : 
                       mode === 'in-person' ? 'In-Person Visit' :
                       mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Urgency */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-[#5D4E47]">Priority Level</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => updateFormData('urgency', value)}
              >
                <SelectTrigger className="border-[#E3D8C8] focus:border-[#C9A6A1] focus:ring-[#C9A6A1] text-[#5D4E47]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority - Routine consultation or general inquiry</SelectItem>
                  <SelectItem value="medium">Medium Priority - Non-urgent health concerns</SelectItem>
                  <SelectItem value="high">High Priority - Urgent medical attention required</SelectItem>
                  <SelectItem value="emergency">Emergency - Immediate medical attention needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Message */}
            <div className="space-y-3">
              <Label htmlFor="message" className="text-base font-medium text-[#5D4E47]">
                Additional Information <span className="text-[#5D4E47]/70 font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Please describe your health concerns, symptoms, or any specific questions you have for the doctor..."
                value={formData.message || ''}
                onChange={(e) => updateFormData('message', e.target.value)}
                className="min-h-[120px] resize-none border-[#E3D8C8] focus:border-[#C9A6A1] focus:ring-[#C9A6A1] text-[#5D4E47]"
              />
              <p className="text-xs text-[#5D4E47]/70">
                This information will help the doctor better understand your needs and prepare for the consultation.
              </p>
            </div>

            {/* Info Card */}
            <Card className="bg-[#F0EBDB] border-[#E3D8C8]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#C9A6A1] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-[#5D4E47]">
                    <p className="font-medium mb-2">What happens next?</p>
                    <ul className="space-y-1 text-sm text-[#5D4E47]/80">
                      <li>• Your complete patient profile will be securely shared with the doctor</li>
                      <li>• {formatDoctorName(doctor.name)} will review your request and medical history</li>
                      <li>• You will receive a response within 24 hours</li>
                      <li>• If approved, you will receive consultation scheduling details</li>
                      <li>• Payment will be processed only after consultation confirmation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border-[#E3D8C8] hover:bg-[#F0EBDB] text-[#5D4E47]"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[#C9A6A1] hover:bg-[#B89691] text-white"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending Request...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Consultation Request
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationRequestForm;