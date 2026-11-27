'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ImagePlus,
  ClipboardPaste,
  X,
} from 'lucide-react';

const IMGBB_API_KEY = 'f9b2ed4e3933997a26d3ebd8799b306e';
const SUPABASE_URL = 'https://jwujhkuudfqpitouiqnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EJM1vWSsz9qNrjRg20lx8A_M-FxsBMq';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const LOADING_GIFS = [
  'https://c.tenor.com/ztf7c4o4fFQAAAAC/tenor.gif',
  'https://media1.tenor.com/m/Gn9gXQJfkVMAAAAC/awful-umamusume.gif',
];

function processAvatarFile(
  file: File,
  maxWidth = 400,
  quality = 0.72
): Promise<{
  previewUrl: string;
  base64Clean: string;
  isGif: boolean;
  sizeKB: number;
}> {
  return new Promise((resolve, reject) => {
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const reader = new FileReader();

    reader.onload = (event) => {
      const rawDataUrl = (event.target?.result as string) || '';
      const rawBase64 = rawDataUrl.split(',')[1] || '';

      if (isGif) {
        const sizeKB = Math.max(1, Math.round(file.size / 1024));
        resolve({
          previewUrl: rawDataUrl,
          base64Clean: rawBase64,
          isGif: true,
          sizeKB,
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Clean = compressedDataUrl.split(',')[1] || '';
        const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
        const sizeKB = Math.max(1, Math.round(approxBytes / 1024));
        resolve({
          previewUrl: compressedDataUrl,
          base64Clean,
          isGif: false,
          sizeKB,
        });
      };
      img.onerror = reject;
      img.src = rawDataUrl;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AuthPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [loadingGifIdx, setLoadingGifIdx] = useState(0);
  const [loadingText, setLoadingText] = useState('กำลังโหลดหน้าบัญชีเทรนเนอร์...');

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [avatarIsGif, setAvatarIsGif] = useState(false);
  const [avatarSizeKB, setAvatarSizeKB] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const triggerGifLoader = useCallback((text: string, durationMs = 750, onDone?: () => void) => {
    setLoadingText(text);
    setLoadingGifIdx((prev) => (prev + 1) % LOADING_GIFS.length);
    setIsLoadingScreen(true);
    setTimeout(() => {
      setIsLoadingScreen(false);
      if (onDone) onDone();
    }, durationMs);
  }, []);

  useEffect(() => {
    setLoadingGifIdx(Math.floor(Math.random() * LOADING_GIFS.length));
    const timer = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

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

  const applyAvatarFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกหรือวางไฟล์รูปภาพ / ภาพ GIF เท่านั้นครับ');
      return;
    }

    if (file.type === 'image/gif' && file.size > 4 * 1024 * 1024) {
      setErrorMsg('ไฟล์ GIF ใหญ่เกิน 4 MB กรุณาเลือกไฟล์ GIF ที่ขนาดเล็กลงครับ');
      return;
    }

    setErrorMsg(null);
    try {
      const processed = await processAvatarFile(file, 400, 0.72);
      setAvatarPreview(processed.previewUrl);
      setAvatarBase64(processed.base64Clean);
      setAvatarIsGif(processed.isGif);
      setAvatarSizeKB(processed.sizeKB);
    } catch {
      setErrorMsg('ไม่สามารถอ่านไฟล์รูปโปรไฟล์นี้ได้ กรุณาลองใหม่อีกครั้งครับ');
    }
  }, []);

  useEffect(() => {
    if (mode !== 'register' || currentUser) return;

    const handlePaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      if (clipboardData.files && clipboardData.files.length > 0) {
        const file = clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          applyAvatarFile(file);
          return;
        }
      }

      if (clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              e.preventDefault();
              applyAvatarFile(file);
              return;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [mode, currentUser, applyAvatarFile]);

  const handlePasteFromClipboardButton = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imgType = item.types.find((t) => t.startsWith('image/'));
        if (imgType) {
          const blob = await item.getType(imgType);
          const ext = imgType === 'image/gif' ? 'gif' : 'png';
          const file = new File([blob], `pasted-avatar.${ext}`, { type: imgType });
          await applyAvatarFile(file);
          return;
        }
      }
      setErrorMsg('ไม่พบรูปภาพหรือ GIF ในคลิปบอร์ด ลองก๊อปปี้รูปหรือ GIF แล้วกดวางอีกครั้งครับ');
    } catch {
      setErrorMsg('กด Ctrl + V (หรือ Cmd + V) เพื่อวางรูป/GIF ได้โดยตรงครับ');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await applyAvatarFile(file);
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAvatarPreview(null);
    setAvatarBase64(null);
    setAvatarIsGif(false);
    setAvatarSizeKB(0);
  };

  const uploadAvatarToImgBB = async (): Promise<string | null> => {
    if (!avatarBase64) return null;
    try {
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', avatarBase64);
      formData.append('name', `trainer-avatar-${Date.now()}`);

      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data?.success && data?.data?.url) {
        return data.data.url as string;
      }
      return null;
    } catch (err) {
      console.error('อัปโหลดรูปโปรไฟล์ไม่สำเร็จ:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        let uploadedAvatarUrl: string | null = null;
        if (avatarBase64) {
          uploadedAvatarUrl = await uploadAvatarToImgBB();
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim() || email.split('@')[0],
              avatar_url: uploadedAvatarUrl,
              avatar_is_gif: avatarIsGif,
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
          setSuccessMsg('สมัครสมาชิกและตั้งค่าโปรไฟล์สำเร็จ!');
          triggerGifLoader('กำลังพากลับสู่หน้าร้าน Tracen Collectibles...', 800, () => {
            router.push('/');
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งครับ');
        } else {
          setSuccessMsg('เข้าสู่ระบบสำเร็จ!');
          triggerGifLoader('กำลังเข้าสู่ระบบเทรนเนอร์...', 800, () => {
            router.push('/');
          });
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

  const currentAvatarUrl: string | null = currentUser?.user_metadata?.avatar_url || null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-slate-900 flex flex-col justify-between">
      {isLoadingScreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-400 p-6 text-white">
          <div className="w-full max-w-xs rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 p-5 shadow-2xl flex flex-col items-center gap-4 text-center">
            <div
              style={{ width: '144px', height: '144px', overflow: 'hidden' }}
              className="rounded-2xl bg-white shadow-lg border-2 border-white shrink-0"
            >
              <img
                src={LOADING_GIFS[loadingGifIdx]}
                alt="กำลังโหลด"
                style={{ width: '144px', height: '144px', objectFit: 'cover' }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-extrabold drop-shadow-xs">{loadingText}</p>
              <p className="text-[11px] text-white/90 font-medium">
                Tracen Collectibles • สลับภาพ GIF อัตโนมัติ
              </p>
            </div>
          </div>
        </div>
      )}

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

      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl blob-animate" />
      <div className="pointer-events-none absolute bottom-10 -right-20 h-96 w-96 rounded-full bg-amber-300/15 blur-3xl blob-animate-delay" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl blob-animate" />

      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              triggerGifLoader('กำลังกลับหน้าร้าน Tracen Collectibles...', 650, () => {
                router.push('/');
              })
            }
            className="group inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>กลับหน้าร้าน</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 px-3 py-1 text-xs font-bold text-amber-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>GIF + Paste Ready</span>
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/95 backdrop-blur-xl">
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
                แนบหรือวางรูปโปรไฟล์ / ภาพ GIF เคลื่อนไหว แล้วล็อกอินใช้งานข้ามเครื่องได้ทันที
              </p>
            </div>

            <div className="space-y-3 pt-8 text-xs">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
                <Smartphone className="h-4 w-4 text-amber-300 shrink-0" />
                <span>ล็อกอินข้ามอุปกรณ์ได้ทั้ง iPhone, iPad, Notebook</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
                <Heart className="h-4 w-4 text-rose-300 shrink-0" />
                <span>ก๊อปปี้แล้ววางรูปหรือ GIF ลงโปรไฟล์ได้ทันที</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
                <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
                <span>ปลอดภัยด้วยระบบยืนยันตัวตน Supabase</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-center bg-white">
            {checkingSession ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
                <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                <span>กำลังตรวจสอบสถานะบัญชี...</span>
              </div>
            ) : currentUser ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      minWidth: '64px',
                      minHeight: '64px',
                      maxWidth: '64px',
                      maxHeight: '64px',
                    }}
                    className="relative rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0 overflow-hidden"
                  >
                    {currentAvatarUrl ? (
                      <img
                        src={currentAvatarUrl}
                        alt={displayTitle}
                        style={{
                          width: '64px',
                          height: '64px',
                          maxWidth: '64px',
                          maxHeight: '64px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      displayTitle.charAt(0).toUpperCase()
                    )}
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
                    บัญชีและรูปโปรไฟล์ของคุณซิงค์บน Cloud แล้ว สามารถนำไปล็อกอินบน{' '}
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
                  <button
                    type="button"
                    onClick={() =>
                      triggerGifLoader('กำลังกลับหน้าร้าน...', 650, () => {
                        router.push('/');
                      })
                    }
                    className="relative overflow-hidden btn-shimmer w-full flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    ไปเลือกช้อปของสะสมต่อ
                  </button>
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
                      : 'สร้างบัญชีฟรี พร้อมแนบหรือวางรูปโปรไฟล์ / ภาพ GIF'}
                  </p>
                </div>

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
                  {/* ช่องแนบหรือก๊อปปี้แล้ววางรูปโปรไฟล์ / ภาพ GIF (ล็อกขนาดรูปตรงแท็ก img + จัดเรียงบน-ล่างไม่เบียดข้อความ) */}
                  {mode === 'register' && (
                    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 flex flex-col items-center text-center gap-3">
                      <label
                        style={{
                          width: '84px',
                          height: '84px',
                          minWidth: '84px',
                          minHeight: '84px',
                          maxWidth: '84px',
                          maxHeight: '84px',
                        }}
                        className="relative rounded-full border-2 border-dashed border-emerald-400 bg-white flex items-center justify-center cursor-pointer overflow-hidden shadow-xs hover:border-emerald-600 transition group"
                      >
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="ตัวอย่างรูปโปรไฟล์"
                            style={{
                              width: '84px',
                              height: '84px',
                              maxWidth: '84px',
                              maxHeight: '84px',
                              objectFit: 'cover',
                              borderRadius: '9999px',
                            }}
                          />
                        ) : (
                          <ImagePlus className="h-7 w-7 text-emerald-600 group-hover:scale-110 transition-transform" />
                        )}
                        <input
                          type="file"
                          accept="image/*,.gif"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>

                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">
                            รูปโปรไฟล์ / ภาพ GIF
                          </span>
                          {avatarIsGif && (
                            <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                              GIF เคลื่อนไหว
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500">
                          {avatarPreview
                            ? `พร้อมใช้งาน (${avatarSizeKB} KB) — กด Ctrl+V หรือแตะวงกลมเพื่อเปลี่ยน`
                            : 'แตะวงกลมด้านบนเพื่อเลือกรูป/GIF หรือกด Ctrl + V วางได้เลย'}
                        </p>

                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handlePasteFromClipboardButton}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 text-[11px] font-bold text-emerald-800 transition"
                          >
                            <ClipboardPaste className="h-3.5 w-3.5" />
                            <span>วางรูป / GIF จากคลิปบอร์ด</span>
                          </button>

                          {avatarPreview && (
                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              className="inline-flex items-center gap-1 rounded-xl bg-rose-100 hover:bg-rose-200 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 transition"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>ลบรูป</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

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
                          placeholder="เช่น สเปเชียล เท็น หรือ เทรนเนอร์ซากุระ"
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
                        placeholder="trainer.tracen@gmail.com"
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
