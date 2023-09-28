import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";

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
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-white">
          <a href="/">
            <Image
              src="/header.jpg"
              width={4000}
              height={200}
              alt="Midwest farm landscape"
            />
          </a>
          {children}
        </main>
        <footer>
          <div className="flex flex-row items-center justify-center w-full h-24">
            <span className="px-2 w-42">
              <a href="https://canr.msu.edu/">
                <Image
                  alt="MSU Ag Experiment Station logo and link"
                  width={40}
                  height={32}
                  src="/MAES.gif"
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
          </div>
          <div className="flex flex-row items-center justify-center w-full h-12 text-white bg-[#18453B]">
            @2023 Michigan State University Board of Trustees
          </div>
        </footer>
      </body>
    </html>
  );
}
