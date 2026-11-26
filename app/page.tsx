'use client';

import { useState, useEffect } from 'react';
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
  Tag,
  Home,
} from 'lucide-react';

const APP_VERSION = 'v1.6';
const WEB3FORMS_ACCESS_KEY = '138683be-375e-4dce-a38e-3037a33dbd6e';
const IMGBB_API_KEY = 'f9b2ed4e3933997a26d3ebd8799b306e';

// 👇 แก้ไขข้อมูลบัญชีรับโอนเงินของคุณตรงนี้ครับ
const BANK_INFO = {
  bankName: 'ธนาคารกสิกรไทย (KBank)',
  accountNumber: '123-4-56789-0',
  accountName: 'นาย อดิชาติ ใจสวน',
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

export default function UmaShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState<'ทั้งหมด' | 'พร้อมส่ง' | 'พรีออเดอร์'>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // สถานะสำหรับมือถือ/แท็บเล็ต
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ระบบปักหัวใจ (Wishlist / รายการโปรด)
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // ระบบตะกร้าสินค้า
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ข้อมูลสั่งซื้อและสลิปที่บีบอัดแล้ว
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
    }, 2200);
  };

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // รองรับการกด Esc เพื่อปิดหน้าต่างบน Notebook / iPad
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setIsCartOpen(false);
        setIsWishlistOpen(false);
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

  const categories = ['ทั้งหมด', 'ฟิกเกอร์', 'ตุ๊กตา', 'พวงกุญแจ'];
  const statuses: ('ทั้งหมด' | 'พร้อมส่ง' | 'พรีออเดอร์')[] = ['ทั้งหมด', 'พร้อมส่ง', 'พรีออเดอร์'];

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const matchStatus = selectedStatus === 'ทั้งหมด' || item.status === selectedStatus;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jpName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

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

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[Tracen Collectibles] คำสั่งซื้อใหม่จากคุณ ${customerName} (฿${grandTotal.toLocaleString()})`,
          from_name: 'Tracen Collectibles Store',
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

    setIsSubmitting(false);
    setIsOrdered(true);

    setTimeout(() => {
      setCart([]);
      localStorage.removeItem('uma_shop_cart');
      setIsOrdered(false);
      setCustomerName('');
      setAddress('');
      setSlipFileName(null);
      setSlipPreview(null);
      setSlipBase64(null);
      setSlipSizeKB(0);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-gray-900 pb-16 md:pb-0">
      {/* แอนิเมชันสำหรับพื้นหลังแบนเนอร์เคลื่อนไหว */}
      <style jsx>{`
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
      `}</style>

      {/* แถบเมนูด้านบน (รองรับ iPhone / iPad / Notebook) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0"
          >
            <span className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold flex items-center justify-center shadow-xs text-sm sm:text-base">
              U
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-emerald-950 leading-none">
                  Tracen Collectibles
                </span>
                <span className="rounded-md bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[10px] font-bold">
                  {APP_VERSION}
                </span>
              </div>
              <span className="hidden xs:block sm:block text-[10px] sm:text-[11px] text-emerald-700 font-medium">
                Uma Musume Figures & Goods
              </span>
            </div>
          </div>

          {/* ช่องค้นหาสำหรับ iPad และ Notebook */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อตัวละคร เช่น Special Week, Oguri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-stone-100 pl-9 pr-8 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                title="ล้างคำค้นหา"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* ปุ่มด้านขวาบน */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* ปุ่มเปิดช่องค้นหาบน iPhone / iPad แนวตั้ง */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className="md:hidden flex items-center justify-center rounded-full border border-stone-200 bg-white p-2 text-gray-700 hover:bg-stone-100 transition"
              title="ค้นหาสินค้า"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 sm:px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
              title="รายการที่ปักหัวใจไว้"
            >
              <Heart
                className={`h-4 w-4 ${
                  wishlistIds.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-gray-500'
                }`}
              />
              <span className="hidden lg:inline">ถูกใจ</span>
              {wishlistIds.length > 0 && (
                <span className="rounded-full bg-rose-100 text-rose-700 px-1.5 py-0.5 text-[11px] font-bold">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-emerald-700 transition shadow-xs"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">ตะกร้า</span>
              {totalItems > 0 && (
                <span className="rounded-full bg-rose-600 px-1.5 sm:px-2 py-0.5 text-[11px] font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* แถบค้นหาแบบเลื่อนเปิดบน iPhone / iPad แนวตั้ง */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-3 pb-3 bg-white border-t border-stone-100">
            <div className="relative mt-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="พิมพ์ชื่อตัวละคร เช่น Special Week, Oguri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-stone-100 pl-9 pr-8 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* แบนเนอร์ร้านแบบพื้นหลังเคลื่อนไหว (ปรับสัดส่วนตามขนาดจอ) */}
      <section className="relative overflow-hidden banner-animated-bg text-white py-8 sm:py-12 lg:py-14 px-4 sm:px-6">
        <div className="pointer-events-none absolute -top-16 -left-16 h-48 sm:h-64 w-48 sm:w-64 rounded-full bg-emerald-300/20 blur-3xl orb-1" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-56 sm:h-72 w-56 sm:w-72 rounded-full bg-teal-300/20 blur-3xl orb-2" />
        <div className="pointer-events-none absolute top-6 right-1/3 h-32 sm:h-40 w-32 sm:w-40 rounded-full bg-amber-200/15 blur-2xl orb-1" />

        <span className="pointer-events-none absolute top-8 right-12 sm:right-24 h-2 w-2 rounded-full bg-amber-300 sparkle-1" />
        <span className="pointer-events-none absolute bottom-10 right-1/4 h-2.5 w-2.5 rounded-full bg-emerald-200 sparkle-2" />
        <span className="pointer-events-none absolute top-14 left-1/2 h-1.5 w-1.5 rounded-full bg-white sparkle-3" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-[11px] sm:text-xs font-medium backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse shrink-0" />
            <span>สินค้าลิขสิทธิ์แท้จากญี่ปุ่น 100% คัดสภาพกล่องทุกชิ้น</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight drop-shadow-xs leading-snug">
            ศูนย์รวมฟิกเกอร์และของสะสม Uma Musume: Pretty Derby
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed">
            คัดสรรงานแท้ทั้งมือ 1 ในซีล และของสะสมหายากจากค่ายชั้นนำ แพ็กบับเบิลหนาพิเศษ ส่งไวทั่วไทย
          </p>
        </div>
      </section>

      {/* แถบสรุปจุดเด่นของร้าน (2 คอลัมน์บนมือถือ • 4 คอลัมน์บน iPad/Notebook) */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-3.5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-gray-900">ลิขสิทธิ์แท้ 100%</p>
              <p className="text-gray-500">นำเข้าตรง Lot JP</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <PackageCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-gray-900">กันกระแทก 3 ชั้น</p>
              <p className="text-gray-500">กล่องแข็งหนาพิเศษ</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-gray-900">จัดส่งไวทั่วไทย</p>
              <p className="text-gray-500">ค่าส่งเริ่มต้น ฿50</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-gray-900">แนบสลิปง่าย</p>
              <p className="text-gray-500">รองรับมือถือ & Ctrl+V</p>
            </div>
          </div>
        </div>
      </div>

      {/* รายการสินค้า (iPhone: 2 คอลัมน์ • iPad: 3 คอลัมน์ • Notebook: 4 คอลัมน์) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="h-5 w-px bg-stone-200 mx-1 shrink-0" />

            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition shrink-0 ${
                  selectedStatus === st
                    ? 'bg-teal-700 text-white'
                    : 'bg-white text-gray-500 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Tag className="h-3 w-3" />
                <span>{st === 'ทั้งหมด' ? 'ทุกสถานะ' : st}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-700 focus:border-emerald-500 focus:outline-none"
              aria-label="เรียงลำดับสินค้า"
            >
              <option value="default">เรียงตาม: แนะนำ</option>
              <option value="price-asc">ราคา: น้อย → มาก</option>
              <option value="price-desc">ราคา: มาก → น้อย</option>
              <option value="rating">คะแนนรีวิวสูงสุด</option>
            </select>
            <span className="text-xs sm:text-sm text-gray-500 shrink-0">
              แสดง {filteredProducts.length} รายการ
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white border border-stone-200 p-10 sm:p-12 text-center space-y-3">
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหาหรือหมวดหมู่ที่เลือกครับ
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ทั้งหมด');
                setSelectedStatus('ทั้งหมด');
                setSearchQuery('');
                setSortBy('default');
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-emerald-700 transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => {
              const isLiked = wishlistIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="group cursor-pointer rounded-xl sm:rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square bg-white p-2 sm:p-3 border-b border-stone-100 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition duration-300"
                      />
                      <span
                        className={`absolute top-2 left-2 sm:top-3 sm:left-3 rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold ${
                          product.status === 'พร้อมส่ง'
                            ? 'bg-emerald-600 text-white'
                            : product.status === 'พรีออเดอร์'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        {product.status}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 rounded-full bg-white/95 p-1.5 sm:p-2 shadow-xs border border-stone-200 hover:scale-110 transition"
                        title={isLiked ? 'เอาออกจากรายการที่ถูกใจ' : 'ปักหัวใจเก็บไว้ดูทีหลัง'}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition ${
                            isLiked
                              ? 'fill-rose-500 text-rose-500'
                              : 'text-gray-400 hover:text-rose-500'
                          }`}
                        />
                      </button>

                      <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 rounded bg-black/65 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] text-white">
                        {product.images.length} รูป
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-4">
                      <p className="text-[11px] sm:text-xs text-emerald-700 font-semibold truncate">
                        {product.character}
                      </p>
                      <h3 className="font-bold text-xs sm:text-sm lg:text-base text-gray-900 mt-0.5 sm:mt-1 line-clamp-2 group-hover:text-emerald-700 transition leading-snug">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-gray-500">
                        <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-gray-700">{product.rating}</span>
                        <span>({product.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-2 flex items-center justify-between gap-1 border-t border-stone-100">
                    <span className="text-sm sm:text-lg font-bold text-rose-700">
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
                      className="inline-flex items-center gap-0.5 sm:gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold transition disabled:opacity-40"
                      title="เพิ่มลงตะกร้าด่วน"
                    >
                      <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>ใส่ตะกร้า</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ส่วนท้ายหน้าเว็บ (Footer) */}
      <footer className="bg-white border-t border-stone-200 py-5 sm:py-6 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="font-medium text-gray-700">
            Tracen Collectibles ({APP_VERSION}) — ศูนย์รวมฟิกเกอร์และของสะสม Uma Musume ลิขสิทธิ์แท้
          </p>
          <p>รองรับ iPhone • iPad • Notebook • PC</p>
        </div>
      </footer>

      {/* แถบเมนูลัดด้านล่างสำหรับ iPhone / มือถือโดยเฉพาะ */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => {
            setIsCartOpen(false);
            setIsWishlistOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium text-emerald-700"
        >
          <Home className="h-5 w-5" />
          <span>หน้าแรก</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsMobileSearchOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium text-gray-600 hover:text-emerald-700"
        >
          <Search className="h-5 w-5" />
          <span>ค้นหา</span>
        </button>

        <button
          type="button"
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium text-gray-600 hover:text-rose-600"
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
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium text-gray-600 hover:text-emerald-700"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>ตะกร้า</span>
          {totalItems > 0 && (
            <span className="absolute top-0.5 right-2 rounded-full bg-emerald-600 text-white px-1.5 text-[10px] font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      {/* ปุ่มเลื่อนกลับขึ้นด้านบน (Back to Top) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-18 md:bottom-5 right-4 sm:right-5 z-30 rounded-full bg-emerald-700 p-2.5 sm:p-3 text-white shadow-lg hover:bg-emerald-800 transition"
          title="เลื่อนกลับขึ้นด้านบน"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}

      {/* กล่องแจ้งเตือนสั้นๆ มุมล่างซ้าย (Toast) */}
      {toastMessage && (
        <div className="fixed bottom-18 md:bottom-5 left-4 sm:left-5 z-50 rounded-xl bg-gray-900/95 text-white px-3.5 py-2 text-xs font-medium shadow-lg flex items-center gap-2 max-w-[85vw]">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Pop-up รายละเอียดสินค้า (เต็มจอบนมือถือ • 2 คอลัมน์บน iPad แนวนอน & Notebook) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 backdrop-blur-xs">
          <div className="relative w-full sm:max-w-3xl lg:max-w-4xl rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 md:p-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="sticky sm:absolute right-0 sm:right-4 top-0 sm:top-4 ml-auto z-20 flex items-center justify-center rounded-full bg-stone-100 p-2 text-gray-600 hover:bg-stone-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-2 sm:pr-10 mb-4 sm:mb-5 -mt-6 sm:mt-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
                <span className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {selectedProduct.category}
                </span>
                <span>• {selectedProduct.jpName}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-snug">
                {selectedProduct.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <div className="relative aspect-square w-full rounded-xl bg-white border border-stone-200 p-3 sm:p-4 overflow-hidden flex items-center justify-center">
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
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 border border-stone-200 p-2 text-gray-700 shadow-xs hover:bg-white transition"
                        title="รูปก่อนหน้า"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 border border-stone-200 p-2 text-gray-700 shadow-xs hover:bg-white transition"
                        title="รูปถัดไป"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-2 mt-3">
                  {selectedProduct.images.slice(0, 5).map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`aspect-square rounded-lg bg-white p-1 overflow-hidden border-2 transition ${
                        activeImageIdx === idx
                          ? 'border-rose-600 ring-2 ring-rose-600/30 scale-[1.02]'
                          : 'border-stone-200 opacity-75 hover:opacity-100'
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

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                  <span className="text-xs text-gray-500 shrink-0">แชร์สินค้า:</span>
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'https://uma-shop.vercel.app'}/?item=${selectedProduct.id}`}
                    className="flex-1 min-w-0 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs text-gray-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(selectedProduct.id)}
                    className="flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-stone-50 shrink-0"
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

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-sm text-amber-500 mb-3">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span className="font-semibold text-gray-800">{selectedProduct.rating}</span>
                    <span className="text-gray-400">
                      ({selectedProduct.reviewsCount} รีวิวจากผู้ซื้อจริง)
                    </span>
                  </div>

                  <div className="divide-y divide-dashed divide-stone-200 border-y border-dashed border-stone-200 text-xs sm:text-sm">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-gray-500">หมวดหมู่</span>
                      <span className="font-medium text-rose-600">{selectedProduct.category}</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-baseline">
                      <span className="text-gray-500">ราคา</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        {selectedProduct.price.toLocaleString()}.00 บาท
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-gray-500">สถานะสินค้า</span>
                      <span
                        className={`font-semibold ${
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
                    <div className="py-2.5 flex justify-between">
                      <span className="text-gray-500">ลงสินค้า</span>
                      <span className="text-gray-700">{selectedProduct.postedDate}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-gray-500">อัพเดทล่าสุด</span>
                      <span className="text-gray-700">{selectedProduct.updatedDate}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-stone-50 p-3.5 border border-stone-200 space-y-1.5 text-xs">
                    <p className="text-gray-600 mb-2 leading-relaxed">{selectedProduct.description}</p>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 shrink-0">แบรนด์:</span>
                      <span className="font-medium text-gray-900 text-right">{selectedProduct.brand}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 shrink-0">ลิขสิทธิ์:</span>
                      <span className="font-medium text-emerald-700 text-right">{selectedProduct.lot}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 shrink-0">ขนาด / วัสดุ:</span>
                      <span className="font-medium text-gray-900 text-right">
                        {selectedProduct.size} ({selectedProduct.material})
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 shrink-0">สภาพสินค้า:</span>
                      <span className="font-medium text-gray-900 text-right">{selectedProduct.condition}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50/70 px-4 py-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-orange-800">ร้านนี้ยืนยันตัวตนแล้ว</p>
                      <p className="text-orange-700 mt-0.5">บัตรประชาชน ✓ • ตรวจสอบประวัติการขายได้</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100">
                  {selectedProduct.status === 'สินค้าหมด' ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-3 text-sm font-semibold text-amber-800">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span>ขออภัย สินค้าหมด</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(selectedProduct)}
                        className={`flex items-center justify-center rounded-xl border px-4 py-3.5 transition ${
                          wishlistIds.includes(selectedProduct.id)
                            ? 'border-rose-200 bg-rose-50 text-rose-600'
                            : 'border-stone-200 bg-white text-gray-600 hover:bg-stone-50'
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
                        onClick={() => {
                          handleAddToCart(selectedProduct, true);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-700 py-3.5 text-sm sm:text-base text-white font-semibold hover:bg-rose-800 transition shadow-xs"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        เพิ่มลงตะกร้า (฿{selectedProduct.price.toLocaleString()})
                      </button>
                    </div>
                  )}

                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>ห่อบับเบิลหนา 3 ชั้น + กล่องแข็งกันกระแทกทุกออเดอร์</span>
                    </div>
                    <div className="flex items-center gap-1.5">
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

      {/* แถบรายการที่ถูกใจ (เต็มจอบน iPhone • ลิ้นชักด้านข้างบน iPad/Notebook) */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                  <h2 className="text-lg font-bold text-gray-900">รายการที่ปักหัวใจไว้</h2>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="py-20 text-center space-y-2 text-gray-400">
                  <Heart className="h-10 w-10 mx-auto text-gray-300" />
                  <p>ยังไม่มีสินค้าที่ปักหัวใจไว้</p>
                  <p className="text-xs">กดรูปหัวใจบนสินค้าที่สนใจเพื่อเก็บไว้ดูทีหลังได้ครับ</p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="flex gap-3 border-b pb-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-contain bg-white border border-stone-200 p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-sm font-bold text-rose-700 mt-0.5">
                          ฿{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleAddToCart(product, true);
                              setIsWishlistOpen(false);
                            }}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                          >
                            + ย้ายลงตะกร้า
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleToggleWishlist(product, e)}
                            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 p-1"
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

      {/* แถบตะกร้าสินค้า + แนบสลิปโอนเงิน (เต็มจอบน iPhone • ลิ้นชักด้านข้างบน iPad/Notebook) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">ตะกร้าสินค้าของคุณ</h2>
                <div className="flex items-center gap-2">
                  {cart.length > 0 && !isOrdered && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline px-2 py-1"
                    >
                      ล้างตะกร้าทั้งหมด
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {isOrdered ? (
                <div className="py-16 text-center space-y-3">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900">ส่งคำสั่งซื้อและสลิปเรียบร้อย!</h3>
                  <p className="text-sm text-gray-500">
                    อัปโหลดสลิปและส่งรายละเอียดคำสั่งซื้อเข้าอีเมลเรียบร้อยแล้ว จะรีบตรวจสอบยอดและจัดส่งให้เร็วที่สุดครับ
                  </p>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-20 text-center text-gray-400">ยังไม่มีสินค้าในตะกร้า</div>
              ) : (
                <div className="mt-4 space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3 border-b pb-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-contain bg-white border border-stone-200 p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-sm font-bold text-rose-700 mt-0.5">
                          ฿{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, -1)}
                            className="p-1.5 rounded border hover:bg-gray-100"
                            title="ลดจำนวน"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-medium w-6 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, 1)}
                            className="p-1.5 rounded border hover:bg-gray-100"
                            title="เพิ่มจำนวน"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(product.id)}
                            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition p-1"
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
              <form onSubmit={handleCheckout} className="pt-4 border-t space-y-3 mt-4 pb-6 sm:pb-0">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>ค่าสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>ค่าจัดส่ง (ห่อกันกระแทก)</span>
                    <span>฿{shipping}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                    <span>ยอดชำระทั้งหมด</span>
                    <span className="text-rose-700">฿{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* กล่องแสดงช่องทางโอนเงิน */}
                <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CreditCard className="h-4 w-4 text-emerald-700" />
                    <span>ช่องทางโอนเงินชำระค่าสินค้า</span>
                  </div>
                  <p className="text-gray-700">{BANK_INFO.bankName}</p>
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <span className="font-mono font-bold text-sm text-gray-900">
                      {BANK_INFO.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBankAccount}
                      className="flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                    >
                      {copiedBank ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>คัดลอกเลขบัญชี</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-600">
                    ชื่อบัญชี:{' '}
                    <span className="font-medium text-gray-900">{BANK_INFO.accountName}</span>{' '}
                    (พร้อมเพย์: {BANK_INFO.promptPay})
                  </p>
                </div>

                {/* ช่องกรอกข้อมูลจัดส่ง */}
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    required
                    placeholder="ชื่อ-นามสกุล ผู้รับ"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="ที่อยู่จัดส่ง และเบอร์โทรศัพท์"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />

                  {/* ช่องอัปโหลด หรือ วางรูปสลิปโอนเงิน */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-700">
                        แนบหลักฐานการโอนเงิน (สลิป) <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleButtonPasteSlip}
                        className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-200 transition"
                      >
                        <ClipboardPaste className="h-3 w-3" />
                        <span>วางรูปจากคลิปบอร์ด</span>
                      </button>
                    </div>

                    <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-3 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/40 transition">
                      {slipPreview ? (
                        <div className="text-center space-y-1.5">
                          <img
                            src={slipPreview}
                            alt="ตัวอย่างสลิป"
                            className="max-h-36 mx-auto rounded-lg border border-stone-200 object-contain"
                          />
                          <p className="text-[11px] text-emerald-700 font-medium">
                            บีบอัดแล้ว ({slipSizeKB} KB) • แตะเพื่อเปลี่ยนรูป หรือกด Ctrl+V วางใหม่
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2 text-gray-500 text-center">
                          <Upload className="h-5 w-5 text-emerald-600 mb-1" />
                          <span className="text-xs font-medium text-gray-700">
                            แตะเลือกรูปจากเครื่อง หรือกด Ctrl + V วางสลิป
                          </span>
                          <span className="text-[11px] text-gray-400">
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
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
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
