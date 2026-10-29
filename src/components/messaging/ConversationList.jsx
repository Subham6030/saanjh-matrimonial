import { Search, Users } from 'lucide-react'
import { cn } from '../../utils/cn'
import { relativeTime, truncate } from '../../utils/format'
import { Avatar, Badge } from '../common/ui'
import { Input } from '../forms/FormControls'
import Button from '../common/Button'

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  search,
  onSearch,
  className,
}) {
  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="border-b border-line p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-ink-primary">Inbox</h2>
          <Badge tone="neutral" size="sm">
            {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
          </Badge>
        </div>
        <div className="relative mt-3">
          <label htmlFor="conversation-search" className="sr-only">
            Search conversations
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <Input
            id="conversation-search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search conversations…"
            className="py-2 pl-9 text-xs"
          />
        </div>
      </div>

      {conversations.length ? (
        <ul className="flex-1 overflow-y-auto" aria-label="Conversations">
          {conversations.map((conversation) => {
            const { profile } = conversation
            const last = conversation.messages[conversation.messages.length - 1]
            const active = conversation.id === activeId
            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-start gap-3 border-b border-line/70 px-4 py-3.5 text-left transition-colors',
                    active ? 'bg-brand/5' : 'hover:bg-bg-secondary/60',
                  )}
                >
                  <Avatar src={profile.primaryPhoto} name={profile.displayName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={cn(
                          'truncate text-sm font-semibold',
                          active ? 'text-brand' : 'text-ink-primary',
                        )}
                      >
                        {profile.displayName}
                      </p>
                      <span className="shrink-0 text-[10px] text-ink-muted">
                        {last ? relativeTime(last.at) : 'New'}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-ink-muted">
                      {profile.profession}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-secondary">
                      {last
                        ? `${last.sender === 'me' ? 'You: ' : ''}${truncate(last.text, 90)}`
                        : 'A new conversation. Say hello.'}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="mt-1.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white">
                      {conversation.unread}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-primary">
            {search ? 'No conversations found' : 'No conversations yet'}
          </p>
          <p className="mt-1 text-xs leading-5 text-ink-secondary">
            {search
              ? 'Try a different name or clear the search.'
              : 'Accept an interest or connect with a match to start a simulated conversation.'}
          </p>
          {search ? (
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => onSearch('')}>
              Clear search
            </Button>
          ) : (
            <Button to="/matches" size="sm" className="mt-3">
              Find matches
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
