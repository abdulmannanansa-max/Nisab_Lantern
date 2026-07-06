import { useEffect, useMemo, useState } from 'react'
import { HeroHighlightDemo } from './components/HeroHighlight'
import logoImage from './assets/Nisab_Lantern_logo.png'

const API_BASE = 'https://api.aladhan.com/v1'
const METALS_API_ENDPOINTS = {
  primary: 'https://api.metals.live/v1/spot/metals',
  fallback: 'https://api.gold-api.com/price'
}
const FX_API = 'https://api.frankfurter.app/latest?from=USD&to=INR'
const FX_API_FALLBACK = 'https://open.er-api.com/v6/latest/USD'
const APP_NAME = 'Nisab Lantern'
const KAABA = { lat: 21.422487, lon: 39.826206 }
const GOLD_NISAB_GRAMS = 87.48
const SILVER_NISAB_GRAMS = 612.36
const TROY_OUNCE_GRAMS = 31.1034768

const cityPages = [
  { slug: 'mumbai', name: 'Mumbai', country: 'India' },
  { slug: 'delhi', name: 'Delhi', country: 'India' },
  { slug: 'hyderabad', name: 'Hyderabad', country: 'India' },
  { slug: 'lucknow', name: 'Lucknow', country: 'India' },
  { slug: 'bangalore', name: 'Bangalore', country: 'India' },
  { slug: 'chennai', name: 'Chennai', country: 'India' },
  { slug: 'kolkata', name: 'Kolkata', country: 'India' },
  { slug: 'ahmedabad', name: 'Ahmedabad', country: 'India' },
  { slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates' },
  { slug: 'abu-dhabi', name: 'Abu Dhabi', country: 'United Arab Emirates' },
  { slug: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia' },
  { slug: 'jeddah', name: 'Jeddah', country: 'Saudi Arabia' },
  { slug: 'doha', name: 'Doha', country: 'Qatar' },
  { slug: 'london', name: 'London', country: 'United Kingdom' },
  { slug: 'new-york', name: 'New York', country: 'United States' },
  { slug: 'toronto', name: 'Toronto', country: 'Canada' },
]

const featurePages = [
  { path: '/prayer-times', label: 'Prayer', title: 'Prayer Times', description: 'Daily salah times, next-prayer countdown, calculation methods, and city pages.' },
  { path: '/qibla', label: 'Qibla', title: 'Qibla Compass', description: 'Location-aware direction to the Kaaba with optional device compass support.' },
  { path: '/hijri', label: 'Hijri', title: 'Hijri Converter', description: 'Convert Gregorian and Hijri dates using the Aladhan public API.' },
  { path: '/ramadan', label: 'Ramadan', title: 'Sehri and Iftar', description: 'Track today\'s Sehri end and Iftar countdown from your selected prayer timetable.' },
  { path: '/zakat', label: 'Zakat', title: 'Live Zakat Calculator', description: 'Calculate zakat using live gold and silver rates, nisab checks, and liability deductions.' },
  { path: '/tasbeeh', label: 'Tasbeeh', title: 'Tasbeeh Counter', description: 'A private browser-based counter with target progress and reset controls.' },
  { path: '/learn-zakat', label: 'Learn', title: 'Learn Zakat', description: 'Understand zakat rules, nisab, recipients, and the annual 2.5% obligation.' },
]

const contentPages = [
  { path: '/resources', label: 'Resources', title: 'Resources', description: 'Original guides about prayer times, Qibla direction, Ramadan planning, and Zakat basics.' },
  { path: '/about', label: 'About', title: 'About Us', description: 'Learn what Nisab Lantern is, who maintains it, and why the site exists.' },
  { path: '/contact', label: 'Contact', title: 'Contact Us', description: 'Contact the Nisab Lantern owner about corrections, feedback, privacy, or partnerships.' },
  { path: '/privacy', label: 'Privacy', title: 'Privacy Policy', description: 'How Nisab Lantern uses cookies, local storage, third-party APIs, analytics, and advertising partners.' },
  { path: '/terms', label: 'Terms', title: 'Terms of Use', description: 'Terms for using Nisab Lantern tools, calculators, content, and third-party data.' },
  { path: '/disclaimer', label: 'Disclaimer', title: 'Disclaimer', description: 'Important limits on religious, financial, location, and prayer-time information shown on Nisab Lantern.' },
]

const resourceArticles = [
  {
    slug: 'how-zakat-is-calculated',
    title: 'How Zakat Is Calculated',
    summary: 'A practical walkthrough of eligible wealth, nisab, liabilities, and the 2.5% annual calculation.',
    body: [
      'Zakat is usually calculated on eligible net wealth that remains above nisab for a lunar year. A simple working method is to list cash, savings, gold, silver, receivables you expect to collect, and trade inventory, then subtract short-term debts that are due soon.',
      'Nisab is commonly measured against either 87.48 grams of gold or 612.36 grams of silver. Many people use the silver benchmark because it brings more wealth into eligibility and can benefit more recipients, while others follow the gold benchmark according to their teacher or local guidance.',
      'Once the net amount is above the nisab threshold, the standard Zakat rate is 2.5%. Nisab Lantern can help with arithmetic and live metal-rate estimates, but your final decision should be checked with a qualified scholar or trusted local institution when your situation is complex.',
    ],
  },
  {
    slug: 'prayer-time-calculation-methods',
    title: 'Prayer Time Calculation Methods Explained',
    summary: 'Why different timetables can show different Fajr, Asr, and Isha times for the same city.',
    body: [
      'Prayer-time apps do not all use the same assumptions. Fajr and Isha depend on twilight angles, Asr depends on juristic method, and high-latitude areas may need special adjustments when twilight does not behave normally.',
      'That is why two reliable timetables can differ by several minutes. Nisab Lantern exposes common calculation methods so you can compare results and use the convention followed by your mosque, family, or local scholarly body.',
      'For daily worship, consistency matters. Use the city selector or location option as a helpful planning aid, then follow your local masjid calendar when it provides an official timetable for your community.',
    ],
  },
  {
    slug: 'ramadan-sehri-iftar-planning',
    title: 'Planning Sehri and Iftar During Ramadan',
    summary: 'A calm way to use prayer times for fasting without turning the day into clock anxiety.',
    body: [
      'Ramadan planning begins with reliable Fajr and Maghrib times. Sehri should finish before Fajr begins, while Iftar begins at Maghrib. Keeping those two moments visible can reduce the need to repeatedly check a full timetable.',
      'It is wise to leave a small personal buffer before Fajr, especially when you are relying on a phone clock, travel schedule, or a new city. For Iftar, many communities follow the local adhan or masjid announcement.',
      'Nisab Lantern uses the current prayer timetable to show the next Sehri or Iftar countdown. Treat it as a planning tool, and keep your local mosque timetable as the authority for communal practice.',
    ],
  },
]

const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const methods = [
  { id: 2, label: 'ISNA' },
  { id: 3, label: 'Muslim World League' },
  { id: 4, label: 'Umm al-Qura' },
  { id: 1, label: 'Karachi' },
]

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const routeCity = getCityFromPath(path)
  const [selectedCity, setSelectedCity] = useState(routeCity ?? cityPages[0])
  const [method, setMethod] = useState(3)
  const [coords, setCoords] = useState(null)
  const [geoStatus, setGeoStatus] = useState('Use your location for precise prayer times and Qibla direction.')
  const [timings, setTimings] = useState(null)
  const [dateMeta, setDateMeta] = useState(null)
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [timeError, setTimeError] = useState('')
  const [now, setNow] = useState(new Date())
  const [metalRates, setMetalRates] = useState(null)
  const [metalStatus, setMetalStatus] = useState('Checking live gold and silver rates...')

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (routeCity) setSelectedCity(routeCity)
  }, [routeCity])

  useEffect(() => {
    const meta = getPageMeta(path)
    document.title = meta.title
    setMetaTag('name', 'description', meta.description)
    setMetaTag('property', 'og:title', meta.title)
    setMetaTag('property', 'og:description', meta.description)
    setMetaTag('property', 'og:url', `${window.location.origin}${path}`)
    setCanonical(`${window.location.origin}${path}`)
  }, [path, routeCity])

  useEffect(() => {
    let cancelled = false
    async function loadTimings() {
      setLoadingTimes(true)
      setTimeError('')
      try {
        const params = coords
          ? `latitude=${coords.lat}&longitude=${coords.lon}&method=${method}`
          : `city=${encodeURIComponent(selectedCity.name)}&country=${encodeURIComponent(selectedCity.country)}&method=${method}`
        const response = await fetch(`${API_BASE}/timings/${todayForApi()}?${params}`)
        const json = await response.json()
        if (!response.ok || json.code !== 200) throw new Error('Unable to load prayer times.')
        if (!cancelled) {
          setTimings(json.data.timings)
          setDateMeta(json.data.date)
        }
      } catch (error) {
        if (!cancelled) setTimeError(error.message)
      } finally {
        if (!cancelled) setLoadingTimes(false)
      }
    }
    loadTimings()
    return () => {
      cancelled = true
    }
  }, [coords, method, selectedCity])

  useEffect(() => {
    let cancelled = false
    
    async function fetchWithTimeout(url, timeoutMs = 8000) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const response = await fetch(url, { signal: controller.signal })
        return response
      } finally {
        clearTimeout(timeoutId)
      }
    }

    async function fetchMetalsFromPrimary() {
      try {
        const response = await fetchWithTimeout(METALS_API_ENDPOINTS.primary)
        if (!response.ok) throw new Error('Primary metals API failed')
        const data = await response.json()
        const gold = Number(data?.gold) // price in USD/oz
        const silver = Number(data?.silver) // price in USD/oz
        if (!gold || !silver) throw new Error('Incomplete metals data')
        return { gold, silver, source: 'metals.live' }
      } catch (err) {
        console.warn('Primary metals API error:', err)
        throw err
      }
    }

    async function fetchMetalsFromFallback() {
      try {
        const goldResponse = await fetchWithTimeout(`${METALS_API_ENDPOINTS.fallback}/XAU/USD`)
        const silverResponse = await fetchWithTimeout(`${METALS_API_ENDPOINTS.fallback}/XAG/USD`)
        
        if (!goldResponse.ok || !silverResponse.ok) throw new Error('Fallback metals API failed')
        
        const goldData = await goldResponse.json()
        const silverData = await silverResponse.json()
        
        const gold = Number(goldData?.price)
        const silver = Number(silverData?.price)
        if (!gold || !silver) throw new Error('Incomplete fallback metals data')
        
        return { gold, silver, source: 'gold-api.com' }
      } catch (err) {
        console.warn('Fallback metals API error:', err)
        throw err
      }
    }

    async function fetchForexRates() {
      try {
        const response = await fetchWithTimeout(FX_API)
        if (!response.ok) throw new Error('Primary forex API failed')
        const data = await response.json()
        const inr = Number(data?.rates?.INR)
        if (!inr) throw new Error('INR rate unavailable')
        return { inr, source: 'frankfurter' }
      } catch (err) {
        console.warn('Primary forex API error:', err)
        // Try fallback
        try {
          const fallbackResponse = await fetchWithTimeout(FX_API_FALLBACK)
          if (!fallbackResponse.ok) throw new Error('Fallback forex API failed')
          const data = await fallbackResponse.json()
          const inr = Number(data?.rates?.INR)
          if (!inr) throw new Error('INR rate unavailable in fallback')
          return { inr, source: 'er-api' }
        } catch (fallbackErr) {
          console.warn('Fallback forex API error:', fallbackErr)
          throw fallbackErr
        }
      }
    }

    async function loadMetalRates() {
      setMetalStatus('Checking live metal and forex rates...')
      try {
        let metalData
        try {
          metalData = await fetchMetalsFromPrimary()
        } catch {
          metalData = await fetchMetalsFromFallback()
        }

        const forexData = await fetchForexRates()
        
        const nextRates = {
          goldPerGram: (metalData.gold * forexData.inr) / TROY_OUNCE_GRAMS,
          silverPerGram: (metalData.silver * forexData.inr) / TROY_OUNCE_GRAMS,
          goldUsdOz: metalData.gold,
          silverUsdOz: metalData.silver,
          usdInr: forexData.inr,
          checkedAt: new Date().toISOString(),
        }
        
        if (!cancelled) {
          setMetalRates(nextRates)
          setMetalStatus(`Live rates loaded from ${metalData.source} & ${forexData.source}.`)
        }
      } catch (error) {
        console.error('Metal rates error:', error)
        if (!cancelled) {
          setMetalStatus(`Unable to load live rates (${error.message}). Enter rates manually to continue.`)
        }
      }
    }
    
    loadMetalRates()
    const refresh = window.setInterval(loadMetalRates, 15 * 60 * 1000)
    
    return () => {
      cancelled = true
      window.clearInterval(refresh)
    }
  }, [])

  const nextPrayer = useMemo(() => getNextPrayer(timings, now), [timings, now])
  const cityLabel = coords ? 'Your location' : `${selectedCity.name}, ${selectedCity.country}`

  function navigate(event, href) {
    event.preventDefault()
    window.history.pushState({}, '', href)
    setPath(href)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function useLocation() {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not available in this browser.')
      return
    }
    setGeoStatus('Requesting location permission...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setGeoStatus('Using your current location.')
      },
      () => setGeoStatus('Location permission was denied. City times are still available.'),
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  const sharedProps = {
    cityLabel,
    coords,
    dateMeta,
    geoStatus,
    loadingTimes,
    metalRates,
    metalStatus,
    method,
    navigate,
    nextPrayer,
    now,
    selectedCity,
    setCoords,
    setMethod,
    setSelectedCity,
    timings,
    timeError,
    useLocation,
  }

  return (
    <main>
      <Header path={path} navigate={navigate} />
      {renderPage(path, sharedProps)}
      <Footer navigate={navigate} />
    </main>
  )
}

