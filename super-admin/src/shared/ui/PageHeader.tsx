import type { ReactNode } from 'react'
import styled from 'styled-components'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  max-width: 960px;
`

const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.6;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <Header className={className}>
      <TitleBlock>
        <Title>{title}</Title>
        {description ? <Description>{description}</Description> : null}
      </TitleBlock>
      {actions ? <Actions>{actions}</Actions> : null}
    </Header>
  )
}
