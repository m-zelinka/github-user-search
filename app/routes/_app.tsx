import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Form, Outlet, useNavigation, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSpinDelay } from "spin-delay";

export default function Component() {
  return (
    <div className="min-h-full bg-gray-100">
      <header className="bg-indigo-600 pb-24 [color-scheme:dark]">
        <div className="mx-auto max-w-3xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between py-5">
            <div className="flex items-center max-lg:px-2">
              <div className="flex-none">
                <Logo className="h-8 w-auto text-indigo-300" />
              </div>
            </div>
            <div className="flex flex-1 justify-end px-2 md:ml-6">
              <Form className="w-full max-w-lg md:max-w-xs">
                <SearchBar />
              </Form>
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

function SearchBar() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const navigation = useNavigation();
  const searching = new URLSearchParams(navigation.location?.search).has("q");
  const showSpinner = useSpinDelay(searching);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search input value with the URL Search Params
  useEffect(() => {
    const searchField = inputRef.current;
    if (searchField) {
      searchField.value = q ?? "";
    }
  }, [q]);

  // Focus input on key press
  const keyShortcut = "/";
  useHotkeys(
    keyShortcut,
    () => {
      const searchField = inputRef.current;
      if (searchField) {
        searchField.focus();
        searchField.select();
      }
    },
    { preventDefault: true },
  );

  return (
    <div className="group relative text-white focus-within:text-gray-600">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        aria-hidden
      >
        {showSpinner ? (
          <ArrowPathIcon className="size-5 animate-spin group-focus-within:text-gray-400" />
        ) : (
          <MagnifyingGlassIcon className="size-5 group-focus-within:text-gray-400" />
        )}
      </div>
      <input
        ref={inputRef}
        type="search"
        name="q"
        id="q"
        defaultValue={q ?? undefined}
        className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:[color-scheme:light] focus:placeholder:text-gray-500 sm:text-sm/6"
        placeholder="Search"
        aria-label="Search users"
        aria-keyshortcuts={keyShortcut}
      />
      <div
        className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5"
        aria-hidden
      >
        <kbd className="inline-flex items-center rounded border border-white/30 px-1 font-sans text-xs text-white group-focus-within:border-gray-200 group-focus-within:text-gray-400">
          {keyShortcut}
        </kbd>
      </div>
    </div>
  );
}
