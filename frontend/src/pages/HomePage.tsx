import { useState } from "react";
import CaseCard from "@components/CaseCard";
import CasesModal from "@components/CasesModal";
import { Banner, Case, GameFeature } from "@/types";

const HomePage: React.FC = () => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isCasesModalOpen, setIsCasesModalOpen] = useState(false);

  const banners: Banner[] = [
    {
      id: 1,
      image: "https://casehunter.sbs/images/cases.jpg",
      link: "#",
    },
    {
      id: 2,
      image: "https://casehunter.sbs/images/roulete.jpg",
      link: "#",
    },
    {
      id: 3,
      image: "https://casehunter.sbs/images/battle.jpg",
      link: "#",
    },
  ];

  const cases: Case[] = [
    // Regular cases
    {
      id: 1,
      name: "Premium Case",
      price: 100,
      image: "https://casehunter.sbs/images/cases.jpg",
      type: "regular",
    },
    {
      id: 2,
      name: "Gold Case",
      price: 250,
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250831_184845312.png",
      type: "regular",
    },
    {
      id: 3,
      name: "Diamond Case",
      price: 500,
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250907_222256007.png",
      type: "regular",
    },
    {
      id: 4,
      name: "Platinum Case",
      price: 750,
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250908_000116933.png",
      type: "regular",
    },
    // Free cases
    {
      id: 5,
      name: "Free Case",
      price: 0,
      image: "https://casehunter.sbs/images/daily_free.PNG",
      type: "free",
    },
    {
      id: 6,
      name: "Daily Gift",
      price: 0,
      image:
        "https://casehunter.sbs/images/gifts_emoji_by_gifts_changes_bot_AgAD-IYAAsfWsEk.png",
      type: "free",
    },
    // Limited cases
    {
      id: 7,
      name: "Limited Edition",
      price: 1000,
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250908_000155281.png",
      type: "limited",
    },
    {
      id: 8,
      name: "Exclusive Case",
      price: 1500,
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250908_000501_222.png",
      type: "limited",
    },
  ];

  const gameFeatures: GameFeature[] = [
    {
      id: "cases",
      title: "Кейсы",
      image: "https://casehunter.sbs/images/cases.jpg",
      count: cases.filter((c) => c.type === "regular").length,
      target: "cases-modal",
      onClick: () => setIsCasesModalOpen(true),
    },
    {
      id: "roulette",
      title: "Рулетка",
      image: "https://casehunter.sbs/images/roulete.jpg",
      count: 8,
      target: "fortune-modal",
    },
    {
      id: "battle",
      title: "Battle",
      image: "https://casehunter.sbs/images/battle.jpg",
      count: 3,
      target: "main-page",
    },
    {
      id: "upgrade",
      title: "Апгрейд",
      image: "https://casehunter.sbs/images/upgrade.jpg",
      count: 3,
      target: "upgrade-page",
    },
  ];

  return (
    <div id="main-page" className="page active">
      {/* Banner Carousel */}
      <div id="banner-carousel" className="banner-carousel">
        <div
          className="banner-slides"
          style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="banner-slide">
              <a href={banner.link}>
                <img src={banner.image} alt={`Banner ${banner.id}`} />
              </a>
            </div>
          ))}
        </div>
        <div className="banner-pagination">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`banner-dot ${index === bannerIndex ? "active" : ""}`}
              onClick={() => setBannerIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Main Game Features */}
      <section id="main2-embed" className="main2-section">
        <h2 className="main2-title">Главная</h2>

        {gameFeatures.map((feature) => (
          <a
            key={feature.id}
            className="feature-card feature-image"
            data-page-target={feature.target}
            aria-label={feature.title}
            onClick={feature.onClick}
          >
            <span className="card-badge">
              <span className="dot"></span>
              <span className="count">{feature.count}</span>
            </span>
            <img className="cover" src={feature.image} alt={feature.title} />
          </a>
        ))}
      </section>

      {/* Cases Sections */}
      <h2>Кейсы</h2>
      <div id="cases-grid-regular" className="cases-grid">
        {cases
          .filter((case_) => case_.type === "regular")
          .map((case_) => (
            <CaseCard key={case_.id} caseItem={case_} />
          ))}
      </div>

      <h3 style={{ marginTop: "32px", marginBottom: "20px" }}>Бесплатные</h3>
      <div id="cases-grid-free" className="cases-grid">
        {cases
          .filter((case_) => case_.type === "free")
          .map((case_) => (
            <CaseCard key={case_.id} caseItem={case_} />
          ))}
      </div>

      <h3 style={{ marginTop: "32px", marginBottom: "20px" }}>
        Лимитированные
      </h3>
      <div id="cases-grid-limited" className="cases-grid">
        {cases
          .filter((case_) => case_.type === "limited")
          .map((case_) => (
            <CaseCard key={case_.id} caseItem={case_} />
          ))}
      </div>

      {/* Cases Modal */}
      <CasesModal
        isOpen={isCasesModalOpen}
        onClose={() => setIsCasesModalOpen(false)}
        cases={cases.filter((c) => c.type === "regular")}
      />
    </div>
  );
};

export default HomePage;
