import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page grid min-h-[80vh] place-items-center text-center">
      <div>
        <Image src="/assets/game/question-block.webp" alt="" width={267} height={256} className="mx-auto w-24" />
        <h1 className="h2 mt-6">This level doesn&apos;t exist yet.</h1>
        <Link href="/" className="btn btn-ink mt-8">
          Back to the start?
        </Link>
      </div>
    </main>
  );
}
