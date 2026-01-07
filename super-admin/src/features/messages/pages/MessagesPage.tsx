import { useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/shared/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { PageHeader } from '@/shared/ui/PageHeader'
import { useMessagesQuery, useMarkMessagesReadMutation } from '../api/hooks'

export function MessagesPage() {
  const { t } = useTranslation()
  const { data: messages, isLoading, error } = useMessagesQuery()
  const markReadMutation = useMarkMessagesReadMutation()

  useEffect(() => {
    markReadMutation.mutate()
    // Mark all messages as read only once when the page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageStack>
      <PageHeader
        title={t('messages.title')}
        description={t('messages.description')}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('messages.inbox')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Muted>{t('messages.loading')}</Muted>
          ) : error ? (
            <ErrorText>{error.message}</ErrorText>
          ) : !messages || messages.length === 0 ? (
            <Muted>{t('messages.empty')}</Muted>
          ) : (
            <TableWrapper>
              <StyledTable>
                <thead>
                  <tr>
                    <HeaderCell>{t('messages.from')}</HeaderCell>
                    <HeaderCell>{t('messages.subject')}</HeaderCell>
                    <HeaderCell>{t('messages.body')}</HeaderCell>
                    <HeaderCell>{t('messages.date')}</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(message => (
                    <Row key={message.id}>
                      <Cell>
                        <Strong>
                          {message.tenantName || t('messages.unknownEmail')}
                        </Strong>
                        <Subtle>
                          {message.tenantEmail || t('messages.unknownEmail')}
                        </Subtle>
                        <Subtle>
                          {message.tenantId || t('messages.unknownTenant')}
                        </Subtle>
                      </Cell>
                      <Cell>{message.subject}</Cell>
                      <BodyCell>{message.body}</BodyCell>
                      <Cell>{formatDateTime(message.createdAt)}</Cell>
                    </Row>
                  ))}
                </tbody>
              </StyledTable>
            </TableWrapper>
          )}
        </CardContent>
      </Card>
    </PageStack>
  )
}

const PageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`

const Muted = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`

const ErrorText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.destructive};
  font-weight: 600;
`

const TableWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: ${({ theme }) => theme.colors.secondary};
  }
`

const HeaderCell = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Row = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Cell = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  vertical-align: top;
`

const BodyCell = styled(Cell)`
  max-width: 540px;
  color: ${({ theme }) => theme.colors.muted};
`

const Strong = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const Subtle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`
