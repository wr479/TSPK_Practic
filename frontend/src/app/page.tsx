import Image from "next/image";
import Link from "next/link";
import { fetchCities, fetchParticipationFormats } from "@/lib/api";
import { IndividualApplicationForm } from "@/components/forms/individual-application-form";
import { SiteHeader } from "@/components/layout/site-header";

const participationFormatCards = [
  {
    title: "Частное лицо",
    price: "от 10 000 ₽",
    description: "Выбираете дату и место, мы готовим саженцы, инструменты и памятную табличку.",
    action: "Участвовать",
    icon: "👤",
  },
  {
    title: "Посвящение в учреждении",
    price: "от 5 000 ₽",
    description: "Проведём церемонию с классом или группой: методические материалы и куратор.",
    action: "Записаться",
    icon: "🏫",
  },
  {
    title: "Свадебное дерево",
    price: "от 5 000 ₽",
    description: "Организуем символичную посадку в день свадьбы, сохраним историю семьи на карте.",
    action: "Посадить",
    icon: "💍",
  },
  {
    title: "Роща славы",
    price: "от 50 000 ₽",
    description: "Закладываем коллективную аллею в честь героев, создаём информационный стенд.",
    action: "Поддержать",
    icon: "🌳",
  },
];

const infoSections = [
  {
    title: "Посади дерево. Стань мужчиной.",
    text: "Не нужно искать повода, чтобы сделать доброе дело. Подберём площадку, подготовим почву и проведём церемонию. Каждое дерево получает координаты и историю, чтобы ваши дети знали, где растёт семейный символ.",
    button: "Заполнить анкету",
    image: "/images/muschina-tree.jpg",
  },
  {
    title: "Свадебное дерево: вместо очередного букета — корни в земле.",
    text: "Свадебная посадка — это эмоции, которые останутся с вами навсегда. Мы организуем фотосъёмку, табличку и сохраним историю на портале. Каждая семья получит красивый отчёт и отметку на карте.",
    button: "Посадить свадебное дерево",
    image: "/images/molodoz-tree.jpg",
    reverse: true,
  },
  {
    title: "Роща славы. Дерево, которое держит память.",
    text: "Создаём живые мемориалы — аллеи, где семьи сажают деревья в честь своих героев. У каждой истории есть QR-код, фото и видео. Роща растёт вместе с детьми и внуками тех, кто посадил дерево памяти.",
    button: "Поддержать проект «Роща славы»",
    image: "/images/alleys-brave.jpg",
  },
];

const stories = [
  {
    title: "Высадка аллеи в Подмосковье",
    subtitle: "Май 2025 · 300 деревьев",
    image: "/images/visadka-trees.jpg",
  },
  {
    title: "Корпоративная высадка «ГрандБанка»",
    subtitle: "150 сотрудников и их семьи",
    image: "/images/corporation-posadka.jpg",
  },
  {
    title: "Свадебное дерево Анны и Михаила",
    subtitle: "Москва · июль 2025",
    image: "/images/weddeing-tree.jpg",
  },
];

const videos = [
  {
    title: "Обзор площадки в Калининграде — июнь 2025",
    image: "/images/lesnaa-sreda.jpg",
  },
  {
    title: "История ИП проекта «Заречье»",
    image: "/images/zareche.jpg",
  },
];

const companyPackages = [
  {
    title: "1 гектар",
    price: "100 000 ₽",
    description: [
      "Единоразовое участие",
      "Сертификаты для команды",
      "Отчёт по итогам сезона",
    ],
    cta: "Отправить заявку",
  },
  {
    title: "10 гектаров",
    price: "900 000 ₽",
    description: [
      "Все преимущества пакета 1 га",
      "Работа с сотрудниками и партнёрами",
      "Медиаподдержка и фотоотчёт",
    ],
    accent: true,
    cta: "Оставить заявку",
  },
  {
    title: "100 гектаров",
    price: "8 000 000 ₽",
    description: [
      "Индивидуальный куратор",
      "Полевой лагерь для команды",
      "PR-кампания на федеральном уровне",
    ],
    cta: "Отправить заявку",
  },
];

