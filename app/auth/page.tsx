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
  Eye,
  EyeOff,
  ImagePlus,
  ClipboardPaste,
  X,
  ZoomIn,
  RotateCcw,
} from 'lucide-react';

const IMGBB_API_KEY = 'f9b2ed4e3933997a26d3ebd8799b306e';
const SUPABASE_URL = 'https://jwujhkuudfqpitouiqnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EJM1vWSsz9qNrjRg20lx8A_M-FxsBMq';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const LOADING_GIFS = [
  'https://c.tenor.com/ztf7c4o4fFQAAAAC/tenor.gif',
  'https://media1.tenor.com/m/Gn9gXQJfkVMAAAAC/awful-umamusume.gif',
];

function isGifFile(file: File): boolean {
  return file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
}

function readImageFile(file: File): Promise<{
  rawDataUrl: string;
  rawBase64: string;
  sizeKB: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = (event.target?.result as string) || '';
      const rawBase64 = rawDataUrl.split(',')[1] || '';
      const sizeKB = Math.max(1, Math.round(file.size / 1024));
      resolve({ rawDataUrl, rawBase64, sizeKB });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cropImageToCircleBase64(
  imageSrc: string,
  zoom: number,
  offsetX: number,
  offsetY: number,
  outputSize = 360,
  previewBoxSize = 84
): Promise<{ base64Clean: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const scaleFactor = outputSize / previewBoxSize;
      const baseScale = Math.max(outputSize / img.width, outputSize / img.height);
      const drawW = img.width * baseScale * zoom;
      const drawH = img.height * baseScale * zoom;
      const drawX = outputSize / 2 - drawW / 2 + offsetX * scaleFactor;
      const drawY = outputSize / 2 - drawH / 2 + offsetY * scaleFactor;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      const base64Clean = dataUrl.split(',')[1] || '';
      resolve({ base64Clean });
    };
    img.onerror = reject;
    img.src = imageSrc;
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

  // รูปโปรไฟล์นิ่งเท่านั้น (ไม่รับ GIF)
  const [avatarRawUrl, setAvatarRawUrl] = useState<string | null>(null);
  const [avatarRawBase64, setAvatarRawBase64] = useState<string | null>(null);
  const [avatarSizeKB, setAvatarSizeKB] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
    if (isGifFile(file)) {
      setErrorMsg('ไม่รองรับไฟล์ GIF ครับ กรุณาเลือกหรือวางเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกหรือวางเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP) เท่านั้นครับ');
      return;
    }

    setErrorMsg(null);
    try {
      const raw = await readImageFile(file);
      setAvatarRawUrl(raw.rawDataUrl);
      setAvatarRawBase64(raw.rawBase64);
      setAvatarSizeKB(raw.sizeKB);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } catch {
      setErrorMsg('ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ กรุณาลองใหม่อีกครั้งครับ');
    }
  }, []);

  useEffect(() => {
    if (mode !== 'register' || currentUser) return;

    const handlePaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      if (clipboardData.files && clipboardData.files.length > 0) {
        const file = clipboardData.files[0];
        e.preventDefault();
        applyAvatarFile(file);
        return;
      }

      if (clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          if (item.kind === 'file') {
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
        if (item.types.includes('image/gif')) {
          setErrorMsg('ไม่รองรับไฟล์ GIF ครับ กรุณาก๊อปปี้เฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP)');
          return;
        }
        const imgType = item.types.find((t) => t.startsWith('image/'));
        if (imgType) {
          const blob = await item.getType(imgType);
          const file = new File([blob], 'pasted-avatar.png', { type: imgType });
          await applyAvatarFile(file);
          return;
        }
      }
      setErrorMsg('ไม่พบรูปภาพในคลิปบอร์ด ลองก๊อปปี้รูปภาพแล้วกดวางอีกครั้งครับ');
    } catch {
      setErrorMsg('กด Ctrl + V (หรือ Cmd + V) เพื่อวางรูปภาพได้โดยตรงครับ');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await applyAvatarFile(file);
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    setAvatarRawUrl(null);
    setAvatarRawBase64(null);
    setAvatarSizeKB(0);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!avatarRawUrl) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const nextX = Math.max(-45, Math.min(45, e.clientX - dragStart.x));
    const nextY = Math.max(-45, Math.min(45, e.clientY - dragStart.y));
    setOffset({ x: nextX, y: nextY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const uploadAvatarToImgBB = async (): Promise<string | null> => {
    if (!avatarRawUrl) return null;

    let base64ToUpload = avatarRawBase64;
    try {
      const cropped = await cropImageToCircleBase64(
        avatarRawUrl,
        zoom,
        offset.x,
        offset.y,
        360,
        84
      );
      if (cropped.base64Clean) {
        base64ToUpload = cropped.base64Clean;
      }
    } catch {
      base64ToUpload = avatarRawBase64;
    }

    if (!base64ToUpload) return null;

    try {
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64ToUpload);
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
        if (avatarRawUrl) {
          uploadedAvatarUrl = await uploadAvatarToImgBB();
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim() || email.split('@')[0],
              avatar_url: uploadedAvatarUrl,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message || 'ไม่สามารถสร้างบัญชีได้ กรุณาตรวจสอบอีเมลและรหัสผ่านครับ');
          setLoading(false);
          return;
        }

        if (data.session) {
          setCurrentUser(data.session.user);
        } else if (data.user) {
          setCurrentUser(data.user);
        }

        setSuccessMsg('สร้างบัญชีสมาชิกสำเร็จแล้วครับ!');
        setLoading(false);

        triggerGifLoader('สร้างบัญชีสำเร็จ! กำลังพากลับสู่หน้าร้าน...', 850, () => {
          router.push('/');
          router.refresh();
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งครับ');
          setLoading(false);
          return;
        }

        if (data.session?.user) {
          setCurrentUser(data.session.user);
        }

        setSuccessMsg('เข้าสู่ระบบสำเร็จแล้วครับ!');
        setLoading(false);

        triggerGifLoader('กำลังเข้าสู่ระบบเทรนเนอร์...', 800, () => {
          router.push('/');
          router.refresh();
        });
      }
    } catch {
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งครับ');
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-slate-900 flex flex-col justify-between">
      {/* หน้าโหลดสีสดใสพร้อมสลับ GIF */}
      {isLoadingScreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-400 p-6 text-white">
          <div className="w-full max-w-xs rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 p-5 shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="loader-gif-box rounded-2xl bg-white shadow-lg border-2 border-white overflow-hidden shrink-0">
              <img
                src={LOADING_GIFS[loadingGifIdx]}
                alt="กำลังโหลด"
                className="loader-gif-img"
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

      {/* CSS ล็อกขนาดรูปภาพและไอคอนด้วย !important ไม่ให้ยืดหรือเพี้ยนตาม globals.css */}
      <style jsx>{`
        svg {
          max-width: 22px !important;
          max-height: 22px !important;
          display: inline-block;
          flex-shrink: 0;
        }
        .loader-gif-box {
          width: 140px !important;
          height: 140px !important;
        }
        .loader-gif-img {
          width: 140px !important;
          height: 140px !important;
          max-width: 140px !important;
          max-height: 140px !important;
          object-fit: cover !important;
        }
        .avatar-circle-box {
          width: 84px !important;
          height: 84px !important;
          min-width: 84px !important;
          min-height: 84px !important;
          max-width: 84px !important;
          max-height: 84px !important;
          border-radius: 9999px !important;
          overflow: hidden !important;
        }
        .avatar-circle-img {
          width: 84px !important;
          height: 84px !important;
          min-width: 84px !important;
          min-height: 84px !important;
          max-width: 84px !important;
          max-height: 84px !important;
          object-fit: cover !important;
          border-radius: 9999px !important;
        }
        .profile-badge-box {
          width: 60px !important;
          height: 60px !important;
          min-width: 60px !important;
          min-height: 60px !important;
          border-radius: 9999px !important;
          overflow: hidden !important;
        }
        .profile-badge-img {
          width: 60px !important;
          height: 60px !important;
          max-width: 60px !important;
          max-height: 60px !important;
          object-fit: cover !important;
        }
      `}</style>

      {/* แถบเมนูด้านบน */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              triggerGifLoader('กำลังกลับหน้าร้าน Tracen Collectibles...', 650, () => {
                router.push('/');
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับหน้าร้าน</span>
          </button>

          <div className="flex items-center gap-2 text-white">
            <span className="h-6 w-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
              U
            </span>
            <span className="text-xs font-bold tracking-tight">Tracen Collectibles</span>
          </div>
        </div>
      </header>

      {/* การ์ดเดี่ยวขนาดกะทัดรัดพอดีหน้าจอ ไม่ยืดยาว */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-[430px] rounded-3xl bg-white shadow-2xl border border-white/20 p-6 sm:p-7">
          {checkingSession ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-slate-500 text-xs">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span>กำลังตรวจสอบสถานะบัญชี...</span>
            </div>
          ) : currentUser ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="profile-badge-box bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-extrabold text-xl shadow-sm shrink-0">
                  {currentAvatarUrl ? (
                    <img
                      src={currentAvatarUrl}
                      alt={displayTitle}
                      className="profile-badge-img"
                    />
                  ) : (
                    displayTitle.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    เข้าสู่ระบบแล้ว
                  </span>
                  <h1 className="text-lg font-extrabold text-slate-900 truncate mt-1">
                    {displayTitle}
                  </h1>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 leading-relaxed">
                สามารถใช้อีเมลและรหัสผ่านนี้ล็อกอินบนอุปกรณ์อื่นได้ทันทีครับ
              </div>

              {successMsg && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() =>
                    triggerGifLoader('กำลังกลับหน้าร้าน...', 650, () => {
                      router.push('/');
                    })
                  }
                  className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-bold text-white transition active:scale-95"
                >
                  ไปเลือกช้อปของสะสมต่อ
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition active:scale-95 disabled:opacity-60"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* หัวข้อการ์ด */}
              <div className="text-center">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {mode === 'login' ? 'เข้าสู่ระบบเทรนเนอร์' : 'สมัครสมาชิกใหม่'}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === 'login'
                    ? 'เข้าสู่ระบบเพื่อใช้งานบัญชีข้ามอุปกรณ์'
                    : 'สร้างบัญชีฟรี พร้อมรูปโปรไฟล์วงกลม'}
                </p>
              </div>

              {/* แถบสลับแท็บ */}
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    mode === 'login'
                      ? 'bg-white text-emerald-700 shadow-xs'
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
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    mode === 'register'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  สมัครสมาชิกใหม่
                </button>
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-semibold flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* กรอบรูปโปรไฟล์วงกลมแบบกะทัดรัด (เฉพาะภาพนิ่ง ไม่รับ GIF) */}
                {mode === 'register' && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col items-center text-center gap-2.5">
                    <div className="relative">
                      {avatarRawUrl ? (
                        <div
                          onPointerDown={handlePointerDown}
                          onPointerMove={handlePointerMove}
                          onPointerUp={handlePointerUp}
                          style={{ touchAction: 'none' }}
                          className="avatar-circle-box relative border-2 border-emerald-500 bg-white shadow-xs cursor-grab active:cursor-grabbing select-none"
                          title="ลากเพื่อเลื่อนตำแหน่งภาพในวงกลม"
                        >
                          <img
                            src={avatarRawUrl}
                            alt="ตัวอย่างรูปโปรไฟล์"
                            draggable={false}
                            className="avatar-circle-img"
                            style={{
                              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                              transformOrigin: 'center center',
                            }}
                          />
                        </div>
                      ) : (
                        <label
                          className="avatar-circle-box border-2 border-dashed border-emerald-400 bg-white flex items-center justify-center cursor-pointer hover:border-emerald-600 transition"
                          title="แตะเพื่อเลือกรูปภาพ"
                        >
                          <ImagePlus className="h-6 w-6 text-emerald-600" />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      )}

                      {avatarRawUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          style={{ width: '22px', height: '22px' }}
                          className="absolute -top-1 -right-1 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-sm hover:bg-rose-700"
                          title="ลบรูป"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 w-full">
                      <p className="text-[11px] font-bold text-slate-700">
                        รูปโปรไฟล์ (เฉพาะภาพ JPG / PNG / WEBP)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {avatarRawUrl
                          ? `ลากในวงกลมเพื่อเลื่อนตำแหน่งได้ (${avatarSizeKB} KB)`
                          : 'แตะวงกลมด้านบนหรือกด Ctrl + V วางรูปได้เลย'}
                      </p>

                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={handlePasteFromClipboardButton}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-100 hover:bg-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-800 transition"
                        >
                          <ClipboardPaste className="h-3 w-3" />
                          <span>วางรูปจากคลิปบอร์ด</span>
                        </button>
                      </div>
                    </div>

                    {avatarRawUrl && (
                      <div className="w-full pt-2 border-t border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-600">
                        <ZoomIn className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <input
                          type="range"
                          min={1}
                          max={2.4}
                          step={0.05}
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="flex-1 accent-emerald-600 cursor-pointer h-1.5"
                          aria-label="ซูมรูปโปรไฟล์"
                        />
                        <span className="font-mono font-bold text-slate-700 w-8 text-right">
                          {zoom.toFixed(1)}x
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setZoom(1);
                            setOffset({ x: 0, y: 0 });
                          }}
                          className="inline-flex items-center gap-0.5 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:text-emerald-700"
                        >
                          <RotateCcw className="h-2.5 w-2.5" />
                          <span>รีเซ็ต</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ชื่อเทรนเนอร์
                    </label>
                    <div className="relative">
                      <UserCircle2 className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="เช่น สเปเชียล เท็น หรือ เทรนเนอร์ซากุระ"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3.5 py-2 text-sm focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    อีเมล
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="trainer.tracen@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3.5 py-2 text-sm focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 py-2 text-sm focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
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
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-60 mt-1"
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
      </main>

      <footer className="py-3.5 px-4 text-center text-[11px] text-emerald-200/70">
        Tracen Collectibles • ระบบบัญชีสมาชิกข้ามอุปกรณ์ผ่าน Supabase
      </footer>
    </div>
  );
}
