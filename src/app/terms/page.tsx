import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen">
      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Effective Date: {new Date().toLocaleDateString()}</p>
          <p>
            Welcome to Menu. By accessing or using our website, you agree to be bound by these Terms of Service.
          </p>
          <h3 className="text-lg font-bold text-foreground mt-6">Use of the Site</h3>
          <p>
            You agree to use the site for lawful purposes only. You must not use the site in any way that causes, or may cause, damage to the site or impairment of the availability or accessibility of the site.
          </p>
          <h3 className="text-lg font-bold text-foreground mt-6">Purchases and Payment</h3>
          <p>
            All purchases made through our site are subject to our acceptance. We reserve the right to refuse or cancel any order for any reason.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
