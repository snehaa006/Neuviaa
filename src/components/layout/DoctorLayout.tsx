import { Outlet } from "react-router-dom";

const DoctorLayout = () => {
  return (
    <div className="min-h-screen w-full bg-transparent m-0 p-0 overflow-hidden">
      <Outlet />
    </div>
  );
};

export default DoctorLayout;
