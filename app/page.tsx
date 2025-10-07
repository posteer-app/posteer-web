import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export default function Home() {
  return (
    <div className="min-h-screen mt-[8rem]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent">
                  Steer your brand's <br className="sm:hidden"/>socials<br className="hidden sm:block"/> yourself <br className="sm:hidden"/>in <span className="text-foreground">one place</span>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                One dashboard. Everything shortform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild className="">
                <Link href="/login">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" className="">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* Social Platform Icons */}
            <div className="flex justify-center items-center gap-8 pt-8 opacity-60">
              <div className="text-sm text-muted-foreground">Post to:</div>
              <div className="flex gap-6">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">IG</span>
                </div>
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">TT</span>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">FB</span>
                </div>
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">YT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to manage your socials</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your social media workflow, designed for small businesses and short-form content creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Multi-Platform Posting */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icons.upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Multi-Platform Posting</CardTitle>
                <CardDescription>
                  Upload once, post everywhere across all major platforms. 
                  <br />Like to post to TikTok directly from CapCut? You can also duplicate to every platform automatically
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Comment Management */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icons.messageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Unified Comment Management</CardTitle>
                <CardDescription>
                  Reply to all comments from one central dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Analytics */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icons.barChart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Cross-Platform Analytics</CardTitle>
                <CardDescription>
                  Track a video's performance (views, likes, shares, etc.) across every platform
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Video Duplication */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icons.users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>
                  Allow employees granular permission to your accounts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}
