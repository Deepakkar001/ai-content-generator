"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Clock, FileText, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { StarParticle } from "./star-particle"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    // This will run only on the client side
    if (typeof window !== "undefined" && particlesRef.current) {
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e
        const x = clientX / window.innerWidth - 0.5
        const y = clientY / window.innerHeight - 0.5

        if (particlesRef.current) {
          particlesRef.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`
        }
      }

      window.addEventListener("mousemove", handleMouseMove)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard')
    } else {
      router.push('/sign-in')
    }
  }

  return (
    <div
      className="relative isolate min-h-screen overflow-hidden bg-[#06111A]"
      style={{
        backgroundImage:
          "radial-gradient(1100px circle at 12% 18%, rgba(16,185,129,0.22), transparent 58%), radial-gradient(950px circle at 92% 38%, rgba(245,158,11,0.14), transparent 62%), radial-gradient(760px circle at 55% 92%, rgba(34,211,238,0.10), transparent 60%), linear-gradient(180deg, #06111A 0%, #06111A 55%, #04080F 100%)",
      }}
    >
      {/* Background layers (purely visual) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-screen"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 50% 30%, black 45%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 45%, transparent 75%)",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_28%,transparent_0%,rgba(6,17,26,0.40)_55%,rgba(6,17,26,0.90)_100%)]" />

        {/* Soft noise overlay (CSS-only) */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
          }}
        />
      </div>
      <div className="absolute left-0 top-1/4 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#10B981] to-[#22D3EE] opacity-18 blur-3xl"></div>
      <div className="absolute right-0 top-1/2 h-[560px] w-[860px] translate-x-1/3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FB7185] opacity-18 blur-3xl"></div>

      {/* Star particles container */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div ref={particlesRef} className="absolute inset-0 transition-transform duration-300 ease-out">
          <StarParticle color="#22D3EE" size={2} top="10%" left="20%" duration={15} delay={0} />
          <StarParticle color="#10B981" size={3} top="15%" left="70%" duration={20} delay={2} />
          <StarParticle color="#F59E0B" size={2.5} top="5%" left="40%" duration={18} delay={5} />
          <StarParticle color="#FB7185" size={2} top="8%" left="85%" duration={25} delay={7} />
          <StarParticle color="#22D3EE" size={3.5} top="3%" left="10%" duration={22} delay={10} />
          <StarParticle color="#10B981" size={1.5} top="12%" left="60%" duration={17} delay={3} />
          <StarParticle color="#F59E0B" size={2.8} top="7%" left="30%" duration={19} delay={8} />
          <StarParticle color="#FB7185" size={2.2} top="2%" left="50%" duration={21} delay={12} />
          <StarParticle color="#22D3EE" size={1.8} top="9%" left="75%" duration={16} delay={6} />
          <StarParticle color="#10B981" size={3.2} top="4%" left="90%" duration={23} delay={9} />
        </div> 
      </div>

      {/* Animated flowing element */}
      <motion.div
        className="absolute right-0 top-1/3 z-0 h-auto w-[800px]"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/flow-element.svg"
            alt="Flow Element"
            width={800}
            height={400}
            className="h-auto w-full"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Header */}
      <motion.header
        className="container relative z-10 mx-auto flex items-center justify-between py-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
           <Image src="/logo.svg" alt="logo" width={120} height={100} style={{ width: 'auto', height: 'auto' }} />
        </motion.div>

        <div className="hidden items-center rounded-full bg-white/8 px-2 py-1 backdrop-blur-md md:flex">
          {["Use cases", "Playbooks", "Customers", "Docs"].map((item) => (
            <motion.div key={item} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={'/dashboard'}
                className="px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link
            href="/dashboard"
            className="rounded-full bg-[#10B981] px-6 py-2.5 text-sm font-medium text-[#03120C] shadow-lg shadow-[#10B981]/20 transition-all hover:bg-[#34D399] hover:shadow-xl hover:shadow-[#10B981]/30"
          >
            Open Workspace
          </Link>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <main className="container relative z-10 mx-auto px-4 py-16 md:px-6 lg:py-24">
        {/* Membership Banner */}
        <motion.div
          className="mx-auto mb-16 flex max-w-max items-center justify-center rounded-full bg-white/8 px-5 py-2 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.18)",
          }}
        >
            <Link href="/dashboard/billing" className="text-sm font-medium text-white">
            NimbusWrite Plus — unlock premium runs
            </Link>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ArrowRight className="ml-2 h-4 w-4 text-white/70" />
          </motion.div>
        </motion.div>

        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span>NimbusWrite </span>
            <motion.span
              className="bg-gradient-to-r from-[#10B981] via-[#22D3EE] to-[#F59E0B] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              Studio
            </motion.span>
          </motion.h1>
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-white/75"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Turn messy notes into publish-ready posts, product pages, and emails—fast. Built for teams who want a clean
            workflow, consistent voice, and fewer rewrites.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.35)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#10B981] via-[#22D3EE] to-[#F59E0B] px-8 py-3.5 text-base font-semibold text-[#03120C] transition-all"
            >
              Generate in seconds
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </button>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <FileText className="h-7 w-7" />,
              title: "Ready-made playbooks",
              description: "Start from proven outlines for social, product, and long-form.",
              link: "/templates",
              gradient: "from-[#22D3EE] to-[#10B981]",
              textColor: "text-[#22D3EE]",
              hoverColor: "hover:text-[#67E8F9]",
              delay: 0.3,
            },
            {
              icon: <Settings className="h-7 w-7" />,
              title: "Brand voice controls",
              description: "Tune tone, audience, and reading level with one switch.",
              link: "/customization",
              gradient: "from-[#10B981] to-[#F59E0B]",
              textColor: "text-[#10B981]",
              hoverColor: "hover:text-[#34D399]",
              delay: 0.5,
            },
            {
              icon: <BookOpen className="h-7 w-7" />,
              title: "Source-aware drafts",
              description: "Generate from your brief and keep structure you can edit.",
              link: "/documentation",
              gradient: "from-[#F59E0B] to-[#FB7185]",
              textColor: "text-[#F59E0B]",
              hoverColor: "hover:text-[#FBBF24]",
              delay: 0.7,
            },
            {
              icon: <Clock className="h-7 w-7" />,
              title: "Fast turnaround",
              description: "Draft, iterate, and export—without waiting on empty pages.",
              link: "/support",
              gradient: "from-[#FB7185] to-[#22D3EE]",
              textColor: "text-[#FB7185]",
              hoverColor: "hover:text-[#FDA4AF]",
              delay: 0.9,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-start rounded-xl bg-white/6 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: feature.delay }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <motion.div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} text-white shadow-lg shadow-${feature.gradient.split("to-")[1].replace("]", "")}/20`}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
              <p className="mb-4 text-white/75">{feature.description}</p>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link href={'/dashboard'} className={`flex items-center ${feature.textColor} ${feature.hoverColor}`}>
                  See how it works <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom text */}
        <motion.div
          className="mt-24 flex justify-between text-white/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.1, color: "#22D3EE" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Draft
          </motion.div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.1, color: "#10B981" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Build your publishing pipeline
            <br />
            in one calm workspace
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, color: "#F59E0B" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Ship
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

