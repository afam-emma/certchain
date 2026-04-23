"use client";


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-24">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-6">
            Get In Touch
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to secure your certificates on blockchain? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-12">
            <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 h-fit">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                  <MessageCircle className="w-12 h-12 text-indigo-500" />
                  Let's Talk Certificates
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Whether you're issuing 10 or 10,000 certificates, we're here to help.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <Mail className="w-8 h-8 text-indigo-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-700">hello@certchain.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <Phone className="w-8 h-8 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <MapPin className="w-8 h-8 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-700">San Francisco Bay Area<br />Blockchain Valley, CA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group p-6 bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.3L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">Twitter</h4>
                </div>
                <p className="text-gray-600 group-hover:text-gray-800">@certchain</p>
              </a>
              
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="group p-6 bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.57.099 18.057a.082.082 0 00.031.056 12.084 12.084 0 003.289 2.136.076.076 0 00.088-.024 11.435 11.435 0 005.31-5.361.078.078 0 00.038-.067c.193-.384.414-.843.608-1.249a12.61 12.61 0 005.573 0c.194.406.415.865.608 1.25a.07.07 0 00.038.066 11.716 11.716 0 005.356 5.363.077.077 0 00.087.024 12.063 12.063 0 003.302-2.133.076.076 0 00.031-.056c.5-6.505-1.028-11.973-3.604-13.686a.07.07 0 00-.031-.028z"/>
                    </svg>
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">Discord</h4>
                </div>
                <p className="text-gray-600 group-hover:text-gray-800">certchain discord</p>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-3xl backdrop-blur-sm bg-white/90 max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Send Message</CardTitle>
                <CardDescription className="text-xl text-gray-600">
                  Drop us a line and we'll get back within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-16">
                    <Send className="w-24 h-24 text-emerald-500 mx-auto mb-8 animate-bounce" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                    <p className="text-xl text-gray-600 mb-8">Thanks for reaching out! We'll reply soon.</p>
                    <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600">
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Full Name</label>
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-16 text-lg px-6 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-16 text-lg px-6 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Message</label>
                      <Textarea
                        placeholder="Tell us about your certificate needs..."
                        value={formData.message}
                        onChange={(e:any) => setFormData({...formData, message: e.target.value})}
                        className="h-40 text-lg px-6 py-6 border-2 border-gray-200 rounded-3xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none"
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-16 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-2xl transition-all duration-300 shadow-xl">
                      <Send className="w-6 h-6 mr-3" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
