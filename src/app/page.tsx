'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Clock, 
  Shield, 
  Award, 
  ChevronRight, 
  Star,
  CheckCircle,
  Play,
  Menu,
  X,
  ArrowRight,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  Calendar,
  HelpCircle,
  ChevronDown,
  DollarSign,
  Building,
  TrendingUp,
  Target,
  Layers,
  Settings,
  FileText,
  Download,
  Share2,
  Briefcase,
  GraduationCap,
  BookOpenCheck,
  Trophy,
  Brain,
  Rocket,
  Lightbulb,
  Heart,
  Camera,
  Headphones,
  Code,
  Database,
  Cloud,
  Lock as LockIcon,
  Wifi,
  Cpu,
  BarChart2
} from 'lucide-react'

// Enhanced Achievement SVG Icons
const TrophyWithRibbon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#FFD700', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#FFA500', stopOpacity:1}} />
      </linearGradient>
    </defs>
    {/* Trophy Base */}
    <ellipse cx="40" cy="70" rx="20" ry="5" fill="#CD853F"/>
    <rect x="35" y="60" width="10" height="15" fill="#CD853F" rx="2"/>
    
    {/* Trophy Cup */}
    <path d="M20 25 Q20 20, 25 20 L55 20 Q60 20, 60 25 L60 40 Q60 50, 50 50 L30 50 Q20 50, 20 40 Z" 
          fill="url(#trophyGrad)" stroke="#DAA520" strokeWidth="2"/>
    
    {/* Trophy Handles */}
    <ellipse cx="15" cy="30" rx="4" ry="8" fill="#FFD700" opacity="0.8"/>
    <ellipse cx="65" cy="30" rx="4" ry="8" fill="#FFD700" opacity="0.8"/>
    
    {/* Crown/Top decoration */}
    <polygon points="30,20 40,10 50,20" fill="#FFD700"/>
    <circle cx="25" cy="15" r="3" fill="#FFD700"/>
    <circle cx="55" cy="15" r="3" fill="#FFD700"/>
    
    {/* Sparkles */}
    <path d="M15 15 L17 13 L19 15 L17 17 Z" fill="#FFFF00" opacity="0.7"/>
    <path d="M65 45 L67 43 L69 45 L67 47 Z" fill="#FFFF00" opacity="0.7"/>
    <circle cx="10" cy="35" r="2" fill="#FFFF00" opacity="0.6"/>
    <circle cx="70" cy="25" r="2" fill="#FFFF00" opacity="0.6"/>
  </svg>
)

const InnovationBulb = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="bulbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#FFE135', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#FFA500', stopOpacity:1}} />
      </linearGradient>
      <radialGradient id="glowGrad" cx="50%" cy="30%">
        <stop offset="0%" style={{stopColor:'#FFFFFF', stopOpacity:0.8}} />
        <stop offset="100%" style={{stopColor:'#FFE135', stopOpacity:0.2}} />
      </radialGradient>
    </defs>
    
    {/* Bulb Body */}
    <path d="M40 10 C50 10, 58 18, 58 28 C58 35, 54 41, 48 44 L48 52 L32 52 L32 44 C26 41, 22 35, 22 28 C22 18, 30 10, 40 10 Z" 
          fill="url(#bulbGrad)" stroke="#DAA520" strokeWidth="1.5"/>
    
    {/* Filament */}
    <path d="M30 25 Q40 20, 50 25 M30 30 Q40 25, 50 30 M30 35 Q40 30, 50 35" 
          stroke="#FF6B35" strokeWidth="1.5" fill="none"/>
    
    {/* Base/Screw */}
    <rect x="32" y="52" width="16" height="12" fill="#C0C0C0" rx="2"/>
    <line x1="32" y1="55" x2="48" y2="55" stroke="#A0A0A0" strokeWidth="1"/>
    <line x1="32" y1="58" x2="48" y2="58" stroke="#A0A0A0" strokeWidth="1"/>
    <line x1="32" y1="61" x2="48" y2="61" stroke="#A0A0A0" strokeWidth="1"/>
    
    {/* Glow Effect */}
    <ellipse cx="40" cy="28" rx="18" ry="22" fill="url(#glowGrad)" opacity="0.6"/>
    
    {/* Innovation Sparks */}
    <g stroke="#FFE135" strokeWidth="2" fill="none">
      <path d="M10 20 L14 24 M10 24 L14 20"/>
      <path d="M66 35 L70 39 M66 39 L70 35"/>
      <path d="M15 50 L19 54 M15 54 L19 50"/>
      <path d="M61 15 L65 19 M61 19 L65 15"/>
    </g>
  </svg>
)

