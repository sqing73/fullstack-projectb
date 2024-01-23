"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Stack from "@mui/material/Stack";
import Header from "./components/Header";
import Footer from "./components/Footer";
import store from "@/store/store";
import { initializeUser } from "@/store/reducers/user";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

store.dispatch(initializeUser());

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <Stack direction="column" sx={{ minHeight: "100vh" }}>
            <Header />
            {children}
            <Footer />
          </Stack>
        </Provider>
      </body>
    </html>
  );
}