const statistics = [
  {
    title: "Вырубка леса в год",
    value: 15.8,
    limit: 20,
    description: "Каждый год Россия теряет миллионы гектаров. Нам нужно сажать больше, чем вырубаем.",
    color: "bg-red-500",
  },
  {
    title: "Посадки 2024 года",
    value: 11.2,
    limit: 20,
    description: "Чем больше инициатив по высадке, тем быстрее баланс качнётся в сторону зелени.",
    color: "bg-green-500",
  },
];

const steps = [
  {
    title: "Выбираете город и формат",
    description: "Заполняете форму — координатор уточняет детали и подбирает площадку.",
  },
  {
    title: "Оплачиваете участие",
    description: "Получаете договор, счёт и закрывающие документы для семьи или компании.",
  },
  {
    title: "Получаете приглашение",
    description: "Присылаем инструкции, координаты, рекомендаций по дресс-коду и памятные материалы.",
  },
  {
    title: "Сажаете и делитесь опытом",
    description: "Проводим мероприятие, делаем фото и видео, публикуем историю на карте.",
  },
];

const partners = ["Sber Bank", "VTB", "МТС", "Google", "МКБ"];

export default async function Home() {
  const [cities, participationFormats] = await Promise.all([
    fetchCities().catch(() => []),
    fetchParticipationFormats().catch(() => []),
  ]);

  return (
    <div className="bg-[#F5F8F3] text-foreground">
      <SiteHeader />
      <main className="flex flex-col gap-20 pb-16">
        <HeroSection />
        <FormatsSection cities={cities} formats={participationFormats} />
        <InfoSections />
        <StoriesSection />
        <VideosSection />
        <CompaniesSection />
        <StatisticsSection />
        <StepsSection />
        <PartnersSection />
        <ContactSection cities={cities} formats={participationFormats} />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section id="hero" className="container mt-10 overflow-hidden rounded-[32px] bg-white shadow-card">
      <div className="relative h-[420px] w-full">
        <Image
          src="/images/tree-bg.jpg"
          alt="Горный лес"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 from-white via-white to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center text-white md:items-start md:justify-end md:pb-16 md:text-left md:px-16">
          <h1 className="max-w-3xl text-3xl font-semibold text-white/85 leading-tight md:text-5xl">
            Покупай саженцы — сажай лес. Лес, в который захочется вернуться.
          </h1>
          <p className="max-w-2xl text-base text-white/85 md:text-lg">
            Вместе мы возрождаем леса и сохраняем память о людях. Выбирайте формат участия — и посадите своё дерево или целую рощу.
          </p>
          <Link href="#formats" className="btn-primary px-8 text-sm md:text-base">
            Выбрать формат посадки
          </Link>
        </div>
      </div>
    </section>
  );
}

type FormatsSectionProps = {
  cities: Awaited<ReturnType<typeof fetchCities>>;
  formats: Awaited<ReturnType<typeof fetchParticipationFormats>>;
};

