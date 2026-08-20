'use client'

// Luxury duotone icon set (Phosphor) exported under the names the app uses.
import type * as React from 'react'
import {
  SquaresFour,
  PresentationChart,
  Binoculars,
  Broadcast,
  Vault,
  Medal,
  Leaf,
  SealCheck,
  SketchLogo,
  ShieldStar,
  Stack,
  Lightning,
  Bank,
  MagnifyingGlass,
  Clock as PClock,
  Timer as PTimer,
  CaretDoubleUp,
  CaretDoubleDown,
  ArrowUp as PArrowUp,
  ArrowDown as PArrowDown,
  CaretLeft,
  CaretRight,
  CaretDown,
  Repeat as PRepeat,
  ShieldCheck as PShieldCheck,
  Cpu as PCpu,
  Info as PInfo,
  ArrowsClockwise,
  Check as PCheck,
  X as PX,
  Crosshair,
  ShareNetwork,
  Minus as PMinus,
  Plus as PPlus,
  Hash as PHash,
  Faders,
  Wallet as PWallet,
  Percent as PPercent,
  Target as PTarget,
  ShieldWarning,
  Trophy as PTrophy,
  CurrencyCircleDollar,
  Coins as PCoins,
  Lightbulb as PLightbulb,
  Warning,
  UploadSimple,
  Lock as PLock,
  Infinity as PInfinity,
  Scan as PScan,
  TrendUp,
  Pulse,
  MinusCircle as PMinusCircle,
  GitBranch as PGitBranch,
  Gauge as PGauge,
  List as PList,
  SignOut,
  IdentificationCard,
  EnvelopeSimple,
  CopySimple,
  ArrowUpRight as PArrowUpRight,
  ArrowRight as PArrowRight,
  type Icon,
} from '@phosphor-icons/react'

export type AppIcon = React.ComponentType<{ className?: string; strokeWidth?: number | string }>

const d = (I: Icon): AppIcon => {
  const C = (props: Record<string, unknown>) => {
    const { strokeWidth: _sw, ...rest } = props
    return <I weight="duotone" {...rest} />
  }
  return C as AppIcon
}

// navigation / tool identities
export const LayoutDashboard = d(SquaresFour)
export const ScanLine = d(PScan)
export const ScanSearch = d(PresentationChart)
export const Telescope = d(Binoculars)
export const Radio = d(Broadcast)
export const RadioTower = d(Broadcast)
export const SlidersHorizontal = d(Faders)
export const LayoutGrid = d(SquaresFour)

// tiers
export const Gift = d(Leaf)
export const Rocket = d(Medal)
export const Star = d(SealCheck)
export const Crown = d(SketchLogo)
export const ShieldCheck = d(ShieldStar)

// generic
export const Layers = d(Stack)
export const Cpu = d(Lightning)
export const Landmark = d(Bank)
export const Search = d(MagnifyingGlass)
export const Clock = d(PClock)
export const Timer = d(PTimer)
export const ChevronsUp = d(CaretDoubleUp)
export const ChevronsDown = d(CaretDoubleDown)
export const ArrowUp = d(PArrowUp)
export const ArrowDown = d(PArrowDown)
export const ChevronLeft = d(CaretLeft)
export const ChevronRight = d(CaretRight)
export const ChevronDown = d(CaretDown)
export const Repeat = d(PRepeat)
export const ShieldBadge = d(PShieldCheck)
export const Info = d(PInfo)
export const RefreshCw = d(ArrowsClockwise)
export const Check = d(PCheck)
export const X: AppIcon = ((props: Record<string, unknown>) => {
  const { strokeWidth: _sw, ...rest } = props
  return <PX weight="bold" {...rest} />
}) as AppIcon
export const Radar = d(Crosshair)
export const Waypoints = d(ShareNetwork)
export const Minus = d(PMinus)
export const Plus = d(PPlus)
export const Hash = d(PHash)
export const Wallet = d(PWallet)
export const Percent = d(PPercent)
export const Target = d(PTarget)
export const ShieldAlert = d(ShieldWarning)
export const Trophy = d(PTrophy)
export const CircleDollarSign = d(CurrencyCircleDollar)
export const Coins = d(PCoins)
export const Lightbulb = d(PLightbulb)
export const AlertTriangle = d(Warning)
export const Upload: AppIcon = ((props: Record<string, unknown>) => {
  const { strokeWidth: _sw, ...rest } = props
  return <UploadSimple weight="bold" {...rest} />
}) as AppIcon
export const Scan = d(PScan)
export const TrendingUp = d(TrendUp)
export const Activity = d(Pulse)
export const MinusCircle = d(PMinusCircle)
export const GitBranch = d(PGitBranch)
export const Gauge = d(PGauge)
export const Menu = d(PList)
export const LogOut = d(SignOut)
export const IdCard = d(IdentificationCard)
export const Mail = d(EnvelopeSimple)
export const Copy = d(CopySimple)
export const ArrowUpRight = d(PArrowUpRight)
export const ArrowRight = d(PArrowRight)
export const Lock = d(PLock)
export const InfinityIcon = d(PInfinity)
