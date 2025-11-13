"use client";

import { SiteHeader } from "@/components/layout/site-header";
import Link from "next/link";
import { useMemo, useState } from "react";

const participationFormats = [
  {
    title: "Частное лицо",
    subtitle: "Посадка от 1 до 100 саженцев",
    features: [
      "Участие в групповой посадке",
      "Сертификат участника",
      "Фотоотчёт о посадке",
    ],
  },
  {
    title: "Специальные программы",
    subtitle: "Посвящение в мужчины",
    features: ["Свадебное дерево", "Роща славы", "Памятное дерево"],
  },
];

const regions = ["Московская область", "Ленинградская область", "Краснодарский край"];
const treeTypes = ["Сосна обыкновенная", "Ель европейская", "Берёза повислая"];

const faq = [
  {
    question: "Как происходит процесс посадки?",
    answer:
      "После подтверждения заявки мы согласуем дату и время, подготовим площадку, саженцы и инструменты. На месте вас встретит координатор, проведёт инструктаж и поможет с посадкой.",
  },
  {
    question: "Можно ли посадить дерево, если я не могу приехать?",
    answer:
      "Да. Мы можем посадить дерево за вас, записать видео процесса и отправить подробный отчёт с фотографиями, координатами и памятной табличкой.",
  },
  {
    question: "Какие гарантии, что дерево приживётся?",
    answer:
      "Мы используем только качественные саженцы и контролируем уход за ними. В течение сезона координатор проверяет состояние деревьев и при необходимости проводит дополнительные агротехнические работы.",
  },
];

const PRICE_PER_TREE = 1000;

export default function ParticipatePage() {
  const [quantity, setQuantity] = useState(10);
  const [region, setRegion] = useState(regions[0]);
  const [tree, setTree] = useState(treeTypes[0]);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const orderSummary = useMemo(() => {
    const trees = quantity * PRICE_PER_TREE;

    return {
      trees,
      participation: 0,
      certificate: 0,
      total: trees,
    };
  }, [quantity]);

  const onChangeQuantity = (value: number) => {
    if (value < 1) {
      setQuantity(1);
      return;
    }
    if (value > 100) {
      setQuantity(100);
      return;
    }
    setQuantity(value);
  };

  return (
    <div className="min-h-screen bg-[#F5F8F3] text-foreground">
      <SiteHeader />
      <main className="container flex flex-col gap-16 py-16">
        <HeroSection />
        <FormatsSection />
        <CalculatorSection
          quantity={quantity}
          onChangeQuantity={onChangeQuantity}
          region={region}
          setRegion={setRegion}
          tree={tree}
          setTree={setTree}
          order={orderSummary}
        />
        <FaqSection openQuestion={openQuestion} setOpenQuestion={setOpenQuestion} />
      </main>
      <ParticipateFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="overflow-hidden rounded-[32px] bg-gradient-to-b from-[#A0D78A] to-[#C7E6B5] px-6 py-16 text-center text-foreground shadow-card md:px-16">
      <h1 className="text-3xl font-semibold md:text-4xl">Как принять участие</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/80 md:text-base">
        Выберите удобный для вас формат участия в восстановлении лесов России. Мы подготовим
        площадку, инструменты и сопровождение.
      </p>
    </section>
  );
}

function FormatsSection() {
  return (
    <section className="space-y-8">
      <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
        Выберите формат участия
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {participationFormats.map((format) => (
          <article
            key={format.title}
            className="flex h-full flex-col gap-4 rounded-[24px] border border-[#D9E8D1] bg-white p-8 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#E0F3D7] text-xl text-[#4CAF50]">
                👤
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{format.title}</h3>
                <p className="text-sm text-muted">{format.subtitle}</p>
              </div>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              {format.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#4CAF50]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#calculator"
              className="btn-primary mt-auto justify-center bg-[#4CAF50] hover:bg-[#3E8F41]"
            >
              Выбрать
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

type CalculatorSectionProps = {
  quantity: number;
  onChangeQuantity: (value: number) => void;
  region: string;
  setRegion: (value: string) => void;
  tree: string;
  setTree: (value: string) => void;
  order: {
    trees: number;
    participation: number;
    certificate: number;
    total: number;
  };
};

function CalculatorSection({
  quantity,
  onChangeQuantity,
  region,
  setRegion,
  tree,
  setTree,
  order,
}: CalculatorSectionProps) {
  return (
    <section
      id="calculator"
      className="grid gap-8 rounded-[28px] bg-white p-8 shadow-card lg:grid-cols-[1.2fr_0.9fr]"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Калькулятор посадки</h2>
        <div className="grid gap-4 text-sm text-muted">
          <label className="flex flex-col gap-2">
            Количество саженцев
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-lg text-foreground transition hover:border-[#4CAF50]"
                onClick={() => onChangeQuantity(quantity - 1)}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(event) => onChangeQuantity(Number(event.target.value))}
                className="w-20 rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-2 text-center text-base text-foreground outline-none transition focus:border-[#4CAF50]"
              />
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-lg text-foreground transition hover:border-[#4CAF50]"
                onClick={() => onChangeQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-2">
            Регион посадки
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
            >
              {regions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            Тип дерева
            <select
              value={tree}
              onChange={(event) => setTree(event.target.value)}
              className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
            >
              {treeTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="rounded-2xl border border-[#D9E8D1] bg-[#F7FBF5] px-4 py-3 text-sm text-muted">
          Вы выбрали {quantity} саженцев ({tree.toLowerCase()}), посадка пройдёт в регионе{" "}
          {region.toLowerCase()}.
        </p>
      </div>
      <div className="flex h-full flex-col gap-4 rounded-[20px] border border-[#D9E8D1] bg-[#F7FBF5] p-6">
        <h3 className="text-lg font-semibold text-foreground">Ваш заказ</h3>
        <OrderLine label={`${quantity} саженцев`} value={order.trees} />
        <OrderLine label="Участие в посадке" value={order.participation} />
        <OrderLine label="Сертификат" value={order.certificate} />
        <div className="mt-auto border-t border-[#D9E8D1] pt-4">
          <div className="flex items-center justify-between text-base font-semibold text-foreground">
            <span>Итого</span>
            <span>{order.total.toLocaleString("ru-RU")} ₽</span>
          </div>
        </div>
        <button
          type="button"
          className="btn-primary justify-center bg-[#4CAF50] text-base hover:bg-[#3E8F41]"
        >
          Перейти к оплате
        </button>
      </div>
    </section>
  );
}

function OrderLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm text-muted">
      <span>{label}</span>
      <span>{value.toLocaleString("ru-RU")} ₽</span>
    </div>
  );
}

type FaqSectionProps = {
  openQuestion: number | null;
  setOpenQuestion: (value: number | null) => void;
};

function FaqSection({ openQuestion, setOpenQuestion }: FaqSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
        Частые вопросы
      </h2>
      <div className="grid gap-4">
        {faq.map((item, index) => {
          const isOpen = openQuestion === index;

          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-[20px] border border-[#D9E8D1] bg-white shadow-soft transition"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground md:text-base"
                onClick={() => setOpenQuestion(isOpen ? null : index)}
              >
                {item.question}
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke text-base text-foreground">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen ? (
                <div className="border-t border-[#E3EFDD] px-5 py-4 text-sm text-muted">
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ParticipateFooter() {
  return (
    <footer className="bg-[#263320] py-10 text-sm text-white/80">
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

