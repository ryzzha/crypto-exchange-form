"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ExchangeForm } from "@/features/exchange";
import { FormProvider, useForm } from "react-hook-form";
import { currencies } from "@/shared/constants";

export default function Home() {
  const methods = useForm<ExchangeForm>({
    defaultValues: {
      fromCurrency: currencies[0],
      toCurrency: currencies[1],
      fromAmount: 1,
      toAmount: null,
      email: "user@gmail.com",
      address: "0x3jh532...."
  }
  });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between gap-10 bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <Navigation />
      <main className="w-full px-10 flex flex-col py-8 gap-8 items-center">
        <FormProvider {...methods} >
          <ExchangeForm />
        </FormProvider>
      </main>
      <Footer />
    </div>
  );
}