function FormatsSection({ cities, formats }: FormatsSectionProps) {
  const activeCities = cities.filter((city) => city.isActive);
  const activeFormats = formats.filter((format) => format.isActive);

  return (
    <section id="formats" className="container space-y-10">
      <header className="text-center">
        <h2 className="text-3xl font-semibold text-foreground">Выберите город и формат участия</h2>
        <p className="mt-3 text-sm text-muted md:text-base">
          Заполните форму — координатор подскажет площадку, даты и подготовит материалы для церемонии.
        </p>
      </header>
      <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-soft md:flex-row md:items-end md:justify-between">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <label className="flex-1 text-left text-sm font-semibold text-muted">
            Ваш город
            <select
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
            >
              <option value="" disabled>
                {activeCities.length ? "Выберите город" : "Нет доступных городов"}
              </option>
              {activeCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 text-left text-sm font-semibold text-muted">
            Формат участия
            <select className="mt-2 w-full rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]">
              {activeFormats.length ? (
                activeFormats.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.name}
                  </option>
                ))
              ) : (
                <option>Нет активных форматов</option>
              )}
            </select>
          </label>
        </div>
        <Link href="#contacts" className="btn-primary justify-center md:w-auto">
          Подобрать дату и место
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {participationFormatCards.map((format) => (
          <article
            key={format.title}
            className="flex h-full flex-col gap-4 rounded-[24px] border border-stroke bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{format.icon}</span>
              <p className="text-sm font-semibold text-[#4CAF50]">{format.price}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{format.title}</h3>
              <p className="text-sm text-muted">{format.description}</p>
            </div>
            <Link href="#contacts" className="btn-secondary mt-auto justify-center">
              {format.action}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function InfoSections() {
  return (
    <section className="container space-y-16">
      {infoSections.map((section) => (
        <div
          key={section.title}
          className={`grid gap-8 overflow-hidden rounded-[32px] bg-white shadow-card lg:grid-cols-2 ${section.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
        >
          <div className="relative h-[260px] w-full lg:h-full">
            <Image
              src={section.image}
              alt={section.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 px-6 py-8 lg:px-12">
            <h3 className="text-2xl font-semibold text-foreground">{section.title}</h3>
            <p className="text-sm leading-relaxed text-muted md:text-base">{section.text}</p>
            <Link href="#contacts" className="btn-primary self-start">
              {section.button}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}

function StoriesSection() {
  return (
    <section id="stories" className="container space-y-8">
      <header className="text-center">
        <h2 className="text-3xl font-semibold text-foreground">Истории посадок</h2>
        <p className="mt-3 text-sm text-muted md:text-base">
          Семьи, компании и волонтёры уже посадили тысячи деревьев. Их истории вдохновляют двигаться дальше.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.title} className="overflow-hidden rounded-[26px] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card">
            <div className="relative h-48">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            <div className="space-y-2 px-6 py-5">
              <h3 className="text-lg font-semibold text-foreground">{story.title}</h3>
              <p className="text-sm text-muted">{story.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function VideosSection() {
  return (
    <section id="videos" className="container space-y-6">
      <header className="text-center">
        <h2 className="text-3xl font-semibold text-foreground">Видео о посадках</h2>
        <p className="mt-3 text-sm text-muted md:text-base">
          Посмотрите, как проходят мероприятия и чем живёт сообщество.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {videos.map((video) => (
          <div key={video.title} className="group relative h-64 overflow-hidden rounded-[28px] bg-black shadow-card">
            <Image
              src={video.image}
              alt={video.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#4CAF50] shadow-lg transition group-hover:scale-110"
              >
                ▶
              </button>
              <p className="max-w-xs px-6 text-center text-sm">{video.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CompaniesSection() {
  return (
    <section id="companies" className="container space-y-8">
      <header className="text-center">
        <h2 className="text-3xl font-semibold text-foreground">Шефство над лесом для компаний</h2>
        <p className="mt-3 text-sm text-muted md:text-base">
          Бизнес может стать опорой лесам и вложить вклад в восстановление зелёного фонда России. Выбирайте масштаб, а мы всё организуем.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-3">
        {companyPackages.map((pkg) => (
          <article
            key={pkg.title}
            className={`flex h-full flex-col gap-5 rounded-[28px] border border-stroke bg-white p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-card ${pkg.accent ? "border-[#FF7A32] bg-[#FFF4EC]" : ""}`}
          >
            <h3 className="text-xl font-semibold text-foreground">{pkg.title}</h3>
            <p className="text-2xl font-semibold text-[#FF7A32]">{pkg.price}</p>
            <ul className="space-y-2 text-sm text-muted">
              {pkg.description.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#contacts"
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition ${pkg.accent ? "bg-[#FF7A32] hover:bg-[#e66923]" : "bg-[#4CAF50] hover:bg-[#3A8D3E]"}`}
            >
              {pkg.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatisticsSection() {
  return (
    <section className="container space-y-8 rounded-[32px] bg-white p-10 shadow-card">
      <header className="text-center">
        <h2 className="text-3xl font-semibold text-foreground">Статистика по лесам России</h2>
        <p className="mt-3 text-sm text-muted md:text-base">
          Зачем важно не «лайкать посты про экологию», а выходить и сажать. Каждое дерево создаёт живой климат.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-2">
        {statistics.map((stat) => (
          <div key={stat.title} className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted">
              <span className="font-semibold text-foreground">{stat.title}</span>
              <span className="font-semibold text-foreground">{stat.value} млн га</span>
            </div>
            <div className="h-3 rounded-full bg-[#EEF5E6]">
              <div
                className={`h-full rounded-full ${stat.color}`}
                style={{ width: `${Math.min((stat.value / stat.limit) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-muted">{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="container space-y-6 rounded-[32px] bg-[#E2F1DA] p-10 shadow-soft">
      <h2 className="text-center text-3xl font-semibold text-foreground">Как это работает</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex h-full flex-col gap-3 rounded-[24px] bg-white p-6 shadow-soft">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4CAF50] text-lg font-semibold text-white">
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="container space-y-6 text-center">
      <h2 className="text-2xl font-semibold text-foreground">Доверие и гарантии</h2>
      <p className="text-sm text-muted md:text-base">Нас поддерживают партнёры и доноры по всей стране.</p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-muted md:text-base">
        {partners.map((partner) => (
          <span key={partner} className="rounded-full border border-stroke px-6 py-2 shadow-soft">
            {partner}
          </span>
        ))}
      </div>
    </section>
  );
}

type ContactSectionProps = FormatsSectionProps;

function ContactSection({ cities, formats }: ContactSectionProps) {
  return (
    <section id="contacts" className="container rounded-[32px] bg-white p-10 shadow-card">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-foreground">Остались вопросы?</h2>
          <p className="text-sm text-muted md:text-base">
            Оставьте заявку — координатор свяжется в течение двух рабочих дней. Подберём площадку, документы и форматы участия.
          </p>
          <div className="grid gap-2 text-sm text-muted">
            <p>
              Телефон: <span className="font-semibold text-foreground">+7 (495) 123-45-67</span>
            </p>
            <p>
              Email: <span className="font-semibold text-foreground">info@derevya.ru</span>
            </p>
            <p>
              Адрес: <span className="font-semibold text-foreground">Москва, ул. Новая, д. 7</span>
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p>Документы:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Устав фонда</li>
              <li>Лицензии и сертификаты</li>
              <li>Отчётность за 2024 год</li>
            </ul>
          </div>
        </div>
        <IndividualApplicationForm cities={cities} participationFormats={formats} />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stroke bg-[#263320] py-10 text-sm text-white/80">
      <div className="container flex flex-col gap-6 md:flex-row md:justify-between">
        <div className="space-y-2">
          <p className="text-base font-semibold text-white">Деревья</p>
          <p>Прощай, леса, которые мы спасаем вместе.</p>
          <p>© {new Date().getFullYear()} Буква. Все права защищены.</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-white">Контакты:</p>
          <p>Телефон: +7 (495) 123-45-67</p>
          <p>Email: info@derevya.ru</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-white">Соцсети:</p>
          <div className="flex gap-3">
            <span>VK</span>
            <span>Telegram</span>
            <span>YouTube</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-white">Документы:</p>
          <p>Пользовательское соглашение</p>
          <p>Политика конфиденциальности</p>
        </div>
      </div>
    </footer>
  );
}
