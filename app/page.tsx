import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2, Settings } from "lucide-react";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-8">
          {/* Main Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white">{t("title")}</h1>
            <p className="text-xl text-slate-300">{t("subtitle")}</p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/play">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                {t("playButton")}
              </Button>
            </Link>

            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black w-full sm:w-auto"
              >
                <Settings className="w-5 h-5 mr-2" />
                {t("adminButton")}
              </Button>
            </Link>
          </div>

          {/* Status Information */}
          <div className="mt-12 space-y-2">
            <div className="text-white bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4">System Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Basic routing:</span>
                  <span className="text-green-400 font-semibold">Working</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Internationalization:</span>
                  <span className="text-green-400 font-semibold">Working</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Hebrew/English support:</span>
                  <span className="text-green-400 font-semibold">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
