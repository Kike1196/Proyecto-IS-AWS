import { AuthLayout } from "@/components/auth-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacidadPage() {
  return (
    <AuthLayout title="Política de Privacidad" subtitle="Cómo protegemos tu información personal">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Política de Privacidad</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-foreground">1. Información que Recopilamos</h3>
            <p className="text-muted-foreground">
              Recopilamos información necesaria para el funcionamiento del sistema educativo, incluyendo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4">
              <li>Datos de identificación personal (nombre, apellidos)</li>
              <li>Información de contacto (correo electrónico, teléfono)</li>
              <li>Datos académicos (número de control, carrera, semestre)</li>
              <li>Información de acceso (credenciales de login)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">2. Uso de la Información</h3>
            <p className="text-muted-foreground">Utilizamos su información personal para:</p>
            <ul className="list-disc list-inside text-muted-foreground ml-4">
              <li>Proporcionar servicios educativos</li>
              <li>Gestionar su cuenta y acceso al sistema</li>
              <li>Comunicar información académica importante</li>
              <li>Mejorar nuestros servicios</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">3. Protección de Datos</h3>
            <p className="text-muted-foreground">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra
              acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">4. Compartir Información</h3>
            <p className="text-muted-foreground">
              No compartimos su información personal con terceros, excepto cuando sea necesario para el funcionamiento
              del sistema educativo o cuando la ley lo requiera.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">5. Sus Derechos</h3>
            <p className="text-muted-foreground">
              Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales.
              Para ejercer estos derechos, contacte al administrador del sistema.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">6. Contacto</h3>
            <p className="text-muted-foreground">
              Para preguntas sobre esta política de privacidad, contacte a: privacidad@institucion.edu.mx
            </p>
          </section>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">Última actualización: Enero 2024</p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}


