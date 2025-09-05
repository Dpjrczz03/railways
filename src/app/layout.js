import localFont from "next/font/local";
import "./globals.css";


export const metadata = {
  title: "Chayan Driver Portal",
  description: "Portal to test the Readiness of a Driver for the Day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
