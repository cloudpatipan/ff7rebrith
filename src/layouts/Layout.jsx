"use client";

import { IoIosSearch } from "react-icons/io";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function Layout({ children }) {

  return (
    <div className={`flex flex-col justify-between min-h-dvh mx-auto`}>
      <div>
        <Navbar />
      </div>

      <section className={`font-extralight text-white`}>
        <div className="min-h-dvh border-t-2 border-b-2 border-[#9a0000]">
          {children}
        </div>
      </section>

      <div>
        <Footer />
      </div>
    </div>
  )
}
