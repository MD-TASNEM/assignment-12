import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Care.xyz - Trusted Care Services",
  description:
    "Care.xyz is a reliable platform for baby sitting, elderly care, and special care services. Find and hire trusted caretakers in your area.",
  keywords: ["care", "babysitting", "elderly care", "service", "home care"],
  openGraph: {
    title: "Care.xyz - Trusted Care Services",
    description:
      "Find and hire trusted caretakers for baby sitting, elderly care, and special care services.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-light">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
