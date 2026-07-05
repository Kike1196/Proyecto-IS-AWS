import { AuthLayout } from "@/components/auth-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TerminosPage() {
  return (
    <AuthLayout title="Términos y Condiciones" subtitle="Condiciones de uso del sistema educativo">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Términos y Condiciones de Uso</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-foreground">1. Aceptación de los Términos</h3>
            <p className="text-muted-foreground">
              Al acceder y utilizar este sistema educativo, usted acepta estar sujeto a estos términos y condiciones de
              uso.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">2. Uso del Sistema</h3>
            <p className="text-muted-foreground">
              El sistema está destinado exclusivamente para fines educativos y académicos. Los usuarios se comprometen
              a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4">
              <li>Utilizar credenciales propias y mantener la confidencialidad</li>
              <li>No compartir información académica con terceros no autorizados</li>
              <li>Respetar los derechos de propiedad intelectual</li>
              <li>Mantener un comportamiento ético y profesional</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">3. Privacidad y Protección de Datos</h3>
            <p className="text-muted-foreground">
              La institución se compromete a proteger la información personal de los usuarios conforme a las leyes de
              protección de datos aplicables.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">4. Responsabilidades del Usuario</h3>
            <p className="text-muted-foreground">
              Los usuarios son responsables de mantener actualizados sus datos de contacto y de reportar cualquier uso
              no autorizado de su cuenta.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">5. Modificaciones</h3>
            <p className="text-muted-foreground">
              La institución se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán
              notificados a través del sistema.
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


