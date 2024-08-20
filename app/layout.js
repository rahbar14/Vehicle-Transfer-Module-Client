import "./globals.css";
import BaseUrl from "@/components/BaseUrl";

export const metadata = {
  title: "Vehicle Transfer Module",
  description: "Transfer vehicles to different entities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <BaseUrl />
      <body className={"min-h-screen"}>{children}</body>
    </html>
  );
}
