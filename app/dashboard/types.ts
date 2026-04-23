export type Category = {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    templates: number;
  };
};

export type Template = {
  id: string;
  name: string;
  bgImage: string | null;
  bgColor: string | null;
  fontFamily: string;
  fontSize: number;
  category: Category;
};

export interface CertificateResult {
  name: string;
  course: string;
  hash: string;
  verifyUrl: string;
}

export interface Certificate {
  id: string;
  recipient: string;
  course: string;
  universityName?: string;
  department?: string;
  grade?: string;
  issuedAt: string;
  certHash: string;
  blockchainStatus: 'PENDING' | 'CONFIRMED' | 'FAILED';
  blockchainTxHash?: string;
}

export interface BulkResults {
  total: number;
  success: number;
  failed: number;
  results: CertificateResult[];
}

