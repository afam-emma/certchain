"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCertificateBlockchain } from '@/lib/web3/useCertificateBlockchain';
import { Verified } from 'lucide-react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Certificate {
  id: string;
  recipient: string;
  course: string;
  issuedAt: string;
  certHash: string;
  blockchainStatus: 'PENDING' | 'CONFIRMED' | 'FAILED';
  blockchainTxHash?: string;
}

export default function IssuancePage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { registerCertificate, verifyCertificate, isRegistering } = useCertificateBlockchain();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      if (!res.ok) throw new Error('Failed to fetch certificates');
      const data = await res.json();
      setCerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading certificates');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'yellow';
      case 'CONFIRMED': return 'green';
      case 'FAILED': return 'red';
      default: return 'gray';
    }
  };

  const handleRegister = async (cert: Certificate) => {
    if (!confirm(`Register ${cert.recipient}'s certificate on blockchain?`)) return;

    const result = await registerCertificate(cert.certHash);
    if (result.success) {
      await fetch(`/api/certificates/${cert.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockchainStatus: 'CONFIRMED',
          blockchainTxHash: result.transactionHash,
        }),
      });
      fetchCertificates();
      alert('Certificate registered on blockchain!');
    } else {
      alert(result.error || 'Registration failed');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600 py-8">
            <div className="text-lg font-semibold mb-2">Error</div>
            <p>{error}</p>
            <button 
              onClick={fetchCertificates}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Issuance</h1>
          <p className="text-gray-500 mt-2">View all certificates and their blockchain status</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {certs.length}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert) => (
          <Card key={cert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{cert.recipient}</CardTitle>
                <Badge variant="secondary" className={`capitalize ${getStatusColor(cert.blockchainStatus)}`}>
                  {cert.blockchainStatus}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{cert.course}</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Issued:</span>
                <span>{new Date(cert.issuedAt).toLocaleDateString()}</span>
              </div>
              {cert.blockchainTxHash && (
                <div className="text-xs text-blue-600 truncate font-mono">
                  Tx: {cert.blockchainTxHash.slice(0, 10)}...
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <a
                  href={`/verify/${cert.certHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded text-center hover:bg-blue-200 transition"
                >
                  Verify
                </a>
                {cert.blockchainStatus === 'PENDING' && (
                  <>
                    <button
                      onClick={() => verifyCertificate(cert.certHash)}
                      className="flex-1 text-xs bg-yellow-100 text-yellow-800 py-1 px-2 rounded text-center hover:bg-yellow-200 transition"
                    >
                      Check Chain
                    </button>
                    <button
                      onClick={() => handleRegister(cert)}
                      disabled={isRegistering}
                      className="flex-1 text-xs bg-green-100 text-green-800 py-1 px-2 rounded text-center hover:bg-green-200 transition disabled:opacity-50"
                    >
                      {isRegistering ? 'Registering...' : 'Register on Chain'}
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certs.length === 0 && (
        <Card className="mt-12">
          <CardContent className="pt-12 text-center">
            <Verified className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-500 mb-6">Issue your first certificate to get started.</p>
            <Link href="/dashboard">
              <Button>Create Certificate</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

