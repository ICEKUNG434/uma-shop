'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, User } from '@supabase/supabase-js';
import {
  Mail,
  Lock,
  UserCircle2,
  ArrowLeft,
  Loader2,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
  Heart,
  Trophy,
} from 'lucide-react';

const SUPABASE_URL = 'https://jwujhkuudfqpitouiqnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EJM1vWSsz9qNrjRg20lx8A_M-FxsBMq';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export default function AuthPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setCheckingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim() || email.split('@')[0],
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.user && !data.session) {
          setSuccessMsg(
            'สมัครสมาชิกสำเร็จ! กรุณากดยืนยันในอีเมล หรือปิด Confirm email ใน Supabase'
          );
        } else {
          setSuccessMsg('สมัครสมาชิกสำเร็จ! กำลังพากลับสู่หน้าร้าน...');
          setTimeout(() => {
            router.push('/');
          }, 900);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งครับ');
        } else {
          setSuccessMsg('เข้าสู่ระบบสำเร็จ! กำลังพากลับสู่หน้าร้าน...');
          setTimeout(() => {
            router.push('/');
          }, 800);
        }
      }
    } catch {
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งครับ');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setCurrentUser(null);
    setLoading(false);
    setSuccessMsg('ออกจากระบบเรียบร้อยแล้วครับ');
  };

  const displayTitle =
    currentUser?.user_metadata?.display_name ||
    currentUser?.email?.split('@')[0] ||
    'เทรนเนอร์';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-slate-900 flex flex-col justify-between">
      {/* แอนิเมชันแสงพื้นหลัง */}
      <style jsx>{`
        svg {
          max-width: 24px;
          max-height: 24px;
          display: inline-block;
          flex-shrink: 0;
        }
        @keyframes pulseBlob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(20px, -25px) scale(1.08);
          }
        }
        @keyframes shimmerBtn {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .blob-animate {
          animation: pulseBlob 8s ease-in-out infinite;
        }
        .blob-animate-delay {
          animation: pulseBlob 10s ease-in-out infinite 2s;
        }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.28),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.65s ease;
        }
        .btn-shimmer:hover::after {
          transform: translateX(100%);
        }
      `}</style>

      {/* วงแสงตกแต่งพื้นหลัง */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl blob-animate" />
      <div className="pointer-events-none absolute bottom-10 -right-20 h-96 w-96 rounded-full bg-amber-300/15 blur-3xl blob-animate-delay" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl blob-animate" />

      {/* แถบด้านบน */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>กลับหน้าร้าน Tracen Collectibles</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 px-3 py-1 text-xs font-bold text-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>Trainer Account</span>
            </span>
          </div>
        </div>
      </header>

      {/* กล่องกลางแบบ Split Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/95 backdrop-blur-xl">
          {/* ฝั่งซ้าย: แบนเนอร์ต้อนรับเทรนเนอร์ */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
            <div className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-amber-400/15 blur-2xl" />

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
                  U
                </div>
                <div>
                  <p className="font-extrabold text-base tracking-tight leading-none">
                    Tracen Collectibles
                  </p>
                  <p className="text-[11px] text-emerald-200 mt-1">
                    Official Goods & Figures
                  </p>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold leading-snug pt-2">
                ยินดีต้อนรับสู่คลับนักสะสม Uma Musume
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                สมัครสมาชิกครั้งเดียว ใช้งานบัญชีเดียวกันได้ทั้งบน iPhone, iPad และคอมพิวเตอร์
              </p>
            </div>

            <div className="space-y-3 pt-8 text-xs">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
                <Smartphone className="h-4 w-4 text-amber-300 shrink-0" />
                <span>ล็อกอินข้ามอุปกรณ์ได้ทันทีผ่าน Cloud</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
                <Heart className="h-4 w-4 text-rose-300 shrink-0" />
                <span>แนบชื่อบัญชีสมาชิกในใบสั่งซื้ออัตโนมัติ</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
                <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
                <span>ปลอดภัยด้วยระบบยืนยันตัวตน Supabase</span>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: ฟอร์มเข้าสู่ระบบ / สมัครบัญชี */}
          <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-center bg-white">
            {checkingSession ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
                <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                <span>กำลังตรวจสอบสถานะบัญชี...</span>
              </div>
            ) : currentUser ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
                    {displayTitle.charAt(0).toUpperCase()}
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-bold text-emerald-700">
                      <Trophy className="h-3 w-3 text-amber-500" />
                      <span>เข้าสู่ระบบเรียบร้อย</span>
                    </span>
                    <h1 className="text-xl font-extrabold text-slate-900 truncate mt-1.5">
                      สวัสดี, {displayTitle}
                    </h1>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs space-y-2">
                  <p className="text-slate-600 leading-relaxed">
                    บัญชีของคุณพร้อมใช้งานข้ามอุปกรณ์แล้ว สามารถนำอีเมลและรหัสผ่านนี้ไปล็อกอินบน{' '}
                    <span className="font-bold text-slate-900">iPhone, iPad หรือเครื่องอื่น</span>{' '}
                    ได้ทันทีครับ
                  </p>
                  <p className="font-mono text-[11px] text-slate-400 truncate">
                    Trainer ID: {currentUser.id}
                  </p>
                </div>

                {successMsg && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <Link
                    href="/"
                    className="relative overflow-hidden btn-shimmer w-full flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    ไปเลือกช้อปของสะสมต่อ
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/80 py-3 text-sm font-bold text-rose-700 hover:bg-rose-100 transition active:scale-95 disabled:opacity-60"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {mode === 'login' ? 'เข้าสู่ระบบเทรนเนอร์' : 'สมัครสมาชิกใหม่'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {mode === 'login'
                      ? 'กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานบัญชีของคุณ'
                      : 'สร้างบัญชีฟรีภายใน 10 วินาที เพื่อซิงค์ข้อมูลข้ามเครื่อง'}
                  </p>
                </div>

                {/* แถบสลับโหมดพร้อมแอนิเมชัน */}
                <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                      mode === 'login'
                        ? 'bg-white text-emerald-700 shadow-sm scale-[1.01]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                      mode === 'register'
                        ? 'bg-white text-emerald-700 shadow-sm scale-[1.01]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    สมัครสมาชิกใหม่
                  </button>
                </div>

                {errorMsg && (
                  <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-semibold flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 font-semibold flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        ชื่อเทรนเนอร์ (ชื่อที่แสดงในร้าน)
                      </label>
                      <div className="relative">
                        <UserCircle2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="เช่น ไอซ์ อดิชาติ"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      อีเมล
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 py-2.5 text-sm focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition"
                        title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative overflow-hidden btn-shimmer w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>กำลังดำเนินการ...</span>
                      </>
                    ) : (
                      <span>{mode === 'login' ? 'เข้าสู่ระบบ' : 'สร้างบัญชีสมาชิก'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-4 px-4 text-center text-xs text-emerald-200/70">
        Tracen Collectibles • ระบบบัญชีสมาชิกข้ามอุปกรณ์ผ่าน Supabase
      </footer>
    </div>
  );
}
