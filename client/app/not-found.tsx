import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full overflow-hidden w-24 h-24 relative">
              <img
                src="https://api.dicebear.com/9.x/initials/svg?seed=CX"
                alt="Company Logo"
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-9xl font-bold text-primary/20">404</div>
          <CardTitle className="text-3xl font-bold">Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Don't worry, you can always go back to the homepage and start fresh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/support">
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 