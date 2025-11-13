import Image from "next/image";
import { SiteHeader } from "@/components/layout/site-header";
import { CompanyApplicationForm } from "@/components/forms/company-application-form";
import { fetchTariffs, type TariffDto } from "@/lib/api";

const benefits = [
  {
    title: "Имидж и репутация",
    description:
      "Укрепление бренда как социально ответственной компании, заботящейся об экологии.",
    icon: "🌿",
  },
  {
    title: "Командообразование",
    description:
      "Совместная посадка леса — уникальный «тимбилдинг» на свежем воздухе.",
    icon: "🤝",
  },
  {
    title: "Экологический вклад",
    description:
      "Реальный вклад в восстановление лесов России и борьбу с климатическими изменениями.",
    icon: "🌍",
  },
];

const partners = ["Sber Bank", "МТС", "VTB", "Google"];

export default async function CompaniesPage() {
  const tariffs = await loadTariffs();

  return (
    <div className="min-h-screen bg-[#F5F8F3] text-foreground">
      <SiteHeader />
      <main className="flex flex-col gap-20 pb-20">
        <HeroSection />
        <BenefitsSection />
        <PackagesSection tariffs={tariffs} />
        <PartnersSection />
        <TestimonialSection />
        <ApplicationSection tariffs={tariffs} />
      </main>
      <Footer />
    </div>
  );
}

async function loadTariffs(): Promise<TariffDto[]> {
  try {
    const tariffs = await fetchTariffs();
    return tariffs.filter((tariff) => tariff.isActive);
  } catch (error) {
    console.error("Не удалось загрузить тарифы", error);
    return [];
  }
}

type PackagesSectionProps = {
  tariffs: TariffDto[];
};

type ApplicationSectionProps = {
  tariffs: TariffDto[];
};

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#B7E2AA] to-[#D9F0CC] py-16 text-center shadow-card">
      <div className="container space-y-4 px-4">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Корпоративное участие
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-foreground/80 md:text-base">
          Экологическая ответственность как часть корпоративной культуры. Подарите
          сотрудникам и клиентам живой символ заботы об экологии.
        </p>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="container space-y-10 px-4 pt-12">
      <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
        Почему компаниям важно участвовать
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex flex-col gap-4 rounded-[24px] border border-[#D9E8D1] bg-white p-8 text-center shadow-soft"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F3D7] text-2xl text-[#4CAF50]">
              {benefit.icon}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
            <p className="text-sm text-muted">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PackagesSection({ tariffs }: PackagesSectionProps) {
  if (tariffs.length === 0) {
    return (
      <section className="container space-y-6 px-4 text-center">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          Форматы корпоративного участия
        </h2>
        <p className="mx-auto max-w-2xl rounded-[24px] border border-dashed border-[#D9E8D1] bg-white/60 px-6 py-8 text-sm text-muted">
          Тарифы появятся позже. Напишите координатору через форму ниже, мы подберём индивидуальное
          предложение.
        </p>
      </section>
    );
  }

  return (
    <section className="container space-y-10 px-4">
      <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
        Форматы корпоративного участия
      </h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {tariffs.map((tariff, index) => {
          const accent = index === 1;
          return (
            <article
              key={tariff.id}
              className={`flex h-full flex-col gap-4 rounded-[28px] border border-[#E9D0C0] bg-white p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-card ${
                accent ? "border-[#F2994A] bg-[#FFF4EC]" : ""
              }`}
            >
              <span className="self-start rounded-full bg-[#FDE1CE] px-3 py-1 text-xs font-semibold text-[#C46721]">
                {accent ? "Популярно" : "Тариф"}
              </span>
              <h3 className="text-xl font-semibold text-foreground">{tariff.name}</h3>
              <p className="text-2xl font-semibold text-[#F0672A]">
                {typeof tariff.price === "number" ? formatPrice(tariff.price) : "Цена по запросу"}
              </p>
              {tariff.description ? (
                <p className="text-sm text-muted">{tariff.description}</p>
              ) : (
                <p className="text-sm text-muted">
                  Описание скоро появится. Свяжитесь с координатором, чтобы получить детали.
                </p>
              )}
              <button
                type="button"
                className={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition ${
                  accent ? "bg-[#F0672A] hover:bg-[#d7581f]" : "bg-[#4CAF50] hover:bg-[#3E8F41]"
                }`}
              >
                Оставить заявку
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="bg-[#F8FBF5] py-12">
      <div className="container space-y-8 px-4 text-center">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          Наши корпоративные партнёры
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 text-lg font-semibold text-muted">
          {partners.map((partner) => (
            <span key={partner} className="rounded-xl border border-[#D9E8D1] px-6 py-3 shadow-soft">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="container px-4">
      <div className="rounded-[28px] border border-[#D9E8D1] bg-white p-8 shadow-soft lg:flex lg:items-center lg:gap-8">
        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-[#E6F3EB] lg:mx-0">
          <Image
            src="/images/portret.jpg"
            alt="Иван Петров"
            fill
            className="object-cover"
          />
        </div>
        <div className="mt-6 space-y-3 text-sm text-muted lg:mt-0">
          <p>
            «Участие в программе шефства над лесом стало важной частью нашей корпоративной
            социальной ответственности. Сотрудники с большим энтузиазмом участвуют в посадках, а
            наши клиенты ценят нашу экологическую позицию.»
          </p>
          <p className="font-semibold text-foreground">
            Иван Петров<br />
            Директор по развитию, Газпромбанк
          </p>
        </div>
      </div>
    </section>
  );
}

function formatPrice(value: number) {
  return value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });
}

function ApplicationSection({ tariffs }: ApplicationSectionProps) {
  return (
    <section className="container space-y-8 px-4">
      <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
        Оставьте заявку для компании
      </h2>
      <CompanyApplicationForm tariffs={tariffs} />
    </section>
  );
}



function Footer() {
  return (
    <footer className="border-t border-stroke bg-[#263320] py-10 text-sm text-white/80">
      <div className="container flex flex-col gap-6 md:flex-row md:justify-between">
        <div className="space-y-2">
          <p className="text-base font-semibold text-white">Деревья</p>
          <p>Посади лес, в который можно вернуться.</p>
          <p>© {new Date().getFullYear()} Деревья. Все права защищены.</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-white">Контакты</p>
          <p>Email: info@derevya.ru</p>
          <p>Телефон: +7 (495) 123-45-67</p>
          <p>Адрес: Москва, ул. Лесная, д. 1</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-white">Соцсети</p>
          <div className="flex gap-3">
            <span>VK</span>
            <span>Telegram</span>
            <span>YouTube</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-white">Документы</p>
          <p>Политика конфиденциальности</p>
          <p>Пользовательское соглашение</p>
          <p>Оферта</p>
        </div>
      </div>
    </footer>
  );
}
