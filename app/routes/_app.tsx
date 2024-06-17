import { Outlet } from "@remix-run/react";

export default function Component() {
  return (
    <div className="min-h-full bg-gray-100">
      <header className="bg-indigo-600 pb-24">
        <div className="mx-auto max-w-3xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center max-lg:px-2">
              <div className="flex-none">
                <Logo className="h-8 w-auto text-indigo-300" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="-mt-24 pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M200 0v200h-60v-69.967C139.982 168.678 108.649 200 70 200c-38.66 0-70-31.34-70-70s31.34-70 70-70c38.649 0 69.982 31.322 70 69.967V60H0V0h200Z" />
    </svg>
  );
}