function renderPage(path, props) {
  if (path === '/') return <LandingPage {...props} />
  if (path === '/prayer-times' || getCityFromPath(path)) return <PrayerTimesPage {...props} />
  if (path === '/qibla') return <FeatureShell title="Qibla Compass" eyebrow="Direction" intro="Find the direction of the Kaaba from your current location. The compass combines your latitude and longitude with optional device-orientation data, then shows the Qibla bearing in degrees from north."><QiblaCompass coords={props.coords} /></FeatureShell>
  if (path === '/hijri') return <FeatureShell title="Hijri Converter" eyebrow="Calendar" intro="Convert dates between the Gregorian and Hijri calendars using the Aladhan date API. Hijri dates can vary by moon sighting and local authority, so use this as a planning reference."><HijriConverter /></FeatureShell>
  if (path === '/ramadan') return <FeatureShell title="Sehri and Iftar Timer" eyebrow="Ramadan" intro="Track the next fasting milestone from today's prayer timetable. The timer uses Fajr for Sehri end and Maghrib for Iftar so you can plan meals and reminders with less friction."><RamadanTimer timings={props.timings} now={props.now} /></FeatureShell>
  if (path === '/zakat') return <FeatureShell title="Live Zakat Calculator" eyebrow="Nisab" intro="Estimate Zakat on cash, gold, silver, business assets, and short-term liabilities. The calculator checks live metal-rate estimates and lets you override rates when you prefer a local jeweller or scholar-provided value."><ZakatCalculator metalRates={props.metalRates} metalStatus={props.metalStatus} /></FeatureShell>
  if (path === '/tasbeeh') return <FeatureShell title="Tasbeeh Counter" eyebrow="Dhikr" intro="Keep a private remembrance count in your browser. Your count and target stay in local storage on your device and are not sent to a server by Nisab Lantern."><TasbeehCounter /></FeatureShell>
  if (path === '/learn-zakat') return <LearnZakatPage />
  if (path === '/resources') return <ResourcesPage navigate={props.navigate} />
  if (path.startsWith('/resources/')) return <ArticlePage path={path} navigate={props.navigate} />
  if (path === '/about') return <AboutPage />
  if (path === '/contact') return <ContactPage />
  if (path === '/privacy') return <PrivacyPolicyPage />
  if (path === '/terms') return <TermsPage />
  if (path === '/disclaimer') return <DisclaimerPage />
  return <LandingPage {...props} />
}

