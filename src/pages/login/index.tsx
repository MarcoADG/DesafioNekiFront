import { useEffect } from "react";
import LoginBox from "./components/LoginBox";
import BackgroundImage from "@/components/background";

export default function Login() {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
  }, []);

  return (
    <div className="flex justify-center items-center align-middle h-screen">
      <LoginBox />
      <BackgroundImage />
    </div>
  );
}
