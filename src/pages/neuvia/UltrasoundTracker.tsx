import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UltrasoundTracker = () => {
  const navigate = useNavigate();

  const currentWeek = 24;

  const milestones = [
    { week: 12, title: "First Trimester Scan", status: "completed", date: "2024-01-15" },
    { week: 20, title: "Anatomy Scan", status: "completed", date: "2024-03-10" },
    { week: 24, title: "Growth Check", status: "current", date: "2024-04-15" },
    { week: 28, title: "Third Trimester Scan", status: "upcoming", date: "2024-05-15" },
    { week: 32, title: "Growth Assessment", status: "upcoming", date: "2024-06-10" },
    { week: 36, title: "Final Position Check", status: "upcoming", date: "2024-07-05" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0EBDB] to-[#C9A6A1]/20 py-8 px-4 relative">
      <div className="absolute inset-0 logo-bg opacity-5"></div>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C9A6A1] to-[#F0EBDB] flex items-center justify-center shadow-md">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#6B4E45] mb-2">Ultrasound Tracker</h1>
          <p className="text-[#C9A6A1]">Track your baby's development - Week {currentWeek}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 lg:col-span-3">
            {/* Scan Schedule */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="text-[#6B4E45] flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Scan Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-all ${
                      milestone.status === "completed"
                        ? "bg-[#F0EBDB]/70 border border-[#C9A6A1]"
                        : milestone.status === "current"
                        ? "bg-[#F8F5EE] border border-[#C9A6A1]"
                        : "bg-[#FCFAF7] border border-[#E5DAD4]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-[#6B4E45]">{milestone.title}</h4>
                        <p className="text-sm text-[#A5827A]">Week {milestone.week}</p>
                      </div>
                      <div className="text-sm text-[#A5827A]">{milestone.date}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="text-[#6B4E45]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-[#C9A6A1] to-[#F0EBDB] text-[#6B4E45] font-semibold hover:opacity-90"
                  onClick={() => navigate("/consult-doctor")}
                >
                  Book Next Scan
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#C9A6A1] text-[#6B4E45] hover:bg-[#C9A6A1] hover:text-white"
                  onClick={() => navigate("/medical-record")}
                >
                  View All Records
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#C9A6A1] text-[#6B4E45] hover:bg-[#C9A6A1] hover:text-white"
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

export default UltrasoundTracker;