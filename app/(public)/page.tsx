"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Download, Layout, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';


const features = [
  {
    icon: Shield,
    title: "Tamper-Proof Security",
    desc: "Certificates registered on blockchain - immutable & verifiable forever.",
  },
  {
    icon: Zap,
    title: "Instant Issuance",
    desc: "Generate & issue professional PDFs with QR codes in seconds.",
  },
  {
    icon: Download,
    title: "Bulk Operations",
    desc: "Upload Excel, issue hundreds of certs at once.",
  },
  {
    icon: Layout,
    title: "Custom Templates",
    desc: "Design branded certificates that match your institution.",
  },
];


const stats = [
  { num: "10K+", label: "Certificates" },
  { num: "50+", label: "Institutions" },
  { num: "99.9%", label: "Uptime" },
  { num: "0s", label: "Verification" },
];

const testimonials = [
  {
    quote: "CertChain revolutionized our certificate management. Zero fakes!",
    author: "University Dean",
  },
  {
    quote: "Lightning fast issuance with blockchain security. Perfect.",
    author: "Corp HR Manager",
  },
];

export default function Home() {
  const router = useRouter();
  const [verifyInput, setVerifyInput] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyInput.trim()) {
      router.push(`/verify/${verifyInput.trim()}`);
    }
  };

  return (
    <>
      {/* Hero */}
      {/* Animated Background Shapes */}
      <section id="verify" className="relative py-32 bg-gradient-to-r from-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 blob-shapes">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-0"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-10 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
              Blockchain<br />
              <span className="text-transparent bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text">Certificates</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Issue tamper-proof, instantly verifiable certificates on blockchain.
              Trusted by universities, corporations, and certification authorities worldwide.
            </p>
            <div className="flex flex-row sm:flex-col gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-xl px-12 py-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  Start Issuing
                </Button>
              </Link>
              <form onSubmit={handleVerify} className="flex sm:flex-col justify-center items-center gap-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter certificate hash..."
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    className="text-lg px-4 py-6 w-64 md:w-80 border-2 border-gray-200 focus:border-indigo-500 shadow-xl"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="text-xl px-6 py-6 border-2 border-gray-200 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Verify
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">From issuance to verification, we've got you covered.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-8 pt-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</CardTitle>
                    <CardDescription className="text-lg text-gray-600">{feature.desc}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.num}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">From template to tamper-proof certificate in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Layout,
                title: "1. Design Template",
                desc: "Upload or create beautiful certificate templates with your branding."
              },
              {
                icon: Upload,
                title: "2. Add Recipients",
                desc: "Upload Excel with names, dates, achievements. Supports bulk operations."
              },
              {
                icon: FileText,
                title: "3. Generate & Issue",
                desc: "Auto-generate PDFs with unique QR codes and register on blockchain."
              },
              {
                icon: CheckCircle2,
                title: "4. Verify Instantly",
                desc: "Anyone scans QR or enters hash - instant blockchain verification."
              }
            ].map((step, i) => (
              <Card key={i} className="border-0 shadow-2xl h-full bg-white/80 backdrop-blur-sm hover:shadow-3xl hover:-translate-y-4 transition-all duration-500 group">
                <CardContent className="p-10 text-center pt-16 relative overflow-hidden">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-12 h-12 text-white font-bold" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-6 mt-16">{step.title}</CardTitle>
                  <p className="text-lg text-gray-600 leading-relaxed">{step.desc}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-8">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(i + 1) * 25}%` }}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Trusted Worldwide</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-12 pt-16">
                  <div className="italic text-2xl text-gray-700 mb-8">"{testimonial.quote}"</div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Secure Your Certificates?</h2>
          <p className="text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto">Join thousands of organizations issuing blockchain certificates today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-xl px-12 py-6 bg-white text-indigo-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl font-bold transition-all duration-300">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-xl px-12 py-6 border-2 border-white hover:bg-white hover:text-indigo-600 shadow-2xl hover:shadow-3xl transition-all duration-300">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
