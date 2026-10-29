import { cn } from '../../utils/cn'

export default function ProfileGrid({ children, className, columns = 'default' }) {
  const layouts = {
    default: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5',
    wide: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5',
    compact: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  }
  return <div className={cn(layouts[columns] || layouts.default, className)}>{children}</div>
}

export function ProfileCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="skeleton aspect-[4/5] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-3.5 w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-9 flex-1" />
          <div className="skeleton h-9 w-9" />
          <div className="skeleton h-9 w-9" />
        </div>
      </div>
    </div>
  )
}

export function ProfileGridSkeleton({ count = 6, className }) {
  return (
    <ProfileGrid className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <ProfileCardSkeleton key={index} />
      ))}
    </ProfileGrid>
  )
}