const SecurityShield = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#4169E1', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#0000CD', stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#32CD32', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#228B22', stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Main Shield */}
    <path d="M40 10 L60 20 L60 45 C60 55, 50 65, 40 70 C30 65, 20 55, 20 45 L20 20 Z" 
          fill="url(#shieldGrad)" stroke="#000080" strokeWidth="2"/>
    
    {/* Inner Shield Pattern */}
    <path d="M40 15 L55 23 L55 43 C55 51, 47.5 58, 40 62 C32.5 58, 25 51, 25 43 L25 23 Z" 
          fill="rgba(255,255,255,0.2)"/>
    
    {/* Security Check Mark */}
    <path d="M30 35 L37 45 L52 25" stroke="url(#checkGrad)" strokeWidth="4" 
          fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Lock Symbol */}
    <rect x="47" y="50" width="12" height="10" fill="url(#checkGrad)" rx="2"/>
    <rect x="49" y="47" width="8" height="6" fill="none" stroke="url(#checkGrad)" strokeWidth="2" rx="4"/>
    <circle cx="53" cy="54" r="1.5" fill="#FFFFFF"/>
    
    {/* Radiating Security Lines */}
    <g stroke="#4169E1" strokeWidth="1" opacity="0.5">
      <line x1="40" y1="5" x2="40" y2="1"/>
      <line x1="25" y1="12" x2="22" y2="9"/>
      <line x1="55" y1="12" x2="58" y2="9"/>
      <line x1="15" y1="25" x2="11" y2="25"/>
      <line x1="65" y1="25" x2="69" y2="25"/>
    </g>
  </svg>
)

const GlobalNetwork = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#00CED1', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#008B8B', stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Main Globe */}
    <circle cx="40" cy="40" r="25" fill="url(#globeGrad)" stroke="#006666" strokeWidth="2"/>
    
    {/* Continents/Land masses */}
    <path d="M20 35 Q25 30, 30 35 Q35 32, 40 35 Q45 38, 50 35 Q55 33, 60 35" 
          stroke="#228B22" strokeWidth="3" fill="none"/>
    <path d="M25 45 Q30 42, 35 45 Q40 48, 45 45 Q50 43, 55 45" 
          stroke="#228B22" strokeWidth="2" fill="none"/>
    
    {/* Grid Lines */}
    <ellipse cx="40" cy="40" rx="25" ry="12" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.6"/>
    <ellipse cx="40" cy="40" rx="12" ry="25" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.6"/>
    <line x1="15" y1="40" x2="65" y2="40" stroke="#FFFFFF" strokeWidth="1" opacity="0.6"/>
    
    {/* Connection Points/Countries */}
    <circle cx="30" cy="30" r="3" fill="#FFD700"/>
    <circle cx="50" cy="28" r="3" fill="#FFD700"/>
    <circle cx="25" cy="50" r="3" fill="#FFD700"/>
    <circle cx="55" cy="52" r="3" fill="#FFD700"/>
    <circle cx="40" cy="25" r="3" fill="#FFD700"/>
    <circle cx="45" cy="55" r="3" fill="#FFD700"/>
    
    {/* Connection Lines */}
    <g stroke="#FFFF00" strokeWidth="1" opacity="0.7">
      <line x1="30" y1="30" x2="50" y2="28"/>
      <line x1="50" y1="28" x2="55" y2="52"/>
      <line x1="25" y1="50" x2="45" y2="55"/>
      <line x1="40" y1="25" x2="30" y2="30"/>
      <line x1="40" y1="25" x2="55" y2="52"/>
    </g>
    
    {/* Country flags representation */}
    <rect x="5" y="70" width="8" height="5" fill="#FF0000"/>
    <rect x="67" y="5" width="8" height="5" fill="#0000FF"/>
    <rect x="67" y="70" width="8" height="5" fill="#00FF00"/>
    <rect x="5" y="5" width="8" height="5" fill="#FFA500"/>
  </svg>
)

// Simple Company Logo Components (instead of specific brands)
const TechCompany1 = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
    <rect x="10" y="10" width="80" height="80" fill="#2563eb" rx="20"/>
    <circle cx="50" cy="50" r="20" fill="white"/>
    <rect x="40" y="30" width="20" height="40" fill="#2563eb" rx="5"/>
  </svg>
)

