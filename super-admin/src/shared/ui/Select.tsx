import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import styled from 'styled-components'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 1px;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ children, ...props }, ref) {
    return (
      <StyledSelect ref={ref} {...props}>
        {children}
      </StyledSelect>
    )
  }
)
