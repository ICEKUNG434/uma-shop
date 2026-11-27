'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, User } from '@supabase/supabase-js';
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowLeft,
  Loader2,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  Clipboard,
  X,
  ZoomIn,
  RotateCcw,
  Crop,
  Check,
  Wand2,
  Shield,
} from 'lucide-react';

const UI_VERSION = 'v5.0';
const IMGBB_API_KEY = 'f9b2ed4e3933997a26d3ebd8799b306e';
const SUPABASE_URL = 'https://jwujhkuudfqpitouiqnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EJM1vWSsz9qNrjRg20lx8A_M-FxsBMq';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const LOADING_GIFS = [
  'https://c.tenor.com/ztf7c4o4fFQAAAAC/tenor.gif',
  'https://media1.tenor.com/m/Gn9gXQJfkVMAAAAC/awful-umamusume.gif',
];

const SAMPLE_TRAINER_NAMES = [
  'เทรนเนอร์ซากุระ',
  'สเปเชียล เท็น',
  'ทีมสปิก้า 01',
  'เทรนเนอร์คาเฟ่',
  'นักสะสมเทรเซน',
];

function isGifFile(file: File): boolean {
  return file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
}

function readImageFile(file: File): Promise<{ rawDataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve({ rawDataUrl: (event.target?.result as string) || '' });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cropImageToCircle(
  imageSrc: string,
  zoom: number,
  offsetX: number,
  offsetY: number,
  outputSize = 360,
  cropBoxSize = 210
): Promise<{ dataUrl: string; base64Clean: string }> {
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

      const scaleFactor = outputSize / cropBoxSize;
      const baseScale = Math.max(outputSize / img.width, outputSize / img.height);
      const drawW = img.width * baseScale * zoom;
      const drawH = img.height * baseScale * zoom;
      const drawX = outputSize / 2 - drawW / 2 + offsetX * scaleFactor;
      const drawY = outputSize / 2 - drawH / 2 + offsetY * scaleFactor;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/png', 0.9);
      const base64Clean = dataUrl.split(',')[1] || '';
      resolve({ dataUrl, base64Clean });
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
  const [loadingText, setLoadingText] = useState('กำลังเปิดระบบสมาชิก...');

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // รูปโปรไฟล์ที่ตัดกรอบวงกลมเสร็จแล้ว
  const [croppedAvatarUrl, setCroppedAvatarUrl] = useState<string | null>(null);
  const [croppedAvatarBase64, setCroppedAvatarBase64] = useState<string | null>(null);

  // Pop-up ตัดกรอบรูปวงกลม
  const [rawImageToCrop, setRawImageToCrop] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
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
    }, 600);
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

  const openCropPopupWithFile = useCallback(async (file: File) => {
    if (isGifFile(file)) {
      setErrorMsg('ไม่รองรับไฟล์ GIF ครับ กรุณาเลือกเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP) เท่านั้นครับ');
      return;
    }

    setErrorMsg(null);
    try {
      const { rawDataUrl } = await readImageFile(file);
      setRawImageToCrop(rawDataUrl);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setIsCropModalOpen(true);
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
        openCropPopupWithFile(file);
        return;
      }

      if (clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) {
              e.preventDefault();
              openCropPopupWithFile(file);
              return;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [mode, currentUser, openCropPopupWithFile]);

  const handlePasteButton = async () => {
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
          await openCropPopupWithFile(file);
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
    await openCropPopupWithFile(file);
    e.target.value = '';
  };

  const handleConfirmCrop = async () => {
    if (!rawImageToCrop) return;
    try {
      const { dataUrl, base64Clean } = await cropImageToCircle(
        rawImageToCrop,
        zoom,
        offset.x,
        offset.y,
        360,
        210
      );
      setCroppedAvatarUrl(dataUrl);
      setCroppedAvatarBase64(base64Clean);
      setIsCropModalOpen(false);
    } catch {
      setErrorMsg('ไม่สามารถตัดกรอบรูปได้ กรุณาลองใหม่อีกครั้งครับ');
    }
  };

  const handleRemoveAvatar = () => {
    setCroppedAvatarUrl(null);
    setCroppedAvatarBase64(null);
    setRawImageToCrop(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const nextX = Math.max(-105, Math.min(105, e.clientX - dragStart.x));
    const nextY = Math.max(-105, Math.min(105, e.clientY - dragStart.y));
    setOffset({ x: nextX, y: nextY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleRandomName = () => {
    const random =
      SAMPLE_TRAINER_NAMES[Math.floor(Math.random() * SAMPLE_TRAINER_NAMES.length)];
    setDisplayName(random);
  };

  const uploadAvatarToImgBB = async (): Promise<string | null> => {
    if (!croppedAvatarBase64) return null;
    try {
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', croppedAvatarBase64);
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
    } catch {
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
        if (croppedAvatarBase64) {
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
          setErrorMsg(error.message || 'ไม่สามารถสร้างบัญชีได้ กรุณาตรวจสอบข้อมูลอีกครั้งครับ');
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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 45%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* หน้าโหลดสีสดใสพร้อมสลับ GIF */}
      {isLoadingScreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.45)',
              padding: '20px',
              width: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: '136px',
                height: '136px',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '2px solid #ffffff',
                background: '#ffffff',
              }}
            >
              <img
                src={LOADING_GIFS[loadingGifIdx]}
                alt="loading"
                style={{ width: '136px', height: '136px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>{loadingText}</p>
              <p style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>
                Tracen Collectibles {UI_VERSION}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up ตัดกรอบรูปวงกลม */}
      {isCropModalOpen && rawImageToCrop && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(2, 6, 23, 0.82)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '22px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crop style={{ width: '18px', height: '18px', color: '#059669' }} />
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  ตัดกรอบรูปโปรไฟล์
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  width: '210px',
                  height: '210px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  border: '4px solid #10b981',
                  background: '#0f172a',
                  position: 'relative',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              >
                <img
                  src={rawImageToCrop}
                  alt="crop-preview"
                  draggable={false}
                  style={{
                    width: '210px',
                    height: '210px',
                    maxWidth: '210px',
                    maxHeight: '210px',
                    objectFit: 'cover',
                    display: 'block',
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                ลากภาพในวงกลมเพื่อเลื่อนตำแหน่ง และปรับแถบซูมด้านล่าง
              </p>
            </div>

            <div
              style={{
                marginTop: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <ZoomIn style={{ width: '16px', height: '16px', color: '#059669', flexShrink: 0 }} />
              <input
                type="range"
                min={1}
                max={2.6}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: '#059669', cursor: 'pointer' }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#334155',
                  width: '34px',
                  textAlign: 'right',
                }}
              >
                {zoom.toFixed(1)}x
              </span>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setOffset({ x: 0, y: 0 });
                }}
                style={{
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  borderRadius: '9999px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#475569',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw style={{ width: '11px', height: '11px' }} />
                <span>รีเซ็ต</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmCrop}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#059669',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Check style={{ width: '15px', height: '15px' }} />
                <span>ใช้รูปนี้</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* แถบเมนูด้านบน */}
      <header
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            padding: '0 16px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={() =>
              triggerGifLoader('กำลังกลับหน้าร้าน...', 600, () => {
                router.push('/');
              })
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            <span>กลับหน้าร้าน</span>
          </button>

          <span
            style={{
              borderRadius: '9999px',
              background: 'rgba(251, 191, 36, 0.2)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#fde68a',
            }}
          >
            TRACEN ID {UI_VERSION}
          </span>
        </div>
      </header>

      {/* กล่องกลางใบเดียวขนาดพอดีจอ */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '410px',
            background: '#ffffff',
            borderRadius: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              padding: '18px 24px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '11px',
                  background: '#fbbf24',
                  color: '#0f172a',
                  fontWeight: 900,
                  fontSize: '17px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                U
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
                  Tracen Collectibles
                </p>
                <p style={{ fontSize: '11px', color: '#d1fae5', margin: '3px 0 0 0' }}>
                  Trainer Account Portal
                </p>
              </div>
            </div>
            <Shield style={{ width: '20px', height: '20px', color: '#fde68a' }} />
          </div>

          <div style={{ padding: '24px' }}>
            {checkingSession ? (
              <div
                style={{
                  padding: '40px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#64748b',
                  fontSize: '12px',
                }}
              >
                <Loader2
                  className="animate-spin"
                  style={{ width: '24px', height: '24px', color: '#059669' }}
                />
                <span>กำลังตรวจสอบบัญชี...</span>
              </div>
            ) : currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '62px',
                      height: '62px',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      background: '#059669',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {currentAvatarUrl ? (
                      <img
                        src={currentAvatarUrl}
                        alt={displayTitle}
                        style={{
                          width: '62px',
                          height: '62px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      displayTitle.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#047857',
                        borderRadius: '9999px',
                        padding: '2px 10px',
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      เข้าสู่ระบบแล้ว
                    </span>
                    <h1
                      style={{
                        fontSize: '17px',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: '4px 0 2px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayTitle}
                    </h1>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                {successMsg && (
                  <div
                    style={{
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#065f46',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                    <span>{successMsg}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    triggerGifLoader('กำลังกลับหน้าร้าน...', 600, () => {
                      router.push('/');
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '16px',
                    border: 'none',
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ไปเลือกช้อปของสะสมต่อ
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '16px',
                    border: '1px solid #fecdd3',
                    background: '#fff1f2',
                    color: '#be123c',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut style={{ width: '15px', height: '15px' }} />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                    background: '#f1f5f9',
                    padding: '4px',
                    borderRadius: '16px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: mode === 'login' ? '#ffffff' : 'transparent',
                      color: mode === 'login' ? '#047857' : '#64748b',
                      boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
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
                    style={{
                      padding: '8px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: mode === 'register' ? '#ffffff' : 'transparent',
                      color: mode === 'register' ? '#047857' : '#64748b',
                      boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    สมัครสมาชิกใหม่
                  </button>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#be123c',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle
                      style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '1px' }}
                    />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div
                    style={{
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#065f46',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <CheckCircle2
                      style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '1px' }}
                    />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  {mode === 'register' && (
                    <>
                      {croppedAvatarUrl ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                          <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                            <div
                              onClick={() => {
                                if (rawImageToCrop) setIsCropModalOpen(true);
                              }}
                              title="แตะเพื่อตัดกรอบรูปใหม่"
                              style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: '9999px',
                                overflow: 'hidden',
                                border: '3px solid #10b981',
                                background: '#ffffff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                                cursor: 'pointer',
                              }}
                            >
                              <img
                                src={croppedAvatarUrl}
                                alt="avatar"
                                style={{
                                  width: '90px',
                                  height: '90px',
                                  maxWidth: '90px',
                                  maxHeight: '90px',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                            </div>

                            {rawImageToCrop && (
                              <button
                                type="button"
                                onClick={() => setIsCropModalOpen(true)}
                                title="ตัดกรอบรูปใหม่"
                                style={{
                                  position: 'absolute',
                                  bottom: '-2px',
                                  left: '-2px',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '9999px',
                                  border: '2px solid #ffffff',
                                  background: '#059669',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <Crop style={{ width: '13px', height: '13px' }} />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              title="ลบรูป"
                              style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                width: '26px',
                                height: '26px',
                                borderRadius: '9999px',
                                border: '2px solid #ffffff',
                                background: '#e11d48',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <X style={{ width: '13px', height: '13px' }} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            borderRadius: '18px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <label
                            title="แตะเพื่อเลือกรูปภาพ"
                            style={{
                              width: '54px',
                              height: '54px',
                              borderRadius: '9999px',
                              border: '2px dashed #10b981',
                              background: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                          >
                            <Camera style={{ width: '22px', height: '22px', color: '#059669' }} />
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleAvatarChange}
                              style={{ display: 'none' }}
                            />
                          </label>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                              }}
                            >
                              <span
                                style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}
                              >
                                รูปโปรไฟล์
                              </span>
                              <button
                                type="button"
                                onClick={handlePasteButton}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  borderRadius: '9999px',
                                  border: 'none',
                                  background: '#d1fae5',
                                  color: '#065f46',
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  flexShrink: 0,
                                }}
                              >
                                <Clipboard style={{ width: '12px', height: '12px' }} />
                                <span>วางรูป</span>
                              </button>
                            </div>
                            <p
                              style={{
                                fontSize: '11px',
                                color: '#64748b',
                                margin: '3px 0 0 0',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              แตะวงกลมหรือกด Ctrl + V วางรูปได้เลย
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {mode === 'register' && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '5px',
                        }}
                      >
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                          ชื่อเทรนเนอร์
                        </label>
                        <button
                          type="button"
                          onClick={handleRandomName}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#059669',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          <Wand2 style={{ width: '12px', height: '12px' }} />
                          <span>สุ่มชื่อเท่ๆ</span>
                        </button>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <UserIcon
                          style={{
                            position: 'absolute',
                            left: '14px',
                            top: '11px',
                            width: '16px',
                            height: '16px',
                            color: '#94a3b8',
                          }}
                        />
                        <input
                          type="text"
                          required
                          placeholder="เช่น สเปเชียล เท็น หรือ เทรนเนอร์ซากุระ"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            borderRadius: '14px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            padding: '9px 14px 9px 38px',
                            fontSize: '13px',
                            color: '#0f172a',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#475569',
                        marginBottom: '5px',
                      }}
                    >
                      อีเมล
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '11px',
                          width: '16px',
                          height: '16px',
                          color: '#94a3b8',
                        }}
                      />
                      <input
                        type="email"
                        required
                        placeholder="trainer.tracen@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          borderRadius: '14px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          padding: '9px 14px 9px 38px',
                          fontSize: '13px',
                          color: '#0f172a',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#475569',
                        marginBottom: '5px',
                      }}
                    >
                      รหัสผ่าน (6 ตัวอักษรขึ้นไป)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '11px',
                          width: '16px',
                          height: '16px',
                          color: '#94a3b8',
                        }}
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          borderRadius: '14px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          padding: '9px 38px 9px 38px',
                          fontSize: '13px',
                          color: '#0f172a',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '10px',
                          border: 'none',
                          background: 'transparent',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        {showPassword ? (
                          <EyeOff style={{ width: '16px', height: '16px' }} />
                        ) : (
                          <Eye style={{ width: '16px', height: '16px' }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      marginTop: '4px',
                      boxShadow: '0 8px 20px -4px rgba(5, 150, 105, 0.4)',
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2
                          className="animate-spin"
                          style={{ width: '16px', height: '16px' }}
                        />
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

      <footer
        style={{
          padding: '12px 16px',
          textAlign: 'center',
          fontSize: '11px',
          color: 'rgba(167, 243, 208, 0.7)',
        }}
      >
        Tracen Collectibles • ระบบบัญชีสมาชิกข้ามอุปกรณ์ผ่าน Supabase
      </footer>
    </div>
  );
}
