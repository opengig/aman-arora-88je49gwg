'use client' ;
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Check, Users, Info, MessageSquare, Heart, Calendar, BarChart, LineChart } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#009688" }}>
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32" style={{ backgroundColor: "#4CAF50" }}>
          <div className="container mx-auto px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">Track Your Semen Health Effectively</h1>
                <p className="max-w-lg text-white md:text-xl">
                  View key metrics, track trends, and receive personalized health recommendations all in one place.
                </p>
                <Button className="bg-white text-primary mt-6 px-6 py-3 rounded-md shadow hover:bg-gray-200">Get Started</Button>
              </div>
              <img
                src="https://picsum.photos/seed/picsum/200/300"
                alt="Semen Health"
                className="mx-auto rounded-xl object-cover shadow-xl lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-24 lg:py-32" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="container mx-auto px-6">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">Your Semen Health Journey</h2>
              <p className="text-secondary max-w-xl mx-auto">
                Log your habits, receive insights, and track your progress towards better semen health.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <BarChart className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4 text-center text-xl font-semibold">Track Metrics</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-secondary">
                  Keep track of semen health metrics and view trends over time.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4 text-center text-xl font-semibold">Receive Insights</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-secondary">
                  Get personalized recommendations and reminders.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Info className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4 text-center text-xl font-semibold">Educational Resources</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-secondary">
                  Access a library of articles on semen health.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4 text-center text-xl font-semibold">Join Discussions</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-secondary">
                  Participate in forums and expert-led Q&A sessions.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-24 lg:py-32" style={{ backgroundColor: "#009688" }}>
          <div className="container mx-auto px-6">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Community & Support</h2>
              <p className="text-white max-w-xl mx-auto">
                Engage with a community that cares about your health and well-being.
              </p>
            </div>
            <Accordion type="single" collapsible className="mt-12 max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-white">How do I track my habits?</AccordionTrigger>
                <AccordionContent className="text-white">
                  Use our app to log daily habits like diet, sleep, and lifestyle changes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-white">What insights can I receive?</AccordionTrigger>
                <AccordionContent className="text-white">
                  Receive insights based on logged data and personalized recommendations for improvement.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-white">Can I join discussions anonymously?</AccordionTrigger>
                <AccordionContent className="text-white">
                  Yes, you can participate in forums anonymously and engage in discussions without revealing your identity.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section className="w-full py-16 md:py-24 lg:py-32" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="container mx-auto px-6">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">Other Features</h2>
              <p className="text-secondary max-w-xl mx-auto">
                Explore additional features that enhance your overall experience.
              </p>
            </div>
            <div className="mt-12 flex flex-col items-center space-y-8">
              <div className="flex items-center gap-6">
                <Avatar>
                  <AvatarImage src="https://picsum.photos/seed/picsum/100/100" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-secondary">Anonymous User</p>
                  <p className="text-sm">"The app has transformed my approach to health. It's intuitive and informative."</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Avatar>
                  <AvatarImage src="https://picsum.photos/seed/picsum/100/100" />
                  <AvatarFallback>JH</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-secondary">John Health</p>
                  <p className="text-sm">"A must-have for anyone serious about improving their semen health."</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary p-6 w-full">
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-white text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Features</h3>
            <a href="#">Metrics</a>
            <a href="#">Recommendations</a>
            <a href="#">Articles</a>
            <a href="#">Forums</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Support</h3>
            <a href="#">Help Center</a>
            <a href="#">Community</a>
            <a href="#">FAQs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;