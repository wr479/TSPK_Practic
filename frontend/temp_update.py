from pathlib import Path

LINE_SEP = "\r\n"

def to_crlf(value: str) -> str:
    return value.replace("\n", LINE_SEP)

path = Path('src/app/page.tsx')
text = path.read_text(encoding='utf-8')

old_imports = to_crlf('import Image from "next/image";\nimport { SiteHeader } from "@/components/layout/site-header";\nimport Link from "next/link";\n\n')
new_imports = to_crlf('import Image from "next/image";\nimport Link from "next/link";\nimport { fetchCities, fetchParticipationFormats } from "@/lib/api";\nimport { IndividualApplicationForm } from "@/components/forms/individual-application-form";\nimport { SiteHeader } from "@/components/layout/site-header";\n\n')
if old_imports not in text:
    raise SystemExit('Импортный блок не найден')
text = text.replace(old_imports, new_imports, 1)

text = text.replace('const participationFormats = [', 'const participationFormatCards = [', 1)
text = text.replace('participationFormats.map((format) => (', 'participationFormatCards.map((format) => ('))
text = text.replace('{participationFormats.map((format) => (', '{participationFormatCards.map((format) => ('))

home_marker = to_crlf('export default function Home() {')
start_home = text.find(home_marker)
if start_home == -1:
    raise SystemExit('Блок Home не найден')
end_home = text.find(to_crlf('function HeroSection'), start_home)
if end_home == -1:
    raise SystemExit('Границы Home не найдены')

new_home = to_crlf('export default async function Home() {\n  const [cities, participationFormatsOptions] = await Promise.all([\n    fetchCities().catch(() => []),\n    fetchParticipationFormats().catch(() => []),\n  ]);\n\n  return (\n    <div className="bg-[#F5F8F3] text-foreground">\n      <SiteHeader />\n      <main className="flex flex-col gap-20 pb-16">\n        <HeroSection />\n        <FormatsSection cities={cities} formats={participationFormatsOptions} />\n        <InfoSections />\n        <StoriesSection />\n        <VideosSection />\n        <CompaniesSection />\n        <StatisticsSection />\n        <StepsSection />\n        <PartnersSection />\n        <ContactSection cities={cities} formats={participationFormatsOptions} />\n      </main>\n      <Footer />\n    </div>\n  );\n}\n\n')
text = text[:start_home] + new_home + text[end_home:]

formats_marker = to_crlf('function FormatsSection()')
start_formats = text.find(formats_marker)
if start_formats == -1:
    raise SystemExit('FormatsSection не найден')
end_formats = text.find(to_crlf('function InfoSections'), start_formats)
if end_formats == -1:
    raise SystemExit('Границы FormatsSection не найдены')

new_formats = to_crlf('type FormatsSectionProps = {\n  cities: Awaited<ReturnType<typeof fetchCities>>;\n  formats: Awaited<ReturnType<typeof fetchParticipationFormats>>;\n};\n\nfunction FormatsSection({ cities, formats }: FormatsSectionProps) {\n  const activeCities = cities.filter((city) => city.isActive);\n  const activeFormats = formats.filter((format) => format.isActive);\n\n  return (\n    <section id="formats" className="container space-y-10">\n      <header className="text-center">\n        <h2 className="text-3xl font-semibold text-foreground">Выберите город и формат участия</h2>\n        <p className="mt-3 text-sm text-muted md:text-base">\n          Заполните форму — координатор подскажет площадку, даты и подготовит материалы для церемонии.\n        </p>\n      </header>\n      <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-soft md:flex-row md:items-end md:justify-between">\n        <div className="flex w-full flex-col gap-4 md:flex-row">\n          <label className="flex-1 text-left text-sm font-semibold text-muted">\n            Ваш город\n            <select\n              defaultValue=""\n              className="mt-2 w-full rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"\n            >\n              <option value="" disabled>\n                {activeCities.length ? "Выберите город" : "Нет доступных городов"}\n              </option>\n              {activeCities.map((city) => (\n                <option key={city.id} value={city.id}>\n                  {city.name}\n                </option>\n              ))}\n            </select>\n          </label>\n          <label className="flex-1 text-left text-sm font-semibold text-muted">\n            Формат участия\n            <select className="mt-2 w-full rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]">\n              {activeFormats.length ? (\n                activeFormats.map((format) => (\n                  <option key={format.id} value={format.id}>\n                    {format.name}\n                  </option>\n                ))\n              ) : (\n                <option>Нет активных форматов</option>\n              )}\n            </select>\n          </label>\n        </div>\n        <Link href="#contacts" className="btn-primary justify-center md:w-auto">\n          Подобрать дату и место\n        </Link>\n      </div>\n      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">\n        {participationFormatCards.map((format) => (\n          <article\n            key={format.title}\n            className="flex h-full flex-col gap-4 rounded-[24px] border border-stroke bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"\n          >\n            <div className="flex items-center justify-between">\n              <span className="text-2xl">{format.icon}</span>\n              <p className="text-sm font-semibold text-[#4CAF50]">{format.price}</p>\n            </div>\n            <div className="space-y-2">\n              <h3 className="text-lg font-semibold text-foreground">{format.title}</h3>\n              <p className="text-sm text-muted">{format.description}</p>\n            </div>\n            <Link href="#contacts" className="btn-secondary mt-auto justify-center">\n              {format.action}\n            </Link>\n          </article>\n        ))}\n      </div>\n    </section>\n  );\n}\n\n')
text = text[:start_formats] + new_formats + text[end_formats:]

contact_marker = to_crlf('function ContactSection()')
start_contact = text.find(contact_marker)
if start_contact == -1:
    raise SystemExit('ContactSection не найден')
end_contact = text.find(to_crlf('function Footer'), start_contact)
if end_contact == -1:
    raise SystemExit('Границы ContactSection не найдены')

new_contact = to_crlf('type ContactSectionProps = FormatsSectionProps;\n\nfunction ContactSection({ cities, formats }: ContactSectionProps) {\n  return (\n    <section id="contacts" className="container rounded-[32px] bg-white p-10 shadow-card">\n      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">\n        <div className="space-y-4">\n          <h2 className="text-3xl font-semibold text-foreground">Остались вопросы?</h2>\n          <p className="text-sm text-muted md:text-base">\n            Оставьте заявку — координатор свяжется в течение двух рабочих дней. Подберём площадку, документы и форматы участия.\n          </p>\n          <div className="grid gap-2 text-sm text-muted">\n            <p>\n              Телефон: <span className="font-semibold text-foreground">+7 (495) 123-45-67</span>\n            </p>\n            <p>\n              Email: <span className="font-semibold text-foreground">info@derevya.ru</span>\n            </p>\n            <p>\n              Адрес: <span className="font-semibold text-foreground">Москва, ул. Новая, д. 7</span>\n            </p>\n          </div>\n          <div className="space-y-2 text-sm text-muted">\n            <p>Документы:</p>\n            <ul className="list-disc space-y-1 pl-5">\n              <li>Устав фонда</li>\n              <li>Лицензии и сертификаты</li>\n              <li>Отчётность за 2024 год</li>\n            </ul>\n          </div>\n        </div>\n        <IndividualApplicationForm cities={cities} participationFormats={formats} />\n      </div>\n    </section>\n  );\n}\n\n')
text = text[:start_contact] + new_contact + text[end_contact:]

path.write_text(text, encoding='utf-8')
