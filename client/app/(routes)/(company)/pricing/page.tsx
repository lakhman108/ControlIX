import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Rocket, MessageSquare, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Rental Plans
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your smart home needs
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Basic Home Plan */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Basic Home</CardTitle>
            <CardDescription>Perfect for starting your smart home journey</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$29.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>4 Smart Bulbs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>1 AC Controller</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Basic support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Get Started</Button>
          </CardFooter>
        </Card>

        {/* Smart Suite Plan */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border-primary">
          <CardHeader>
            <CardTitle>Smart Suite</CardTitle>
            <CardDescription>Ideal for medium-sized homes</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$49.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>8 Smart Bulbs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>2 AC Controllers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>1 Security Camera</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Get Started</Button>
          </CardFooter>
        </Card>

        {/* Premium Home Plan */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Premium Home</CardTitle>
            <CardDescription>Complete home automation</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$79.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>12 Smart Bulbs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>3 AC Controllers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Full security suite</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>24/7 premium support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Get Started</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">Why Rent with ControlX?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Rocket className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Free Installation</h3>
                  <p className="text-muted-foreground">
                    Professional setup and installation of your devices at no extra cost
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Regular Maintenance</h3>
                  <p className="text-muted-foreground">
                    Scheduled maintenance and support to keep your devices running smoothly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Free Upgrades</h3>
                  <p className="text-muted-foreground">
                    Stay current with the latest technology through our upgrade program
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Instant Replacement</h3>
                  <p className="text-muted-foreground">
                    Quick replacement service for any faulty devices to minimize downtime
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center text-muted-foreground italic">
        All plans include free device installation and setup support
      </div>
    </div>
  );
} 