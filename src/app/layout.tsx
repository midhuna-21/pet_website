import "../styles/globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import AppClient from "../hooks/AppClient";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppClient>{children}</AppClient>
        </AuthProvider>
      </body>
    </html>
  );
}
