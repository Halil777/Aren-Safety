import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryContrast};
    border: 1px solid ${({ theme }) => theme.colors.primary};

    &:hover {
      background: ${({ theme }) => theme.colors.text};
      border-color: ${({ theme }) => theme.colors.text};
    }
  `,
  destructive: css`
    background: ${({ theme }) => theme.colors.destructive};
    color: ${({ theme }) => theme.colors.destructiveContrast};
    border: 1px solid ${({ theme }) => theme.colors.destructive};

    &:hover {
      filter: brightness(0.95);
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.secondaryContrast};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      filter: brightness(0.97);
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid transparent;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }
  `,
  link: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid transparent;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  `,
}

const sizeStyles = {
  default: css`
    height: 40px;
    padding: 0 ${({ theme }) => theme.spacing.lg};
  `,
  sm: css`
    height: 36px;
    padding: 0 ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radii.sm};
  `,
  lg: css`
    height: 44px;
    padding: 0 ${({ theme }) => theme.spacing.xl};
  `,
  icon: css`
    height: 40px;
    width: 40px;
    padding: 0;
  `,
}

const StyledButton = styled.button<{
  $variant: ButtonVariant
  $size: ButtonSize
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.1;
  cursor: pointer;
  transition: all 120ms ease;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
`

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', ...props }, ref) => {
    return <StyledButton ref={ref} $variant={variant} $size={size} {...props} />
  }
)
Button.displayName = 'Button'

export { Button }
