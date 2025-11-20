import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MedicalRecord = () => {
  const navigate = useNavigate();

  const records = [
    { date: "2024-04-15" },
    { date: "2024-04-01" },
    { date: "2024-03-15" },
    { date: "2024-03-01" }
  ];

  const vitals = {
    bloodPressure: "118/76 mmHg",
    weight: "145 lbs",
    heartRate: "72 bpm",
    temperature: "98.6°F"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C9A6A1] to-[#F0EBDB] py-10 px-4 text-[#3B2F2F]">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C9A6A1] to-[#F0EBDB] flex items-center justify-center shadow-md">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[#4B2E2E]">📋 Medical Records</h1>
          <p className="text-[#6B4F4F]">Your complete pregnancy health overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Records Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 shadow-md border border-[#E5D5C5] rounded-2xl">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-[#A47E76]">Recent Records</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#C9A6A1] text-[#4B2E2E] hover:bg-[#C9A6A1] hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {records.map((record, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-[#F0EBDB] to-[#FFF8F4] border border-[#E8D8CF] rounded-xl flex justify-between items-center hover:shadow-sm transition-all"
                  >
                    <span className="font-medium">{record.date}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#C9A6A1] text-[#4B2E2E] hover:bg-[#C9A6A1] hover:text-white"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Vitals */}
            <Card className="bg-white/80 shadow-md border border-[#E5D5C5] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#A47E76] flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Current Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(vitals).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center p-3 rounded-lg bg-[#F0EBDB] border border-[#E5D5C5]"
                  >
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-[#4B2E2E]">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card className="bg-white/80 shadow-md border border-[#E5D5C5] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#A47E76]">Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-[#F0EBDB] border border-[#E5D5C5]">
                  <h4 className="font-semibold text-[#4B2E2E]">Overall Health</h4>
                  <p className="text-sm text-[#6B4F4F]">Excellent - No concerns</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F0EBDB] border border-[#E5D5C5]">
                  <h4 className="font-semibold text-[#4B2E2E]">Baby Development</h4>
                  <p className="text-sm text-[#6B4F4F]">On track for 24 weeks</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F0EBDB] border border-[#E5D5C5]">
                  <h4 className="font-semibold text-[#4B2E2E]">Next Checkup</h4>
                  <p className="text-sm text-[#6B4F4F]">April 29, 2024</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 shadow-md border border-[#E5D5C5] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#A47E76]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-[#C9A6A1] to-[#F0EBDB] text-white hover:opacity-90"
                  onClick={() => navigate("/consult-doctor")}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#C9A6A1] text-[#4B2E2E] hover:bg-[#C9A6A1] hover:text-white"
                  onClick={() => navigate("/symptom-tracker")}
                >
                  Log Symptoms
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#C9A6A1] text-[#4B2E2E] hover:bg-[#C9A6A1] hover:text-white"
                  onClick={() => navigate("/patient/dashboard")}
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

export default MedicalRecord;