const TechCompany2 = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="40" fill="#10b981"/>
    <polygon points="35,35 65,35 50,65" fill="white"/>
    <circle cx="50" cy="40" r="8" fill="#10b981"/>
  </svg>
)

const TechCompany3 = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
    <rect x="15" y="15" width="70" height="70" fill="#8b5cf6" rx="10"/>
    <rect x="25" y="25" width="20" height="20" fill="white" rx="5"/>
    <rect x="55" y="25" width="20" height="20" fill="white" rx="5"/>
    <rect x="25" y="55" width="50" height="20" fill="white" rx="5"/>
  </svg>
)

const TechCompany4 = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="40" fill="#f59e0b"/>
    <path d="M30 50 Q50 20, 70 50 Q50 80, 30 50" fill="white"/>
  </svg>
)

const TechCompany5 = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
    <rect x="10" y="20" width="80" height="60" fill="#ef4444" rx="15"/>
    <rect x="20" y="30" width="15" height="40" fill="white" rx="3"/>
    <rect x="42.5" y="30" width="15" height="40" fill="white" rx="3"/>
    <rect x="65" y="30" width="15" height="40" fill="white" rx="3"/>
  </svg>
)

const TechCompany6 = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
    <ellipse cx="50" cy="50" rx="40" ry="30" fill="#06b6d4"/>
    <ellipse cx="50" cy="50" rx="25" ry="35" fill="white"/>
    <ellipse cx="50" cy="50" rx="15" ry="20" fill="#06b6d4"/>
  </svg>
)

// Enhanced Company Logo Component with generic logos
const CompanyLogoWithSVG = ({ name, LogoComponent, bgColor = "bg-gray-50" }) => (
  <div className={`flex flex-col items-center justify-center p-6 ${bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group min-h-[140px]`}>
    <div className="w-16 h-16 mb-3 group-hover:scale-110 transition-transform duration-300">
      <LogoComponent />
    </div>
    <span className="text-gray-700 font-semibold text-lg">{name}</span>
  </div>
)

// Enhanced SVG Components with more details
const DashboardHeroSVG = () => (
  <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#1d4ed8', stopOpacity:1}} />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
    </defs>
    <rect width="600" height="400" fill="url(#heroGrad)" rx="12" opacity="0.1"/>
    <rect x="20" y="20" width="560" height="60" fill="#ffffff" rx="8" stroke="#e5e7eb" strokeWidth="1" filter="url(#shadow)"/>
    <circle cx="50" cy="50" r="8" fill="#3b82f6"/>
    <rect x="70" y="42" width="120" height="16" fill="#374151" rx="2"/>
    <rect x="480" y="42" width="80" height="16" fill="#10b981" rx="8"/>
    
    <rect x="20" y="100" width="180" height="260" fill="#ffffff" rx="8" stroke="#e5e7eb" strokeWidth="1" filter="url(#shadow)"/>
    <rect x="40" y="120" width="140" height="12" fill="#6b7280" rx="2"/>
    <rect x="40" y="150" width="100" height="12" fill="#9ca3af" rx="2"/>
    <rect x="40" y="180" width="120" height="12" fill="#9ca3af" rx="2"/>
    <rect x="40" y="210" width="90" height="12" fill="#9ca3af" rx="2"/>
    
    <rect x="220" y="100" width="360" height="130" fill="#ffffff" rx="8" stroke="#e5e7eb" strokeWidth="1" filter="url(#shadow)"/>
    <rect x="240" y="120" width="160" height="90" fill="url(#heroGrad)" rx="4" opacity="0.1"/>
    <path d="M250 180 L280 160 L310 170 L340 150 L370 140" stroke="#3b82f6" strokeWidth="3" fill="none"/>
    
    <rect x="420" y="120" width="140" height="90" fill="#f0fdf4" rx="4"/>
    <rect x="430" y="180" width="20" height="20" fill="#10b981" rx="2"/>
    <rect x="460" y="170" width="20" height="30" fill="#10b981" rx="2"/>
    <rect x="490" y="160" width="20" height="40" fill="#10b981" rx="2"/>
    <rect x="520" y="150" width="20" height="50" fill="#10b981" rx="2"/>
    
    <rect x="220" y="250" width="110" height="110" fill="#ffffff" rx="8" stroke="#e5e7eb" strokeWidth="1" filter="url(#shadow)"/>
    <circle cx="275" cy="280" r="15" fill="#8b5cf6"/>
    <rect x="240" y="305" width="70" height="8" fill="#6b7280" rx="2"/>
    <rect x="240" y="320" width="50" height="8" fill="#9ca3af" rx="2"/>
    
    <rect x="350" y="250" width="110" height="110" fill="#ffffff" rx="8" stroke="#e5e7eb" strokeWidth="1" filter="url(#shadow)"/>
    <circle cx="405" cy="280" r="15" fill="#f59e0b"/>
    <rect x="370" y="305" width="70" height="8" fill="#6b7280" rx="2"/>
    <rect x="370" y="320" width="50" height="8" fill="#9ca3af" rx="2"/>
    
    <rect x="480" y="250" width="100" height="110" fill="#ffffff" rx="8" stroke="#e5e7eb" strokeWidth="1" filter="url(#shadow)"/>
    <circle cx="530" cy="280" r="15" fill="#ef4444"/>
    <rect x="500" y="305" width="60" height="8" fill="#6b7280" rx="2"/>
    <rect x="500" y="320" width="40" height="8" fill="#9ca3af" rx="2"/>
  </svg>
)

