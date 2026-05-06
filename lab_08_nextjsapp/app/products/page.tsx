import Link from 'next/link';

const products = [
  { id: '1', title: 'MacBook Pro', description: 'M3 Chip, 16GB RAM', price: '$1999' },
  { id: '2', title: 'iPhone 15', description: 'Dynamic Island, 128GB', price: '$799' },
  { id: '3', title: 'AirPods Pro', description: 'Active Noise Cancellation', price: '$249' },
];

export default function ProductList() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Products</h1>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-bold">{product.title}</h2>
            <p className="text-gray-500">{product.description}</p>
            <p className="text-blue-600 font-semibold">{product.price}</p>
            {/* Link to dynamic page */}
            <Link href={`/products/${product.id}`} className="inline-block mt-2 text-blue-500 hover:underline">
              View Product Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}