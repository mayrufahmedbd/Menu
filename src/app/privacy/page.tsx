import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen">
      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Effective Date: {new Date().toLocaleDateString()}</p>
          <p>
            Your privacy is important to us. This Privacy Policy outlines the types of personal information that is received and collected by Menu and how it is used.
          </p>
          <h3 className="text-lg font-bold text-foreground mt-6">Information Collection and Use</h3>
          <p>
            We collect personal information when you create an account, make a purchase, or subscribe to our newsletter. This information includes your name, email address, and shipping address.
          </p>
          <h3 className="text-lg font-bold text-foreground mt-6">Data Security</h3>
          <p>
            We implement reasonable security practices to protect your personal data from unauthorized access or disclosure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
