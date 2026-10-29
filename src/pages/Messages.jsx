import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { cn } from '../utils/cn'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePageMeta } from '../hooks/usePageMeta'
import { useMessaging } from '../context/MessagingContext'
import { useToast } from '../context/ToastContext'
import { getProfileById } from '../data/profiles'
import Button from '../components/common/Button'
import ConversationList from '../components/messaging/ConversationList'
import ChatPanel from '../components/messaging/ChatPanel'
import { Badge, PageHeader } from '../components/common/ui'
import { ConfirmDialog } from '../components/common/Modal'

export default function Messages() {
  usePageMeta(
    'Messages',
    'Chat with accepted connections in the simulated Saanjh messaging experience.',
  )
  const {
    sortedConversations,
    getConversation,
    setActiveConversation,
    sendMessage,
    isTyping,
    unreadTotal,
    clearConversation,
  } = useMessaging()
  const toast = useToast()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [searchParams, setSearchParams] = useSearchParams()
  const paramId = searchParams.get('c')
  const [selectedId, setSelectedId] = useState(paramId || null)
  const [search, setSearch] = useState('')
  const [clearOpen, setClearOpen] = useState(false)

  const rows = useMemo(
    () =>
      sortedConversations
        .map((conversation) => ({
          ...conversation,
          profile: getProfileById(conversation.profileId),
        }))
        .filter((conversation) => Boolean(conversation.profile)),
    [sortedConversations],
  )

  useEffect(() => {
    if (paramId && paramId !== selectedId) setSelectedId(paramId)
  }, [paramId, selectedId])

  useEffect(() => {
    if (isDesktop && !selectedId && rows.length) {
      setSelectedId(rows[0].id)
    }
  }, [isDesktop, selectedId, rows])

  useEffect(() => {
    setActiveConversation(selectedId)
    return () => setActiveConversation(null)
  }, [selectedId, setActiveConversation])

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((conversation) => {
      const last = conversation.messages[conversation.messages.length - 1]
      return (
        conversation.profile.displayName.toLowerCase().includes(term) ||
        conversation.profile.profession?.toLowerCase().includes(term) ||
        last?.text.toLowerCase().includes(term)
      )
    })
  }, [rows, search])

  const activeConversation = selectedId ? getConversation(selectedId) : null
  const activeProfile = activeConversation
    ? getProfileById(activeConversation.profileId)
    : null

  function selectConversation(id) {
    setSelectedId(id)
    const next = new URLSearchParams(searchParams)
    next.set('c', id)
    setSearchParams(next, { replace: true })
  }

  function closeConversation() {
    setSelectedId(null)
    const next = new URLSearchParams(searchParams)
    next.delete('c')
    setSearchParams(next, { replace: true })
  }

  function handleClear() {
    if (!activeConversation) return
    clearConversation(activeConversation.id)
    setClearOpen(false)
    toast.info('The conversation history was cleared for this demo.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Conversations"
        title="Messages"
        description="Stay in touch with accepted connections. Replies arrive automatically in this front-end demo."
        actions={
          <>
            {unreadTotal > 0 && (
              <Badge tone="brand" size="sm">
                <MessageCircle className="h-3 w-3" aria-hidden="true" /> {unreadTotal} unread
              </Badge>
            )}
            <Button to="/matches" variant="secondary" size="sm">
              Find connections
            </Button>
          </>
        }
      />

      <div className="card-surface grid h-[calc(100vh-15rem)] min-h-[540px] overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)]">
        <ConversationList
          conversations={filteredRows}
          activeId={selectedId}
          onSelect={selectConversation}
          search={search}
          onSearch={setSearch}
          className={cn(
            'min-h-0 border-line lg:border-r',
            selectedId ? 'hidden lg:flex' : 'flex',
          )}
        />
        <div className={cn('min-h-0', selectedId ? 'block' : 'hidden lg:block')}>
          <ChatPanel
            conversation={activeConversation}
            profile={activeProfile}
            typing={activeConversation ? isTyping(activeConversation.id) : false}
            onSend={(text) => (activeConversation ? sendMessage(activeConversation.id, text) : false)}
            onBack={closeConversation}
            onClear={() => setClearOpen(true)}
            onAttach={() =>
              toast.info('Attachments are not available in this front-end demo.', {
                title: 'Demo limitation',
              })
            }
          />
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] leading-5 text-ink-muted">
        All conversations are fictional. Messages are stored only in this browser and auto-replies
        are simulated.
      </p>

      <ConfirmDialog
        open={clearOpen}
        title="Clear this conversation?"
        description="This removes the message history from this browser for the demo."
        confirmLabel="Clear conversation"
        onConfirm={handleClear}
        onCancel={() => setClearOpen(false)}
      >
        The conversation itself will remain in your inbox so you can start again.
      </ConfirmDialog>
    </div>
  )
}
