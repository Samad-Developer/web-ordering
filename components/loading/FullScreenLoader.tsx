"use client";

import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

export default function FullscreenLoader() {
    const t = useTranslations("common")

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-lg">
            <div className="flex flex-col justify-center items-center gap-4">
                <Spinner />
                <p className="text-sm text-muted-foreground">{t("loading")}</p>
            </div>
        </div>
    );
}
