import {
  AcademicCapIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  FingerPrintIcon,
  FlagIcon,
  HeartIcon,
  HomeModernIcon,
  IdentificationIcon,
  QueueListIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

import sizes from '@/components/icons/heroIconSizes.module.css'

export function ServiceIcon({ name, className, compact }) {
  const cn = [compact ? sizes.size32 : sizes.size48, className].filter(Boolean).join(' ')
  switch (name) {
    case 'rvp':
    case 'document':
      return <DocumentTextIcon className={cn} aria-hidden />
    case 'quota':
      return <QueueListIcon className={cn} aria-hidden />
    case 'vnzh':
      return <HomeModernIcon className={cn} aria-hidden />
    case 'passport':
    case 'id':
      return <IdentificationIcon className={cn} aria-hidden />
    case 'work':
    case 'briefcase':
    case 'stamp':
      return <BriefcaseIcon className={cn} aria-hidden />
    case 'gavel':
    case 'scale':
      return <ScaleIcon className={cn} aria-hidden />
    case 'shield':
      return <ShieldCheckIcon className={cn} aria-hidden />
    case 'heart':
      return <HeartIcon className={cn} aria-hidden />
    case 'fingerprint':
      return <FingerPrintIcon className={cn} aria-hidden />
    case 'education':
      return <AcademicCapIcon className={cn} aria-hidden />
    case 'flag':
      return <FlagIcon className={cn} aria-hidden />
    case 'people':
    case 'user':
      return <UserGroupIcon className={cn} aria-hidden />
    case 'chat':
      return <ChatBubbleLeftRightIcon className={cn} aria-hidden />
    default:
      return <DocumentTextIcon className={cn} aria-hidden />
  }
}