// FAQ Component
const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100">
    <button 
      onClick={onToggle}
      className="w-full p-6 text-left flex justify-between items-center"
    >
      <h4 className="text-lg font-semibold text-gray-900 pr-4">{question}</h4>
      <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="px-6 pb-6">
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    )}
  </div>
)

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showChatBot, setShowChatBot] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(null)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  const features = [
    {
      icon: BookOpen,
      title: "Smart Examinations",
      description: "Create and manage online exams with advanced question types and automated grading",
      color: "blue",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics", 
      description: "Track student performance with detailed reports and insights",
      color: "green",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Organize students into classes and manage user roles efficiently", 
      color: "purple",
      bgGradient: "from-purple-50 to-violet-50"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Schedule exams with custom time limits and availability windows",
      color: "orange",
      bgGradient: "from-orange-50 to-amber-50"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Ensure exam integrity with secure login and anti-cheating measures",
      color: "red",
      bgGradient: "from-red-50 to-rose-50"
    },
    {
      icon: Award,
      title: "Digital Certificates", 
      description: "Generate and issue digital certificates for successful completion",
      color: "yellow",
      bgGradient: "from-yellow-50 to-amber-50"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Professor", 
      company: "Local University",
      content: "ExamPortal has made conducting online exams much easier for our department. The interface is clean and students find it intuitive.",
      rating: 5,
      avatarColor: "#6366f1",
      avatarBg: "#e0e7ff",
      image: "👩‍🏫"
    },
    {
      name: "Michael Chen",
      role: "IT Administrator",
      company: "Community College",
      content: "We needed a reliable platform for remote testing. ExamPortal delivered exactly what we were looking for.",
      rating: 5,
      avatarColor: "#16a34a", 
      avatarBg: "#dcfce7",
      image: "👨‍💻"
    },
    {
      name: "Lisa Rodriguez",
      role: "Training Coordinator",
      company: "Corporate Training Center",
      content: "The certification feature is perfect for our employee training programs. Easy to use and professional results.",
      rating: 5,
      avatarColor: "#ec4899",
      avatarBg: "#fdf2f8",
      image: "👩‍💼"
    }
  ]

  const stats = [
    { number: "500+", label: "Active Users", icon: Users, color: "blue" },
    { number: "50+", label: "Educational Institutions", icon: Building, color: "green" },
    { number: "10K+", label: "Exams Completed", icon: CheckCircle, color: "purple" },
    { number: "99.5%", label: "Platform Uptime", icon: Zap, color: "orange" }
  ]

  // More realistic startup achievements
  const achievements = [
    { 
      title: "Growing Platform", 
      description: "Serving Educational Institutions Since 2024", 
      icon: TrophyWithRibbon,
      bgGradient: "from-yellow-400 to-orange-500"
    },
    { 
      title: "Modern Technology", 
      description: "Built with Latest Web Technologies", 
      icon: InnovationBulb,
      bgGradient: "from-yellow-400 to-orange-500"
    },
    { 
      title: "Security Focused", 
      description: "SSL Encrypted & GDPR Compliant", 
      icon: SecurityShield,
      bgGradient: "from-yellow-400 to-orange-500"
    },
    { 
      title: "Cloud-Based", 
      description: "Accessible from Anywhere", 
      icon: GlobalNetwork,
      bgGradient: "from-yellow-400 to-orange-500"
    }
  ]

  const techStack = [
    { name: "React/Next.js", icon: Code, color: "bg-blue-500" },
    { name: "Cloud Hosting", icon: Cloud, color: "bg-green-500" },
    { name: "Database", icon: Database, color: "bg-purple-500" },
    { name: "Analytics", icon: BarChart2, color: "bg-orange-500" },
    { name: "Security", icon: LockIcon, color: "bg-red-500" },
    { name: "Mobile-Ready", icon: Smartphone, color: "bg-indigo-500" }
  ]

  // Generic partner companies instead of specific brands
  const trustedCompanies = [
    { name: "TechEdu Inc", LogoComponent: TechCompany1, bgColor: "bg-blue-50" },
    { name: "EduSoft", LogoComponent: TechCompany2, bgColor: "bg-green-50" },
    { name: "LearnTech", LogoComponent: TechCompany3, bgColor: "bg-purple-50" },
    { name: "SmartClass", LogoComponent: TechCompany4, bgColor: "bg-yellow-50" },
    { name: "EduCloud", LogoComponent: TechCompany5, bgColor: "bg-red-50" },
    { name: "ClassFlow", LogoComponent: TechCompany6, bgColor: "bg-cyan-50" }
  ]

  const faqs = [
    {
      question: "How does ExamPortal ensure exam security?",
      answer: "We implement secure login systems, time-limited access, and monitor exam sessions to maintain integrity. Our platform uses SSL encryption and follows best security practices."
    },
    {
      question: "Can I integrate ExamPortal with my existing LMS?",
      answer: "Yes! ExamPortal can integrate with popular Learning Management Systems. Contact us to discuss your specific integration needs."
    },
    {
      question: "What happens if a student loses internet connection during an exam?",
      answer: "Our platform automatically saves progress. Students can reconnect and continue their exam from where they left off, ensuring no work is lost."
    },
    {
      question: "Do you provide customer support?",
      answer: "Yes! We provide email support and documentation to help you get started. Our team is dedicated to ensuring a smooth experience for all users."
    },
    {
      question: "How do I get started with ExamPortal?",
      answer: "Simply sign up for an account, and you can start creating your first exam within minutes. We provide guides and tutorials to help you get up and running quickly."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial so you can explore all features and see if ExamPortal is right for your institution."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 overflow-x-hidden">
      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes bounce-in {
          0% { 
            opacity: 0; 
            transform: scale(0.3); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.1); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.4); 
          }
          50% { 
            box-shadow: 0 0 45px rgba(59, 130, 246, 0.8); 
          }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.8s ease-out; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-rotate { animation: rotate 20s linear infinite; }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        .animate-delay-500 { animation-delay: 0.5s; }

        html { scroll-behavior: smooth; }
        
        @media (max-width: 640px) {
          .hero-title { font-size: 2.5rem; }
          .feature-grid { grid-template-columns: 1fr; }
          .testimonial-grid { grid-template-columns: 1fr; }
        }
        
        .mobile-touch { min-height: 44px; min-width: 44px; }
        
        .gradient-text {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Navigation - Enhanced */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 glass-effect sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 animate-slide-up">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center animate-bounce-in shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold gradient-text">ExamPortal</span>
              <div className="text-xs text-gray-500 font-medium">Online Assessment Platform</div>
            </div>
          </div>
          
          {/* Desktop Menu - Enhanced */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-all hover:scale-105 transform font-medium">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-all hover:scale-105 transform font-medium">Reviews</a>
            <a href="#tech" className="text-gray-600 hover:text-blue-600 transition-all hover:scale-105 transform font-medium">Technology</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-all hover:scale-105 transform font-medium">FAQ</a>
            
            <Link href="/login">
              <Button 
                variant="outline" 
                className="hover:scale-105 transform transition-all mobile-touch border-2 border-blue-200 hover:border-blue-300"
              >
                <Mail className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transform transition-all mobile-touch shadow-lg animate-pulse-glow"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden mobile-touch p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu - Enhanced */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            <div className="flex flex-col space-y-4 bg-white rounded-xl p-4 shadow-lg">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors mobile-touch font-medium">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors mobile-touch font-medium">Reviews</a>
              <a href="#tech" className="text-gray-600 hover:text-blue-600 transition-colors mobile-touch font-medium">Technology</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors mobile-touch font-medium">FAQ</a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full mobile-touch"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 mobile-touch"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row items-center justify-between py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Left Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-8 animate-bounce-in shadow-lg">
              <Rocket className="h-5 w-5 mr-2 text-blue-600" />
              Modern Online Assessment Platform
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight animate-slide-up animate-delay-100 hero-title">
              Simplify
              <span className="gradient-text block animate-slide-up animate-delay-200">
                Online Exams
              </span>
              <span className="text-4xl md:text-5xl lg:text-6xl text-gray-600 block animate-slide-up animate-delay-300">
                for Modern Education
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed animate-slide-up animate-delay-400">
              Create, manage, and grade online assessments with ease. 
              <span className="font-semibold text-blue-600">Built for educators, designed for students.</span>
            </p>

            {/* CTA Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-6 mb-10 animate-slide-up animate-delay-500">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl mobile-touch animate-pulse-glow text-lg px-8 py-4"
                >
                  <Rocket className="h-6 w-6 mr-3" />
                  Start Free Trial
                  <ChevronRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 mobile-touch text-lg px-8 py-4"
              >
                <Play className="h-6 w-6 mr-3" />
                View Demo
              </Button>
            </div>

            {/* Trust Indicators - Enhanced */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 text-gray-600 animate-slide-up animate-delay-500">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
                <span className="font-medium">Free 14-day trial</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-3 text-blue-500" />
                <span className="font-medium">Secure & reliable</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-6 w-6 mr-3 text-red-500" />
                <span className="font-medium">Easy to use</span>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Hero Image */}
          <div className="lg:w-1/2 relative">
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 rounded-3xl transform rotate-6 opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500 border border-gray-200">
                <DashboardHeroSVG />
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full p-4 animate-bounce-in shadow-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-3 animate-bounce-in animate-delay-200 shadow-lg">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Floating Elements - Enhanced */}
            <div className="absolute top-10 -left-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full p-6 animate-float animate-delay-100 shadow-lg">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <div className="absolute bottom-10 -right-10 bg-gradient-to-r from-purple-100 to-indigo-200 rounded-full p-6 animate-float animate-delay-200 shadow-lg">
              <BarChart3 className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-pink-100 to-rose-200 rounded-full p-4 animate-float animate-delay-300 shadow-lg">
              <BookOpen className="h-8 w-8 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Stats - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-20 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <stat.icon className={`h-10 w-10 text-${stat.color}-600`} />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Companies Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Trusted by Educational Partners</h3>
            <p className="text-xl text-gray-600">Growing community of educational institutions and training centers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {trustedCompanies.map((company, index) => (
              <div key={index} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CompanyLogoWithSVG 
                  name={company.name} 
                  LogoComponent={company.LogoComponent}
                  bgColor={company.bgColor}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Banner - ENHANCED with realistic startup content */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-20 h-20 bg-white/10 rounded-full animate-float animate-delay-100"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-white/10 rounded-full animate-float animate-delay-200"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-sparkle"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for the Future of Education
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              ExamPortal is designed with modern technology and educational best practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="text-center text-white animate-slide-up group hover:scale-105 transition-transform duration-300" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Enhanced Icon with Custom SVG */}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-6 group-hover:bg-opacity-30 transition-all duration-300 shadow-lg backdrop-blur-sm">
                  <achievement.icon />
                </div>
                
                <h4 className="text-2xl font-bold mb-3 group-hover:text-blue-200 transition-colors">
                  {achievement.title}
                </h4>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {achievement.description}
                </p>
                
                {/* Decorative element */}
                <div className="mt-4 w-16 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mx-auto group-hover:w-20 transition-all duration-300"></div>
              </div>
            ))}
          </div>

          {/* Bottom section with startup values */}
          <div className="mt-16 text-center animate-slide-up">
            <div className="inline-flex items-center space-x-8 text-white text-lg">
              <div className="flex items-center">
                <Code className="h-6 w-6 mr-2 text-blue-300" />
                <span>Modern Tech</span>
              </div>
              <div className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-300" />
                <span>User-Focused</span>
              </div>
              <div className="flex items-center">
                <Rocket className="h-6 w-6 mr-2 text-blue-300" />
                <span>Continuously Improving</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="gradient-text block">Online Assessments</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive tools to create, deliver, and analyze online exams with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 feature-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden animate-slide-up p-8"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`relative h-60 bg-gradient-to-r ${feature.bgGradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <feature.icon className="h-20 w-20 text-blue-600 animate-float" />
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors text-lg">
                      Learn More
                      <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section - Enhanced */}
      <section id="tech" className="py-24 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-5xl font-bold mb-6">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              ExamPortal uses the latest web technologies to deliver a fast, reliable experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`inline-flex items-center justify-center w-20 h-20 ${tech.color} rounded-2xl mb-4 shadow-lg animate-float`}>
                  <tech.icon className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-lg font-semibold">{tech.name}</h4>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center animate-slide-up">
            <div className="inline-flex items-center px-8 py-4 bg-white bg-opacity-10 rounded-full">
              <Cpu className="h-6 w-6 mr-3 animate-rotate" />
              <span className="text-lg font-semibold">Scalable & Reliable Infrastructure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced with realistic reviews */}
      <section id="testimonials" className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-2xl text-gray-600">Real feedback from educators using ExamPortal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up border border-gray-100"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 rounded-full mr-6 text-4xl flex items-center justify-center shadow-lg" style={{backgroundColor: testimonial.avatarBg}}>
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-lg">{testimonial.role}</div>
                    <div className="text-blue-600 font-semibold">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed text-lg italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-2xl text-gray-600">Get answers to common questions about ExamPortal</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-white/10 rounded-full animate-float animate-delay-100"></div>
          <div className="absolute bottom-20 left-32 w-16 h-16 bg-white/10 rounded-full animate-float animate-delay-200"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative animate-slide-up">
          <h3 className="text-4xl font-bold text-white mb-6">Stay Updated</h3>
          <p className="text-xl text-blue-100 mb-10">Get updates on new features and educational technology insights</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-8 py-4 rounded-xl border-0 focus:ring-4 focus:ring-white focus:outline-none mobile-touch text-lg shadow-lg"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 whitespace-nowrap mobile-touch px-8 py-4 text-lg font-semibold shadow-lg">
              <Mail className="h-5 w-5 mr-2" />
              Subscribe
            </Button>
          </div>
          
          <p className="text-blue-200 mt-6">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="animate-slide-up">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">ExamPortal</span>
                  <div className="text-sm text-gray-400">Online Assessment</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Making online assessments simple, secure, and effective for educational institutions.
              </p>
              <div className="flex space-x-4">
                {['Email', 'Twitter', 'LinkedIn'].map((social, index) => (
                  <div key={index} className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer mobile-touch">
                    <span className="text-white font-bold text-sm">{social.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-slide-up animate-delay-100">
              <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3">
                {['Features', 'Security', 'Documentation', 'System Status'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block mobile-touch">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="animate-slide-up animate-delay-200">
              <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'Getting Started', 'Tutorials'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block mobile-touch">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="animate-slide-up animate-delay-300">
              <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Careers', 'Privacy Policy'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block mobile-touch">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-slide-up">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2025 ExamPortal. All rights reserved. Built with passion for education.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>SSL Secured</span>
              <span>•</span>
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          onClick={() => setShowChatBot(!showChatBot)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-bounce mobile-touch"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
        
        {showChatBot && (
          <div className="absolute bottom-20 right-0 w-96 bg-white rounded-2xl shadow-2xl border animate-slide-up">
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-lg">Need Help?</h4>
                  <p className="text-blue-100 text-sm">We're here to help you get started</p>
                </div>
                <button onClick={() => setShowChatBot(false)} className="text-white hover:text-gray-200 mobile-touch">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full text-left p-4 hover:bg-blue-50 rounded-xl transition-colors flex items-center mobile-touch group">
                  <FileText className="h-6 w-6 mr-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold">Getting Started</div>
                    <div className="text-sm text-gray-500">Learn how to create your first exam</div>
                  </div>
                </button>
                <button className="w-full text-left p-4 hover:bg-green-50 rounded-xl transition-colors flex items-center mobile-touch group">
                  <Mail className="h-6 w-6 mr-4 text-green-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold">Contact Support</div>
                    <div className="text-sm text-gray-500">Get help from our team</div>
                  </div>
                </button>
                <button className="w-full text-left p-4 hover:bg-purple-50 rounded-xl transition-colors flex items-center mobile-touch group">
                  <Play className="h-6 w-6 mr-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold">View Demo</div>
                    <div className="text-sm text-gray-500">See ExamPortal in action</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
