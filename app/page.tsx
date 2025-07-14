import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2, Settings } from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">{t("title")}</h1>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="flex gap-3">
              <Link href="/play">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  {t("playButton")}
                </Button>
              </Link>

              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  {t("adminButton")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-white text-center">
          <p className="text-xl mb-4">{t("subtitle")}</p>
          <p className="text-lg">
            ✅ Basic routing: <strong>Working</strong>
          </p>
          <p className="text-lg">
            ✅ Internationalization: <strong>Working</strong>
          </p>
          <p className="text-lg">
            ✅ Hebrew/English support: <strong>Ready</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
