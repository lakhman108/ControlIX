import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your privacy is our top priority
        </p>
      </div>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Privacy Policy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              You can write privacy policy here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 