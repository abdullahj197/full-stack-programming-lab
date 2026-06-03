export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-white mb-12">
      {/* Complex curved background replicating the design */}
      <div className="absolute inset-0 z-0">
        <svg viewBox="0 0 1440 600" preserveAspectRatio="none" className="w-full h-full">
          {/* Main grey sweeping shape: Pushed further down to stay below text */}
          <path d="M0,0 L1440,0 L1440,450 Q720,650 0,450 Z" fill="#e5e5e5" />
          {/* Orange curve accent */}
          <path d="M0,450 Q720,650 1440,450 L1440,465 Q720,665 0,465 Z" fill="#f97316" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between py-24 min-h-[550px]">
        {/* Left Side: Product Image (Chair) */}
        <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
          <div className="w-[500px] h-[400px] flex items-center justify-center">
             <img src="/imagess/1.jfif" alt="Chair" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        </div>

        {/* Right Side: Text & Price */}
        <div className="w-full md:w-1/2 text-right pl-0 md:pl-16 flex flex-col items-end">
          {/* Downward pointing orange triangle */}
          <div className="mb-6 mr-12">
            <svg width="30" height="30" viewBox="0 0 100 100" className="opacity-80">
               <polygon points="0,0 100,0 50,100" fill="#f97316" />
            </svg>
          </div>
          
          <p className="text-gray-600 font-serif italic text-lg leading-relaxed mb-8 max-w-md text-right">
            This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.
          </p>

          <div className="flex items-center justify-end mb-6">
            <span className="text-5xl font-light text-orange-500 mr-2">£</span>
            <span className="text-7xl font-bold text-orange-500 tracking-tighter">129</span>
            <span className="text-[10px] font-bold text-gray-800 ml-2 tracking-widest mt-4">OUR PRICE</span>
          </div>

          <button className="bg-gray-200 border border-gray-300 rounded-full px-6 py-2 text-[11px] font-bold tracking-widest text-gray-700 hover:bg-orange-500 hover:text-white transition group flex items-center justify-center shadow-sm">
            ADD TO
            <span className="ml-2 bg-orange-100 group-hover:bg-white rounded-full p-1 text-orange-500">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
               </svg>
            </span>
          </button>
        </div>
      </div>
      
      {/* Floating geometric detail near bottom right */}
      <div className="absolute right-24 bottom-12 z-20">
         <svg width="40" height="80" viewBox="0 0 40 80">
            {/* Two left-pointing chevrons, intertwined */}
            <polyline points="40,0 10,30 40,60" fill="none" stroke="#6b7280" strokeWidth="2" />
            <polyline points="30,20 0,50 30,80" fill="none" stroke="#f97316" strokeWidth="2" />
         </svg>
      </div>
    </div>
  );
}
