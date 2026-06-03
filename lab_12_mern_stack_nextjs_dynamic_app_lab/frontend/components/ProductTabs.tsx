"use client";
import { useState, useEffect } from 'react';

export default function ProductTabs() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featured = products.filter(p => p.category === 'Featured').slice(0, 4);
  const special = products.filter(p => p.category === 'Special').slice(0, 4);
  const popular = products.filter(p => p.category === 'Popular').slice(0, 4);

  // Helper to render a column of products
  const renderColumn = (title: string, items: any[], seeAllText: string) => (
    <div className="flex flex-col">
      <h3 className="text-sm font-serif tracking-widest text-gray-500 uppercase mb-8 border-b border-gray-200 pb-2 inline-block">
        {title}
      </h3>
      <div className="flex-1 flex flex-col space-y-6 mb-8">
        {loading ? (
          <div className="text-gray-400 italic text-sm">Loading...</div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center group cursor-pointer">
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden shrink-0 group-hover:border-orange-500 transition">
                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" /> : <span className="text-xs text-gray-400 italic px-2 text-center">Image</span>}
              </div>
              <div className="ml-4 flex flex-col justify-center border-b border-gray-100 border-dashed pb-4 flex-1">
                <h4 className="text-xs text-gray-800 font-serif mb-1 leading-tight">{item.title}</h4>
                <div className="text-orange-500 font-bold text-sm mb-2">£{item.price}</div>
                <button className="self-start border border-gray-300 text-[10px] uppercase tracking-widest px-4 py-1 rounded-full text-gray-600 hover:border-orange-500 hover:text-orange-500 transition">
                  Detail
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 italic text-sm">No items found.</div>
        )}
      </div>
      <button className="bg-gray-100 text-gray-500 text-[10px] uppercase font-bold tracking-widest py-3 rounded hover:bg-gray-200 transition">
        {seeAllText}
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Category Collections Promo Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
         {/* Chairs Collection */}
         <div className="bg-gray-50 flex items-center p-6 border border-gray-100 group cursor-pointer hover:shadow-md transition">
            <div className="w-1/2">
               <h3 className="text-xl font-serif text-gray-800 uppercase tracking-widest leading-none mb-1">Chairs</h3>
               <p className="text-orange-500 font-serif italic text-sm">Collection</p>
            </div>
            <div className="w-1/2 h-24 flex items-center justify-center text-gray-400 group-hover:scale-105 transition transform overflow-hidden">
               <img src="/imagess/2.jfif" alt="Chairs Collection" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
            </div>
         </div>
         {/* Beds Collection */}
         <div className="bg-gray-50 flex items-center p-6 border border-gray-100 group cursor-pointer hover:shadow-md transition">
            <div className="w-1/2">
               <h3 className="text-xl font-serif text-gray-800 uppercase tracking-widest leading-none mb-1">Beds</h3>
               <p className="text-orange-500 font-serif italic text-sm">Collection</p>
            </div>
            <div className="w-1/2 h-24 flex items-center justify-center text-gray-400 group-hover:scale-105 transition transform overflow-hidden">
               <img src="/imagess/4.jfif" alt="Beds Collection" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
            </div>
         </div>
         {/* Tables Collection */}
         <div className="bg-gray-50 flex items-center p-6 border border-gray-100 group cursor-pointer hover:shadow-md transition">
            <div className="w-1/2">
               <h3 className="text-xl font-serif text-gray-800 uppercase tracking-widest leading-none mb-1">Tables</h3>
               <p className="text-orange-500 font-serif italic text-sm">Collection</p>
            </div>
            <div className="w-1/2 h-24 flex items-center justify-center text-gray-400 group-hover:scale-105 transition transform overflow-hidden">
               <img src="/imagess/3.jfif" alt="Tables Collection" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
            </div>
         </div>
      </div>

      {/* 3-Column Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {renderColumn('Featured', featured, 'See All Feature')}
        {renderColumn('Special', special, 'See All Special')}
        {renderColumn('Popular', popular, 'See All Popular')}
      </div>
    </div>
  );
}
