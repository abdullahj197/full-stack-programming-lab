export default function HotDeal() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-serif italic text-gray-600">Hot Deal</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Left Deal */}
        <div className="bg-gray-100 flex flex-col p-8 relative border border-gray-200 h-64 overflow-hidden group">
          <img src="/imagess/5.jfif" alt="Elite Collection" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-700" />
          <div className="relative z-10 flex flex-col items-start w-full h-full">
             <h3 className="text-2xl font-serif text-gray-800 tracking-wider">Elite Collection</h3>
             <p className="text-orange-500 font-serif italic text-sm">Deluxe Furniture</p>
             <div className="absolute bottom-4 right-4 bg-orange-500 text-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg">
                <span className="text-2xl font-bold leading-none">35%</span>
                <span className="text-[10px] uppercase tracking-widest mt-1">Sale Off</span>
             </div>
          </div>
        </div>

        {/* Right Deal */}
        <div className="bg-gray-200 flex flex-col p-8 relative border border-gray-300 h-64 overflow-hidden group">
          <img src="/imagess/6.jfif" alt="Reclaimed crafted" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-700" />
          <div className="relative z-10 flex flex-col items-end w-full h-full text-right">
             <h3 className="text-2xl font-serif text-gray-800 tracking-wider mb-2">Reclaimed and hand crafted</h3>
             <div className="flex flex-col items-end">
                <span className="text-orange-500 font-serif italic text-xl">Sale OFF</span>
                <span className="text-6xl font-bold text-gray-900 tracking-tighter leading-none">50%</span>
             </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#fefce8] border border-[#fef08a] p-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center md:items-baseline md:space-x-4">
           <div className="text-3xl font-bold text-[#14b8a6] uppercase tracking-tighter mb-2 md:mb-0">
             BUY ONLINE
             <div className="text-orange-500 text-sm tracking-widest">PICK UP IN STORE</div>
           </div>
           <div className="hidden md:block w-px h-12 bg-gray-300 mx-4"></div>
           <div>
             <h4 className="text-lg font-bold text-gray-800 uppercase tracking-widest">NOW AVAILABLE IN OUR STORE SYSTEM</h4>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
               AVAILABLE ON SELECT PRODUCTS. <a href="#" className="text-orange-500 underline ml-1 font-serif italic lowercase text-xs">Learn more</a>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
