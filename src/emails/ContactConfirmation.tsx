import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface Props {
  name: string
  interest?: string | null
}

export default function ContactConfirmation({ name, interest }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Recebemos sua mensagem, {name}! Retornaremos em até 24h.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          <Section style={styles.header}>
            <Heading style={styles.brand}>Housing <span style={{ color: '#00ffff' }}>PRO</span></Heading>
          </Section>

          <Section style={styles.content}>
            <Heading as="h2" style={styles.title}>
              Mensagem recebida! 👋
            </Heading>
            <Text style={styles.text}>
              Olá, <strong style={{ color: '#ffffff' }}>{name}</strong>!
            </Text>
            <Text style={styles.text}>
              Recebemos sua mensagem{interest ? ` sobre <strong>${interest}</strong>` : ''} e nossa equipe entrará em contato em até <strong style={{ color: '#00ffff' }}>24 horas úteis</strong>.
            </Text>

            <Section style={styles.card}>
              <Text style={styles.cardTitle}>O que acontece agora?</Text>
              {[
                'Um especialista analisa seu contexto e objetivos',
                'Agendamos uma conversa sem script de vendas',
                'Apresentamos um diagnóstico inicial gratuito',
              ].map((step, i) => (
                <Text key={i} style={styles.step}>
                  <span style={{ color: '#00ffff', fontWeight: 700, marginRight: 10 }}>{i + 1}.</span>
                  {step}
                </Text>
              ))}
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.text}>
              Enquanto isso, confira nossos artigos sobre{' '}
              <Link href="https://housingpro.tech/blog" style={styles.link}>
                Performance Marketing, Data e IA
              </Link>
              .
            </Text>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © 2026 Housing PRO — Ecossistemas Digitais · São Paulo, Brasil
            </Text>
            <Text style={styles.footerText}>
              <Link href="https://housingpro.tech" style={{ color: 'rgba(0,255,255,.4)', textDecoration: 'none' }}>
                housingpro.tech
              </Link>
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
  header: { backgroundColor: '#00001a', padding: '28px 32px 20px', borderBottom: '1px solid rgba(0,255,255,.15)', textAlign: 'center' as const },
  brand: { color: '#ffffff', fontSize: 22, fontWeight: 800, margin: 0 },
  content: { padding: '32px 32px 24px' },
  title: { color: '#ffffff', fontSize: 22, fontWeight: 800, marginTop: 0, marginBottom: 16 },
  text: { color: 'rgba(255,255,255,.65)', fontSize: 15, lineHeight: '1.75', margin: '0 0 16px' },
  card: { backgroundColor: 'rgba(0,255,255,.04)', border: '1px solid rgba(0,255,255,.12)', borderRadius: 10, padding: '20px 24px', margin: '24px 0' },
  cardTitle: { color: '#ffffff', fontSize: 14, fontWeight: 700, margin: '0 0 14px' },
  step: { color: 'rgba(255,255,255,.65)', fontSize: 14, lineHeight: '1.6', margin: '0 0 10px' },
  divider: { borderColor: 'rgba(255,255,255,.08)', margin: '24px 0' },
  link: { color: '#00ffff', textDecoration: 'underline' },
  footer: { backgroundColor: '#00001a', padding: '16px 32px', borderTop: '1px solid rgba(255,255,255,.06)', textAlign: 'center' as const },
  footerText: { color: 'rgba(255,255,255,.25)', fontSize: 11, margin: '4px 0' },
}
