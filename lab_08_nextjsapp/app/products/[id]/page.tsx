// ADD THIS LINE AT THE TOP
import Link from 'next/link'; 

export default function ProductDetail({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-blue-400">
      <h1 className="text-3xl font-bold mb-4">Product Details</h1>
      <p className="text-xl">
        Viewing details for Product ID: <span className="text-blue-600 font-mono">{params.id}</span>
      </p>
      
      <div className="mt-8 p-4 bg-white shadow rounded">
        <p>This page is dynamically rendered using the <code>[id]</code> route segment.</p>
      </div>

      <div className="mt-4">
         {/* This will now work because Link is defined */}
         <Link href="/products" className="text-sm text-gray-500 underline">
           ← Back to List
         </Link>
      </div>
    </div>
  );
}
