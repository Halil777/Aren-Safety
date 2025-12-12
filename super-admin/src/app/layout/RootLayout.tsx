import { type ReactElement, useEffect } from 'react'
import { LayoutDashboard, Mail, Menu, PanelLeft, Shield } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useUiStore } from '@/shared/store/ui-store'
import { Button } from '@/shared/ui/Button'
import { LanguageSwitch } from '@/shared/ui/LanguageSwitch'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import { APP_ROUTES } from '@/shared/config/routes'
import { useUnreadCountQuery } from '@/features/messages/api/hooks'

type NavItem = {
  to: string
  labelKey: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const navItems: NavItem[] = [
  {
    to: APP_ROUTES.DASHBOARD,
    labelKey: 'nav.dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  { to: APP_ROUTES.TENANTS.LIST, labelKey: 'nav.tenants', icon: Shield },
  { to: APP_ROUTES.MESSAGES.LIST, labelKey: 'nav.messages', icon: Mail },
]

export function RootLayout(): ReactElement {
  const { t } = useTranslation()
  const location = useLocation()
  const isSidebarOpen = useUiStore(state => state.isSidebarOpen)
  const toggleSidebar = useUiStore(state => state.toggleSidebar)
  const closeSidebar = useUiStore(state => state.closeSidebar)
  const { data: unreadCount = 0 } = useUnreadCountQuery()

  useEffect(() => {
    closeSidebar()
  }, [closeSidebar, location.pathname])

  return (
    <Shell>
      <Sidebar
        items={navItems}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        brandTitle={t('layout.brand')}
        brandSubtitle={t('layout.subtitle')}
        translate={t}
        unreadCount={unreadCount}
      />

      <Main>
        <Topbar
          onToggleSidebar={toggleSidebar}
          brandTitle={t('layout.brand')}
          brandSubtitle={t('layout.subtitle')}
        />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  )
}

type SidebarProps = {
  items: NavItem[]
  isOpen: boolean
  onToggle: () => void
  brandTitle: string
  brandSubtitle: string
  translate: (key: string) => string
  unreadCount: number
}

function Sidebar({
  items,
  isOpen,
  onToggle,
  brandTitle,
  brandSubtitle,
  translate,
  unreadCount,
}: SidebarProps) {
  return (
    <>
      <SidebarContainer $open={isOpen} aria-label="Sidebar">
        <SidebarHeader>
          <AvatarCircle>SA</AvatarCircle>
          <BrandText>
            <BrandTitle>{brandTitle}</BrandTitle>
            <BrandSubtitle>{brandSubtitle}</BrandSubtitle>
          </BrandText>
          <SidebarCloseButton
            variant="ghost"
            size="icon"
            aria-label="Close sidebar"
            onClick={onToggle}
          >
            <PanelLeft size={18} />
          </SidebarCloseButton>
        </SidebarHeader>

        <NavList>
          {items.map(item => (
            <NavItemLink key={item.to} to={item.to} end={item.end}>
              <item.icon size={18} />
              <span>
                {translate(item.labelKey)}
                {item.to === APP_ROUTES.MESSAGES.LIST && unreadCount > 0 ? (
                  <UnreadBadge>{unreadCount}</UnreadBadge>
                ) : null}
              </span>
            </NavItemLink>
          ))}
        </NavList>

        <SidebarFooter>
          <FooterLabel>{brandSubtitle}</FooterLabel>
          <FooterText>Platform oversight</FooterText>
        </SidebarFooter>
      </SidebarContainer>
      {isOpen ? <SidebarOverlay onClick={onToggle} /> : null}
    </>
  )
}

type TopbarProps = {
  onToggleSidebar: () => void
  brandTitle: string
  brandSubtitle: string
}

function Topbar({ onToggleSidebar, brandTitle, brandSubtitle }: TopbarProps) {
  return (
    <TopbarContainer>
      <MobileMenuButton
        variant="ghost"
        size="icon"
        aria-label="Open sidebar"
        onClick={onToggleSidebar}
      >
        <Menu size={18} />
      </MobileMenuButton>
      <TopbarBrand>
        <AvatarCircle>SA</AvatarCircle>
        <TopbarBrandText>
          <BrandTitle>{brandTitle}</BrandTitle>
          <BrandSubtitle>{brandSubtitle}</BrandSubtitle>
        </TopbarBrandText>
      </TopbarBrand>

      <TopbarActions>
        <LanguageSwitch />
        <ThemeToggle />
        <UserBadge />
      </TopbarActions>
    </TopbarContainer>
  )
}

function UserBadge() {
  return (
    <UserBadgeContainer>
      <UserAvatar>SA</UserAvatar>
      <UserInfo>
        <UserName>Super Admin</UserName>
        <UserRole>Platform owner</UserRole>
      </UserInfo>
    </UserBadgeContainer>
  )
}

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
`

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 0;

  @media (min-width: 960px) {
    margin-left: 280px;
  }
`

const Content = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

const SidebarContainer = styled.aside<{ $open: boolean }>`
  position: fixed;
  inset: 0 auto 0 0;
  width: 280px;
  background: ${({ theme }) => theme.colors.card};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.md};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 30;
  transform: translateX(${({ $open }) => ($open ? '0' : '-110%')});
  transition: transform 200ms ease;

  @media (min-width: 960px) {
    transform: translateX(0);
  }
`

const SidebarCloseButton = styled(Button)`
  @media (min-width: 960px) {
    display: none;
  }
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`

const BrandTitle = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`

const BrandSubtitle = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`

const AvatarCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accentContrast};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`

const NavItemLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px solid transparent;
  transition: all 140ms ease;

  &.active {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.secondary};
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
`

const UnreadBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-size: 11px;
  font-weight: 700;
`

const SidebarFooter = styled.div`
  margin-top: auto;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.md};
`

const FooterLabel = styled.p`
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`

const FooterText = styled.p`
  margin: 2px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`

const SidebarOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(2px);
  z-index: 20;

  @media (min-width: 960px) {
    display: none;
  }
`

const TopbarContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(6px);
  background: ${({ theme }) => theme.colors.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const MobileMenuButton = styled(Button)`
  @media (min-width: 960px) {
    display: none;
  }
`

const TopbarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const TopbarBrandText = styled.div`
  display: none;
  flex-direction: column;
  gap: 2px;

  @media (min-width: 640px) {
    display: flex;
  }
`

const TopbarActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-left: auto;
`

const UserBadgeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 8px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accentContrast};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
`

const UserInfo = styled.div`
  display: none;
  flex-direction: column;
  line-height: 1.3;

  @media (min-width: 640px) {
    display: flex;
  }
`

const UserName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const UserRole = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`
