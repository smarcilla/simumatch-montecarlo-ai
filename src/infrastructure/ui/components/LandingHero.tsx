import { useTranslations } from "next-intl";

export function LandingHero() {
  const t = useTranslations("layout.hero");

  return (
    <div className="landing-hero">
      <h2 className="landing-hero-headline">{t("headline")}</h2>
      <p className="landing-hero-subtitle">{t("subtitle")}</p>

      <div className="how-it-works-grid">
        <div className="how-it-works-step">
          <div className="how-it-works-step-title">{t("steps.xg.title")}</div>
          <div className="how-it-works-step-body">
            {t("steps.xg.description")}
          </div>
        </div>
        <div className="how-it-works-step">
          <div className="how-it-works-step-title">
            {t("steps.montecarlo.title")}
          </div>
          <div className="how-it-works-step-body">
            {t("steps.montecarlo.description")}
          </div>
        </div>
        <div className="how-it-works-step">
          <div className="how-it-works-step-title">
            {t("steps.score.title")}
          </div>
          <div className="how-it-works-step-body">
            {t("steps.score.description")}
          </div>
        </div>
      </div>
    </div>
  );
}
