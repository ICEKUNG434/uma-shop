'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, User } from '@supabase/supabase-js';
import {
  Search,
  ShoppingBag,
  Star,
  ShieldCheck,
  PackageCheck,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  BadgeCheck,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Heart,
  Upload,
  CreditCard,
  ClipboardPaste,
  ArrowUp,
  Truck,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Home,
  Dices,
  ReceiptText,
  Zap,
  ExternalLink,
  UserCircle2,
  Edit3,
  LogOut,
  Camera,
  ZoomIn,
  Crop,
  Save,
  Award,
} from 'lucide-react';

const APP_VERSION = 'v3.7';
const WEB3FORMS_ACCESS_KEY = '138683be-375e-4dce-a38e-3037a33dbd6e';
const IMGBB_API_KEY = 'f9b2ed4e3933997a26d3ebd8799b306e';

const SUPABASE_URL = 'https://jwujhkuudfqpitouiqnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EJM1vWSsz9qNrjRg20lx8A_M-FxsBMq';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const LOADING_GIFS = [
  'https://c.tenor.com/ztf7c4o4fFQAAAAC/tenor.gif',
  'https://media1.tenor.com/m/Gn9gXQJfkVMAAAAC/awful-umamusume.gif',
];

const BANK_INFO = {
  bankName: 'ธนาคารกสิกรไทย (KBank)',
  accountNumber: '123-4-56789-0',
  accountName: 'Tracen Collectibles Official',
  promptPay: '081-234-5678',
};

interface Product {
  id: string;
  name: string;
  jpName: string;
  character: string;
  category: 'ฟิกเกอร์' | 'ตุ๊กตา' | 'พวงกุญแจ';
  price: number;
  status: 'พร้อมส่ง' | 'พรีออเดอร์' | 'สินค้าหมด';
  images: string[];
  brand: string;
  lot: string;
  size: string;
  material: string;
  condition: string;
  postedDate: string;
  updatedDate: string;
  rating: number;
  reviewsCount: number;
  description: string;
}

interface OrderRecord {
  orderId: string;
  date: string;
  customerName: string;
  itemsSummary: string;
  total: number;
  slipUrl: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'uma-001',
    name: 'ฟิกเกอร์ Special Week — ชุดแข่งมาตรฐาน',
    jpName: 'スペシャルウィーク',
    character: 'Special Week',
    category: 'ฟิกเกอร์',
    price: 1290,
    status: 'พร้อมส่ง',
    images: [
      'https://de.lnwfile.com/_/de/_raw/fs/ww/w0.jpg',
      'https://de.lnwfile.com/_/de/_raw/ud/1b/8u.jpg',
      'https://de.lnwfile.com/_/de/_raw/kn/33/nv.jpg',
      'https://de.lnwfile.com/_/de/_raw/ts/ui/az.jpg',
      'https://de.lnwfile.com/_/de/_raw/2g/m7/mq.jpg',
    ],
    brand: 'Banpresto (Bandai Spirits)',
    lot: 'ลิขสิทธิ์แท้ 100% (Lot JP มีสติ๊กเกอร์แมวทอง)',
    size: 'สูงประมาณ 18 ซม. (พร้อมฐานตั้งโชว์)',
    material: 'PVC / ABS ลงสีสำเร็จ',
    condition: 'มือ 1 ในซีล กล่องคม 100%',
    postedDate: '20 พ.ย. 2569',
    updatedDate: '20 พ.ย. 2569',
    rating: 4.9,
    reviewsCount: 38,
    description: 'ฟิกเกอร์ Special Week รายละเอียดคมชัด ลงสีไล่เฉดสวยงาม มาพร้อมฐานตั้งโชว์ในกล่อง เหมาะสำหรับตั้งสะสมหรือมอบเป็นของขวัญ',
  },
  {
    id: 'uma-002',
    name: 'ฟิกเกอร์ Tokai Teio — B-style',
    jpName: 'トウカイテイオー',
    character: 'Tokai Teio',
    category: 'ฟิกเกอร์',
    price: 1450,
    status: 'พร้อมส่ง',
    images: [
      'https://de.lnwfile.com/_/de/_raw/6h/6c/lr.jpg',
      'https://de.lnwfile.com/_/de/_raw/vs/7k/yy.jpg',
      'https://de.lnwfile.com/_/de/_raw/xd/hc/89.jpg',
      'https://de.lnwfile.com/_/de/_raw/b4/bf/bz.jpg',
      'https://de.lnwfile.com/_/de/_raw/m3/hd/tt.jpg',
    ],
    brand: 'Kotobukiya',
    lot: 'ลิขสิทธิ์แท้ 100% (Lot JP)',
    size: 'สูงประมาณ 21 ซม. (สเกล 1/7)',
    material: 'PVC / ABS',
    condition: 'มือ 1 ในซีล กล่องสวย',
    postedDate: '18 พ.ย. 2569',
    updatedDate: '20 พ.ย. 2569',
    rating: 5.0,
    reviewsCount: 24,
    description: 'โทไค เตโอ ในท่าโพสสุดร่าเริง เก็บรายละเอียดชุดแข่งและเครื่องประดับครบถ้วน',
  },
  {
    id: 'uma-003',
    name: 'ฟิกเกอร์ Oguri Cap — 1/7 Scale (Phat! Company)',
    jpName: 'オグリキャップ',
    character: 'Oguri Cap',
    category: 'ฟิกเกอร์',
    price: 7500,
    status: 'พร้อมส่ง',
    images: [
      'https://img.amiami.com/images/product/review/253/FIGURE-190728_08.jpg',
      'https://img.amiami.com/images/product/review/253/FIGURE-190728_10.jpg',
      'https://img.amiami.com/images/product/review/253/FIGURE-190728_12.jpg',
      'https://img.amiami.com/images/product/review/253/FIGURE-190728_13.jpg',
      'https://img.amiami.com/images/product/review/253/FIGURE-190728_14.jpg',
    ],
    brand: 'Phat! Company (Good Smile Company)',
    lot: 'ลิขสิทธิ์แท้ 100% (Lot JP)',
    size: 'สูงประมาณ 27 ซม. (สเกล 1/7 พร้อมฐานตั้งโชว์)',
    material: 'พลาสติก PVC / ABS ลงสีสำเร็จ',
    condition: 'มือ 1 ในซีล กล่องคม 100%',
    postedDate: '20 พ.ย. 2569',
    updatedDate: '20 พ.ย. 2569',
    rating: 4.9,
    reviewsCount: 51,
    description: 'ฟิกเกอร์สเกล 1/7 โอกุริ แคป จากค่าย Phat! Company (ปั้นต้นแบบโดย Masaki Yusuke) มาพร้อมชุดเครื่องแบบโรงเรียนเทรเซนรายละเอียดคมชัดและฐานตั้งโชว์ในกล่อง',
  },
  {
    id: 'uma-004',
    name: 'พวงกุญแจอะคริลิค Rice Shower — Acrylic Pinched (Game Ver.)',
    jpName: 'ライスシャワー',
    character: 'Rice Shower',
    category: 'พวงกุญแจ',
    price: 290,
    status: 'พร้อมส่ง',
    images: [
      'https://img.amiami.com/images/product/main/222/GOODS-04241403.jpg',
      'https://img.amiami.com/images/product/review/222/GOODS-04241403_01.jpg',
      'https://img.amiami.com/images/product/review/222/GOODS-04241403_02.jpg',
    ],
    brand: 'COSPA (Cygames Official)',
    lot: 'ลิขสิทธิ์แท้ 100% (Lot JP)',
    size: 'สูงประมาณ 6 ซม.',
    material: 'อะคริลิคใส พร้อมตะขอเกี่ยว สายคล้อง และจุกเสียบช่องหูฟัง',
    condition: 'มือ 1 ในซองซีลเดิม',
    postedDate: '20 พ.ย. 2569',
    updatedDate: '20 พ.ย. 2569',
    rating: 5.0,
    reviewsCount: 15,
    description: 'พวงกุญแจอะคริลิคลายจิบิ Rice Shower ซีรีส์ Tsumamare (โดนหนีบคอเสื้อ) จากค่าย COSPA มาพร้อมตะขอเกี่ยว สายคล้อง และพาร์ทจุกเสียบช่องหูฟัง 3.5 มม. สามารถถอดเปลี่ยนใช้งานได้หลากหลาย',
  },
];

