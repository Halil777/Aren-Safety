import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'

type BadgeVariant = 'default' | 'success' | 'secondary' | 'destructive'

type BadgeProps = {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  line-height: 1;
  ${({ $variant }) => badgeVariantStyles[$variant]}
`

const badgeVariantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  default: css`
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accentContrast};
    border: 1px solid ${({ theme }) => theme.colors.border};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.success}1a;
    color: ${({ theme }) => theme.colors.success};
    border: 1px solid ${({ theme }) => theme.colors.success}33;
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.secondaryContrast};
    border: 1px solid ${({ theme }) => theme.colors.border};
  `,
  destructive: css`
    background: ${({ theme }) => theme.colors.destructive}1a;
    color: ${({ theme }) => theme.colors.destructive};
    border: 1px solid ${({ theme }) => theme.colors.destructive}33;
  `,
}

export function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  return (
    <StyledBadge className={className} $variant={variant}>
      {children}
    </StyledBadge>
  )
}
