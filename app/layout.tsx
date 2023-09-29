import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Carbon Calculator",
  description:
    "a carbon calculator to estimate production emissions in US Croplands",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="" lang="en">
      <body className={inter.className}>
        <header>
          <div className="relative">
            <a href="/">
              <Image
                src="/header.jpg"
                width={2000}
                height={200}
                alt="Midwest farm landscape"
              />
            </a>
            <div className="absolute top-3 sm:top-5 md:top-6 text-sm text-white sm:font-heavy sm:text-base md:text-xl start-8 md:start-24">
              US Cropland Greenhouse Gas Calculator
            </div>
            <div className="absolute top-0 sm:top-1 text-white font-light md:font-heavy text-xs md:text-base start-6 md:start-20">
              Michigan State University&apos;s
            </div>
          </div>
        </header>
        <main className="dark:bg-slate-900 bg-white text-slate-900 dark:text-white">
          {children}
        </main>
        <footer className="relative dark:bg-slate-900 bg-white text-slate-900 dark:text-white">
          <div className="flex flex-row items-center justify-center w-full h-24">
            <span className="px-2 w-42">
              <a href="https://canr.msu.edu/">
                <img
                  alt="MSU Ag Experiment Station logo and link"
                  width={40}
                  height={32}
                  src="/AGBioResearch_Logo_Horiz_PMS_567_Transparent.png"
                  className="w-40"
                />
              </a>
            </span>
            <span className="w-40 px-2">
              <a
                href="https://seekvectorlogo.com/electric-power-research-institute-epri-vector-logo-svg/"
                target="_blank"
              >
                <img
                  alt="epri logo and link"
                  src="https://seekvectorlogo.com/wp-content/uploads/2019/03/electric-power-research-institute-epri-vector-logo.png"
                />
              </a>
            </span>
            <span className="w-24 px-2">
              <a href="https://www.nsf.gov/">
                <Image
                  alt="nsf logo and link"
                  width={16}
                  height={16}
                  src="/NSF.svg"
                  className="w-16"
                />
              </a>
            </span>
            <span className="w-20 px-2 ">
              <a href="https://cleanet.org/clean/about/selected_by_CLEAN">
                <Image
                  alt="clean net logo and link"
                  width={40}
                  height={36}
                  src="/clean-selected.jpg"
                  className="w-20"
                />
              </a>
            </span>
            <span dir="rtl" className="absolute top-0 start-0 px-4">
              <Link className="underline" href="/credits">
                Credits
              </Link>
            </span>
          </div>
          <div className="flex flex-row items-center justify-center w-full h-12 text-white bg-[#18453B]">
            @2023 Michigan State University Board of Trustees
          </div>
        </footer>
      </body>
    </html>
  );
}
