import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Zap, Globe, GraduationCap, Building2, Award, Download, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <section className="py-32 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-24">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              About CertChain
            </h1>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The future of certificate management is here - secure, instant, blockchain-powered.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-8">Revolutionizing Credential Verification</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                CertChain solves the biggest problems in certificate management: forgery, slow verification, 
                and lack of trust. Our blockchain platform makes every certificate instantly verifiable 
                by anyone, anywhere, forever.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-6 bg-white/70 rounded-2xl shadow-xl">
                  <Shield className="w-12 h-12 text-indigo-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Zero Fakes</h3>
                    <p className="text-gray-600">Blockchain immutability guarantees authenticity.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white/70 rounded-2xl shadow-xl">
                  <Zap className="w-12 h-12 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Instant Verify</h3>
                    <p className="text-gray-600">QR scan → verified in seconds, no middlemen.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-12 backdrop-blur-sm shadow-2xl">
                <img src="/api/placeholder/600/400" alt="CertChain Platform" className="rounded-2xl shadow-2xl w-full h-96 object-cover" />
              </div>
            </div>
          </div>

          {/* Features Deep Dive */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-center font-bold text-gray-900 mb-4">For Education</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-lg text-gray-700">
                  <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-emerald-500" /> Digital diplomas</li>
                  <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Bulk graduation certs</li>
                  <li className="flex items-center gap-3"><Globe className="w-5 h-5 text-emerald-500" /> Global verification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-center font-bold text-gray-900 mb-4">For Corporations</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-lg text-gray-700">
                  <li className="flex items-center gap-3"><Award className="w-5 h-5 text-emerald-500" /> Training certificates</li>
                  <li className="flex items-center gap-3"><Download className="w-5 h-5 text-emerald-500" /> Bulk employee certs</li>
                  <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-emerald-500" /> Compliance proof</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 hover:shadow-3xl transition-all duration-300 col-span-1 md:col-span-3 lg:col-span-1">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-center font-bold text-gray-900 mb-4">Anyone, Anywhere</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-center">
                <p className="text-xl text-gray-700 mb-8">Certification authorities, training centers, 
                  professional bodies - anyone issuing credentials.</p>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-2xl">
                    Start Issuing Today
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-8">Built for the Future</h2>
          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            By afamefune miracle - bringing Web3 to certificate management.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-2 border-white text-xl px-12 py-6 hover:bg-white hover:text-gray-900">
                Get In Touch
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="text-xl px-12 py-6 bg-gradient-to-r from-indigo-500 to-purple-600">
                Try Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
