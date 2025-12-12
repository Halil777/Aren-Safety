import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import styled from 'styled-components'

const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
`

const CardHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
`

const CardTitleText = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`

const CardDescriptionText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`

const CardContentWrapper = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.xl}
    ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
`

const CardFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  padding-top: 0;
`

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <CardContainer ref={ref} {...props} />
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <CardHeaderWrapper ref={ref} {...props} />
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ ...props }, ref) => <CardTitleText ref={ref} {...props} />)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ ...props }, ref) => <CardDescriptionText ref={ref} {...props} />)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <CardContentWrapper ref={ref} {...props} />
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <CardFooterWrapper ref={ref} {...props} />
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
