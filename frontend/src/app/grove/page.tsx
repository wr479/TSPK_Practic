import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";

const steps = [
  {
    icon: "🗺️",
    title: "Выберите участок",
    description: "На карте выберите свободный участок для посадки дерева памяти.",
  },
  {
    icon: "✍️",
    title: "Укажите имя",
    description: "Напишите имя защитника, в честь которого будет посажено дерево.",
  },
  {
    icon: "🌱",
    title: "Приезжайте на посадку",
    description: "Участвуйте в посадке вместе с семьёй или доверьте дерево нашим волонтёрам.",
  },
];

const memorialStories = [
  {
    name: "Александр Иванов",
    description: "Погиб при исполнении военного долга, 2022",
    quote:
      "Папа всегда говорил, что самое главное - оставить после себя добрый след. Теперь у нас есть его дерево, которое будет расти и напоминать о нём.",
    planted: "Посажено 15.05.2023",
    avatar:
      "/images/men-ava.jpg",
  },
  {
    name: "Михаил Петров",
    description: "Участник СВО, пропал без вести, 2023",
    quote:
      "Мы не знаем, где наш сын. Но теперь у нас есть место, где мы можем побыть с ним. Каждый раз, приезжая сюда, мы чувствуем связь с Михаилом.",
    planted: "Посажено 22.06.2023",
    avatar:
      "/images/men-ava.jpg",
  },
  {
    name: "Сергей Козлов",
    description: "Герой при защите Родины, 2022",
    quote:
      "Каждый раз, когда мы приезжаем к дереву Сергея, наш сын рассказывает ему о своих успехах в школе. Для него это не просто дерево - это связь с папой.",
    planted: "Посажено 09.05.2023",
    avatar:
      "/images/men-ava.jpg",
  },
  {
    name: "Дмитрий Смирнов",
    description: "Герой России, погиб в зоне СВО, 2023",
    quote:
      "Дмитрий всегда любил природу. Теперь у нас есть место, где мы можем почувствовать его присутствие. Спасибо за эту возможность сохранить память.",
    planted: "Посажено 12.07.2023",
    avatar:
      "/images/men-ava.jpg",
  },
];

const instructions = [
  "Оставьте заявку",
  "Выберите дерево",
  "Участвуйте в посадке",
  "Получите сертификат",
];

export default function GrovePage() {
  return (
    <div className="min-h-screen bg-[#F5F8F3] text-foreground">
      <SiteHeader />
      <main className="flex flex-col gap-20 pb-16">
        <HeroSection />
        <MemorialSection />
        <MapSection />
        <StepsSection />
        <StoriesSection />
        <InstructionSection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#B7E2AA] to-[#D9F0CC] py-16 text-center shadow-card">
      <div className="container space-y-3 px-4">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Роща славы</h1>
        <p className="mx-auto max-w-3xl text-sm text-foreground/80 md:text-base">
          Живой мемориал в честь защитников Отечества. Дерево памяти — место, куда всегда можно
          вернуться всей семьёй.
        </p>
      </div>
    </section>
  );
}

function MemorialSection() {
  return (
    <section className="container grid gap-8 px-4 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div className="space-y-4 text-left">
        <h2 className="text-2xl font-semibold text-[#3B7F32] md:text-3xl">
          Роща славы. Дерево, которое держит память
        </h2>
        <p className="text-sm text-muted md:text-base">
          Есть вещи, которые словами не лечатся. Когда отец на фронте. Когда его нет. Когда ребёнку
          нужно не что-то утереться, кроме жгучей гордости.
        </p>
        <p className="text-sm text-muted md:text-base">
          Мы создаём Рощу славы — живой мемориал, где дети с мамами сажают деревья в честь своих
          защитников. У каждого дерева — имя, у каждой семьи — место, куда можно приехать, обняться
          и сказать: «Герой, это твоё дерево. Дерево растёт. Так же, как растёт ребёнок и его
          настоящее».
        </p>
        <Link
          href="/participate"
          className="btn-primary inline-flex justify-center bg-[#4CAF50] text-base hover:bg-[#3E8F41]"
        >
          Посадить дерево в Роще славы
        </Link>
      </div>
      <div className="overflow-hidden rounded-[28px] border border-[#D9E8D1] bg-white shadow-soft">
        <Image
          src="/images/allea-slavi.jpg"
          alt="Аллея памяти"
          width={720}
          height={420}
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="container space-y-6 px-4">
      <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
        Карта Рощи славы
      </h2>
      <div className="overflow-hidden rounded-[24px] border border-[#D9E8D1] bg-white shadow-soft">
        <div className="relative h-72 w-full">
          <Image
            src="/images/karta.jpg"
            alt="Интерактивная карта Рощи славы"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-[#F5F8F3]/70 text-sm font-semibold text-muted">
            Интерактивная карта Рощи славы (в разработке)
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="container grid gap-6 px-4 text-center md:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.title}
          className="flex flex-col gap-3 rounded-[24px] border border-[#D9E8D1] bg-white p-6 shadow-soft"
        >
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F3D7] text-xl text-[#4CAF50]">
            {step.icon}
          </span>
          <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
          <p className="text-sm text-muted">{step.description}</p>
        </div>
      ))}
    </section>
  );
}

function StoriesSection() {
  return (
    <section className="container space-y-8 px-4">
      <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Истории памяти</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {memorialStories.map((story) => (
          <article
            key={story.name}
            className="flex flex-col gap-4 rounded-[24px] border border-[#D9E8D1] bg-white p-6 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#E6F3EB]">
                <Image src={story.avatar} alt={story.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{story.name}</h3>
                <p className="text-xs text-muted">{story.description}</p>
              </div>
            </div>
            <p className="text-sm text-muted">“{story.quote}”</p>
            <p className="text-xs font-semibold text-[#4CAF50]">{story.planted}</p>
          </article>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="btn-secondary justify-center border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
        >
          Показать больше историй
        </button>
      </div>
    </section>
  );
}

function InstructionSection() {
  return (
    <section className="bg-[#B7E2AA] py-16">
      <div className="container space-y-8 px-4 text-center">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          Как посадить дерево в Роще славы
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {instructions.map((title, index) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 rounded-[24px] border border-[#D9E8D1] bg-white p-6 shadow-soft"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F3D7] text-lg font-semibold text-[#4CAF50]">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-foreground">{title}</p>
            </div>
          ))}
        </div>
        <Link
          href="/participate"
          className="btn-primary inline-flex justify-center bg-[#4CAF50] text-base hover:bg-[#3E8F41]"
        >
          Посадить дерево памяти
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-т border-stroke bg-[#263320] py-10 text-sm text-white/80">
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
