import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"I Am Ronaldo · One task at a time",description:"Your goals. Your pace. A simple daily task list and count-up focus timer.",referrer:"no-referrer",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg",apple:"/apple-touch-icon.png"},manifest:"/manifest.webmanifest",appleWebApp:{capable:true,statusBarStyle:"default",title:"I Am Ronaldo"}};
export const viewport: Viewport = {width:"device-width",initialScale:1,themeColor:"#ffffff"};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>;}
