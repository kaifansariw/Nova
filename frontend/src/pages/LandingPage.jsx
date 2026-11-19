import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Kanban,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Zap,
  Users,
  Moon,
  Sun,
  ChevronDown,
  Star,
  FolderKanban,
  Play,
  Layers,
  ArrowUpRight,
  Check
} from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { RunningMockups } from '../components/landing/RunningMockups';
import { useAuthStore } from '../store/authStore';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Instant 1-Click demo login handler
  const handleInstantDemo = async () => {
    try {
      setIsDemoLoggingIn(true);
      const res = await login('demo@nova.team', 'password123');
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      navigate('/login');
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  const features = [
    {
      icon: Kanban,
      title: 'Real-Time Kanban Board',
      desc: 'Organize backlog, active sprints, and code reviews with frictionless status transitions and task checklists.',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: BarChart3,
      title: 'Velocity & Burndown Analytics',
      desc: 'Automatic progress gauges, task distribution donut charts, and workload balance across team members.',
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      icon: Users,
      title: 'Role-Based Access Control',
      desc: 'Owner, Admin, and Member permissions. Secure workspace governance, team invitations, and role management.',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Sun,
      title: 'Engineered Light & Dark Themes',
      desc: 'Pixel-perfect contrast conforming to WCAG 2.1 AA. Smooth system-wide theme switching with zero layout shift.',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: Zap,
      title: 'Sub-Second Optimistic UI',
      desc: 'Instant drag-and-drop feedback with background server synchronization. No freezing or blocking spinners.',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Data Ownership',
      desc: 'Deploy on your own infrastructure or cloud clusters with full MongoDB persistence and JWT encryption.',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Create Your Workspaces',
      desc: 'Set up product repositories, define sprint milestones, and invite team members with specific roles in under a minute.'
    },
    {
      step: '02',
      title: 'Organize & Track Tasks',
      desc: 'Break down epics into actionable deliverables with priority tags, deadlines, checklists, and rich markdown notes.'
    },
    {
      step: '03',
      title: 'Ship Continuously',
      desc: 'Monitor sprint burndown in real time, identify bottlenecks early, and celebrate deliverables crossing the finish line.'
    }
  ];

  const faqs = [
    {
      q: 'Can I test the platform without registering?',
      a: 'Yes! Click the "Instant 1-Click Demo" button anywhere on this page to immediately enter a fully-seeded workspace with projects and tasks.'
    },
    {
      q: 'How does Nova-Team handle theme preferences?',
      a: 'Nova-Team includes a built-in theme engine that respects your OS preference and lets you toggle seamlessly between Light and Dark mode anytime.'
    },
    {
      q: 'Can I deploy Nova-Team to Render or our private servers?',
      a: 'Absolutely. Nova-Team includes a ready-to-run render.yaml Blueprint and Docker configurations for one-click deployment to Render, AWS, or local containers.'
    },
    {
      q: 'Is there a free plan for startups and developers?',
      a: 'Yes, the Community Edition is completely free forever for teams up to 5 members with full Kanban and analytics functionality.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      {/* 1. TOP NAVBAR */}
      <LandingNavbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Plan, Collaborate, <span className="cyan-500 bg-clip-text">Deliver.</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ditch bloated enterprise tools. Nova-Team delivers a high-velocity workspace with live Kanban boards, real-time telemetry, and team collaboration.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-7 rounded-xl text-sm font-semibold
                  bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
              >
                <Kanban className="w-4 h-4" />
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-7 rounded-xl text-sm font-semibold
                    bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                >
                  <span>Start Free Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleInstantDemo}
                  disabled={isDemoLoggingIn}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold
                    bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                  <span>{isDemoLoggingIn ? 'Launching...' : '1-Click Demo Login'}</span>
                </button>
              </>
            )}
          </div>

        </div>
      </section>

      {/* 3. RUNNING MOCKUPS SHOWCASE (LIVE PRODUCT SIMULATOR) */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <RunningMockups />
      </section>

      {/* 4. CORE FEATURES GRID */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 tracking-widest mb-2">
            Engineered For Speed
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything Your Engineering Team Needs
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            No clutter. No unnecessary enterprise configuration. Just razor-sharp focus on shipping product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. WORKFLOW SECTION */}
      <section id="workflows" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-widest mb-2">
              Simple Agile Flow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              From Ideation to Production in 3 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl font-black text-blue-600/20 dark:text-blue-500/20 font-mono block mb-2">
                    {step.step}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 tracking-widest mb-2">
              Got Questions?
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 p-8 sm:p-12 text-center text-white shadow-2xl">
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Ready to Accelerate Your Shipping Velocity?
          </h3>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">
            Join engineering teams delivering on-time milestones with zero distraction. Get started in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-8 rounded-xl text-sm font-bold bg-white text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleInstantDemo}
              disabled={isDemoLoggingIn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold bg-blue-700/60 hover:bg-blue-700 text-white border border-white/20 transition-colors"
            >
              <span>{isDemoLoggingIn ? 'Logging in...' : 'Try Live Demo Now'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Nova-Team
            </span>
            <span className="text-slate-400">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-blue-500 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-blue-500 transition-colors">Create Account</Link>
            <a href="https://github.com/kaifansariw/Nova" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">GitHub</a>
            <a href="#mockups" className="hover:text-blue-500 transition-colors">Product Demo</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

