'use client';

import { useState } from 'react';
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
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  jpName: string;
  character: string;
  category: 'ฟิกเกอร์' | 'ตุ๊กตา' | 'พวงกุญแจ';
  price: number;
  status: 'พร้อมส่ง' | 'พรีออเดอร์';
  image: string;
  brand: string;
  lot: string;
  size: string;
  material: string;
  condition: string;
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
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=600',
    brand: 'Banpresto (Bandai Spirits)',
    lot: 'ลิขสิทธิ์แท้ 100% (Lot JP มีสติ๊กเกอร์แมวทอง)',
    size: 'สูงประมาณ 18 ซม. (พร้อมฐานตั้งโชว์)',
    material: 'PVC / ABS ลงสีสำเร็จ',
    condition: 'มือ 1 ในซีล กล่องคม 100%',
    rating: 4.9,
    reviewsCount: 38,
    description: 'ฟิกเกอร์ Special Week รายละเอียดคมชัด ลงสีไล่เฉดสวยงาม มาพร้อมฐานตั้งโชว์ในกล่อง เหมาะสำหรับตั้งสะสมหรือมอบเป็นของขวัญ',
  },
  {
    id: 'uma-002',
    name: 'ฟิกเกอร์ Tokai Teio — Beyond the Horizon',
    jpName: 'トウカイテイオー',
    character: 'Tokai Teio',
    category: 'ฟิกเกอร์',
    price: 1450,
    status: 'พร้อมส่ง',
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=600',
    brand: 'Kotobukiya',
    lot: 'ลิขสิทธิ์แท้ 100% (Lot JP)',
    size: 'สูงประมาณ 21 ซม. (สเกล 1/7)',
    material: 'PVC / ABS',
    condition: 'มือ 1 ในซีล กล่องสวย',
    rating: 5.0,
    reviewsCount: 24,
    description: 'โทไค เตโอ ในท่าโพสสุดร่าเริง เก็บรายละเอียดชุดแข่งและเครื่องประดับครบถ้วน',
  },
  {
    id: 'uma-003',
    name: 'ตุ๊กตา Nesoberi — Oguri Cap (ไซส์ M)',
    jpName: 'オグリキャップ',
    character: 'Oguri Cap',
    category: 'ตุ๊กตา',
    price: 790,
    status: 'พร้อมส่ง',
    image: 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?auto=format&fit=crop&q=80&w=600',
    brand: 'SEGA Prize',
    lot: 'ลิขสิทธิ์แท้ 100% (ป้ายห้อยครบ)',
    size: 'ยาวประมาณ 30 ซม.',
    material: 'ผ้าโพลีเอสเตอร์ขนนุ่มพิเศษ',
    condition: 'มือ 1 ในถุงซีลเดิมจากญี่ปุ่น',
    rating: 4.8,
    reviewsCount: 51,
    description: 'ตุ๊กตาท่านอนสุดนุ่มนิ่ม โอกุริ แคป ป้ายแท็กครบถ้วน เหมาะสำหรับกอดหรือวางตกแต่งเตียง',
  },
  {
    id: 'uma-004',
    name: 'พวงกุญแจอะคริลิค Manhattan Cafe',
    jpName: 'マンハッタンカフェ',
    character: 'Manhattan Cafe',
    category: 'พวงกุญแจ',
    price: 250,
    status: 'พรีออเดอร์',
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&q=80&w=600',
    brand: 'Cygames Official',
    lot: 'สั่งตรงจาก Cygames Store (JP)',
    size: 'สูงประมาณ 7 ซม.',
    material: 'อะคริลิคใสหนา 3 มม. พิมพ์ลายสองด้าน',
    condition: 'มือ 1 ในซอง',
    rating: 4.9,
    reviewsCount: 15,
    description: 'พวงกุญแจอะคริลิคตัวละคร Manhattan Cafe ลายเส้นพิเศษ พร้อมตะขอเกี่ยวสีเงิน',
  },
];

export default function UmaShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  const categories = ['ทั้งหมด', 'ฟิกเกอร์', 'ตุ๊กตา', 'พวงกุญแจ'];

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.character.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    setTimeout(() => {
      setCart([]);
      setIsOrdered(false);
      setCustomerName('');
      setAddress('');
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen">
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

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
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
      </header>

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
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      product.status === 'พร้อมส่ง'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {product.status}
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
          ))}
        </div>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-600 shadow hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="bg-stone-100 flex items-center justify-center p-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="max-h-[420px] w-full rounded-xl object-cover shadow-md"
              />
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
                  <span className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <span>• {selectedProduct.jpName}</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>

                <div className="flex items-center gap-1.5 mt-2 text-sm text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="font-semibold text-gray-800">{selectedProduct.rating}</span>
                  <span className="text-gray-400">
                    ({selectedProduct.reviewsCount} รีวิวจากผู้ซื้อจริง)
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="mt-4 rounded-xl bg-stone-50 p-4 border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">แบรนด์ผู้ผลิต:</span>
                    <span className="font-medium text-gray-900">{selectedProduct.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">การรับรองลิขสิทธิ์:</span>
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
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-sm text-gray-500">ราคาสุทธิ</span>
                  <span className="text-3xl font-bold text-rose-700">
                    ฿{selectedProduct.price.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-700 py-3.5 text-white font-semibold hover:bg-rose-800 transition"
                >
                  <ShoppingBag className="h-5 w-5" />
                  เพิ่มลงตะกร้า
                </button>

                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>ห่อบับเบิลหนา 3 ชั้น + กล่องแข็งกันกระแทกทุกออเดอร์</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>คืนเงิน 100% หากสินค้าเสียหายจากการขนส่ง (เมื่อมีวิดีโอแกะกล่อง)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">ตะกร้าสินค้าของคุณ</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {isOrdered ? (
                <div className="py-16 text-center space-y-3">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900">รับคำสั่งซื้อเรียบร้อย!</h3>
                  <p className="text-sm text-gray-500">
                    ขอบคุณที่อุดหนุนครับ ทางร้านจะรีบจัดส่งให้เร็วที่สุด
                  </p>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-20 text-center text-gray-400">ยังไม่มีสินค้าในตะกร้า</div>
              ) : (
                <div className="mt-4 space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3 border-b pb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover bg-gray-100"
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
                            onClick={() => handleUpdateQty(product.id, -1)}
                            className="p-1 rounded border hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-medium w-6 text-center">{quantity}</span>
                          <button
                            onClick={() => handleUpdateQty(product.id, 1)}
                            className="p-1 rounded border hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() =>
                              setCart((prev) => prev.filter((i) => i.product.id !== product.id))
                            }
                            className="ml-auto text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
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
                    <span className="text-rose-700">฿{(subtotal + shipping).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
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
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  ยืนยันการสั่งซื้อ (PromptPay / โอนเงิน)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
