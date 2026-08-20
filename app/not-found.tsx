export default function NotFound() {
  return (
    <div className="relative min-h-dvh bg-background">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-up/20 via-accent/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-gold/15 via-accent/5 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-20 sm:px-6">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/vertex-logo.png"
              alt="Vertex AI"
              className="h-16 w-16 rounded-2xl shadow-lg"
            />
          </div>

          {/* 404 Text */}
          <h1 className="mb-3 text-center font-playfair text-7xl font-bold tracking-tight sm:text-8xl">
            <span className="bg-gradient-to-r from-up via-gold to-accent bg-clip-text text-transparent">
              404
            </span>
          </h1>

          <p className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
            Page Not Found
          </p>

          <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist. It might have
            been moved, deleted, or perhaps you took a wrong turn in the market.
          </p>

          {/* Vertex branding */}
          <div className="mt-16 flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">Powered by</p>
            <p className="font-playfair text-lg font-bold text-foreground">
              Vertex <span className="text-accent">AI</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
