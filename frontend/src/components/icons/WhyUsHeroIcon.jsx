import {
  ArrowPathIcon,
  BanknotesIcon,
  BoltIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CursorArrowRaysIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

import sizes from '@/components/icons/heroIconSizes.module.css'

export function WhyUsHeroIcon({ variant, className }) {
  const cn = [sizes.size40, className].filter(Boolean).join(' ')
  switch (variant) {
    case 'why_target':
      return <CursorArrowRaysIcon className={cn} aria-hidden />
    case 'why_contract':
      return <ClipboardDocumentCheckIcon className={cn} aria-hidden />
    case 'why_money':
      return <BanknotesIcon className={cn} aria-hidden />
    case 'why_repeat':
      return <ArrowPathIcon className={cn} aria-hidden />
    case 'why_gov':
      return <BuildingLibraryIcon className={cn} aria-hidden />
    case 'why_honest':
      return <CheckBadgeIcon className={cn} aria-hidden />
    case 'why_clock':
      return <ClockIcon className={cn} aria-hidden />
    case 'why_fast':
      return <BoltIcon className={cn} aria-hidden />
    case 'why_docs':
      return <ShieldCheckIcon className={cn} aria-hidden />
    default:
      return <ShieldCheckIcon className={cn} aria-hidden />
  }
}
