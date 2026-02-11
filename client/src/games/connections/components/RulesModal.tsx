import { X } from "lucide-react";

interface RulesModalProps {
  onClose: () => void;
}

export function RulesModal({ onClose }: RulesModalProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 flex items-center justify-center z-[3000] p-5"
      onClick={onClose}
    >
      <div
        className="bg-header-bg w-full max-w-[480px] rounded-2xl relative py-10 px-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-[15px] right-[15px] bg-transparent border-none cursor-pointer text-app-text"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div>
          <h2 className="text-[1.8rem] mb-3 text-center text-app-text font-bold">
            Kako igrati?
          </h2>

          {/* This remains centered as requested */}
          <p className="text-center mb-6 font-medium text-app-text">
            Pronađite grupe od četiri pojma koji imaju nešto zajedničko.
          </p>

          {/* List items are now explicitly left-aligned and justified */}
          <ul className="pl-6 mb-5 text-app-text list-disc text-left">
            <li className="mb-3 text-justify">
              Odaberite četiri stavke i pritisnite <strong>'Provjeri'</strong>{" "}
              da vidite je li vaš pogodak tačan.
            </li>
            <li className="mb-3 text-justify">
              Pronađite sve grupe bez više od <strong>4 greške!</strong>
            </li>
          </ul>

          <h3 className="text-[1.1rem] mt-5 mb-2.5 border-b border-header-border pb-1.5 text-app-text font-bold">
            Primjeri kategorija
          </h3>
          <div className="bg-tile-bg p-3 rounded-md mb-2 text-[0.95rem] text-app-text">
            <p>
              <strong>STVARI KOJE SE MOGU IZVUĆI:</strong> Pouka, Korist, Deblji
              kraj, Živa glava{" "}
            </p>
          </div>
          <div className="bg-tile-bg p-3 rounded-md mb-2 text-[0.95rem] text-app-text">
            <p>
              <strong>HOROSKOPSKI ZNAKOVI + DODATNA SLOVA:</strong> Rakija,
              Lavanda, Ribar, Vaganje
            </p>
          </div>

          <p className="text-[0.9rem] opacity-80 mt-4 leading-[1.4] text-app-text text-left">
            Kategorije će uvijek biti specifičnije od "RIJEČI OD 5 SLOVA",
            "IMENA" ili "GLAGOLI".
          </p>
          <p className="text-[0.9rem] opacity-80 mt-2.5 leading-[1.4] text-app-text text-left">
            Svaka zagonetka ima tačno jedno rješenje. Čuvajte se riječi koje se
            čine kao da pripadaju u više kategorija!
          </p>

          <div className="mt-[30px] text-[0.9rem] text-app-text border-t border-header-border pt-4">
            <p className="font-medium mb-2">
              Svaka grupa ima boju koja se otkriva rješavanjem:
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#f9df6d]"></span>{" "}
              Jednostavno
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#a0c35a]"></span>{" "}
              Srednje
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#b0c4ef]"></span>{" "}
              Teško
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ba81c5]"></span>{" "}
              Vrlo teško
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
