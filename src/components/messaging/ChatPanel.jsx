import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  MessageCircle,
  MessagesSquare,
  Paperclip,
  Send,
  Trash2,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatDate, formatTime, relativeTime } from '../../utils/format'
import { Avatar, Badge } from '../common/ui'
import Button from '../common/Button'

function dayKey(value) {
  const date = new Date(value)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function dayLabel(value) {
  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (dayKey(date) === dayKey(today)) return 'Today'
  if (dayKey(date) === dayKey(yesterday)) return 'Yesterday'
  return formatDate(date)
}

export default function ChatPanel({
  conversation,
  profile,
  typing,
  onSend,
  onBack,
  onClear,
  onAttach,
}) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    setDraft('')
  }, [conversation?.id])

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [conversation?.messages?.length, typing, conversation?.id])

  function submit(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    const sent = onSend(text)
    if (sent) setDraft('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit(event)
    }
  }

  if (!conversation || !profile) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-bg-elevated/30 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <MessagesSquare className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-2xl text-ink-primary">Your conversations live here</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-ink-secondary">
          Choose a conversation from the inbox, or connect with a match to start a simulated
          conversation.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button to="/matches" size="sm">
            Find matches
          </Button>
          <Button to="/interests" variant="secondary" size="sm">
            Review interests
          </Button>
        </div>
      </div>
    )
  }

  const messages = conversation.messages || []

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-card">
      <header className="flex items-center gap-3 border-b border-line px-3 py-3 sm:px-4">
        {onBack && (
          <button type="button" onClick={onBack} className="btn-icon lg:hidden" aria-label="Back to inbox">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <Link to={`/profile/${profile.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar src={profile.primaryPhoto} name={profile.displayName} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-primary hover:text-brand">
              {profile.displayName}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-ink-muted">
              {profile.profession} · Active {relativeTime(profile.lastActiveAt)}
            </p>
          </div>
        </Link>
        <Badge tone="warning" size="sm" className="hidden sm:inline-flex">
          Demo chat
        </Badge>
        <button
          type="button"
          onClick={onClear}
          className="btn-icon"
          aria-label="Clear conversation"
          title="Clear conversation"
          disabled={!messages.length}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-bg-primary/40 px-3 py-4 sm:px-5 sm:py-5"
        role="log"
        aria-live="polite"
        aria-label={`Conversation with ${profile.displayName}`}
      >
        {messages.length ? (
          <div className="mx-auto max-w-2xl space-y-3">
            {messages.map((message, index) => {
              const previous = messages[index - 1]
              const showDay = !previous || dayKey(previous.at) !== dayKey(message.at)
              const mine = message.sender === 'me'
              return (
                <Fragment key={message.id}>
                  {showDay && (
                    <div className="flex items-center gap-3 py-2">
                      <span className="h-px flex-1 bg-line" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                        {dayLabel(message.at)}
                      </span>
                      <span className="h-px flex-1 bg-line" />
                    </div>
                  )}
                  <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                    {!mine && (
                      <Avatar
                        src={profile.primaryPhoto}
                        name={profile.displayName}
                        size="xs"
                        className="mr-2 self-end"
                      />
                    )}
                    <div className={cn('max-w-[82%] sm:max-w-[72%]', mine && 'text-right')}>
                      <div
                        className={cn(
                          'inline-block rounded-2xl px-3.5 py-2.5 text-left text-sm leading-6 shadow-sm',
                          mine
                            ? 'rounded-br-md bg-brand text-white'
                            : 'rounded-bl-md border border-line bg-bg-card text-ink-primary',
                        )}
                      >
                        {message.text}
                      </div>
                      <p className="mt-1 px-1 text-[10px] text-ink-muted">
                        {mine ? 'You' : profile.firstName} · {formatTime(message.at)}
                      </p>
                    </div>
                  </div>
                </Fragment>
              )
            })}

            {typing && (
              <div className="flex items-end gap-2">
                <Avatar src={profile.primaryPhoto} name={profile.displayName} size="xs" />
                <div className="rounded-2xl rounded-bl-md border border-line bg-bg-card px-4 py-3">
                  <span className="flex items-center gap-1" aria-label={`${profile.firstName} is typing`}>
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted"
                        style={{ animationDelay: `${dot * 140}ms` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink-primary">A blank page, kindly.</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-ink-secondary">
              Say hello to {profile.firstName}. Replies in this demo are simulated automatically.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-line p-3 sm:p-4">
        <form onSubmit={submit} className="flex items-end gap-2">
          <div className="relative flex-1">
            <label htmlFor="message-composer" className="sr-only">
              Write a message
            </label>
            <button
              type="button"
              onClick={onAttach}
              className="absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-bg-secondary hover:text-ink-primary"
              aria-label="Attach a file (not available in demo)"
              title="Attachments are not available in this demo"
            >
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <textarea
              id="message-composer"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={1000}
              placeholder={`Write a message to ${profile.firstName}…`}
              className="field-base block min-h-[44px] resize-none py-2.5 pl-11 pr-12 leading-6"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-brand text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-[10px] text-ink-muted">
          Enter to send · Shift + Enter for a new line · Replies are simulated
        </p>
      </div>
    </div>
  )
}
