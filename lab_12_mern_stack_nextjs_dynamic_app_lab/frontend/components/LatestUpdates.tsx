export default function LatestUpdates() {
  return (
    <div className="container mx-auto px-4 py-16 border-t border-gray-100 mt-12">
      <div className="text-center mb-12">
        <h2 className="text-xl font-serif italic text-gray-600">Latest Updates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white group cursor-pointer flex flex-col">
            <div className="h-48 bg-gray-100 mb-4 overflow-hidden border border-gray-200 flex items-center justify-center text-gray-400 italic">
               <img src={`/imagess/4.jfif`} alt={`Blog post thumbnail`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h4 className="text-sm font-serif font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Lorem ipsum</h4>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed font-serif italic flex-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="self-end border border-gray-300 text-[9px] font-bold text-gray-600 uppercase tracking-widest py-1 px-3 hover:border-orange-500 hover:text-orange-500 transition">
              READ MORE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
