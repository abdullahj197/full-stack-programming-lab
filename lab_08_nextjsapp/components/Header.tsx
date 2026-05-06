import Link from 'next/link'; 

export default function Header() { // Ensure "export default" is here
  return (
    <nav className="p-4 bg-blue-600 text-white flex gap-4">
      <Link href="/">Home</Link> 
      <Link href="/about">About</Link> 
      <Link href="/contact">Contact</Link>
      <Link href="/products">Products</Link>
    </nav>
  );
}