import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-lg font-semibold tracking-wider">
            TAARON
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm hover:text-gray-600">
              Home
            </Link>
            <div className="group relative">
              <button className="text-sm hover:text-gray-600">Shop</button>
              <div className="absolute left-0 hidden w-48 bg-white shadow-lg group-hover:block">
                <Link href="/?category=bags" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Bags & Backpacks
                </Link>
                <Link href="/?category=belts" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Belts
                </Link>
                <Link href="/?category=wallets" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Wallets
                </Link>
                <Link href="/?category=cardholder" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Card Holders
                </Link>
                <Link href="/?category=ladies" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Ladies Bags
                </Link>
                <Link href="/?category=combos" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Gift Combos
                </Link>
              </div>
            </div>
            <Link href="/" className="text-sm hover:text-gray-600">
              Our Story
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600">
              Help & Contact
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <input
              type="text"
              placeholder="Search..."
              className="hidden w-32 border-b border-gray-300 bg-white px-2 py-1 text-sm outline-none md:block"
            />
            <Link href="/dashboard" className="text-sm hover:text-gray-600">
              Account
            </Link>
            <Link href="/checkout" className="text-sm hover:text-gray-600">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
