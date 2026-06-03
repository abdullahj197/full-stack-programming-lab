import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-12">
      {/* Brands section */}
      <div className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition duration-500">
          <div className="text-2xl font-bold text-green-500 tracking-tighter">f4b</div>
          <div className="text-xl font-bold text-blue-900 italic">QANTAS</div>
          <div className="text-xl font-bold text-blue-500 italic">INTERTEK</div>
          <div className="text-xl font-bold text-blue-800">GE Money</div>
          <div className="text-xl font-bold text-black tracking-tighter">Rockwell Collins</div>
          <div className="text-xl font-bold text-red-600">LexisNexis</div>
          <div className="text-xl font-bold text-orange-400">ohtlmedia</div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="bg-[#e5e5e5] border-t-2 border-gray-300 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-orange-500 font-serif italic text-lg mb-6">Informations</h4>
            <ul className="space-y-3 text-[11px] uppercase tracking-wider text-gray-600 font-bold">
              <li><Link href="#" className="hover:text-orange-500">Terms and conditions</Link></li>
              <li><Link href="#" className="hover:text-orange-500">About us</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Sitemap</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Contact</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Return policy</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Suppliers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-orange-500 font-serif italic text-lg mb-6">My Account</h4>
            <ul className="space-y-3 text-[11px] uppercase tracking-wider text-gray-600 font-bold">
              <li><Link href="#" className="hover:text-orange-500">Your Account</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Information</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Addresses</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Orders history</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Delivery Information</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Search Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-orange-500 font-serif italic text-lg mb-6">Help and More</h4>
            <ul className="space-y-3 text-[11px] uppercase tracking-wider text-gray-600 font-bold">
              <li><Link href="#" className="hover:text-orange-500">New products</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Top sellers</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Manufacturers</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Suppliers</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Specials</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-orange-500 font-serif italic text-lg mb-6">Links</h4>
            <ul className="space-y-3 text-[11px] uppercase tracking-wider text-gray-600 font-bold">
              <li><Link href="#" className="hover:text-orange-500">Delivery</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Service</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Gift Cards</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Mobile</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Manufacturers</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Orange Bar */}
      <div className="bg-orange-500 text-center py-4 text-[10px] text-white tracking-widest uppercase opacity-90">
        &copy; 2026 Rustik Plank Furniture - All Rights Reserved.
      </div>
    </footer>
  );
}
