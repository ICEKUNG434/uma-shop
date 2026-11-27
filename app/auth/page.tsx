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
  Plus,
  MoreVertical,
  Trash2,
} from 'lucide-react';

const UI_VERSION = 'v5.6';
const IMGBB_API_KEY = 'f9b2ed4e3933997a26d3ebd8799b306e';
const SUPABASE_URL = 'https://jwujhkuudfqpitouiqnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EJM1vWSsz9qNrjRg20lx8A_M-FxsBMq';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const LOADING_GIFS = [
  'https://c.tenor.com/ztf7c4o4fFQAAAAC/tenor.gif',
  'https://media1.tenor.com/m/Gn9gXQJfkVMAAAAC/awful-umamusume.gif',
];

const SAMPLE_TRAINER_NAMES = [
  'TazunaHayakawa',
  'SpecialWeek01',
  'TokaiTeio',
  'OguriCap',
  'เทรนเนอร์ซากุระ',
];

interface SavedTrainerProfile {
  name: string;
  email: string;
  avatar: string | null;
}

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
  outputSize = 256,
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

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputSize, outputSize);

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

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
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

  const [savedProfiles, setSavedProfiles] = useState<SavedTrainerProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<SavedTrainerProfile | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [openMenuEmail, setOpenMenuEmail] = useState<string | null>(null);

  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [loadingGifIdx, setLoadingGifIdx] = useState(0);
  const [loadingText, setLoadingText] = useState('กำลังเปิดหน้าเลือกผู้ใช้งาน...');

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [trainerName, setTrainerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [croppedAvatarUrl, setCroppedAvatarUrl] = useState<string | null>(null);
  const [croppedAvatarBase64, setCroppedAvatarBase64] = useState<string | null>(null);

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

  const loadSavedProfiles = useCallback(() => {
    try {
      const raw = localStorage.getItem('tracen_saved_profiles');
      const list: SavedTrainerProfile[] = raw ? JSON.parse(raw) : [];
      setSavedProfiles(list);
      if (list.length > 0) {
        setShowAuthForm(false);
      } else {
        setShowAuthForm(true);
        setMode('register');
      }
    } catch {
      setSavedProfiles([]);
      setShowAuthForm(true);
    }
  }, []);

  const saveProfileToDirectory = useCallback(
    (name: string, emailVal: string, avatarVal: string | null) => {
      try {
        const raw = localStorage.getItem('tracen_saved_profiles');
        const list: SavedTrainerProfile[] = raw ? JSON.parse(raw) : [];
        const filtered = list.filter(
          (p) => p.email.toLowerCase() !== emailVal.toLowerCase()
        );
        const updated = [{ name, email: emailVal, avatar: avatarVal }, ...filtered].slice(0, 6);
        localStorage.setItem('tracen_saved_profiles', JSON.stringify(updated));
        setSavedProfiles(updated);

        const rawMap = localStorage.getItem('tracen_trainer_directory');
        const map = rawMap ? JSON.parse(rawMap) : {};
        map[name.toLowerCase()] = emailVal;
        localStorage.setItem('tracen_trainer_directory', JSON.stringify(map));
      } catch {
        // ignore
      }
    },
    []
  );

  const handleDeleteSavedProfile = (targetEmail: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = savedProfiles.filter(
      (p) => p.email.toLowerCase() !== targetEmail.toLowerCase()
    );
    setSavedProfiles(next);
    localStorage.setItem('tracen_saved_profiles', JSON.stringify(next));
    setOpenMenuEmail(null);
    if (next.length === 0) {
      setShowAuthForm(true);
      setMode('register');
    }
  };

  useEffect(() => {
    setLoadingGifIdx(Math.floor(Math.random() * LOADING_GIFS.length));
    loadSavedProfiles();
    const timer = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [loadSavedProfiles]);

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
    if (mode !== 'register' || currentUser || !showAuthForm) return;

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
  }, [mode, currentUser, showAuthForm, openCropPopupWithFile]);

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
        256,
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
    setTrainerName(random);
  };

  const handleSelectProfileCard = (profile: SavedTrainerProfile) => {
    setSelectedProfile(profile);
    setTrainerName(profile.name);
    setPassword('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setMode('login');
    setShowAuthForm(true);
  };

  const handleClickAddProfile = () => {
    setSelectedProfile(null);
    setTrainerName('');
    setEmail('');
    setPassword('');
    setCroppedAvatarUrl(null);
    setCroppedAvatarBase64(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setMode('register');
    setShowAuthForm(true);
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

    const cleanName = trainerName.trim();
    if (!cleanName) {
      setErrorMsg('กรุณากรอกชื่อเทรนเนอร์ครับ');
      return;
    }

    if (mode === 'register') {
      const cleanEmail = email.trim();
      if (!cleanEmail) {
        setErrorMsg('กรุณากรอกอีเมลครับ');
        return;
      }

      setLoading(true);

      try {
        let uploadedAvatarUrl: string | null = null;
        if (croppedAvatarBase64) {
          uploadedAvatarUrl = await uploadAvatarToImgBB();
        }

        const finalAvatar = uploadedAvatarUrl || croppedAvatarUrl || null;

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              display_name: cleanName,
              avatar_url: finalAvatar,
              bio: 'เทรนเนอร์นักสะสมแห่งสถาบันเทรเซน',
            },
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes('already registered')) {
            setErrorMsg('อีเมลนี้ถูกใช้สมัครสมาชิกแล้วครับ');
          } else {
            setErrorMsg(error.message || 'ไม่สามารถสร้างบัญชีได้ กรุณาตรวจสอบข้อมูลอีกครั้งครับ');
          }
          setLoading(false);
          return;
        }

        saveProfileToDirectory(cleanName, cleanEmail, finalAvatar);
        if (finalAvatar) {
          localStorage.setItem('tracen_cached_avatar', finalAvatar);
        }
        localStorage.setItem('tracen_cached_name', cleanName);

        if (data.session) {
          setCurrentUser(data.session.user);
        } else if (data.user) {
          setCurrentUser(data.user);
        }

        setSuccessMsg('สร้างบัญชีสำเร็จ! กำลังพากลับหน้าแรก...');
        setLoading(false);

        triggerGifLoader('สมัครสมาชิกสำเร็จ! กำลังเข้าสู่หน้าแรก...', 750, () => {
          router.push('/');
        });
      } catch {
        setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งครับ');
        setLoading(false);
      }
    } else {
      setLoading(true);

      let targetEmail = selectedProfile?.email || '';
      if (!targetEmail) {
        if (cleanName.includes('@')) {
          targetEmail = cleanName;
        } else {
          try {
            const rawMap = localStorage.getItem('tracen_trainer_directory');
            const map = rawMap ? JSON.parse(rawMap) : {};
            targetEmail = map[cleanName.toLowerCase()] || '';
          } catch {
            targetEmail = '';
          }
        }
      }

      if (!targetEmail) {
        setErrorMsg('ไม่พบชื่อเทรนเนอร์นี้ในระบบ กรุณาสมัครสมาชิกใหม่ก่อนครับ');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password,
        });

        if (error) {
          setErrorMsg('ชื่อเทรนเนอร์หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งครับ');
          setLoading(false);
          return;
        }

        if (data.session?.user) {
          setCurrentUser(data.session.user);
          const userMeta = data.session.user.user_metadata;
          const resolvedName = userMeta?.display_name || cleanName;
          const resolvedAvatar = userMeta?.avatar_url || selectedProfile?.avatar || null;
          if (resolvedAvatar) {
            localStorage.setItem('tracen_cached_avatar', resolvedAvatar);
          }
          localStorage.setItem('tracen_cached_name', resolvedName);
          saveProfileToDirectory(resolvedName, targetEmail, resolvedAvatar);
        }

        setSuccessMsg('เข้าสู่ระบบสำเร็จ! กำลังพากลับหน้าแรก...');
        setLoading(false);

        triggerGifLoader('กำลังเข้าสู่หน้าแรก...', 700, () => {
          router.push('/');
        });
      } catch {
        setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งครับ');
        setLoading(false);
      }
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('tracen_cached_avatar');
    localStorage.removeItem('tracen_cached_name');
    setCurrentUser(null);
    setSelectedProfile(null);
    loadSavedProfiles();
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
        background: 'linear-gradient(135deg, #061814 0%, #06372b 50%, #0b1324 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* หน้าโหลดโทนมืดกระจกพรีเมียม */}
      {isLoadingScreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'radial-gradient(circle at 50% 35%, #064e3b 0%, #041813 55%, #070d17 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(16px)',
              borderRadius: '28px',
              border: '1px solid rgba(110, 231, 183, 0.22)',
              padding: '24px 28px',
              width: '250px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              textAlign: 'center',
              color: '#f8fafc',
              boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.65)',
            }}
          >
            <div
              style={{
                width: '108px',
                height: '108px',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '2px solid rgba(52, 211, 153, 0.55)',
                background: '#0f172a',
                boxShadow: '0 0 24px rgba(16, 185, 129, 0.25)',
              }}
            >
              <img
                src={LOADING_GIFS[loadingGifIdx]}
                alt="loading"
                style={{ width: '108px', height: '108px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  margin: 0,
                  color: '#ecfdf5',
                }}
              >
                {loadingText}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span
                  className="animate-bounce"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '9999px',
                    background: '#34d399',
                    animationDelay: '0ms',
                  }}
                />
                <span
                  className="animate-bounce"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '9999px',
                    background: '#34d399',
                    animationDelay: '150ms',
                  }}
                />
                <span
                  className="animate-bounce"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '9999px',
                    background: '#34d399',
                    animationDelay: '300ms',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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

      <header
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '860px',
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

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 16px',
        }}
      >
        {checkingSession ? (
          <div style={{ color: '#a7f3d0', fontSize: '13px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" style={{ width: '28px', height: '28px', margin: '0 auto 8px' }} />
            <span>กำลังตรวจสอบบัญชี...</span>
          </div>
        ) : currentUser ? (
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              background: '#ffffff',
              borderRadius: '28px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
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
                    style={{ width: '62px', height: '62px', objectFit: 'cover', display: 'block' }}
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
                  กำลังใช้งานบัญชีนี้
                </span>
                <h1
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: '4px 0 0 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayTitle}
                </h1>
              </div>
            </div>

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
              <span>ออกจากระบบ / สลับผู้ใช้งาน</span>
            </button>
          </div>
        ) : !showAuthForm && savedProfiles.length > 0 ? (
          <div style={{ width: '100%', maxWidth: '820px', textAlign: 'center', color: '#ffffff' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#0f172a',
                fontWeight: 900,
                fontSize: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.35)',
              }}
            >
              U
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0' }}>
              เลือกบัญชีเทรนเนอร์ที่ต้องการใช้งาน
            </h1>
            <p style={{ fontSize: '13px', color: '#a7f3d0', margin: '0 0 28px 0' }}>
              แตะที่การ์ดผู้ใช้งานเพื่อเข้าสู่ระบบทันที หรือกดเพิ่มบัญชีสมาชิกใหม่
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '16px',
              }}
            >
              {savedProfiles.map((profile) => (
                <div
                  key={profile.email}
                  onClick={() => handleSelectProfileCard(profile)}
                  style={{
                    width: '165px',
                    height: '205px',
                    borderRadius: '18px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    backdropFilter: 'blur(10px)',
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.2s ease, background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuEmail((prev) =>
                        prev === profile.email ? null : profile.email
                      );
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.65)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title="ตัวเลือกบัญชี"
                  >
                    <MoreVertical style={{ width: '15px', height: '15px' }} />
                  </button>

                  {openMenuEmail === profile.email && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        top: '34px',
                        right: '10px',
                        background: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
                        padding: '4px',
                        zIndex: 20,
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSavedProfile(profile.email, e)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#e11d48',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Trash2 style={{ width: '13px', height: '13px' }} />
                        <span>ลบออกจากรายการ</span>
                      </button>
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: '6px 0 0 0',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      padding: '0 14px',
                    }}
                  >
                    {profile.name}
                  </p>

                  <div
                    style={{
                      width: '86px',
                      height: '86px',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
                      border: '3px solid rgba(255,255,255,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      fontWeight: 800,
                      color: '#ffffff',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        style={{
                          width: '86px',
                          height: '86px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      profile.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <span style={{ fontSize: '10px', color: '#6ee7b7', fontWeight: 600 }}>
                    แตะเพื่อเข้าสู่ระบบ
                  </span>
                </div>
              ))}

              <div
                onClick={handleClickAddProfile}
                style={{
                  width: '165px',
                  height: '205px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1.5px dashed rgba(255, 255, 255, 0.28)',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#34d399';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', margin: '6px 0 0 0' }}>
                  สมัคร / เพิ่มบัญชี
                </p>

                <div
                  style={{
                    width: '86px',
                    height: '86px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Plus style={{ width: '32px', height: '32px' }} />
                </div>

                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                  สร้างบัญชีใหม่
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
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

              {savedProfiles.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthForm(false);
                    setSelectedProfile(null);
                    setErrorMsg(null);
                  }}
                  style={{
                    border: '1px solid rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  เลือกโปรไฟล์อื่น
                </button>
              ) : (
                <Shield style={{ width: '20px', height: '20px', color: '#fde68a' }} />
              )}
            </div>

            <div style={{ padding: '24px' }}>
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
                      setSelectedProfile(null);
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

                {mode === 'login' && selectedProfile && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      paddingTop: '2px',
                    }}
                  >
                    <div
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        border: '3px solid #10b981',
                        background: '#059669',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        fontWeight: 800,
                      }}
                    >
                      {selectedProfile.avatar ? (
                        <img
                          src={selectedProfile.avatar}
                          alt={selectedProfile.name}
                          style={{
                            width: '74px',
                            height: '74px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        selectedProfile.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                      {selectedProfile.name}
                    </span>
                  </div>
                )}

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
                      {mode === 'register' && (
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
                      )}
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
                        placeholder="เช่น TazunaHayakawa หรือ สเปเชียล เท็น"
                        value={trainerName}
                        onChange={(e) => setTrainerName(e.target.value)}
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

                  {mode === 'register' && (
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
            </div>
          </div>
        )}
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
