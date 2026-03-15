import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components'

interface Props {
  name: string
  email: string
  company?: string | null
  phone?: string | null
  interest?: string | null
  message?: string | null
  source?: string | null
}

export default function ContactNotification({ name, email, company, phone, interest, message, source }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Novo contato de {name} — {interest ?? 'sem interesse definido'}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          <Section style={styles.header}>
            <Heading style={styles.brand}>Housing <span style={{ color: '#00ffff' }}>PRO</span></Heading>
            <Text style={styles.headerSub}>Novo contato recebido via {source ?? 'site'}</Text>
          </Section>

          <Section style={styles.content}>
            <Heading as="h2" style={styles.sectionTitle}>Dados do Lead</Heading>

            <Row>
              <Column style={styles.fieldLabel}>Nome</Column>
              <Column style={styles.fieldValue}>{name}</Column>
            </Row>
            <Hr style={styles.divider} />

            <Row>
              <Column style={styles.fieldLabel}>E-mail</Column>
              <Column style={styles.fieldValue}>{email}</Column>
            </Row>
            <Hr style={styles.divider} />

            {company && (
              <>
                <Row>
                  <Column style={styles.fieldLabel}>Empresa</Column>
                  <Column style={styles.fieldValue}>{company}</Column>
                </Row>
                <Hr style={styles.divider} />
              </>
            )}

            {phone && (
              <>
                <Row>
                  <Column style={styles.fieldLabel}>WhatsApp</Column>
                  <Column style={styles.fieldValue}>{phone}</Column>
                </Row>
                <Hr style={styles.divider} />
              </>
            )}

            {interest && (
              <>
                <Row>
                  <Column style={styles.fieldLabel}>Interesse</Column>
                  <Column style={{ ...styles.fieldValue, color: '#00cccc', fontWeight: 'bold' }}>{interest}</Column>
                </Row>
                <Hr style={styles.divider} />
              </>
            )}

            {message && (
              <Section style={styles.messageBox}>
                <Text style={styles.fieldLabel}>Mensagem</Text>
                <Text style={styles.messageText}>{message}</Text>
              </Section>
            )}
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Housing PRO — Ecossistemas Digitais · São Paulo, Brasil
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: { backgroundColor: '#f4f4f5', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: '32px 0' },
  container: { backgroundColor: '#000033', borderRadius: 12, maxWidth: 560, margin: '0 auto', overflow: 'hidden' },
  header: { backgroundColor: '#00001a', padding: '28px 32px 20px', borderBottom: '1px solid rgba(0,255,255,.15)' },
  brand: { color: '#ffffff', fontSize: 22, fontWeight: 800, margin: 0 },
  headerSub: { color: 'rgba(255,255,255,.45)', fontSize: 13, margin: '6px 0 0' },
  content: { padding: '28px 32px' },
  sectionTitle: { color: '#ffffff', fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: 0 },
  fieldLabel: { color: 'rgba(255,255,255,.45)', fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '.08em', width: '30%', paddingBottom: 6, paddingTop: 6 },
  fieldValue: { color: '#ffffff', fontSize: 14, width: '70%', paddingBottom: 6, paddingTop: 6 },
  divider: { borderColor: 'rgba(255,255,255,.06)', margin: '0' },
  messageBox: { marginTop: 20, backgroundColor: 'rgba(0,255,255,.04)', border: '1px solid rgba(0,255,255,.12)', borderRadius: 8, padding: '16px 20px' },
  messageText: { color: 'rgba(255,255,255,.75)', fontSize: 14, lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap' as const },
  footer: { backgroundColor: '#00001a', padding: '16px 32px', borderTop: '1px solid rgba(255,255,255,.06)' },
  footerText: { color: 'rgba(255,255,255,.25)', fontSize: 11, margin: 0, textAlign: 'center' as const },
}