const QUICK_CHARACTERS = ['ทั้งหมด', 'Special Week', 'Tokai Teio', 'Oguri Cap', 'Rice Shower'];

function compressSlipImage(
  file: File,
  maxWidth = 800,
  quality = 0.6
): Promise<{ dataUrl: string; base64Clean: string; sizeKB: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
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
        resolve({ dataUrl: compressedDataUrl, base64Clean, sizeKB });
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cropAvatarCircleHome(
  imageSrc: string,
  zoom: number,
  offsetX: number,
  offsetY: number,
  outputSize = 256,
  cropBoxSize = 190
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

export default function UmaShopPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cachedAvatar, setCachedAvatar] = useState<string | null>(null);

  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [loadingGifIdx, setLoadingGifIdx] = useState(0);
  const [loadingText, setLoadingText] = useState('กำลังโหลดร้าน Tracen Collectibles...');

  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [editAvatarBase64, setEditAvatarBase64] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [rawCropSrc, setRawCropSrc] = useState<string | null>(null);
  const [isHomeCropOpen, setIsHomeCropOpen] = useState(false);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStartCrop, setDragStartCrop] = useState({ x: 0, y: 0 });

  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedCharacter, setSelectedCharacter] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState<'ทั้งหมด' | 'พร้อมส่ง' | 'พรีออเดอร์'>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const [isRollingGacha, setIsRollingGacha] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([]);
  const [isOrdersLoaded, setIsOrdersLoaded] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [slipFileName, setSlipFileName] = useState<string | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [slipBase64, setSlipBase64] = useState<string | null>(null);
  const [slipSizeKB, setSlipSizeKB] = useState<number>(0);
  const [copiedBank, setCopiedBank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const triggerGifLoader = useCallback((text: string, durationMs = 700, onDone?: () => void) => {
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

  const syncUserToForm = useCallback((user: User | null) => {
    setCurrentUser(user);
    const localSavedAvatar =
      typeof window !== 'undefined' ? localStorage.getItem('tracen_cached_avatar') : null;
    if (localSavedAvatar) {
      setCachedAvatar(localSavedAvatar);
    }

    if (user) {
      const name = user.user_metadata?.display_name || user.email?.split('@')[0] || 'เทรนเนอร์';
      const bio = user.user_metadata?.bio || 'เทรนเนอร์นักสะสมแห่งสถาบันเทรเซน';
      const avatar = user.user_metadata?.avatar_url || localSavedAvatar || null;
      setCustomerName((prev) => prev || name);
      setEditName(name);
      setEditBio(bio);
      setEditAvatarPreview(avatar);
      setEditAvatarBase64(null);
      if (avatar && typeof window !== 'undefined') {
        localStorage.setItem('tracen_cached_avatar', avatar);
        setCachedAvatar(avatar);
      }
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUserToForm(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserToForm(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [syncUserToForm]);

  const activeAvatarUrl: string | null =
    currentUser?.user_metadata?.avatar_url || cachedAvatar || null;

  const handleProfileButtonClick = () => {
    if (currentUser) {
      setIsEditingProfile(false);
      setEditName(
        currentUser.user_metadata?.display_name ||
          currentUser.email?.split('@')[0] ||
          'เทรนเนอร์'
      );
      setEditBio(currentUser.user_metadata?.bio || 'เทรนเนอร์นักสะสมแห่งสถาบันเทรเซน');
      setEditAvatarPreview(activeAvatarUrl);
      setEditAvatarBase64(null);
      setIsProfileCardOpen(true);
    } else {
      triggerGifLoader('กำลังเปิดหน้าเข้าสู่ระบบ / สมัครสมาชิก...', 650, () => {
        router.push('/auth');
      });
    }
  };

  const handleSelectEditAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')) {
      alert('ไม่รองรับไฟล์ GIF ครับ กรุณาเลือกเฉพาะรูปภาพ (JPG, PNG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawCropSrc((ev.target?.result as string) || null);
      setCropZoom(1);
      setCropOffset({ x: 0, y: 0 });
      setIsHomeCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleConfirmHomeCrop = async () => {
    if (!rawCropSrc) return;
    try {
      const { dataUrl, base64Clean } = await cropAvatarCircleHome(
        rawCropSrc,
        cropZoom,
        cropOffset.x,
        cropOffset.y,
        256,
        190
      );
      setEditAvatarPreview(dataUrl);
      setEditAvatarBase64(base64Clean);
      setIsHomeCropOpen(false);
    } catch {
      alert('ไม่สามารถตัดกรอบรูปได้ กรุณาลองใหม่อีกครั้งครับ');
    }
  };

  const handleSaveProfileCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);

    let finalAvatarUrl = editAvatarPreview;

    if (editAvatarBase64) {
      try {
        const formData = new FormData();
        formData.append('key', IMGBB_API_KEY);
        formData.append('image', editAvatarBase64);
        formData.append('name', `trainer-avatar-${Date.now()}`);

        const res = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data?.success && data?.data?.url) {
          finalAvatarUrl = data.data.url as string;
        }
      } catch (err) {
        console.error('อัปโหลดรูปโปรไฟล์ใหม่ไม่สำเร็จ:', err);
      }
    }

    const cleanNewName = editName.trim() || 'เทรนเนอร์';
    const cleanNewBio = editBio.trim() || 'เทรนเนอร์นักสะสมแห่งสถาบันเทรเซน';

    const { data, error } = await supabase.auth.updateUser({
      data: {
        display_name: cleanNewName,
        bio: cleanNewBio,
        avatar_url: finalAvatarUrl,
      },
    });

    setIsSavingProfile(false);

    if (error) {
      alert('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้งครับ');
      return;
    }

    if (finalAvatarUrl) {
      localStorage.setItem('tracen_cached_avatar', finalAvatarUrl);
      setCachedAvatar(finalAvatarUrl);
    }
    if (currentUser.email) {
      try {
        const rawMap = localStorage.getItem('tracen_trainer_directory');
        const map = rawMap ? JSON.parse(rawMap) : {};
        map[cleanNewName.toLowerCase()] = currentUser.email;
        localStorage.setItem('tracen_trainer_directory', JSON.stringify(map));
      } catch {
        // ignore
      }
    }

    if (data.user) {
      setCurrentUser(data.user);
      setCustomerName(cleanNewName);
    }
    setIsEditingProfile(false);
    showToast('บันทึกข้อมูลนามบัตรเรียบร้อยแล้ว!');
  };

  const handleLogoutFromCard = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('tracen_cached_avatar');
    localStorage.removeItem('tracen_cached_name');
    setCachedAvatar(null);
    setCurrentUser(null);
    setIsProfileCardOpen(false);
    showToast('ออกจากระบบเรียบร้อยแล้ว');
  };

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 320);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setIsCartOpen(false);
        setIsWishlistOpen(false);
        setIsOrdersOpen(false);
        setIsProfileCardOpen(false);
        setIsHomeCropOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const applySlipFile = async (file: File) => {
    try {
      const { dataUrl, base64Clean, sizeKB } = await compressSlipImage(file, 800, 0.6);
      setSlipFileName(file.name || 'slip-payment.jpg');
      setSlipPreview(dataUrl);
      setSlipBase64(base64Clean);
      setSlipSizeKB(sizeKB);
      showToast(`แนบสลิปเรียบร้อย (${sizeKB} KB)`);
    } catch {
      alert('ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ กรุณาลองเลือกรูปใหม่อีกครั้งครับ');
    }
  };

  const handleClearSlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlipFileName(null);
    setSlipPreview(null);
    setSlipBase64(null);
    setSlipSizeKB(0);
    showToast('ลบรูปสลิปออกแล้ว');
  };

  useEffect(() => {
    if (!isCartOpen) return;

    const handleWindowPaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      if (clipboardData.files && clipboardData.files.length > 0) {
        const file = clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          applySlipFile(file);
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
              applySlipFile(file);
              return;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => window.removeEventListener('paste', handleWindowPaste);
  }, [isCartOpen]);

  const handleButtonPasteSlip = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((type) => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'pasted-slip.png', { type: imageType });
          await applySlipFile(file);
          return;
        }
      }
      alert('ไม่พบรูปภาพในคลิปบอร์ด กรุณาแคปหน้าจอหรือก๊อปปี้รูปสลิปก่อนกดวางครับ');
    } catch {
      alert('อุปกรณ์นี้ไม่อนุญาตให้วางผ่านปุ่ม กรุณากดปุ่ม "เลือกรูปสลิป" หรือกด Ctrl + V แทนครับ');
    }
  };

  useEffect(() => {
    const savedWishlist = localStorage.getItem('uma_shop_wishlist');
    if (savedWishlist) {
      try {
        setWishlistIds(JSON.parse(savedWishlist));
      } catch {
        localStorage.removeItem('uma_shop_wishlist');
      }
    }
    setIsWishlistLoaded(true);
  }, []);

  useEffect(() => {
    if (isWishlistLoaded) {
      localStorage.setItem('uma_shop_wishlist', JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isWishlistLoaded]);

  useEffect(() => {
    const savedCart = localStorage.getItem('uma_shop_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('uma_shop_cart');
      }
    }
    setIsCartLoaded(true);
  }, []);

  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('uma_shop_cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('uma_shop_orders');
    if (savedOrders) {
      try {
        setOrderHistory(JSON.parse(savedOrders));
      } catch {
        localStorage.removeItem('uma_shop_orders');
      }
    }
    setIsOrdersLoaded(true);
  }, []);

  useEffect(() => {
    if (isOrdersLoaded) {
      localStorage.setItem('uma_shop_orders', JSON.stringify(orderHistory));
    }
  }, [orderHistory, isOrdersLoaded]);

  const categories = ['ทั้งหมด', 'ฟิกเกอร์', 'ตุ๊กตา', 'พวงกุญแจ'];
  const statuses: ('ทั้งหมด' | 'พร้อมส่ง' | 'พรีออเดอร์')[] = ['ทั้งหมด', 'พร้อมส่ง', 'พรีออเดอร์'];

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const matchCharacter =
      selectedCharacter === 'ทั้งหมด' || item.character === selectedCharacter;
    const matchStatus = selectedStatus === 'ทั้งหมด' || item.status === selectedStatus;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jpName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchCharacter && matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleRandomPick = () => {
    if (isRollingGacha || PRODUCTS.length === 0) return;
    setIsRollingGacha(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * PRODUCTS.length);
      const picked = PRODUCTS[randomIndex];
      setIsRollingGacha(false);
      handleOpenProduct(picked);
      showToast(`สุ่มได้ "${picked.character}"!`);
    }, 650);
  };

  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = wishlistIds.includes(product.id);
    setWishlistIds((prev) =>
      exists ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
    showToast(
      exists
        ? `นำ "${product.character}" ออกจากรายการถูกใจแล้ว`
        : `ปักหัวใจให้ "${product.character}" แล้ว`
    );
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIdx(0);
    setCopiedLink(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    setActiveImageIdx((prev) =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    setActiveImageIdx((prev) =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleCopyShareLink = (productId: string) => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?item=${productId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    showToast('คัดลอกลิงก์สินค้าแล้ว');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyBankAccount = () => {
    navigator.clipboard.writeText(BANK_INFO.accountNumber.replace(/-/g, ''));
    setCopiedBank(true);
    showToast('คัดลอกเลขบัญชีแล้ว');
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleAddToCart = (product: Product, openDrawer = true) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`เพิ่ม "${product.character}" ลงตะกร้าแล้ว`);
    if (openDrawer) setIsCartOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('uma_shop_cart');
    showToast('ล้างตะกร้าเรียบร้อยแล้ว');
  };

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    applySlipFile(file);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const grandTotal = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipBase64) {
      alert('กรุณาแนบหรือวางรูปสลิปโอนเงินเพื่อเป็นหลักฐานการสั่งซื้อครับ');
      return;
    }

    setIsSubmitting(true);

    let slipImageUrl = 'อัปโหลดลิงก์สลิปไม่สำเร็จ';

    try {
      const imgbbForm = new FormData();
      imgbbForm.append('key', IMGBB_API_KEY);
      imgbbForm.append('image', slipBase64);
      imgbbForm.append('name', `slip-${Date.now()}`);

      const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: imgbbForm,
      });
      const imgbbData = await imgbbRes.json();

      if (imgbbData?.success && imgbbData?.data?.url) {
        slipImageUrl = imgbbData.data.url;
      }
    } catch (err) {
      console.error('อัปโหลดรูปขึ้น ImgBB ไม่สำเร็จ:', err);
    }

    const itemListText = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.name} x${item.quantity} ชิ้น (฿${(
            item.product.price * item.quantity
          ).toLocaleString()})`
      )
      .join('\n');

    const orderTime = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    const generatedOrderId = `TRC-${Math.floor(100000 + Math.random() * 900000)}`;
    const memberName = currentUser?.user_metadata?.display_name || 'ไม่ได้เข้าสู่ระบบ (Guest)';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[Tracen Collectibles] คำสั่งซื้อ ${generatedOrderId} จากคุณ ${customerName} (฿${grandTotal.toLocaleString()})`,
          from_name: 'Tracen Collectibles Store',
          รหัสคำสั่งซื้อ: generatedOrderId,
          บัญชีสมาชิกที่สั่งซื้อ: memberName,
          ชื่อผู้รับ: customerName,
          ที่อยู่จัดส่งและเบอร์โทร: address,
          รายการสินค้า: itemListText,
          ค่าสินค้า: `฿${subtotal.toLocaleString()}`,
          ค่าจัดส่ง: `฿${shipping}`,
          ยอดชำระทั้งหมด: `฿${grandTotal.toLocaleString()}`,
          ลิงก์รูปสลิปโอนเงิน: slipImageUrl,
          รายละเอียดไฟล์สลิป: `${slipFileName || 'slip.jpg'} (${slipSizeKB} KB)`,
          เวลาสั่งซื้อ: orderTime,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        alert(`ส่งข้อมูลไม่สำเร็จ: ${result.message || 'กรุณาลองใหม่อีกครั้ง'}`);
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error('ส่งอีเมลไม่สำเร็จ:', err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งครับ');
      setIsSubmitting(false);
      return;
    }

    setOrderHistory((prev) => [
      {
        orderId: generatedOrderId,
        date: orderTime,
        customerName,
        itemsSummary: cart.map((i) => `${i.product.character} x${i.quantity}`).join(', '),
        total: grandTotal,
        slipUrl: slipImageUrl,
      },
      ...prev,
    ]);

    setIsSubmitting(false);
    setIsOrdered(true);

    setTimeout(() => {
      setCart([]);
      localStorage.removeItem('uma_shop_cart');
      setIsOrdered(false);
      setAddress('');
      setSlipFileName(null);
      setSlipPreview(null);
      setSlipBase64(null);
      setSlipSizeKB(0);
      setIsCartOpen(false);
    }, 3000);
  };

  const displayUserName =
    currentUser?.user_metadata?.display_name ||
    currentUser?.email?.split('@')[0] ||
    'สมาชิก';

  const userBio =
    currentUser?.user_metadata?.bio || 'เทรนเนอร์นักสะสมแห่งสถาบันเทรเซน';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-24 md:pb-0">
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
                alt="กำลังโหลด"
                style={{ width: '136px', height: '136px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>{loadingText}</p>
              <p style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>
                Tracen Collectibles {APP_VERSION}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up นามบัตรเทรนเนอร์ */}
      {isProfileCardOpen && currentUser && (
        <div
          onClick={() => setIsProfileCardOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9990,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: '#ffffff',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #065f46 0%, #0d9488 100%)',
                padding: '18px 22px 46px 22px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award style={{ width: '18px', height: '18px', color: '#fde68a' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.03em' }}>
                  TRACEN TRAINER CARD
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileCardOpen(false)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.18)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div style={{ padding: '0 24px 24px 24px', marginTop: '-36px' }}>
              {isEditingProfile ? (
                <form
                  onSubmit={handleSaveProfileCard}
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '84px', height: '84px' }}>
                      <div
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          border: '4px solid #ffffff',
                          background: '#059669',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '28px',
                          fontWeight: 800,
                          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                        }}
                      >
                        {editAvatarPreview ? (
                          <img
                            src={editAvatarPreview}
                            alt="avatar"
                            style={{
                              width: '84px',
                              height: '84px',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          editName.charAt(0).toUpperCase() || 'T'
                        )}
                      </div>
                      <label
                        title="เปลี่ยนรูปโปรไฟล์"
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '28px',
                          height: '28px',
                          borderRadius: '9999px',
                          background: '#059669',
                          border: '2px solid #ffffff',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Camera style={{ width: '14px', height: '14px' }} />
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleSelectEditAvatarFile}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                      แตะไอคอนกล้องเพื่อเปลี่ยนรูปโปรไฟล์ใหม่
                    </span>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#475569',
                        marginBottom: '4px',
                      }}
                    >
                      ชื่อเทรนเนอร์
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        padding: '8px 12px',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#475569',
                        marginBottom: '4px',
                      }}
                    >
                      คำอธิบายบนนามบัตร (แนะนำตัว / ตัวละครที่ชอบ)
                    </label>
                    <textarea
                      rows={2}
                      maxLength={120}
                      placeholder="เช่น สะสมฟิกเกอร์ Oguri Cap และ Tokai Teio..."
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        padding: '8px 12px',
                        fontSize: '12px',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
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
                      type="submit"
                      disabled={isSavingProfile}
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
                      {isSavingProfile ? (
                        <Loader2 className="animate-spin" style={{ width: '15px', height: '15px' }} />
                      ) : (
                        <Save style={{ width: '15px', height: '15px' }} />
                      )}
                      <span>{isSavingProfile ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        border: '4px solid #ffffff',
                        background: '#059669',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        fontWeight: 800,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                        flexShrink: 0,
                      }}
                    >
                      {activeAvatarUrl ? (
                        <img
                          src={activeAvatarUrl}
                          alt={displayUserName}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        displayUserName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div style={{ paddingBottom: '4px', minWidth: 0 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          background: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '9999px',
                          padding: '2px 10px',
                          fontSize: '10px',
                          fontWeight: 800,
                        }}
                      >
                        OFFICIAL TRAINER
                      </span>
                      <h3
                        style={{
                          fontSize: '19px',
                          fontWeight: 800,
                          color: '#0f172a',
                          margin: '4px 0 0 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {displayUserName}
                      </h3>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '12px 14px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#94a3b8',
                        margin: '0 0 4px 0',
                        textTransform: 'uppercase',
                      }}
                    >
                      คำอธิบาย / แนะนำตัว
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#334155',
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {userBio}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: '14px',
                        border: 'none',
                        background: '#059669',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit3 style={{ width: '15px', height: '15px' }} />
                      <span>แก้ไขข้อมูล</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogoutFromCard}
                      style={{
                        padding: '11px 14px',
                        borderRadius: '14px',
                        border: '1px solid #fecdd3',
                        background: '#fff1f2',
                        color: '#be123c',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                      }}
                      title="ออกจากระบบ"
                    >
                      <LogOut style={{ width: '15px', height: '15px' }} />
                      <span>ออก</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pop-up ครอปรูปวงกลมตอนแก้ไขในนามบัตร */}
      {isHomeCropOpen && rawCropSrc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9995,
            background: 'rgba(2, 6, 23, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                ปรับกรอบรูปโปรไฟล์ใหม่
              </span>
              <button
                type="button"
                onClick={() => setIsHomeCropOpen(false)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#f1f5f9',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                onPointerDown={(e) => {
                  setIsDraggingCrop(true);
                  setDragStartCrop({
                    x: e.clientX - cropOffset.x,
                    y: e.clientY - cropOffset.y,
                  });
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!isDraggingCrop) return;
                  setCropOffset({
                    x: Math.max(-95, Math.min(95, e.clientX - dragStartCrop.x)),
                    y: Math.max(-95, Math.min(95, e.clientY - dragStartCrop.y)),
                  });
                }}
                onPointerUp={() => setIsDraggingCrop(false)}
                style={{
                  width: '190px',
                  height: '190px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  border: '4px solid #10b981',
                  background: '#0f172a',
                  touchAction: 'none',
                  cursor: 'grab',
                }}
              >
                <img
                  src={rawCropSrc}
                  alt="crop"
                  draggable={false}
                  style={{
                    width: '190px',
                    height: '190px',
                    objectFit: 'cover',
                    transform: `translate(${cropOffset.x}px, ${cropOffset.y}px) scale(${cropZoom})`,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                padding: '8px 12px',
                borderRadius: '12px',
              }}
            >
              <ZoomIn style={{ width: '15px', height: '15px', color: '#059669' }} />
              <input
                type="range"
                min={1}
                max={2.6}
                step={0.05}
                value={cropZoom}
                onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: '#059669' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setIsHomeCropOpen(false)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmHomeCrop}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <Crop style={{ width: '14px', height: '14px' }} />
                <span>ใช้รูปนี้</span>
              </button>
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
        @keyframes gradientWave {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          50% {
            transform: translateY(-18px) translateX(14px) scale(1.06);
          }
        }
        @keyframes floatReverse {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          50% {
            transform: translateY(16px) translateX(-16px) scale(1.08);
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.25);
          }
        }
        .banner-animated-bg {
          background: linear-gradient(-45deg, #064e3b, #0f766e, #047857, #115e59, #065f46);
          background-size: 300% 300%;
          animation: gradientWave 10s ease infinite;
        }
        .orb-1 {
          animation: floatSlow 7s ease-in-out infinite;
        }
        .orb-2 {
          animation: floatReverse 9s ease-in-out infinite;
        }
        .sparkle-1 {
          animation: twinkle 3.2s ease-in-out infinite;
        }
        .sparkle-2 {
          animation: twinkle 4.5s ease-in-out infinite 1.1s;
        }
        .sparkle-3 {
          animation: twinkle 3.8s ease-in-out infinite 2s;
        }
        .cart-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.65s ease;
        }
        .cart-shimmer:hover::after {
          transform: translateX(100%);
        }
      `}</style>

      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2.5 sm:gap-4">
          <div
            onClick={() => {
              triggerGifLoader('กำลังรีเฟรชหน้าร้าน...', 550, () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            }}
            className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold flex items-center justify-center shadow-sm text-base group-hover:scale-105 group-hover:rotate-3 transition-transform">
              U
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-lg text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  Tracen Collectibles
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                Uma Musume Figures & Goods Store
              </p>
            </div>
          </div>

          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อตัวละคร เช่น Special Week, Oguri Cap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-slate-100/90 border border-transparent pl-10 pr-9 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                title="ล้างคำค้นหา"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className="md:hidden flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              title="ค้นหาสินค้า"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsOrdersOpen(true)}
              className="group relative hidden sm:flex items-center gap-2 h-10 rounded-full border border-slate-200/90 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-sky-100/70 active:scale-95 transition-all duration-200"
              title="ประวัติคำสั่งซื้อล่าสุด"
            >
              <ReceiptText className="h-4 w-4 text-slate-500 group-hover:text-sky-600 group-hover:-rotate-12 transition-transform duration-200" />
              <span className="hidden xl:inline">ออเดอร์</span>
              {orderHistory.length > 0 && (
                <span className="rounded-full bg-sky-600 text-white px-1.5 py-0.5 text-[11px] font-bold shadow-2xs">
                  {orderHistory.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="group relative hidden sm:flex items-center gap-2 h-10 rounded-full border border-slate-200/90 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-rose-300 hover:bg-rose-50/80 hover:text-rose-600 hover:-translate-y-0.5 hover:shadow-md hover:shadow-rose-100/80 active:scale-95 transition-all duration-200"
              title="รายการที่ปักหัวใจไว้"
            >
              <Heart
                className={`h-4 w-4 transition-transform duration-200 group-hover:scale-125 ${
                  wishlistIds.length > 0
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-500 group-hover:text-rose-500'
                }`}
              />
              <span className="hidden xl:inline">ถูกใจ</span>
              {wishlistIds.length > 0 && (
                <span className="rounded-full bg-rose-500 text-white px-1.5 py-0.5 text-[11px] font-bold shadow-2xs">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative overflow-hidden cart-shimmer flex items-center gap-2 h-9 sm:h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 sm:px-4 text-xs sm:text-sm font-bold text-white shadow-sm hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              <ShoppingBag className="h-4 w-4 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">ตะกร้า</span>
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-rose-500 px-1.5 sm:px-2 py-0.5 text-[11px] font-extrabold shadow-xs animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* ปุ่มโปรไฟล์ด้านบน */}
            <button
              type="button"
              onClick={handleProfileButtonClick}
              className={`group relative flex items-center gap-2 h-9 sm:h-10 rounded-full border pl-2 pr-3.5 sm:pr-4 text-xs sm:text-sm font-semibold hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ${
                currentUser
                  ? 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 hover:shadow-md hover:shadow-emerald-100'
                  : 'border-slate-200/90 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-800 hover:shadow-md hover:shadow-slate-100'
              }`}
              title={currentUser ? 'คลิกเพื่อเปิดนามบัตรเทรนเนอร์' : 'เข้าสู่ระบบ / สมัครบัญชี'}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
                className="relative bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"
              >
                {activeAvatarUrl ? (
                  <img
                    src={activeAvatarUrl}
                    alt={displayUserName}
                    style={{ width: '26px', height: '26px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <UserCircle2 className="h-4 w-4 group-hover:scale-110 group-hover:text-emerald-600 transition-transform duration-200" />
                )}
              </div>
              <span className="max-w-[85px] sm:max-w-[115px] truncate">
                {currentUser ? displayUserName : 'เข้าสู่ระบบ'}
              </span>
            </button>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-3.5 bg-white border-t border-slate-100">
            <div className="relative mt-2.5">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="พิมพ์ชื่อตัวละคร เช่น Special Week, Oguri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-100 pl-10 pr-9 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden banner-animated-bg text-white py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-16 -left-16 h-56 sm:h-72 w-56 sm:w-72 rounded-full bg-emerald-300/20 blur-3xl orb-1" />
        <div className="pointer-events-none absolute -bottom-24 right-8 h-64 sm:h-80 w-64 sm:w-80 rounded-full bg-teal-300/20 blur-3xl orb-2" />
        <div className="pointer-events-none absolute top-6 right-1/3 h-36 sm:h-44 w-36 sm:w-44 rounded-full bg-amber-200/15 blur-2xl orb-1" />

        <span className="pointer-events-none absolute top-8 right-12 sm:right-24 h-2 w-2 rounded-full bg-amber-300 sparkle-1" />
        <span className="pointer-events-none absolute bottom-10 right-1/4 h-2.5 w-2.5 rounded-full bg-emerald-200 sparkle-2" />
        <span className="pointer-events-none absolute top-14 left-1/2 h-1.5 w-1.5 rounded-full bg-white sparkle-3" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3.5 py-1.5 text-xs font-medium backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse shrink-0" />
              <span>สินค้าลิขสิทธิ์แท้จากญี่ปุ่น 100% คัดสภาพกล่องทุกชิ้น</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
              ศูนย์รวมฟิกเกอร์และของสะสม Uma Musume: Pretty Derby
            </h1>
            <p className="text-emerald-100/95 text-sm sm:text-base leading-relaxed">
              คัดสรรงานแท้ทั้งมือ 1 ในซีล และของสะสมหายากจากค่ายชั้นนำ แพ็กบับเบิลหนาพิเศษ ส่งไวทั่วไทย
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleRandomPick}
              disabled={isRollingGacha}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 hover:-translate-y-0.5 active:scale-95 text-slate-950 font-extrabold px-5 py-3.5 text-xs sm:text-sm shadow-lg transition-all disabled:opacity-70"
            >
              <Dices className={`h-5 w-5 ${isRollingGacha ? 'animate-spin' : ''}`} />
              <span>{isRollingGacha ? 'กำลังสุ่มตัวละคร...' : 'สุ่มแนะนำของสะสม (Gacha)'}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">ลิขสิทธิ์แท้ 100%</p>
              <p className="text-slate-500 mt-0.5">นำเข้าตรง Lot JP</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">กันกระแทก 3 ชั้น</p>
              <p className="text-slate-500 mt-0.5">กล่องแข็งหนาพิเศษ</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <div className="h-10 w-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">จัดส่งไวทั่วไทย</p>
              <p className="text-slate-500 mt-0.5">ค่าส่งเริ่มต้น ฿50</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">ระบบนามบัตรเทรนเนอร์</p>
              <p className="text-slate-500 mt-0.5">ล็อกอินได้ทุกอุปกรณ์</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full">
        <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">ตัวละคร:</span>
          {QUICK_CHARACTERS.map((charName) => {
            const active = selectedCharacter === charName;
            return (
              <button
                key={charName}
                type="button"
                onClick={() => setSelectedCharacter(charName)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 active:scale-95 ${
                  active
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-sm -translate-y-0.5'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {charName === 'ทั้งหมด' ? 'ทุกตัวละคร' : charName}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-semibold transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    selectedStatus === st
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st === 'ทั้งหมด' ? 'ทุกสถานะ' : st}
                </button>
              ))}
            </div>

            <div className="relative flex items-center">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-2xl border border-slate-200 bg-white pl-8 pr-4 py-2 text-xs sm:text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
                aria-label="เรียงลำดับสินค้า"
              >
                <option value="default">เรียง: แนะนำ</option>
                <option value="price-asc">ราคา: ต่ำ → สูง</option>
                <option value="price-desc">ราคา: สูง → ต่ำ</option>
                <option value="rating">รีวิวสูงสุด</option>
              </select>
            </div>

            <span className="text-xs sm:text-sm text-slate-500 font-medium pl-1">
              {filteredProducts.length} รายการ
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหาหรือหมวดหมู่ที่เลือกครับ
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ทั้งหมด');
                setSelectedCharacter('ทั้งหมด');
                setSelectedStatus('ทั้งหมด');
                setSearchQuery('');
                setSortBy('default');
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
            {filteredProducts.map((product) => {
              const isLiked = wishlistIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="group cursor-pointer rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-emerald-950/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square bg-white p-3.5 sm:p-5 border-b border-slate-100 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition duration-300"
                      />
                      <span
                        className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold shadow-2xs ${
                          product.status === 'พร้อมส่ง'
                            ? 'bg-emerald-600 text-white'
                            : product.status === 'พรีออเดอร์'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-600 text-white'
                        }`}
                      >
                        {product.status}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className="absolute top-2.5 right-2.5 z-10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-white/95 shadow-sm border border-slate-200/80 hover:scale-110 transition"
                        title={isLiked ? 'เอาออกจากรายการที่ถูกใจ' : 'ปักหัวใจเก็บไว้ดูทีหลัง'}
                      >
                        <Heart
                          className={`h-4 w-4 transition ${
                            isLiked
                              ? 'fill-rose-500 text-rose-500'
                              : 'text-slate-400 hover:text-rose-500'
                          }`}
                        />
                      </button>

                      <span className="absolute bottom-2.5 right-2.5 rounded-lg bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-white">
                        {product.images.length} รูป
                      </span>
                    </div>

                    <div className="p-3.5 sm:p-5 space-y-1.5 sm:space-y-2">
                      <p className="text-[11px] sm:text-xs text-emerald-700 font-semibold truncate">
                        {product.character}
                      </p>
                      <h3 className="font-bold text-xs sm:text-sm lg:text-base text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition leading-snug min-h-[2.5rem] sm:min-h-[2.75rem]">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 pt-0.5 text-[11px] sm:text-xs text-slate-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="font-semibold text-slate-700">{product.rating}</span>
                        <span>({product.reviewsCount} รีวิว)</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
                    <span className="text-base sm:text-lg font-extrabold text-rose-600">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.status !== 'สินค้าหมด') {
                          handleAddToCart(product, false);
                        }
                      }}
                      disabled={product.status === 'สินค้าหมด'}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white px-3 py-2 text-xs font-semibold transition disabled:opacity-40 shrink-0"
                      title="เพิ่มลงตะกร้าด่วน"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>ใส่ตะกร้า</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-semibold text-slate-700">
            Tracen Collectibles ({APP_VERSION}) — ศูนย์รวมฟิกเกอร์และของสะสม Uma Musume ลิขสิทธิ์แท้
          </p>
          <p>เชื่อมต่อ Supabase Auth • รองรับ iPhone • iPad • Notebook • PC</p>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => {
            setIsCartOpen(false);
            setIsWishlistOpen(false);
            setIsOrdersOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 text-[11px] font-semibold text-emerald-700 active:scale-95 transition"
        >
          <Home className="h-5 w-5" />
          <span>หน้าแรก</span>
        </button>

        <button
          type="button"
          onClick={handleRandomPick}
          className="flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 text-[11px] font-medium text-amber-600 active:scale-95 transition"
        >
          <Dices className="h-5 w-5" />
          <span>สุ่มกาชา</span>
        </button>

        <button
          type="button"
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 text-[11px] font-medium text-slate-600 hover:text-rose-600 active:scale-95 transition"
        >
          <Heart
            className={`h-5 w-5 ${
              wishlistIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
          <span>ถูกใจ</span>
          {wishlistIds.length > 0 && (
            <span className="absolute top-0.5 right-2 rounded-full bg-rose-500 text-white px-1.5 text-[10px] font-bold">
              {wishlistIds.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsOrdersOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 text-[11px] font-medium text-slate-600 active:scale-95 transition"
        >
          <ReceiptText className="h-5 w-5" />
          <span>ออเดอร์</span>
          {orderHistory.length > 0 && (
            <span className="absolute top-0.5 right-2 rounded-full bg-slate-800 text-white px-1.5 text-[10px] font-bold">
              {orderHistory.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleProfileButtonClick}
          className={`flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 text-[11px] font-medium active:scale-95 transition ${
            currentUser ? 'text-emerald-700 font-bold' : 'text-slate-600'
          }`}
        >
          <UserCircle2 className="h-5 w-5" />
          <span>{currentUser ? 'นามบัตร' : 'ล็อกอิน'}</span>
        </button>
      </nav>

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 h-11 w-11 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-lg hover:bg-emerald-700 transition"
          title="เลื่อนกลับขึ้นด้านบน"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-50 rounded-2xl bg-slate-900/95 text-white px-4 py-3 text-xs font-medium shadow-xl flex items-center gap-2.5 max-w-[85vw]">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 sm:p-5 backdrop-blur-xs">
          <div className="relative w-full sm:max-w-3xl lg:max-w-4xl rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 lg:p-9">
            <button
              onClick={() => setSelectedProduct(null)}
              className="sticky sm:absolute right-0 sm:right-5 top-0 sm:top-5 ml-auto z-20 h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-2 sm:pr-12 mb-5 sm:mb-6 -mt-6 sm:mt-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-700 font-semibold">
                <span className="bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                  {selectedProduct.category}
                </span>
                <span>• {selectedProduct.jpName}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {selectedProduct.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-9">
              <div>
                <div className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="h-full w-full object-contain"
                  />
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/95 border border-slate-200 text-slate-700 shadow-sm hover:bg-white transition"
                        title="รูปก่อนหน้า"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/95 border border-slate-200 text-slate-700 shadow-sm hover:bg-white transition"
                        title="รูปถัดไป"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-2.5 mt-3.5">
                  {selectedProduct.images.slice(0, 5).map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`aspect-square rounded-xl bg-white p-1.5 overflow-hidden border-2 transition ${
                        activeImageIdx === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-600/20 scale-[1.03]'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`มุมมองที่ ${idx + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2.5">
                  <span className="text-xs text-slate-500 shrink-0 font-medium">แชร์สินค้า:</span>
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'https://uma-shop.vercel.app'}/?item=${selectedProduct.id}`}
                    className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(selectedProduct.id)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shrink-0 transition"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span className="font-bold text-slate-800">{selectedProduct.rating}</span>
                    <span className="text-slate-400 text-xs">
                      ({selectedProduct.reviewsCount} รีวิวจากผู้ซื้อจริง)
                    </span>
                  </div>

                  <div className="divide-y divide-dashed divide-slate-200 border-y border-dashed border-slate-200 text-xs sm:text-sm">
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-500">หมวดหมู่</span>
                      <span className="font-semibold text-rose-600">{selectedProduct.category}</span>
                    </div>
                    <div className="py-3 flex justify-between items-baseline">
                      <span className="text-slate-500">ราคา</span>
                      <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        ฿{selectedProduct.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-500">สถานะสินค้า</span>
                      <span
                        className={`font-bold ${
                          selectedProduct.status === 'พร้อมส่ง'
                            ? 'text-emerald-600'
                            : selectedProduct.status === 'พรีออเดอร์'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {selectedProduct.status}
                      </span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-500">ลงสินค้า / อัปเดต</span>
                      <span className="text-slate-700">{selectedProduct.updatedDate}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-xs">
                    <p className="text-slate-600 pb-1.5 leading-relaxed">{selectedProduct.description}</p>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 shrink-0">แบรนด์:</span>
                      <span className="font-semibold text-slate-900 text-right">{selectedProduct.brand}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 shrink-0">ลิขสิทธิ์:</span>
                      <span className="font-semibold text-emerald-700 text-right">{selectedProduct.lot}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 shrink-0">ขนาด / วัสดุ:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {selectedProduct.size} ({selectedProduct.material})
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 shrink-0">สภาพสินค้า:</span>
                      <span className="font-semibold text-slate-900 text-right">{selectedProduct.condition}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 rounded-2xl border border-orange-200/80 bg-orange-50/70 px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-orange-900">ร้านนี้ยืนยันตัวตนแล้ว</p>
                      <p className="text-orange-700 mt-0.5">บัตรประชาชน ✓ • ตรวจสอบประวัติการขายได้</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  {selectedProduct.status === 'สินค้าหมด' ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 py-3.5 text-sm font-semibold text-amber-800">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span>ขออภัย สินค้าหมด</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleWishlist(selectedProduct)}
                          className={`flex items-center justify-center rounded-2xl border px-4 py-3.5 transition ${
                            wishlistIds.includes(selectedProduct.id)
                              ? 'border-rose-200 bg-rose-50 text-rose-600'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                          title="ปักหัวใจเก็บไว้ก่อน"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              wishlistIds.includes(selectedProduct.id) ? 'fill-rose-500' : ''
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleAddToCart(selectedProduct, false);
                            setSelectedProduct(null);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald-600 bg-emerald-50 py-3 text-xs sm:text-sm text-emerald-800 font-bold hover:bg-emerald-100 transition"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>เพิ่มลงตะกร้า</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          handleAddToCart(selectedProduct, true);
                          setSelectedProduct(null);
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm sm:text-base text-white font-bold hover:bg-emerald-700 transition shadow-sm"
                      >
                        <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
                        <span>ซื้อทันที (฿{selectedProduct.price.toLocaleString()})</span>
                      </button>
                    </>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>ห่อบับเบิลหนา 3 ชั้น + กล่องแข็งกันกระแทกทุกออเดอร์</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>คืนเงิน 100% หากสินค้าเสียหายจากการขนส่ง</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <ReceiptText className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900">ประวัติคำสั่งซื้อล่าสุด</h2>
                </div>
                <button
                  onClick={() => setIsOrdersOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              {orderHistory.length === 0 ? (
                <div className="py-24 text-center space-y-2.5 text-slate-400">
                  <ReceiptText className="h-11 w-11 mx-auto text-slate-300" />
                  <p className="font-medium text-slate-600">ยังไม่มีประวัติคำสั่งซื้อในเครื่องนี้</p>
                  <p className="text-xs">เมื่อกดสั่งซื้อและแนบสลิปแล้ว รายการจะบันทึกไว้ที่นี่ครับ</p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {orderHistory.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-700">{ord.orderId}</span>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-semibold">
                          ส่งหลักฐานแล้ว
                        </span>
                      </div>
                      <p className="text-slate-500">{ord.date}</p>
                      <p className="font-semibold text-slate-800">ผู้รับ: {ord.customerName}</p>
                      <p className="text-slate-600">{ord.itemsSummary}</p>
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="font-extrabold text-sm text-rose-600">
                          ฿{ord.total.toLocaleString()}
                        </span>
                        {ord.slipUrl.startsWith('http') && (
                          <a
                            href={ord.slipUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                          >
                            <span>ดูรูปสลิป</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                  <h2 className="text-lg font-bold text-slate-900">รายการที่ปักหัวใจไว้</h2>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="py-24 text-center space-y-2.5 text-slate-400">
                  <Heart className="h-11 w-11 mx-auto text-slate-300" />
                  <p className="font-medium text-slate-600">ยังไม่มีสินค้าที่ปักหัวใจไว้</p>
                  <p className="text-xs">กดรูปหัวใจบนสินค้าที่สนใจเพื่อเก็บไว้ดูทีหลังได้ครับ</p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="flex gap-3.5 border-b border-slate-100 pb-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-18 w-18 rounded-xl object-contain bg-white border border-slate-200 p-1.5 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-sm font-extrabold text-rose-600">
                          ฿{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 pt-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              handleAddToCart(product, true);
                              setIsWishlistOpen(false);
                            }}
                            className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                          >
                            + ย้ายลงตะกร้า
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleToggleWishlist(product, e)}
                            className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 p-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>เอาออก</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">ตะกร้าสินค้าของคุณ</h2>
                <div className="flex items-center gap-2">
                  {cart.length > 0 && !isOrdered && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline px-2 py-1"
                    >
                      ล้างตะกร้า
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100"
                  >
                    <X className="h-5 w-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {isOrdered ? (
                <div className="py-20 text-center space-y-3.5">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900">ส่งคำสั่งซื้อและสลิปเรียบร้อย!</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    อัปโหลดสลิปและส่งรายละเอียดคำสั่งซื้อเข้าอีเมลเรียบร้อยแล้ว จะรีบตรวจสอบยอดและจัดส่งให้เร็วที่สุดครับ
                  </p>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-24 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="h-11 w-11 mx-auto text-slate-300" />
                  <p className="font-medium text-slate-600">ยังไม่มีสินค้าในตะกร้า</p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3.5 border-b border-slate-100 pb-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-18 w-18 rounded-xl object-contain bg-white border border-slate-200 p-1.5 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-sm font-extrabold text-rose-600">
                          ฿{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 pt-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, -1)}
                            className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100"
                            title="ลดจำนวน"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, 1)}
                            className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100"
                            title="เพิ่มจำนวน"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(product.id)}
                            className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition p-1"
                            title="ลบรายการนี้"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && !isOrdered && (
              <form onSubmit={handleCheckout} className="pt-5 border-t border-slate-100 space-y-4 mt-5 pb-8 sm:pb-0">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>ค่าสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>ค่าจัดส่ง (ห่อกันกระแทก)</span>
                    <span>฿{shipping}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2.5 border-t border-slate-100">
                    <span>ยอดชำระทั้งหมด</span>
                    <span className="text-rose-600">฿{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200/80 p-3.5 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <CreditCard className="h-4 w-4 text-emerald-700" />
                    <span>ช่องทางโอนเงินชำระค่าสินค้า</span>
                  </div>
                  <p className="text-slate-700">{BANK_INFO.bankName}</p>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-emerald-200">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {BANK_INFO.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBankAccount}
                      className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                    >
                      {copiedBank ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>คัดลอก</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-600">
                    ชื่อบัญชี:{' '}
                    <span className="font-semibold text-slate-900">{BANK_INFO.accountName}</span>{' '}
                    (พร้อมเพย์: {BANK_INFO.promptPay})
                  </p>
                </div>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="ชื่อ-นามสกุล ผู้รับ"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="ที่อยู่จัดส่ง และเบอร์โทรศัพท์"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />

                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">
                        แนบหลักฐานการโอนเงิน (สลิป) <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleButtonPasteSlip}
                        className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-200 transition"
                      >
                        <ClipboardPaste className="h-3 w-3" />
                        <span>วางรูปจากคลิปบอร์ด</span>
                      </button>
                    </div>

                    <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/40 transition">
                      {slipPreview ? (
                        <div className="text-center space-y-2 w-full">
                          <button
                            type="button"
                            onClick={handleClearSlip}
                            className="absolute top-2.5 right-2.5 h-7 w-7 flex items-center justify-center rounded-full bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition"
                            title="ลบรูปสลิปนี้"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                          <img
                            src={slipPreview}
                            alt="ตัวอย่างสลิป"
                            className="max-h-36 mx-auto rounded-xl border border-slate-200 object-contain"
                          />
                          <p className="text-[11px] text-emerald-700 font-semibold">
                            บีบอัดแล้ว ({slipSizeKB} KB) • แตะเพื่อเปลี่ยนรูป หรือกด Ctrl+V วางใหม่
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2 text-slate-500 text-center space-y-1">
                          <Upload className="h-5 w-5 text-emerald-600" />
                          <span className="text-xs font-semibold text-slate-700">
                            แตะเลือกรูปจากเครื่อง หรือกด Ctrl + V วางสลิป
                          </span>
                          <span className="text-[11px] text-slate-400">
                            รองรับ iPhone, iPad, Notebook และแคปหน้าจอวางโดยตรง
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm sm:text-base text-white font-bold hover:bg-emerald-700 transition disabled:opacity-60 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>กำลังอัปโหลดสลิปและส่งคำสั่งซื้อ...</span>
                    </>
                  ) : (
                    <span>ยืนยันการสั่งซื้อพร้อมส่งสลิป</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
