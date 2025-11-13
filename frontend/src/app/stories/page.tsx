import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";

const filters = [
  { label: "Все истории", active: true },
  { label: "Частное лицо" },
  { label: "Компания" },
  { label: "Свадебное дерево" },
  { label: "Роща славы" },
];

const stories = [
  {
    tag: "Частное лицо",
    tagColor: "bg-[#4CAF50]",
    tagText: "text-white",
    title: "Семья Ивановых: наша первая посадка",
    excerpt:
      "Весной 2023 года мы всей семьёй поехали сажать лес в Подмосковье. Это был незабываемый опыт для детей...",
    stats: "15 саженцев",
    link: "#",
    image:
      "/images/visadka-trees.jpg",
  },
  {
    tag: "Компания",
    tagColor: "bg-[#F2994A]",
    tagText: "text-white",
    title: "Газпромбанк: корпоративная посадка",
    excerpt:
      "Сотрудники банка высадили 2 гектара леса в Ленинградской области в рамках программы корпоративной ответственности...",
    stats: "2000 саженцев",
    link: "#",
    image:
      "/images/tree-bg.jpg",
  },
  {
    tag: "Свадебное дерево",
    tagColor: "bg-[#E85D8C]",
    tagText: "text-white",
    title: "Анна и Михаил: начало семейной традиции",
    excerpt:
      "В день свадьбы вместо традиционного букета мы посадили дерево. Теперь каждую годовщину приезжаем к нему...",
    stats: "1 свадебное дерево",
    link: "#",
    image:
      "/images/anna.jpg",
  },
  {
    tag: "Роща славы",
    tagColor: "bg-[#3F8AE0]",
    tagText: "text-white",
    title: "Памяти защитника Отечества",
    excerpt:
      "Семья Сергея посадила дерево в честь отца, погибшего при исполнении военного долга. Теперь у них есть место...",
    stats: "1 дерево памяти",
    link: "#",
    image:
      "/images/muschina-tree.jpg",
  },
  {
    tag: "Посвящение в мужчины",
    tagColor: "bg-[#6FCC3B]",
    tagText: "text-white",
    title: "Илья: мой первый ответственный поступок",
    excerpt:
      "В 12 лет Илья вместе с клубом посадил своё первое дерево. Теперь в школьном саду будет его личное дерево ответственности...",
    stats: "1 дерево",
    link: "#",
    image:
      "/images/volonteri.jpg",
  },
  {
    tag: "Компания",
    tagColor: "bg-[#F2994A]",
    tagText: "text-white",
    title: "Яндекс: шефство над гектаром леса",
    excerpt:
      "Компания взяла под опеку 10 гектаров леса в Карелии. Ежегодно сотрудники приезжают ухаживать за посадками...",
    stats: "10 гектаров",
    link: "#",
    image:
      "/images/gectar-lesa.jpg",
  },
];

const videos = [
  {
    title: "Весенняя посадка 2023 — обзор с квадрокоптера",
    image:
      "/images/cvadro.jpg",
  },
  {
    title: "Интервью с участниками осенней посадки",
    image:
      "/images/interview.jpg",
  },
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-[#F5F8F3] text-foreground">
      <SiteHeader />
      <main className="flex flex-col gap-20 pb-16">
        <HeroSection />
        <StoriesGrid />
        <VideosSection />
        <JoinSection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#B7E2AA] to-[#D9F0CC] py-16 text-center text-foreground shadow-card">
      <div className="container space-y-4 px-6">
        <h1 className="text-3xl font-semibold md:text-4xl">Истории посадок</h1>
        <p className="mx-auto max-w-3xl text-sm text-foreground/80 md:text-base">
          Реальные истории людей и компаний, которые уже посадили свой лес вместе с нами.
          Выбирайте формат и вдохновляйтесь их примером.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          {filters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={`rounded-full border border-[#8FC46F] px-4 py-2 transition ${
                filter.active
                  ? "bg-[#4CAF50] text-white shadow-sm"
                  : "bg-white text-foreground hover:bg-[#F0F8E8]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoriesGrid() {
  return (
    <section className="container space-y-10 px-4">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stories.map((story) => (
          <article
            key={story.title}
            className="overflow-hidden rounded-[24px] border border-[#D9E8D1] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className="relative h-52">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
              />
            </div>
            <div className="space-y-3 px-6 py-5">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${story.tagColor} ${story.tagText}`}
              >
                {story.tag}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{story.title}</h3>
              <p className="text-sm text-muted">{story.excerpt}</p>
              <div className="flex items-center justify-between text-xs font-semibold text-[#4CAF50]">
                <span>{story.stats}</span>
                <Link href={story.link} className="text-[#2F7A2B] hover:underline">
                  Читать полностью →
                </Link>
              </div>
            </div>
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

function VideosSection() {
  return (
    <section className="bg-[#F0F8E8] py-16">
      <div className="container space-y-8 px-4 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-foreground">Видео о посадках</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted md:text-base">
            Посмотрите репортажи с прошлых мероприятий и почувствуйте атмосферу живых посадок.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((video) => (
            <div key={video.title} className="relative h-64 overflow-hidden rounded-[26px] bg-black">
              <Image
                src={video.image}
                alt={video.title}
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <button
                  type="button"
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#4CAF50] shadow-lg transition hover:scale-105"
                >
                  ▶
                </button>
                <p className="max-w-xs px-6 text-sm">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinSection() {
  return (
    <section className="bg-[#B7E2AA] py-16">
      <div className="container space-y-6 px-4 text-center">
        <h2 className="text-3xl font-semibold text-foreground">
          Присоединяйтесь к нашим историям
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-foreground/80 md:text-base">
          Станьте частью сообщества людей, которые меняют экологию России к лучшему. Мы поможем
          выбрать формат и подготовим вашу историю.
        </p>
        <Link
          href="/participate"
          className="btn-primary inline-flex justify-center bg-[#4CAF50] text-base hover:bg-[#3E8F41]"
        >
          Участвовать в посадке
        </Link>
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
