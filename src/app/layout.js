import { Inter } from "next/font/google";
import "./globals.css";
import ContextProvider from "../components/ContextProvider";
import AppWrapper from "./_app";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arbitrum Sequencer Bypasser",
  description: "Created by Blockchain at Berkeley Fa2023",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <AppWrapper>
            <div className="flex flex-col min-h-screen bg-1e-black m-0 p-0">
              <Header className="flex-shrink-0" />
              {children}
              <Footer className="flex-shrink-0" />
            </div>
          </AppWrapper>
        </ContextProvider>
      </body>
    </html>
  );
}
