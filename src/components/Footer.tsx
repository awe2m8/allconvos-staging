import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/5 py-12 bg-ocean-950">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-mono">
                <div>
                    &copy; {new Date().getFullYear()} allconvos. All rights reserved.
                </div>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <Link href="/contact" className="hover:text-neon">Contact</Link>
                    <Link href="#" className="hover:text-neon">Privacy</Link>
                    <Link href="#" className="hover:text-neon">Terms</Link>
                    <Link href="#" className="hover:text-neon">Login</Link>
                </div>
            </div>
        </footer>
    );
}