function Header({ path, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={(event) => navigate(event, '/')} aria-label={`${APP_NAME} home`}>
        <img src={logoImage} alt="Nisab Lantern" className="brand-logo" />
        <span className="brand-text">{APP_NAME}</span>
      </a>

      {/* Desktop primary nav */}
      <nav className="primary-nav" aria-label="Primary navigation">
        {[...featurePages.slice(0, 6), contentPages[0]].map((item) => (
          <a
            className={path === item.path ? 'active' : ''}
            href={item.path}
            key={item.path}
            onClick={(event) => navigate(event, item.path)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Mobile menu toggle */}
      <button
        className={`menu-toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span className="hamburger" />
      </button>

      {/* Mobile slide-in panel */}
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-nav__backdrop" onClick={() => setMenuOpen(false)} />
        <div className="mobile-nav__panel">
          <button className="mobile-nav__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
          <div className="mobile-nav__links">
            {[...featurePages.slice(0, 6), ...contentPages].map((item) => (
              <a
                key={item.path}
                className={path === item.path ? 'active' : ''}
                href={item.path}
                onClick={(event) => {
                  navigate(event, item.path)
                  setMenuOpen(false)
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

function LandingPage({ navigate, nextPrayer, metalRates }) {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('.reveal'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.22 },
    )

    // Stagger reveals for a journey-like flow
    items.forEach((item, i) => {
      item.style.transitionDelay = `${(i % 8) * 80}ms`
      observer.observe(item)
    })

    // Parallax hero background and journey thumb progress (disabled on mobile to prevent layout thrashing)
    const isMobile = window.innerWidth <= 1024
    const flow = document.querySelector('.flow-track')
    const thumb = document.querySelector('.journey-thumb')

    function onScroll() {
      // Only apply parallax on larger screens (desktop/large tablet)
      if (!isMobile) {
        const scrolled = window.scrollY
        const heroYShift = Math.min(50, Math.max(-40, scrolled * -0.02))
        document.documentElement.style.setProperty('--heroY', `${50 + heroYShift}%`)
      }

      if (flow && thumb && !isMobile) {
        const rect = flow.getBoundingClientRect()
        const start = rect.top + window.scrollY - window.innerHeight * 0.25
        const end = rect.bottom + window.scrollY - window.innerHeight * 0.25
        const progress = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)))
        thumb.style.transform = `translate(-50%, ${progress * 100}%)`
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <section className="hero" id="top">
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__content">
          <p className="eyebrow">Daily Islamic tools, reimagined</p>
          <HeroHighlightDemo title={APP_NAME} />
          <p className="hero__lead">
            Prayer times, Qibla direction, Ramadan reminders, and live Zakat checks — instantly accessible.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="/zakat" onClick={(event) => navigate(event, '/zakat')}>Open Zakat calculator</a>
            <a className="button button--ghost" href="/prayer-times" onClick={(event) => navigate(event, '/prayer-times')}>View prayer times</a>
          </div>
        </div>
        <div className="hero__console reveal" aria-label="Live summary">
          <div>
            <span>Next prayer</span>
            <strong>{nextPrayer?.name ?? 'Loading'}</strong>
          </div>
          <time>{nextPrayer?.time ?? '--:--'}</time>
          <small>{nextPrayer?.countdown ?? 'Fetching today\'s schedule'}</small>
          <div className="console-line">
            <span>Gold</span>
            <strong>{metalRates ? `${formatMoney(metalRates.goldPerGram)} / g` : '--'}</strong>
          </div>
          <div className="console-line">
            <span>Silver</span>
            <strong>{metalRates ? `${formatMoney(metalRates.silverPerGram)} / g` : '--'}</strong>
          </div>
        </div>
      </section>

      <section className="landing-flow">
        <div className="flow-copy reveal">
          <p className="eyebrow">Everything for your daily ritual</p>
          <h2>Prayer, fasting, and Zakat tools in one simple, seamless journey.</h2>
        </div>
        <div className="journey-progress" aria-hidden="true">
          <div className="journey-thumb" />
        </div>
        <div className="flow-track" aria-label="Feature journey">
          {featurePages.slice(0, 6).map((feature, index) => (
            <a
              className="flow-step reveal"
              href={feature.path}
              key={feature.path}
              onClick={(event) => navigate(event, feature.path)}
              style={{ '--step': index + 1 }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{feature.title}</strong>
              <p>{feature.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="signal-section">
        <div className="signal-sticky reveal">
          <p className="eyebrow">Live signals</p>
          <h2>Prayer time, market rate, and daily remembrance stay close without feeling crowded.</h2>
        </div>
        <div className="signal-stack">
          <a className="signal-band reveal" href="/prayer-times" onClick={(event) => navigate(event, '/prayer-times')}>
            <span>Now</span>
            <strong>{nextPrayer?.name ?? 'Prayer times'}</strong>
            <p>{nextPrayer?.countdown ?? 'Today\'s salah schedule loads as the page opens.'}</p>
          </a>
          <a className="signal-band reveal" href="/zakat" onClick={(event) => navigate(event, '/zakat')}>
            <span>Nisab</span>
            <strong>{metalRates ? formatMoney(metalRates.goldPerGram * GOLD_NISAB_GRAMS) : 'Live threshold'}</strong>
            <p>Gold and silver rates are checked in real time before the Zakat calculation runs.</p>
          </a>
          <a className="signal-band reveal" href="/learn-zakat" onClick={(event) => navigate(event, '/learn-zakat')}>
            <span>Learn</span>
            <strong>Zakat guidance</strong>
            <p>Understand the 2.5% obligation, eligible wealth, nisab, and recipient categories.</p>
          </a>
        </div>
      </section>

      <section className="landing-cta reveal">
        <div>
          <p className="eyebrow">Begin with purpose</p>
          <h2>Open a tool, then let the rest stay one smooth gesture away.</h2>
        </div>
        <div className="cta-strip">
          {featurePages.map((feature) => (
            <a href={feature.path} key={feature.path} onClick={(event) => navigate(event, feature.path)}>
              {feature.label}
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
function FeatureShell({ children, eyebrow, title, intro }) {
  return (
    <section className="section page-section">
      <div className="section__head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
          {intro ? <p className="section__intro">{intro}</p> : null}
        </div>
      </div>
      <div className="single-tool">{children}</div>
    </section>
  )
}

function PrayerTimesPage({
  cityLabel,
  dateMeta,
  geoStatus,
  loadingTimes,
  method,
  navigate,
  nextPrayer,
  selectedCity,
  setCoords,
  setMethod,
  setSelectedCity,
  timings,
  timeError,
  useLocation,
}) {
  return (
    <>
      <section className="section page-section">
        <div className="section__head">
          <div>
            <p className="eyebrow">Today</p>
            <h1 className="page-title">Prayer Times for {cityLabel}</h1>
          </div>
          <button className="button button--primary" type="button" onClick={useLocation}>
            Use my location
          </button>
        </div>

        <div className="controls">
          <label>
            City
            <select
              value={selectedCity.slug}
              onChange={(event) => {
                const city = cityPages.find((item) => item.slug === event.target.value)
                setCoords(null)
                setSelectedCity(city)
              }}
            >
              {cityPages.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
          </label>
          <label>
            Calculation
            <select value={method} onChange={(event) => setMethod(Number(event.target.value))}>
              {methods.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="status">{loadingTimes ? 'Loading current prayer times...' : geoStatus}</p>
        {timeError ? <p className="status status--error">{timeError}</p> : null}

        <div className="next-strip">
          <span>Next prayer</span>
          <strong>{nextPrayer?.name ?? 'Loading'}</strong>
          <time>{nextPrayer?.countdown ?? '--:--:--'}</time>
        </div>

        <div className="prayer-grid">
          {prayers.map((name) => (
            <article className={nextPrayer?.name === name ? 'prayer prayer--active' : 'prayer'} key={name}>
              <span>{name}</span>
              <strong>{formatPrayerTime(timings?.[name])}</strong>
            </article>
          ))}
        </div>
        <div className="date-strip">
          <span>{dateMeta?.readable ?? new Date().toLocaleDateString()}</span>
          <span>{dateMeta?.hijri ? `${dateMeta.hijri.day} ${dateMeta.hijri.month.en} ${dateMeta.hijri.year} AH` : 'Hijri date loading'}</span>
        </div>

        <div className="content-note">
          <h2>How to use this prayer timetable</h2>
          <p>
            Select a city or use your device location to load today's salah times. The next-prayer
            strip highlights the upcoming prayer and counts down using your browser clock.
          </p>
          <p>
            Calculation methods can differ for Fajr, Asr, and Isha. If your local mosque publishes
            an official timetable, use that local timetable for community practice and use this page
            as a convenient planning aid.
          </p>
        </div>
      </section>

      <section className="section city-section">
        <div className="section__head">
          <div>
            <p className="eyebrow">City pages</p>
            <h2>Prayer time pages ready for SEO expansion</h2>
          </div>
        </div>
        <div className="city-list">
          {cityPages.map((city) => (
            <a key={city.slug} href={`/prayer-times/${city.slug}`} onClick={(event) => navigate(event, `/prayer-times/${city.slug}`)}>
              {city.name}
              <span>{city.country}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

function QiblaCompass({ coords }) {
  const [heading, setHeading] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const bearing = coords ? calculateBearing(coords.lat, coords.lon, KAABA.lat, KAABA.lon) : 0
  const rotation = bearing - heading

  const compassDirections = [
    { label: 'N', angle: 0 },
    { label: 'NE', angle: 45 },
    { label: 'E', angle: 90 },
    { label: 'SE', angle: 135 },
    { label: 'S', angle: 180 },
    { label: 'SW', angle: 225 },
    { label: 'W', angle: 270 },
    { label: 'NW', angle: 315 },
  ]

  function enableCompass() {
    setEnabled(true)
    window.addEventListener('deviceorientation', (event) => {
      const deviceHeading = event.webkitCompassHeading ?? 360 - (event.alpha ?? 0)
      setHeading(deviceHeading)
    }, { passive: true })
  }

  return (
    <article className="tool">
      <div className="tool__head">
        <span className="icon">Q</span>
        <h2>Qibla Compass</h2>
      </div>
      <div className="compass">
        <svg className="compass-directions" viewBox="0 0 200 200" width="240" height="240">
          {/* Outer and inner circles */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(23, 108, 88, 0.2)" strokeWidth="1" />
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(23, 108, 88, 0.15)" strokeWidth="1" />
          
          {/* Direction markers and labels */}
          {compassDirections.map((dir) => {
            const angle = (dir.angle * Math.PI) / 180
            const x = 100 + 75 * Math.sin(angle)
            const y = 100 - 75 * Math.cos(angle)
            const isCardinal = dir.label.length === 1
            const fontSize = isCardinal ? 14 : 10
            const fontWeight = isCardinal ? 700 : 600

            return (
              <g key={dir.label}>
                {/* Direction line */}
                <line
                  x1="100"
                  y1={isCardinal ? 20 : 25}
                  x2="100"
                  y2={isCardinal ? 15 : 18}
                  stroke={isCardinal ? 'rgba(23, 108, 88, 0.8)' : 'rgba(23, 108, 88, 0.5)'}
                  strokeWidth={isCardinal ? 2 : 1}
                  transform={`rotate(${dir.angle} 100 100)`}
                />
                {/* Direction text */}
                <text
                  x={x}
                  y={y + 6}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  fill={isCardinal ? 'rgba(23, 108, 88, 0.9)' : 'rgba(23, 108, 88, 0.6)'}
                >
                  {dir.label}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="compass__needle" style={{ transform: `rotate(${rotation}deg)` }} />
        <span>Qibla</span>
      </div>
      <p>{coords ? `${Math.round(bearing)} degrees from north` : 'Use location on the Prayer page to calculate direction.'}</p>
      <button className="button button--ghost" type="button" onClick={enableCompass}>
        {enabled ? 'Compass listening' : 'Enable compass'}
      </button>
      <div className="tool-note">
        <h3>About the bearing</h3>
        <p>
          The Qibla angle is calculated from your coordinates to the Kaaba in Makkah. Phone compass
          readings can drift indoors, near metal, or before sensor calibration, so compare with a
          trusted local direction when accuracy matters.
        </p>
      </div>
    </article>
  )
}

function HijriConverter() {
  const [mode, setMode] = useState('gToH')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  async function convert(event) {
    event.preventDefault()
    setError('')
    setResult('Converting...')
    try {
      const [year, month, day] = date.split('-')
      const endpoint = mode === 'gToH' ? 'gToH' : 'hToG'
      const response = await fetch(`${API_BASE}/${endpoint}/${day}-${month}-${year}`)
      const json = await response.json()
      if (!response.ok || json.code !== 200) throw new Error('Date conversion failed.')
      const converted = mode === 'gToH' ? json.data.hijri : json.data.gregorian
      setResult(`${converted.day} ${converted.month.en} ${converted.year}`)
    } catch (conversionError) {
      setResult('')
      setError(conversionError.message)
    }
  }

  return (
    <article className="tool">
      <div className="tool__head">
        <span className="icon">H</span>
        <h2>Hijri Converter</h2>
      </div>
      <form className="stack" onSubmit={convert}>
        <div className="segmented" role="group" aria-label="Conversion direction">
          <button type="button" className={mode === 'gToH' ? 'active' : ''} onClick={() => setMode('gToH')}>
            Gregorian
          </button>
          <button type="button" className={mode === 'hToG' ? 'active' : ''} onClick={() => setMode('hToG')}>
            Hijri
          </button>
        </div>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <button className="button button--primary" type="submit">Convert</button>
      </form>
      <p className={error ? 'status status--error' : 'result'}>{error || result || 'Choose a date to convert.'}</p>
      <div className="tool-note">
        <h3>Calendar note</h3>
        <p>
          Hijri dates may differ by one day between regions because communities can follow local
          moon sighting, calculated calendars, or official religious authorities.
        </p>
      </div>
    </article>
  )
}

function RamadanTimer({ timings, now }) {
  const fajr = timings?.Fajr
  const maghrib = timings?.Maghrib
  const nextMeal = getNextMeal(fajr, maghrib, now)

  return (
    <article className="tool">
      <div className="tool__head">
        <span className="icon">R</span>
        <h2>Sehri / Iftar</h2>
      </div>
      <div className="big-number">{nextMeal.countdown}</div>
      <p>{nextMeal.label}</p>
      <div className="mini-times">
        <span>Sehri ends <strong>{formatPrayerTime(fajr)}</strong></span>
        <span>Iftar <strong>{formatPrayerTime(maghrib)}</strong></span>
      </div>
      <div className="tool-note">
        <h3>Fasting reminder</h3>
        <p>
          Sehri is based on the Fajr time loaded for your selected city or location, and Iftar is
          based on Maghrib. Leave a careful buffer when you are travelling or following a local
          mosque timetable.
        </p>
      </div>
    </article>
  )
}

function ZakatCalculator({ metalRates, metalStatus }) {
  const [values, setValues] = useState({
    cash: 0,
    goldGrams: 0,
    silverGrams: 0,
    business: 0,
    debts: 0,
  })
  const [manualRates, setManualRates] = useState({ goldPerGram: '', silverPerGram: '' })
  const goldRate = Number(manualRates.goldPerGram) || metalRates?.goldPerGram || 0
  const silverRate = Number(manualRates.silverPerGram) || metalRates?.silverPerGram || 0
  const goldValue = Number(values.goldGrams) * goldRate
  const silverValue = Number(values.silverGrams) * silverRate
  const total = Math.max(
    Number(values.cash) + goldValue + silverValue + Number(values.business) - Number(values.debts),
    0,
  )
  const goldNisab = goldRate * GOLD_NISAB_GRAMS
  const silverNisab = silverRate * SILVER_NISAB_GRAMS
  const nisab = Math.min(goldNisab || Infinity, silverNisab || Infinity)
  const qualifies = Number.isFinite(nisab) && total >= nisab
  const zakat = qualifies ? total * 0.025 : 0

  function updateValue(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function updateRate(event) {
    setManualRates({ ...manualRates, [event.target.name]: event.target.value })
  }

  return (
    <article className="tool tool--wide">
      <div className="tool__head">
        <span className="icon">Z</span>
        <h2>Zakat Calculator</h2>
      </div>

      <div className="rate-board">
        <div>
          <span>Gold rate</span>
          <strong>{goldRate ? `${formatMoney(goldRate)} / g` : '--'}</strong>
        </div>
        <div>
          <span>Silver rate</span>
          <strong>{silverRate ? `${formatMoney(silverRate)} / g` : '--'}</strong>
        </div>
        <p>{metalStatus}</p>
      </div>

      <div className="money-grid">
        {[
          ['cash', 'Cash and savings'],
          ['goldGrams', 'Gold owned in grams'],
          ['silverGrams', 'Silver owned in grams'],
          ['business', 'Business and trade assets'],
          ['debts', 'Short-term debts'],
        ].map(([name, label]) => (
          <label key={name}>
            {label}
            <input min="0" name={name} type="number" value={values[name]} onChange={updateValue} />
          </label>
        ))}
        <label>
          Manual gold rate per gram
          <input min="0" name="goldPerGram" placeholder="Uses live rate" type="number" value={manualRates.goldPerGram} onChange={updateRate} />
        </label>
        <label>
          Manual silver rate per gram
          <input min="0" name="silverPerGram" placeholder="Uses live rate" type="number" value={manualRates.silverPerGram} onChange={updateRate} />
        </label>
      </div>

      <div className="nisab-grid">
        <span>Gold nisab <strong>{goldNisab ? formatMoney(goldNisab) : '--'}</strong></span>
        <span>Silver nisab <strong>{silverNisab ? formatMoney(silverNisab) : '--'}</strong></span>
        <span>Status <strong>{qualifies ? 'Zakat applies' : 'Below nisab'}</strong></span>
      </div>

      <div className="zakat-total">
        <span>Zakat owed at 2.5%</span>
        <strong>{formatMoney(zakat)}</strong>
      </div>
      <div className="tool-note">
        <h3>What this estimate includes</h3>
        <p>
          This calculator totals common liquid and trade assets, subtracts short-term debts, checks
          the lower available nisab threshold, and applies 2.5% when the net amount qualifies.
          Complex assets, business structures, and personal circumstances need qualified guidance.
        </p>
      </div>
    </article>
  )
}

function LearnZakatPage() {
  return (
    <section className="section page-section learn-page">
      <div className="section__head">
        <div>
          <p className="eyebrow">Learn Zakat</p>
          <h1 className="page-title">Rules, obligations, and benefits</h1>
        </div>
      </div>
      <div className="learn-grid">
        <article>
          <h2>What zakat means</h2>
          <p>
            Zakat is a mandatory Islamic financial obligation for Muslims who own wealth above the
            nisab threshold for a lunar year. It is one of the five pillars of Islam and is commonly
            calculated as 2.5% of eligible net wealth.
          </p>
        </article>
        <article>
          <h2>Nisab threshold</h2>
          <p>
            Nisab is the minimum wealth level at which zakat becomes due. The reference thresholds
            are the value of 87.48 grams of gold or 612.36 grams of silver.
          </p>
        </article>
        <article>
          <h2>What to include</h2>
          <p>
            Include cash, savings, gold, silver, business inventory, and other zakatable assets.
            Deduct short-term liabilities before checking whether your net total meets nisab.
          </p>
        </article>
        <article>
          <h2>Who receives zakat</h2>
          <p>
            Classical recipient categories include the poor, the needy, people in debt, stranded
            travelers, zakat administrators, and other eligible welfare categories.
          </p>
        </article>
      </div>
    </section>
  )
}

function ResourcesPage({ navigate }) {
  return (
    <section className="section page-section prose-page">
      <div className="section__head">
        <div>
          <p className="eyebrow">Resources</p>
          <h1 className="page-title">Guides for daily Islamic tools</h1>
          <p className="section__intro">
            Original articles that explain the assumptions behind Nisab Lantern's calculators,
            timers, and prayer-time utilities.
          </p>
        </div>
      </div>
      <div className="article-list">
        {resourceArticles.map((article) => (
          <article className="article-card" key={article.slug}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <a href={`/resources/${article.slug}`} onClick={(event) => navigate(event, `/resources/${article.slug}`)}>
              Read guide
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function ArticlePage({ path, navigate }) {
  const article = resourceArticles.find((item) => `/resources/${item.slug}` === path)
  if (!article) return <ResourcesPage navigate={navigate} />

  return (
    <section className="section page-section prose-page">
      <div className="section__head">
        <div>
          <p className="eyebrow">Guide</p>
          <h1 className="page-title">{article.title}</h1>
          <p className="section__intro">{article.summary}</p>
        </div>
      </div>
      <article className="prose-block">
        {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p>
          For related tools, visit the <a href="/zakat" onClick={(event) => navigate(event, '/zakat')}>Zakat calculator</a>,
          {' '}<a href="/prayer-times" onClick={(event) => navigate(event, '/prayer-times')}>prayer times</a>,
          or <a href="/ramadan" onClick={(event) => navigate(event, '/ramadan')}>Ramadan timer</a>.
        </p>
      </article>
    </section>
  )
}

function AboutPage() {
  return (
    <StaticPage eyebrow="About Us" title="About Nisab Lantern">
      <p>
        Nisab Lantern is a browser-based Islamic utility site for prayer times, Qibla direction,
        Hijri date conversion, Ramadan timing, Zakat estimation, and private Tasbeeh counting.
      </p>
      <p>
        The site is independently maintained as a practical daily toolkit for Muslims who want fast,
        readable tools without installing another app. It uses public APIs for prayer, calendar,
        currency, and metal-rate data, then keeps the interface simple enough for quick daily use.
      </p>
      <p>
        Nisab Lantern is run by the site owner listed on the Contact page. The goal is to provide
        helpful calculations and educational context while encouraging users to follow their local
        mosque, scholar, or trusted institution for religious decisions.
      </p>
    </StaticPage>
  )
}

function ContactPage() {
  return (
    <StaticPage eyebrow="Contact Us" title="Contact Nisab Lantern">
      <p>
        For corrections, privacy requests, advertising questions, accessibility issues, or general
        feedback, contact the site owner at <a href="mailto:abdulmannanansa@gmail.com">abdulmannanansa@gmail.com</a>.
      </p>
      <p>
        Replace this email with your real monitored address before submitting the site to Google
        AdSense. A working contact method is important for visitors, policy questions, and account
        verification.
      </p>
      <div className="contact-panel">
        <span>Suggested email subjects</span>
        <strong>Correction request, privacy request, advertising inquiry, accessibility feedback</strong>
      </div>
    </StaticPage>
  )
}

function PrivacyPolicyPage() {
  return (
    <StaticPage eyebrow="Privacy Policy" title="Privacy Policy">
      <p><strong>Effective date:</strong> July 6, 2026</p>
      <p>
        Nisab Lantern respects your privacy. This policy explains what information may be collected
        when you use the site, how third-party services may process data, and how advertising cookies
        may be used if Google AdSense or similar ad vendors are enabled.
      </p>
      <h2>Information we collect</h2>
      <p>
        The site may store Tasbeeh count and target values in your browser's local storage. If you
        choose to use location-based prayer times or Qibla direction, your browser asks for location
        permission and the coordinates are used in the page to request relevant timing data. Nisab
        Lantern does not operate a user account system.
      </p>
      <h2>Cookies, ads, and third-party vendors</h2>
      <p>
        Google, as a third-party vendor, may use cookies to serve ads based on a user's prior visits
        to this site or other websites. Google's advertising cookies enable Google and its partners
        to serve ads to users based on visits to Nisab Lantern and other sites on the internet.
      </p>
      <p>
        Users may opt out of personalized advertising by visiting Google's Ads Settings. You can also
        visit aboutads.info to learn about choices for third-party vendor cookies. Other third-party
        ad vendors or networks may also use cookies, JavaScript, or similar technologies to measure
        ads, prevent fraud, and personalize or limit advertising.
      </p>
      <h2>Third-party APIs</h2>
      <p>
        Nisab Lantern uses public services such as Aladhan, metals-rate providers, and foreign
        exchange APIs to power tools. Requests to those services may include technical information
        such as IP address, browser details, and requested city or coordinates, according to each
        provider's own privacy practices.
      </p>
      <h2>Your choices</h2>
      <p>
        You can block or delete cookies in your browser, clear local storage, deny location
        permission, or avoid personalized ads through Google settings. Some tools may be less precise
        if location access is disabled.
      </p>
      <h2>Contact</h2>
      <p>
        Privacy questions can be sent to <a href="mailto:abdulmannanansa@gmail.com">abdulmannanansa@gmail.com</a>.
        Replace this with your real privacy contact email before launch.
      </p>
    </StaticPage>
  )
}

function TermsPage() {
  return (
    <StaticPage eyebrow="Terms of Use" title="Terms of Use">
      <p>
        By using Nisab Lantern, you agree to use the site for personal, lawful, informational
        purposes. The tools are provided as-is and may depend on third-party APIs, device sensors,
        browser settings, and network availability.
      </p>
      <p>
        You may not misuse the site, interfere with its operation, scrape it aggressively, or present
        its estimates as an official religious or financial ruling. We may update content, tools, or
        these terms as the site develops.
      </p>
      <p>
        Nisab Lantern is not liable for losses or missed obligations caused by incorrect inputs,
        device clock errors, third-party API outages, calculation differences, or reliance on the
        site instead of qualified local guidance.
      </p>
    </StaticPage>
  )
}

function DisclaimerPage() {
  return (
    <StaticPage eyebrow="Disclaimer" title="Religious and Financial Disclaimer">
      <p>
        Nisab Lantern provides calculators, prayer-time references, educational writing, and planning
        tools for general information only. It does not issue fatwas, religious rulings, financial
        advice, legal advice, tax advice, or professional accounting advice.
      </p>
      <p>
        Prayer times, Hijri dates, Qibla direction, Ramadan countdowns, metal rates, and Zakat
        estimates can vary by method, region, device, market data source, and personal circumstance.
        Always follow your local mosque, qualified scholar, or trusted institution for binding
        religious practice.
      </p>
      <p>
        Before paying Zakat or making financial decisions, review your assets and liabilities with a
        qualified scholar, accountant, or adviser who understands your situation.
      </p>
    </StaticPage>
  )
}

function StaticPage({ children, eyebrow, title }) {
  return (
    <section className="section page-section prose-page">
      <div className="section__head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>
      <article className="prose-block">{children}</article>
    </section>
  )
}

function TasbeehCounter() {
  const [count, setCount] = useState(() => Number(localStorage.getItem('nisab-lantern-tasbeeh-count') ?? 0))
  const [target, setTarget] = useState(() => Number(localStorage.getItem('nisab-lantern-tasbeeh-target') ?? 33))

  useEffect(() => {
    localStorage.setItem('nisab-lantern-tasbeeh-count', String(count))
  }, [count])

  useEffect(() => {
    localStorage.setItem('nisab-lantern-tasbeeh-target', String(target))
  }, [target])

  function increment() {
    setCount((current) => current + 1)
    navigator.vibrate?.(18)
  }

  return (
    <article className="tool">
      <div className="tool__head">
        <span className="icon">T</span>
        <h2>Tasbeeh Counter</h2>
      </div>
      <button className="tasbeeh-button" type="button" onClick={increment}>
        <span>{count}</span>
        Tap
      </button>
      <label>
        Target
        <input min="1" type="number" value={target} onChange={(event) => setTarget(Number(event.target.value))} />
      </label>
      <progress max={target || 1} value={count % (target || 1)} />
      <button className="button button--ghost" type="button" onClick={() => setCount(0)}>Reset</button>
      <div className="tool-note">
        <h3>Private by default</h3>
        <p>
          The counter saves only in this browser through local storage. It is meant for personal
          dhikr routines and does not upload your count to Nisab Lantern.
        </p>
      </div>
    </article>
  )
}

function Footer({ navigate }) {
  const footerLinks = [
    { path: '/resources', label: 'Resources' },
    { path: '/learn-zakat', label: 'Learn Zakat' },
    { path: '/zakat', label: 'Calculator' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/privacy', label: 'Privacy' },
    { path: '/terms', label: 'Terms' },
    { path: '/disclaimer', label: 'Disclaimer' },
  ]

  return (
    <footer className="footer">
      <p>{APP_NAME} uses Aladhan, Gold API, and Frankfurter public endpoints. Tasbeeh progress stays in your browser.</p>
      <div>
        {footerLinks.map((item) => (
          <a key={item.path} href={item.path} onClick={(event) => navigate(event, item.path)}>{item.label}</a>
        ))}
        <a href="/" onClick={(event) => navigate(event, '/')}>Home</a>
      </div>
    </footer>
  )
}

function getPageMeta(path) {
  const routeCity = getCityFromPath(path)
  if (routeCity) {
    return {
      title: `${routeCity.name} prayer times today | ${APP_NAME}`,
      description: `Today's Fajr, Dhuhr, Asr, Maghrib, and Isha prayer times for ${routeCity.name}, ${routeCity.country}, with Hijri date and next-prayer countdown.`,
    }
  }

  const article = resourceArticles.find((item) => `/resources/${item.slug}` === path)
  if (article) {
    return {
      title: `${article.title} | ${APP_NAME}`,
      description: article.summary,
    }
  }

  const page = [...featurePages, ...contentPages].find((item) => item.path === path)
  if (page) {
    return {
      title: `${page.title} | ${APP_NAME}`,
      description: page.description,
    }
  }

  return {
    title: `${APP_NAME} | Prayer Times, Qibla, Ramadan and Zakat Tools`,
    description: 'Fast Islamic daily tools for prayer times, Qibla direction, Hijri dates, Ramadan reminders, Zakat estimates, and private Tasbeeh counting.',
  }
}

function setMetaTag(attribute, key, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function getCityFromPath(path) {
  const match = path.match(/^\/prayer-times\/([^/]+)/)
  if (!match) return null
  return cityPages.find((city) => city.slug === match[1]) ?? null
}

function todayForApi() {
  const date = new Date()
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

function formatPrayerTime(value) {
  if (!value) return '--:--'
  return value.replace(/\s*\(.+\)/, '')
}

function getNextPrayer(timings, now) {
  if (!timings) return null
  const upcoming = prayers
    .map((name) => ({ name, date: timeOnToday(formatPrayerTime(timings[name]), now), time: formatPrayerTime(timings[name]) }))
    .find((item) => item.date > now)
  const next = upcoming ?? {
    name: 'Fajr',
    date: addDays(timeOnToday(formatPrayerTime(timings.Fajr), now), 1),
    time: formatPrayerTime(timings.Fajr),
  }
  return { ...next, countdown: formatDuration(next.date - now) }
}

function getNextMeal(fajr, maghrib, now) {
  if (!fajr || !maghrib) return { label: 'Waiting for prayer times', countdown: '--:--:--' }
  const sehri = timeOnToday(formatPrayerTime(fajr), now)
  const iftar = timeOnToday(formatPrayerTime(maghrib), now)
  if (sehri > now) return { label: 'until Sehri ends', countdown: formatDuration(sehri - now) }
  if (iftar > now) return { label: 'until Iftar', countdown: formatDuration(iftar - now) }
  return { label: 'until tomorrow\'s Sehri', countdown: formatDuration(addDays(sehri, 1) - now) }
}

function timeOnToday(time, now) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date(now)
  date.setHours(hours, minutes, 0, 0)
  return date
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatDuration(ms) {
  const seconds = Math.max(Math.floor(ms / 1000), 0)
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const remaining = String(seconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${remaining}`
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  const startLat = toRad(lat1)
  const endLat = toRad(lat2)
  const deltaLon = toRad(lon2 - lon1)
  const y = Math.sin(deltaLon) * Math.cos(endLat)
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLon)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

function toRad(value) {
  return (value * Math.PI) / 180
}

function toDeg(value) {
  return (value * 180) / Math.PI
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export default App
