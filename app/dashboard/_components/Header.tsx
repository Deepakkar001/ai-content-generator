"use client"
import { UserButton } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const path = usePathname()

  const MenuList = [
    {
      name: 'Home',
      path: '/dashboard'
    },
    {
      name: 'History',
      path: '/dashboard/history'
    },
    {
      name: 'Settings',
      path: '/dashboard/settings'
    },
  ]

  return (
    <>
      <div className='relative p-4 md:p-5 border-b border-white/10 bg-[#050A1C]/85 backdrop-blur-xl z-50'>
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-0 top-0 h-[220px] w-[620px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 opacity-15 blur-3xl"></div>
          <div className="absolute right-0 top-0 h-[220px] w-[620px] translate-x-1/3 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 opacity-10 blur-3xl"></div>
        </div>

        <div className='flex justify-between items-center max-w-7xl mx-auto'>
          {/* Hamburger Menu - Only visible on mobile */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors'
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className='flex gap-4 items-center ml-auto'>
            <div className="relative">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bg-[#050A1C] border border-white/10",
                    userButtonPopoverActions: "text-white",
                    userButtonPopoverActionButton: "hover:bg-white/10",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#050A1C]/95 backdrop-blur-md border-r border-white/10 p-6 z-50 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {MenuList.map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        p-3 rounded-lg cursor-pointer
                        ${path === item.path 
                          ? 'bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }
                        transition-all duration-200
                      `}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header