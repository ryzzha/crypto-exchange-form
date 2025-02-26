import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ExchangeForm } from "@/features/exchange";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-between gap-10 bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <Navigation />
      <main className="w-full px-10 flex flex-col p-5 gap-8 items-center">
        <ExchangeForm />
      </main>
      <Footer />
    </div>
  );
}
