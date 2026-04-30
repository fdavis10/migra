import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { ChatBubbleLeftRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { submitLead } from '@/api/leads'
import { useTranslation } from '@/i18n/useTranslation'
import styles from './SpecialistChat.module.css'

const STORAGE_KEY = 'resident_specialist_chat_v2'
const OP_PICK_KEY = 'resident_op_pick'
const TYPING_MS = 1400
/** Авто-раскрытие панели чата после загрузки страницы (иконка видна сразу) */
const CHAT_AUTO_EXPAND_DELAY_MS = 10_000

const OPERATORS = [
  { id: 'alena', avatar: '/images/operator_alena.webp' },
  { id: 'daniil', avatar: '/images/operator_daniil.jpg' },
  { id: 'anna', avatar: '/images/operator_anna.webp' },
]

function pickOperatorId() {
  return OPERATORS[Math.floor(Math.random() * OPERATORS.length)].id
}

function resolveOperatorId(stored) {
  if (stored && OPERATORS.some((o) => o.id === stored)) return stored
  if (typeof window === 'undefined') return OPERATORS[0].id
  try {
    const sid = sessionStorage.getItem(OP_PICK_KEY)
    if (sid && OPERATORS.some((o) => o.id === sid)) return sid
  } catch {}
  const id = pickOperatorId()
  try {
    sessionStorage.setItem(OP_PICK_KEY, id)
  } catch {}
  return id
}

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeDisplayName(s) {
  const t = s.trim().replace(/\s+/g, ' ')
  if (!t) return ''
  return t
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function extractPhone(text) {
  const t = text.trim().slice(0, 40)
  const digits = t.replace(/\D/g, '')
  if (digits.length >= 10) return t
  if (t.length >= 8) return t
  return t || '—'
}

function formatTranscript(messages, specialistLabel, t) {
  return messages
    .map((m) => `${m.role === 'assistant' ? specialistLabel : t('specialistChat.you')}: ${m.text}`)
    .join('\n')
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || data.version !== 2) return null
    return data
  } catch {
    return null
  }
}

function savePersisted(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, ...data }))
  } catch {}
}

function getInitialOperatorId() {
  const p = typeof window !== 'undefined' ? loadPersisted() : null
  return resolveOperatorId(p?.operatorId)
}

