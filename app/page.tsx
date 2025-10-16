import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center overflow-hidden">
          <img 
            src="/icon.png" 
            alt="Bead Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-3">
          Bead
        </h1>
        <p className="text-xl text-purple-400 mb-6 font-semibold">
          Your Web3 Wingman
        </p>

        {/* Description */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          Track crypto projects, get AI-powered summaries, and stay ahead of the curve—all inside Farcaster.
        </p>

        {/* CTA Button */}
        <Link
          href="/frame"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105"
        >
          Open in Farcaster
        </Link>

        {/* Features */}
        <div className="mt-12 space-y-4 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              🔔
            </div>
            <div>
              <h3 className="text-white font-semibold">Daily Updates</h3>
              <p className="text-gray-400 text-sm">Never miss important news</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              🤖
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Summaries</h3>
              <p className="text-gray-400 text-sm">Get the signal, skip the noise</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              ⛓️
            </div>
            <div>
              <h3 className="text-white font-semibold">Onchain Tracking</h3>
              <p className="text-gray-400 text-sm">Record your activity on Base</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}