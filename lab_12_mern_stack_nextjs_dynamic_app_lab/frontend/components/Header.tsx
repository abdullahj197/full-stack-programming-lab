import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-100">
        
        {/* Logo (Left) */}
        <div className="text-3xl font-bold text-gray-800 tracking-tight md:w-1/4">
          <Link href="/">
            <span className="text-orange-500">R</span>ustik Plank
          </Link>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex space-x-6 text-[11px] uppercase tracking-widest text-gray-800 font-serif md:w-2/4 justify-center">
          <Link href="/" className="hover:text-orange-500 italic">Home</Link>
          <Link href="/blog" className="hover:text-orange-500 italic">Blog</Link>
          <Link href="/about" className="hover:text-orange-500 italic">About Us</Link>
          <Link href="/contact" className="hover:text-orange-500 italic">Contact Us</Link>
        </nav>

        {/* Right Info */}
        <div className="flex flex-col items-end text-xs text-gray-600 md:w-1/4">
          <div className="flex space-x-2 mb-2 items-center">
             <span className="font-serif italic cursor-pointer hover:text-orange-500">Twitter</span>
             <span className="font-serif italic cursor-pointer hover:text-orange-500">G+</span>
             <span className="font-serif italic cursor-pointer hover:text-orange-500">FB</span>
             <span className="ml-4 text-gray-800 font-semibold tracking-widest">01562 822479</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-serif italic cursor-pointer hover:text-orange-500">My Account (Login/Register)</span>
            <div className="flex items-center text-orange-500 cursor-pointer text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <span className="font-semibold text-xs text-gray-800">0 item</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Categories & Search */}
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex space-x-8 text-xs font-semibold text-gray-600 tracking-widest md:mx-auto">
          <Link href="/category/beds" className="hover:text-orange-500 transition">BEDS</Link>
          <Link href="/category/cabinets" className="hover:text-orange-500 transition">CABINETS</Link>
          <Link href="/category/bookcases" className="hover:text-orange-500 transition">BOOKCASES</Link>
          <Link href="/category/boxes" className="hover:text-orange-500 transition">BOXES</Link>
          <Link href="/category/chairs" className="hover:text-orange-500 transition">CHAIRS</Link>
          <Link href="/category/tables" className="hover:text-orange-500 transition">TABLES</Link>
        </div>
        
        {/* Search */}
        <div className="mt-4 md:mt-0 absolute right-4">
          <div className="relative border border-gray-300 rounded overflow-hidden">
            <input type="text" placeholder="Search..." className="px-3 py-1 text-xs focus:outline-none w-48 text-gray-500 italic font-serif" />
            <button className="absolute right-0 top-0 h-full px-2 bg-gray-100 hover:bg-gray-200 border-l border-gray-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
