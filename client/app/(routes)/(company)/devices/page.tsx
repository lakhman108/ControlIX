import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Snowflake, Shield } from "lucide-react";

export default function DevicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Smart Home Devices
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your living space with our cutting-edge smart devices available for rent
        </p>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Smart Bulbs Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-500" />
              <CardTitle>Smart Bulbs</CardTitle>
            </div>
            <CardDescription>Illuminate your home with intelligence</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Philips Hue compatible smart bulbs
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Color-changing capabilities
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Schedule and automation support
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Voice control integration
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Energy consumption monitoring
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Smart AC Control Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Snowflake className="h-6 w-6 text-blue-500" />
              <CardTitle>Smart AC Control</CardTitle>
            </div>
            <CardDescription>Climate control at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Universal AC controller
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Temperature scheduling
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Energy-saving modes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Remote control via app
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Usage analytics
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Security Devices Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-500" />
              <CardTitle>Security Devices</CardTitle>
            </div>
            <CardDescription>Protect what matters most</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Smart cameras
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Door sensors
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Motion detectors
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Video doorbells
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Smart locks
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center text-muted-foreground italic">
        All devices come with professional installation and 24/7 support!
      </div>
    </div>
  );
} 