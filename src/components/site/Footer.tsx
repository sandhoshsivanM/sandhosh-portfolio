import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="container-page flex flex-col items-center justify-between gap-2 border-t border-line py-8 text-[14px] text-ink-2 max-md:pb-24 md:flex-row">
      <p>
        © {new Date().getFullYear()} {profile.name} · {profile.location}
      </p>
      <p className="font-hand text-[19px]">Drawn by hand, built in Next.js.</p>
    </footer>
  );
}
