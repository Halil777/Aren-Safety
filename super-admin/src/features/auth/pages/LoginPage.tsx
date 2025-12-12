import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export function LoginPage() {
  const { t } = useTranslation()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Form submission will be wired to auth flow later
  }

  return (
    <Page>
      <CardShell>
        <Card>
          <CenteredHeader>
            <CardTitle>{t('pages.login.title')}</CardTitle>
            <CardDescription>{t('pages.login.description')}</CardDescription>
          </CenteredHeader>
          <CardContent>
            <Form onSubmit={handleSubmit}>
              <Field>
                <Label>{t('form.email')}</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  required
                />
              </Field>
              <Field>
                <Label>{t('form.password')}</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  required
                />
              </Field>
              <Button type="submit">{t('pages.login.submit')}</Button>
            </Form>
          </CardContent>
        </Card>
      </CardShell>
    </Page>
  )
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
`

const CardShell = styled.div`
  width: 100%;
  max-width: 460px;
`

const CenteredHeader = styled(CardHeader)`
  text-align: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`
