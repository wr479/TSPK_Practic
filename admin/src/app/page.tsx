'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

type City = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

type ParticipationFormat = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
};

type Tariff = {
  id: string;
  name: string;
  description?: string;
  price?: number | null;
  isActive: boolean;
  createdAt: string;
};

type CaseEntity = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type Application = {
  id: string;
  type: 'individual' | 'company';
  fullName?: string;
  phone: string;
  email: string;
  city?: { name: string };
  participationFormat?: { name: string };
  companyName?: string;
  contactPerson?: string;
  tariff?: { name: string };
  comment?: string;
  createdAt: string;
};

const storageKey = 'tspkthee-admin-auth';

function encodeAuth(login: string, password: string) {
  return `Basic ${typeof window !== 'undefined' ? window.btoa(`${login}:${password}`) : ''}`;
}

export default function AdminDashboard() {
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [cities, setCities] = useState<City[]>([]);
  const [formats, setFormats] = useState<ParticipationFormat[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [cases, setCases] = useState<CaseEntity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [newCity, setNewCity] = useState('');
  const [newFormat, setNewFormat] = useState({ name: '', description: '' });
  const [newTariff, setNewTariff] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [caseForm, setCaseForm] = useState({
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    isPublished: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.sessionStorage.getItem(storageKey);
    if (stored) {
      setAuthHeader(stored);
    }
  }, []);

  const authorized = !!authHeader;

  const fetchJson = useCallback(
    async (path: string, init: RequestInit = {}) => {
      if (!authHeader) {
        throw new Error('Не авторизовано');
      }

      const headers = new Headers(init.headers);
      headers.set('Authorization', authHeader);
      if (init.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Ошибка ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
    [authHeader],
  );

  const reloadCities = useCallback(async () => {
    const data = await fetchJson('/cities?all=true');
    setCities(data);
  }, [fetchJson]);

  const reloadFormats = useCallback(async () => {
    const data = await fetchJson('/participation-formats?all=true');
    setFormats(data);
  }, [fetchJson]);

  const reloadTariffs = useCallback(async () => {
    const data = await fetchJson('/tariffs?all=true');
    setTariffs(data);
  }, [fetchJson]);

  const reloadCases = useCallback(async () => {
    const data = await fetchJson('/cases/all');
    setCases(data);
  }, [fetchJson]);

  const reloadApplications = useCallback(async () => {
    const data = await fetchJson('/applications');
    setApplications(data);
  }, [fetchJson]);

  const reloadAll = useCallback(async () => {
    if (!authorized) {
      return;
    }
    setIsLoadingData(true);
    setMessage(null);
    try {
      await Promise.all([
        reloadCities(),
        reloadFormats(),
        reloadTariffs(),
        reloadCases(),
        reloadApplications(),
      ]);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsLoadingData(false);
    }
  }, [authorized, reloadCities, reloadFormats, reloadTariffs, reloadCases, reloadApplications]);

  useEffect(() => {
    if (authorized) {
      void reloadAll();
    }
  }, [authorized, reloadAll]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    setMessage(null);
    setLoadingAuth(true);
    try {
      const header = encodeAuth(login, password);
      const response = await fetch(`${API_URL}/cities?all=true`, {
        headers: {
          Authorization: header,
        },
      });

      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }

      setAuthHeader(header);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(storageKey, header);
      }
      setLogin('');
      setPassword('');
    } catch (error) {
      setAuthError((error as Error).message);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setAuthHeader(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(storageKey);
    }
    setCities([]);
    setFormats([]);
    setTariffs([]);
    setCases([]);
    setApplications([]);
  };

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  const disabled = isLoadingData;

  const handleAddCity = async () => {
    if (!newCity.trim()) {
      showMessage('Введите название города');
      return;
    }
    try {
      await fetchJson('/cities', {
        method: 'POST',
        body: JSON.stringify({ name: newCity.trim(), isActive: true }),
      });
      setNewCity('');
      await reloadCities();
      showMessage('Город добавлен');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleRenameCity = async (city: City) => {
    const name = window.prompt('Новое название города', city.name);
    if (!name || name.trim() === city.name) {
      return;
    }
    try {
      await fetchJson(`/cities/${city.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: name.trim() }),
      });
      await reloadCities();
      showMessage('Город обновлен');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleToggleCity = async (city: City) => {
    try {
      await fetchJson(`/cities/${city.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !city.isActive }),
      });
      await reloadCities();
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleDeleteCity = async (city: City) => {
    if (!window.confirm(`Удалить город ${city.name}?`)) {
      return;
    }
    try {
      await fetchJson(`/cities/${city.id}`, {
        method: 'DELETE',
      });
      await reloadCities();
      showMessage('Город удален');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleAddFormat = async () => {
    if (!newFormat.name.trim()) {
      showMessage('Введите название формата');
      return;
    }
    try {
      await fetchJson('/participation-formats', {
        method: 'POST',
        body: JSON.stringify({
          name: newFormat.name.trim(),
          description: newFormat.description || undefined,
          isActive: true,
        }),
      });
      setNewFormat({ name: '', description: '' });
      await reloadFormats();
      showMessage('Формат добавлен');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleEditFormat = async (format: ParticipationFormat) => {
    const name = window.prompt('Название формата', format.name) ?? format.name;
    const description =
      window.prompt('Описание формата', format.description ?? '') ?? format.description ?? '';
    try {
      await fetchJson(`/participation-formats/${format.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });
      await reloadFormats();
      showMessage('Формат обновлен');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleToggleFormat = async (format: ParticipationFormat) => {
    try {
      await fetchJson(`/participation-formats/${format.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !format.isActive }),
      });
      await reloadFormats();
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleDeleteFormat = async (format: ParticipationFormat) => {
    if (!window.confirm(`Удалить формат ${format.name}?`)) {
      return;
    }
    try {
      await fetchJson(`/participation-formats/${format.id}`, {
        method: 'DELETE',
      });
      await reloadFormats();
      showMessage('Формат удален');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleAddTariff = async () => {
    if (!newTariff.name.trim()) {
      showMessage('Введите название тарифа');
      return;
    }
    const priceValue = newTariff.price ? Number(newTariff.price) : undefined;
    if (priceValue && Number.isNaN(priceValue)) {
      showMessage('Укажите корректную стоимость');
      return;
    }
    try {
      await fetchJson('/tariffs', {
        method: 'POST',
        body: JSON.stringify({
          name: newTariff.name.trim(),
          description: newTariff.description || undefined,
          price: priceValue,
          isActive: true,
        }),
      });
      setNewTariff({ name: '', description: '', price: '' });
      await reloadTariffs();
      showMessage('Тариф добавлен');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleEditTariff = async (tariff: Tariff) => {
    const name = window.prompt('Название тарифа', tariff.name) ?? tariff.name;
    const description =
      window.prompt('Описание тарифа', tariff.description ?? '') ?? tariff.description ?? '';
    const priceInput = window.prompt(
      'Стоимость (оставьте пустым для удаления)',
      tariff.price !== null && tariff.price !== undefined ? String(tariff.price) : '',
    );
    const priceValue =
      priceInput && priceInput.trim() !== ''
        ? Number(priceInput.replace(',', '.'))
        : undefined;

    if (priceValue !== undefined && Number.isNaN(priceValue)) {
      showMessage('Некорректная стоимость');
      return;
    }

    try {
      await fetchJson(`/tariffs/${tariff.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          price: priceValue,
        }),
      });
      await reloadTariffs();
      showMessage('Тариф обновлен');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleToggleTariff = async (tariff: Tariff) => {
    try {
      await fetchJson(`/tariffs/${tariff.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !tariff.isActive }),
      });
      await reloadTariffs();
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleDeleteTariff = async (tariff: Tariff) => {
    if (!window.confirm(`Удалить тариф ${tariff.name}?`)) {
      return;
    }
    try {
      await fetchJson(`/tariffs/${tariff.id}`, {
        method: 'DELETE',
      });
      await reloadTariffs();
      showMessage('Тариф удален');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const isEditingCase = useMemo(() => caseForm.id.length > 0, [caseForm.id]);

  const resetCaseForm = () =>
    setCaseForm({
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      isPublished: true,
    });

  const handleCaseSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!caseForm.title.trim() || !caseForm.description.trim()) {
      showMessage('Заполните название и описание кейса');
      return;
    }

    const payload = {
      title: caseForm.title.trim(),
      description: caseForm.description.trim(),
      imageUrl: caseForm.imageUrl.trim() || undefined,
      videoUrl: caseForm.videoUrl.trim() || undefined,
      isPublished: caseForm.isPublished,
    };

    try {
      if (isEditingCase) {
        await fetchJson(`/cases/${caseForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        showMessage('Кейс обновлен');
      } else {
        await fetchJson('/cases', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showMessage('Кейс создан');
      }
      resetCaseForm();
      await reloadCases();
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  const handleEditCase = (item: CaseEntity) => {
    setCaseForm({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl ?? '',
      videoUrl: item.videoUrl ?? '',
      isPublished: item.isPublished,
    });
  };

  const handleDeleteCase = async (item: CaseEntity) => {
    if (!window.confirm(`Удалить кейс "${item.title}"?`)) {
      return;
    }
    try {
      await fetchJson(`/cases/${item.id}`, {
        method: 'DELETE',
      });
      await reloadCases();
      showMessage('Кейс удален');
    } catch (error) {
      showMessage((error as Error).message);
    }
  };

  if (!authorized) {
    return (
      <div className="auth-wrapper">
        <form className="card auth-card" onSubmit={handleLogin}>
          <h1>Админка</h1>
          <label className="field">
            <span>Логин</span>
            <input
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>
          {authError && <p className="error">{authError}</p>}
          <button type="submit" className="button" disabled={loadingAuth}>
            {loadingAuth ? 'Проверяем...' : 'Войти'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {message && (
        <div className="toast-container">
          <div className="toast">{message}</div>
        </div>
      )}

      <header className="dashboard-header">
        <div className="dashboard-header__title">
          <h1>Панель управления</h1>
          <p>Справочники, кейсы и заявки проекта</p>
        </div>
        <div className="dashboard-header__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => void reloadAll()}
            disabled={disabled}
          >
            {disabled ? 'Обновляем...' : 'Обновить данные'}
          </button>
          <button type="button" className="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-columns">
          <section className="panel">
            <div className="panel__header">
              <h2>Города</h2>
              <p>Укажите локации, где доступно участие</p>
            </div>
            <div className="panel__form panel__form--inline">
              <input
                value={newCity}
                onChange={(event) => setNewCity(event.target.value)}
                placeholder="Название города"
                disabled={disabled}
              />
              <button
                type="button"
                className="button"
                onClick={() => void handleAddCity()}
                disabled={disabled}
              >
                Добавить
              </button>
            </div>
            <ul className="list">
              {cities.map((city) => (
                <li key={city.id} className={!city.isActive ? 'muted' : ''}>
                  <div>
                    <strong>{city.name}</strong>
                    {!city.isActive && <span className="tag">неактивен</span>}
                  </div>
                  <div className="list-actions">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => void handleRenameCity(city)}
                    >
                      Переименовать
                    </button>
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => void handleToggleCity(city)}
                    >
                      {city.isActive ? 'Скрыть' : 'Активировать'}
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={() => void handleDeleteCity(city)}
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__header">
              <h2>Форматы участия</h2>
              <p>Настройте доступные форматы для частных лиц</p>
            </div>
            <div className="panel__form">
              <input
                value={newFormat.name}
                onChange={(event) =>
                  setNewFormat((state) => ({ ...state, name: event.target.value }))
                }
                placeholder="Название формата"
                disabled={disabled}
              />
              <textarea
                value={newFormat.description}
                onChange={(event) =>
                  setNewFormat((state) => ({ ...state, description: event.target.value }))
                }
                placeholder="Описание (опционально)"
                rows={2}
                disabled={disabled}
              />
              <button
                type="button"
                className="button"
                onClick={() => void handleAddFormat()}
                disabled={disabled}
              >
                Добавить
              </button>
            </div>
            <ul className="list">
              {formats.map((format) => (
                <li key={format.id} className={!format.isActive ? 'muted' : ''}>
                  <div>
                    <strong>{format.name}</strong>
                    {format.description && <p>{format.description}</p>}
                    {!format.isActive && <span className="tag">неактивен</span>}
                  </div>
                  <div className="list-actions">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => void handleEditFormat(format)}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => void handleToggleFormat(format)}
                    >
                      {format.isActive ? 'Скрыть' : 'Активировать'}
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={() => void handleDeleteFormat(format)}
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__header">
              <h2>Тарифы</h2>
              <p>Тарифные планы для корпоративных клиентов</p>
            </div>
            <div className="panel__form">
              <input
                value={newTariff.name}
                onChange={(event) =>
                  setNewTariff((state) => ({ ...state, name: event.target.value }))
                }
                placeholder="Название тарифа"
                disabled={disabled}
              />
              <textarea
                value={newTariff.description}
                onChange={(event) =>
                  setNewTariff((state) => ({ ...state, description: event.target.value }))
                }
                placeholder="Описание (опционально)"
                rows={2}
                disabled={disabled}
              />
              <input
                value={newTariff.price}
                onChange={(event) =>
                  setNewTariff((state) => ({ ...state, price: event.target.value }))
                }
                placeholder="Стоимость (опционально)"
                disabled={disabled}
              />
              <button
                type="button"
                className="button"
                onClick={() => void handleAddTariff()}
                disabled={disabled}
              >
                Добавить
              </button>
            </div>
            <ul className="list">
              {tariffs.map((tariff) => (
                <li key={tariff.id} className={!tariff.isActive ? 'muted' : ''}>
                  <div>
                    <strong>{tariff.name}</strong>
                    {tariff.description && <p>{tariff.description}</p>}
                    {tariff.price !== null && tariff.price !== undefined && (
                      <span className="tag">₽ {tariff.price}</span>
                    )}
                    {!tariff.isActive && <span className="tag">неактивен</span>}
                  </div>
                  <div className="list-actions">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => void handleEditTariff(tariff)}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => void handleToggleTariff(tariff)}
                    >
                      {tariff.isActive ? 'Скрыть' : 'Активировать'}
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={() => void handleDeleteTariff(tariff)}
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="dashboard-columns">
          <section className="panel">
            <div className="panel__header">
              <h2>{isEditingCase ? 'Редактирование кейса' : 'Новый кейс'}</h2>
              <p>Добавьте материалы, ссылку на изображение и видео</p>
            </div>
            <form className="case-form" onSubmit={handleCaseSubmit}>
              <label className="field">
                <span>Название</span>
                <input
                  value={caseForm.title}
                  onChange={(event) =>
                    setCaseForm((state) => ({ ...state, title: event.target.value }))
                  }
                  required
                  disabled={disabled}
                />
              </label>
              <label className="field">
                <span>Описание</span>
                <textarea
                  value={caseForm.description}
                  onChange={(event) =>
                    setCaseForm((state) => ({ ...state, description: event.target.value }))
                  }
                  rows={4}
                  required
                  disabled={disabled}
                />
              </label>
              <div className="case-form__row">
                <label className="field">
                  <span>Ссылка на изображение</span>
                  <input
                    value={caseForm.imageUrl}
                    onChange={(event) =>
                      setCaseForm((state) => ({ ...state, imageUrl: event.target.value }))
                    }
                    placeholder="https://..."
                    disabled={disabled}
                  />
                </label>
                <label className="field">
                  <span>Видео (iframe)</span>
                  <input
                    value={caseForm.videoUrl}
                    onChange={(event) =>
                      setCaseForm((state) => ({ ...state, videoUrl: event.target.value }))
                    }
                    placeholder="https://..."
                    disabled={disabled}
                  />
                </label>
              </div>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={caseForm.isPublished}
                  onChange={(event) =>
                    setCaseForm((state) => ({ ...state, isPublished: event.target.checked }))
                  }
                  disabled={disabled}
                />
                <span>Публиковать сразу</span>
              </label>
              <div className="form-actions">
                <button type="submit" className="button" disabled={disabled}>
                  {isEditingCase ? 'Сохранить' : 'Создать'}
                </button>
                {isEditingCase && (
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={resetCaseForm}
                    disabled={disabled}
                  >
                    Отмена
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="panel">
            <div className="panel__header">
              <h2>Кейсы</h2>
              <p>Управляйте опубликованными и черновыми кейсами</p>
            </div>
            <ul className="list list--cases">
              {cases.map((item) => (
                <li key={item.id} className={!item.isPublished ? 'muted' : ''}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    <div className="case-meta">
                      {item.imageUrl && <span className="tag">Изображение</span>}
                      {item.videoUrl && <span className="tag">Видео</span>}
                      {!item.isPublished && <span className="tag">черновик</span>}
                    </div>
                  </div>
                  <div className="list-actions">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => handleEditCase(item)}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={() => void handleDeleteCase(item)}
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
              {!cases.length && <li className="empty-card">Кейсы ещё не добавлены</li>}
            </ul>
          </section>
        </div>

        <section className="panel panel--applications">
          <div className="panel__header">
            <h2>Заявки</h2>
            <p>История обращений частных лиц и компаний</p>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Тип</th>
                  <th>Контакты</th>
                  <th>Детали</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>{item.type === 'individual' ? 'Частное лицо' : 'Компания'}</td>
                    <td>
                      <div>{item.phone}</div>
                      <div>{item.email}</div>
                    </td>
                    <td>
                      {item.type === 'individual' ? (
                        <>
                          <div>{item.fullName}</div>
                          {item.city?.name && <div>Город: {item.city.name}</div>}
                          {item.participationFormat?.name && (
                            <div>Формат: {item.participationFormat.name}</div>
                          )}
                        </>
                      ) : (
                        <>
                          <div>{item.companyName}</div>
                          <div>Контакт: {item.contactPerson}</div>
                          {item.tariff?.name && <div>Тариф: {item.tariff.name}</div>}
                        </>
                      )}
                      {item.comment && <div>Комментарий: {item.comment}</div>}
                    </td>
                  </tr>
                ))}
                {!applications.length && (
                  <tr>
                    <td colSpan={4} className="empty">
                      Нет заявок
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
