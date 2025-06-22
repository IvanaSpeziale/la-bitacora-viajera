import { AuthProvider } from "@/core/pods/auth/auth.provider";
import LoginComponent from "@/pods/login/login.component";

export default function Login() {
  return (
    <AuthProvider>
      <LoginComponent />
    </AuthProvider>
  );
}
