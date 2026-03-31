import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Mail, CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Car className="h-8 w-8" />
            <span className="text-2xl font-bold">DriveNow</span>
          </Link>
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a confirmation link to verify your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="h-5 w-5" />
            <span>Please check your inbox and spam folder</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Back to login</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive an email?{" "}
            <Link href="/auth/sign-up" className="text-foreground underline underline-offset-4 hover:text-primary">
              Try again
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