export function SpecialistChat() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [operatorId] = useState(getInitialOperatorId)
  const operator = useMemo(
    () => OPERATORS.find((o) => o.id === operatorId) || OPERATORS[0],
    [operatorId],
  )
  const operatorLabel = t(`specialistChat.op.${operatorId}`)
  const chatMsg = useMemo(
    () => ({
      greet: t('specialistChat.greet'),
      askName: t('specialistChat.askName'),
      askCity: t('specialistChat.askCity'),
      connectAndAskPhone: t('specialistChat.connectAndAskPhone'),
      thanks: t('specialistChat.thanks'),
      thanksNoApi: t('specialistChat.thanksNoApi'),
    }),
    [t],
  )
  const [mounted, setMounted] = useState(false)
  /** Кнопка всегда видна; панель — по клику или авто через CHAT_AUTO_EXPAND_DELAY_MS */
  const [minimized, setMinimized] = useState(true)
  const [messages, setMessages] = useState([])
  /** 0 привет / любой ответ → 1 имя → 2 город → 3 телефон → 4 готово */
  const [step, setStep] = useState(0)
  const [userName, setUserName] = useState('')
  const [cityReply, setCityReply] = useState('')
  const [done, setDone] = useState(false)
  const [leadOk, setLeadOk] = useState(null)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [inputLocked, setInputLocked] = useState(false)

  const listRef = useRef(null)
  const timerRef = useRef(null)
  const autoExpandTimerRef = useRef(0)
  const hydrated = useRef(false)
  const messagesRef = useRef([])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const p = loadPersisted()
    const saved = p && Array.isArray(p.messages) ? p.messages : []
    if (saved.length > 0) {
      setMessages(saved)
      setStep(typeof p.step === 'number' ? p.step : 0)
      setUserName(p.userName || '')
      setCityReply(p.cityReply || '')
      setDone(Boolean(p.done))
      setLeadOk(typeof p.leadOk === 'boolean' ? p.leadOk : null)
      if (typeof p.minimized === 'boolean') setMinimized(p.minimized)
    } else {
      setMessages([{ id: uid(), role: 'assistant', text: chatMsg.greet }])
      setMinimized(true)
    }
  }, [chatMsg.greet])

  const persist = useCallback(() => {
    savePersisted({
      minimized,
      messages,
      step,
      userName,
      cityReply,
      done,
      leadOk,
      operatorId,
    })
    if (operatorId) {
      try {
        sessionStorage.setItem(OP_PICK_KEY, operatorId)
      } catch {}
    }
  }, [minimized, messages, step, userName, cityReply, done, leadOk, operatorId])

  useEffect(() => {
    persist()
  }, [persist])

  const ensureGreeting = useCallback(() => {
    setMessages((prev) => {
      if (prev.length > 0) return prev
      return [{ id: uid(), role: 'assistant', text: chatMsg.greet }]
    })
  }, [chatMsg.greet])

  useEffect(() => {
    if (!mounted) return
    autoExpandTimerRef.current = window.setTimeout(() => {
      autoExpandTimerRef.current = 0
      setMinimized(false)
      ensureGreeting()
    }, CHAT_AUTO_EXPAND_DELAY_MS)
    return () => {
      if (autoExpandTimerRef.current) {
        window.clearTimeout(autoExpandTimerRef.current)
        autoExpandTimerRef.current = 0
      }
    }
  }, [mounted, ensureGreeting])

  const openPanel = () => {
    if (autoExpandTimerRef.current) {
      window.clearTimeout(autoExpandTimerRef.current)
      autoExpandTimerRef.current = 0
    }
    setMinimized(false)
    ensureGreeting()
  }

  const scrollBottom = () => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  useEffect(() => {
    scrollBottom()
  }, [messages, typing, minimized])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const pushAssistant = (text) => {
    setMessages((prev) => [...prev, { id: uid(), role: 'assistant', text }])
  }

  const scheduleReply = useCallback((text) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setTyping(true)
    setInputLocked(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setTyping(false)
      setInputLocked(false)
      pushAssistant(text)
    }, TYPING_MS)
  }, [])

  const submitConversation = async (allMessages, phoneText, name, city) => {
    const transcript = formatTranscript(allMessages, operatorLabel, t)
    const phone = extractPhone(phoneText)
    const footer = [
      '',
      '---',
      `${t('specialistChat.leadSummaryName')}: ${name || '—'}`,
      `${t('specialistChat.leadSummaryCity')}: ${city || '—'}`,
      `${t('specialistChat.leadSummaryPhone')}: ${phone}`,
    ].join('\n')
    const message = `${transcript}${footer}`.slice(0, 5000)
    try {
      await submitLead({
        name: (name || '').slice(0, 200),
        phone,
        citizenship: '',
        region: (city || '').slice(0, 100),
        service: t('specialistChat.leadService'),
        message,
        source_page: pathname,
        source: 'chat',
      })
      setLeadOk(true)
      return true
    } catch {
      setLeadOk(false)
      return false
    }
  }

  const onSend = async () => {
    const text = draft.trim()
    if (!text || inputLocked || typing || done) return
    setDraft('')
    const userMsg = { id: uid(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])

    if (step === 0) {
      setStep(1)
      scheduleReply(chatMsg.askName)
      return
    }
    if (step === 1) {
      setUserName(normalizeDisplayName(text) || text.trim())
      setStep(2)
      scheduleReply(chatMsg.askCity)
      return
    }
    if (step === 2) {
      setCityReply(text.trim())
      setStep(3)
      scheduleReply(chatMsg.connectAndAskPhone)
      return
    }
    if (step === 3) {
      setStep(4)
      setInputLocked(true)
      setTyping(true)
      const nameSnap = (userName || '').trim() || '—'
      const citySnap = (cityReply || '').trim() || '—'
      const transcriptMessages = [...messagesRef.current, userMsg]
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(async () => {
        timerRef.current = null
        setTyping(false)
        const ok = await submitConversation(transcriptMessages, text, nameSnap, citySnap)
        pushAssistant(ok ? chatMsg.thanks : chatMsg.thanksNoApi)
        setDone(true)
        setInputLocked(true)
      }, TYPING_MS)
    }
  }

  const resetChat = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    try {
      sessionStorage.removeItem(OP_PICK_KEY)
    } catch {}
    setMessages([{ id: uid(), role: 'assistant', text: chatMsg.greet }])
    setStep(0)
    setUserName('')
    setCityReply('')
    setDone(false)
    setLeadOk(null)
    setDraft('')
    setTyping(false)
    setInputLocked(false)
    setMinimized(true)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const unread = useMemo(() => {
    if (!minimized || messages.length === 0) return 0
    const last = messages[messages.length - 1]
    return last?.role === 'assistant' ? 1 : 0
  }, [minimized, messages])

  if (!mounted) return null

  const node = (
    <div className={styles.wrap} aria-live="polite">
      {minimized ? (
        <div className={styles.fabWrap}>
          <button
            type="button"
            className={styles.fab}
            onClick={openPanel}
            aria-label={t('specialistChat.openFabAria')}
          >
            <ChatBubbleLeftRightIcon className={styles.fabIcon} aria-hidden />
          </button>
          {unread ? <span className={styles.badge}>1</span> : null}
        </div>
      ) : (
        <section className={styles.panel} aria-label={t('specialistChat.panelAria')}>
          <header className={styles.head}>
            <img
              className={styles.avatar}
              src={operator.avatar}
              width={44}
              height={44}
              alt={operatorLabel}
            />
            <div className={styles.headText}>
              <p className={styles.name}>{operatorLabel}</p>
              <p className={styles.role}>{t('chatPerson.role')}</p>
            </div>
            <div className={styles.headActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setMinimized(true)}
                aria-label={t('specialistChat.minimizeAria')}
              >
                <ChevronDownIcon width={22} height={22} aria-hidden />
              </button>
            </div>
          </header>
          <div className={styles.messages} ref={listRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.bubbleRow} ${m.role === 'user' ? styles.bubbleRowUser : ''}`}
              >
                <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : ''}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing ? (
              <div className={styles.typingRow}>
                <img
                  className={styles.typingAvatar}
                  src={operator.avatar}
                  width={28}
                  height={28}
                  alt=""
                />
                <div className={styles.typingBubble}>
                  <span>{t('specialistChat.typingStatus')}</span>
                  <span className={styles.dots} aria-hidden>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          {done ? (
            <p className={styles.doneNote}>
              {t('specialistChat.doneNote')}{' '}
              <button type="button" className={styles.resetBtn} onClick={resetChat}>
                {t('specialistChat.startOver')}
              </button>
            </p>
          ) : (
            <div className={styles.inputRow}>
              <textarea
                className={styles.input}
                rows={2}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t('specialistChat.placeholder')}
                disabled={inputLocked || typing}
                aria-label={t('specialistChat.inputAria')}
              />
              <button
                type="button"
                className={styles.send}
                onClick={onSend}
                disabled={!draft.trim() || inputLocked || typing}
              >
                {t('specialistChat.sendShort')}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )

  return createPortal(node, document.body)
}
