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
} from 'lucide-react';

const WEB3FORMS_ACCESS_KEY = '138683be-375e-4dce-a38e-3037a33dbd6e';

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

export default function UmaShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // ระบบปักหัวใจ (Wishlist / รายการโปรด)
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // ระบบตะกร้าสินค้า
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ข้อมูลสั่งซื้อและแนบสลิป
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  // ฟังก์ชันกลางสำหรับนำไฟล์รูปมาแสดงตัวอย่าง
  const applySlipFile = (file: File) => {
    setSlipFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSlipPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ดักจับการกด Ctrl + V ทั้งหน้าจอทันทีที่เปิดตะกร้าอยู่ (ไม่ต้องคลิกในกรอบก่อน)
  useEffect(() => {
    if (!isCartOpen) return;

    const handleWindowPaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      // 1. ตรวจสอบจากไฟล์โดยตรง (เช่น ก๊อปไฟล์รูปจากโฟลเดอร์ หรือจาก LINE)
      if (clipboardData.files && clipboardData.files.length > 0) {
        const file = clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          applySlipFile(file);
          return;
        }
      }

      // 2. ตรวจสอบจาก items (เช่น แคปหน้าจอ PrintScreen / Snipping Tool / คัดลอกรูปในเว็บ)
      if (clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              e.preventDefault();
              const namedFile = new File([file], file.name || 'pasted-slip.png', {
                type: file.type,
              });
              applySlipFile(namedFile);
              return;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => window.removeEventListener('paste', handleWindowPaste);
  }, [isCartOpen]);

  // ฟังก์ชันสำหรับปุ่มกดวางรูปจากคลิปบอร์ดด้วยเมาส์
  const handleButtonPasteSlip = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((type) => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'pasted-slip.png', { type: imageType });
          applySlipFile(file);
          return;
        }
      }
      alert('ไม่พบรูปภาพในคลิปบอร์ด กรุณาแคปหน้าจอหรือก๊อปปี้รูปสลิปก่อนกดวางครับ');
    } catch {
      alert('เบราว์เซอร์ไม่อนุญาตให้เข้าถึงคลิปบอร์ดผ่านปุ่ม กรุณากด Ctrl + V บนคีย์บอร์ดแทนครับ');
    }
  };

  // โหลดข้อมูลรายการโปรด (Wishlist) จากเครื่อง
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

  // บันทึกรายการโปรดลงเครื่องอัตโนมัติ
  useEffect(() => {
    if (isWishlistLoaded) {
      localStorage.setItem('uma_shop_wishlist', JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isWishlistLoaded]);

  // โหลดข้อมูลตะกร้าจากเครื่อง
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

  // บันทึกตะกร้าลงเครื่องอัตโนมัติ
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('uma_shop_cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  const categories = ['ทั้งหมด', 'ฟิกเกอร์', 'ตุ๊กตา', 'พวงกุญแจ'];

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.character.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIdx(0);
    setCopiedLink(false);
  };

  const handleCopyShareLink = (productId: string) => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?item=${productId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyBankAccount = () => {
    navigator.clipboard.writeText(BANK_INFO.accountNumber.replace(/-/g, ''));
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
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
    if (!slipFile) {
      alert('กรุณาแนบหรือวางรูปสลิปโอนเงินเพื่อเป็นหลักฐานการสั่งซื้อครับ');
      return;
    }

    setIsSubmitting(true);

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
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append(
        'subject',
        `[Tracen Collectibles] คำสั่งซื้อใหม่ + สลิปโอนเงิน จากคุณ ${customerName} (฿${grandTotal.toLocaleString()})`
      );
      formData.append('from_name', 'Tracen Collectibles Store');
      formData.append('ชื่อผู้รับ', customerName);
      formData.append('ที่อยู่จัดส่งและเบอร์โทร', address);
      formData.append('รายการสินค้า', `\n${itemListText}`);
      formData.append('ค่าสินค้า', `฿${subtotal.toLocaleString()}`);
      formData.append('ค่าจัดส่ง', `฿${shipping}`);
      formData.append('ยอดชำระทั้งหมด', `฿${grandTotal.toLocaleString()}`);
      formData.append('เวลาสั่งซื้อ', orderTime);
      formData.append('attachment', slipFile, slipFile.name || 'slip.png');

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      console.error('ส่งอีเมลไม่สำเร็จ:', err);
    }

    setIsSubmitting(false);
    setIsOrdered(true);

    setTimeout(() => {
      setCart([]);
      localStorage.removeItem('uma_shop_cart');
      setIsOrdered(false);
      setCustomerName('');
      setAddress('');
      setSlipFile(null);
      setSlipPreview(null);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      {/* แถบเมนูด้านบน */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
              U
            </span>
            <span className="font-bold text-lg text-emerald-950">Tracen Collectibles</span>
          </div>

          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อตัวละคร เช่น Special Week, Oguri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-stone-100 pl-9 pr-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* ปุ่มรายการที่ถูกใจ (หัวใจ) + ปุ่มตะกร้า */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
              title="รายการที่ปักหัวใจไว้"
            >
              <Heart
                className={`h-4 w-4 ${
                  wishlistIds.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-gray-500'
                }`}
              />
              <span className="hidden md:inline">ถูกใจ</span>
              {wishlistIds.length > 0 && (
                <span className="rounded-full bg-rose-100 text-rose-700 px-1.5 py-0.5 text-xs font-bold">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>ตะกร้า</span>
              {totalItems > 0 && (
                <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* แบนเนอร์ร้าน */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>สินค้าลิขสิทธิ์แท้จากญี่ปุ่น 100% คัดสภาพกล่อง</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            ศูนย์รวมฟิกเกอร์และของสะสม Uma Musume: Pretty Derby
          </h1>
          <p className="text-emerald-100 text-sm md:text-base">
            คัดสรรงานแท้ทั้งมือ 1 ในซีล และของสะสมหายาก แพ็กบับเบิลหนาพิเศษ ส่งไวทั่วไทย
          </p>
        </div>
      </section>

      {/* รายการสินค้า */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">แสดง {filteredProducts.length} รายการ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isLiked = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => handleOpenProduct(product)}
                className="group cursor-pointer rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square bg-white p-3 border-b border-stone-100 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <span
                      className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                      onClick={(e) => handleToggleWishlist(product.id, e)}
                      className="absolute top-2.5 right-2.5 z-10 rounded-full bg-white/90 p-2 shadow-sm border border-stone-200 hover:scale-110 transition"
                      title={isLiked ? 'เอาออกจากรายการที่ถูกใจ' : 'ปักหัวใจเก็บไว้ดูทีหลัง'}
                    >
                      <Heart
                        className={`h-4 w-4 transition ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'
                        }`}
                      />
                    </button>

                    <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[11px] text-white">
                      {product.images.length} รูป
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-emerald-700 font-medium">{product.character}</p>
                    <h3 className="font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-emerald-700">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span>({product.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-stone-100">
                  <span className="text-lg font-bold text-rose-700">
                    ฿{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 group-hover:underline">
                    ดูรายละเอียด →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Pop-up รายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[92vh] overflow-y-auto p-6 md:p-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-stone-100 p-2 text-gray-600 hover:bg-stone-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-10 mb-5">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
                <span className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {selectedProduct.category}
                </span>
                <span>• {selectedProduct.jpName}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="aspect-square w-full rounded-xl bg-white border border-stone-200 p-4 overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="h-full w-full object-contain"
                  />
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
                    className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs text-gray-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(selectedProduct.id)}
                    className="flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-stone-50"
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

                  <div className="divide-y divide-dashed divide-stone-200 border-y border-dashed border-stone-200 text-sm">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-gray-500">หมวดหมู่</span>
                      <span className="font-medium text-rose-600">{selectedProduct.category}</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-baseline">
                      <span className="text-gray-500">ราคา</span>
                      <span className="text-xl font-bold text-gray-900">
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
                    <div className="flex justify-between">
                      <span className="text-gray-500">แบรนด์:</span>
                      <span className="font-medium text-gray-900">{selectedProduct.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ลิขสิทธิ์:</span>
                      <span className="font-medium text-emerald-700">{selectedProduct.lot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ขนาด / วัสดุ:</span>
                      <span className="font-medium text-gray-900">
                        {selectedProduct.size} ({selectedProduct.material})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">สภาพสินค้า:</span>
                      <span className="font-medium text-gray-900">{selectedProduct.condition}</span>
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
                        onClick={() => handleToggleWishlist(selectedProduct.id)}
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
                          handleAddToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-700 py-3.5 text-white font-semibold hover:bg-rose-800 transition shadow-sm"
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

      {/* แถบรายการที่ถูกใจ (Wishlist / ปักหัวใจไว้ก่อน) */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                  <h2 className="text-lg font-bold text-gray-900">รายการที่ปักหัวใจไว้</h2>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
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
                        className="h-16 w-16 rounded-lg object-contain bg-white border border-stone-200 p-1"
                      />
                      <div className="flex-1">
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
                              handleAddToCart(product);
                              setIsWishlistOpen(false);
                            }}
                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                          >
                            + ย้ายลงตะกร้า
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleWishlist(product.id)}
                            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-600"
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

      {/* แถบตะกร้าสินค้า + แนบสลิปโอนเงิน */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
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
                    className="p-1.5 rounded-full hover:bg-gray-100"
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
                    ทางร้านได้รับข้อมูลออเดอร์และสลิปโอนเงินเรียบร้อยแล้ว จะรีบจัดส่งให้เร็วที่สุดครับ
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
                        className="h-16 w-16 rounded-lg object-contain bg-white border border-stone-200 p-1"
                      />
                      <div className="flex-1">
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
                            className="p-1 rounded border hover:bg-gray-100"
                            title="ลดจำนวน"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-medium w-6 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, 1)}
                            className="p-1 rounded border hover:bg-gray-100"
                            title="เพิ่มจำนวน"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(product.id)}
                            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition"
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
              <form onSubmit={handleCheckout} className="pt-4 border-t space-y-3 mt-4">
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
                    ชื่อบัญชี: <span className="font-medium text-gray-900">{BANK_INFO.accountName}</span> (พร้อมเพย์: {BANK_INFO.promptPay})
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
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="ที่อยู่จัดส่ง และเบอร์โทรศัพท์"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
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
                        className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-200 transition"
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
                            คลิกเปลี่ยนรูป หรือกด Ctrl+V วางรูปใหม่ ({slipFile?.name || 'pasted-slip.png'})
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2 text-gray-500">
                          <Upload className="h-5 w-5 text-emerald-600 mb-1" />
                          <span className="text-xs font-medium text-gray-700">
                            คลิกเลือกรูป หรือกด Ctrl + V วางสลิปได้ทันที
                          </span>
                          <span className="text-[11px] text-gray-400">
                            รองรับ JPG, PNG และการแคปหน้าจอวางโดยตรง
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
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>กำลังส่งคำสั่งซื้อและสลิป...</span>
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
