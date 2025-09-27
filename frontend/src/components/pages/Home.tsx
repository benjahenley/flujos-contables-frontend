"use client";

import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function HomePage() {
  const router = useRouter();
  const handleJoinClick = () => {
    router.push("/auth/sign-up");
  };

  return (
    <div className="w-full mx-auto h-full p-6 rounded-xl shadow-soft py-16">
      <div className="w-full mx-auto flex flex-col items-center gap-6 pb-12">
        <h1 className="text-5xl font-bold text-primary mb-6 uppercase max-w-xl text-center mx-auto">
          FLUJOS CONTABLES
        </h1>
        <h2 className="text-xl max-w-2xl text-center mx-auto text-balance">
          Software de Facturación Automática para estudios contables hecho a
          medida
        </h2>
        <Button
          onClick={handleJoinClick}
          type="button"
          isLoading={false}
          className="font-bold">
          Quiero unirme
        </Button>
      </div>

      <hr></hr>
    </div>
  );
}
