// Mock loan data for demonstration
export interface LoanScheme {
  id: string
  bank: string
  bankLogo?: string
  name: string
  type: "personal" | "car" | "home" | "student" | "business"
  interestRate: string
  minAmount: number
  maxAmount: number
  tenure: string
  processingFee: string
  eligibility: string[]
  features: string[]
  sourceUrl: string
  captureDate: string
  lastUpdated: string
  verified: boolean
}

export const mockLoans: LoanScheme[] = [
  {
    id: "1",
    bank: "HBL",
    name: "HBL Personal Loan",
    type: "personal",
    interestRate: "14.5% - 18%",
    minAmount: 50000,
    maxAmount: 3000000,
    tenure: "12 - 60 months",
    processingFee: "1% + documentation charges",
    eligibility: ["Minimum age 21 years", "Maximum age 60 years", "Minimum salary Rs. 25,000"],
    features: ["Quick approval", "Flexible repayment", "No collateral required"],
    sourceUrl: "https://www.hbl.com/personal-loans",
    captureDate: "2025-01-15",
    lastUpdated: "2025-01-15",
    verified: true,
  },
  {
    id: "2",
    bank: "UBL",
    name: "UBL Auto Loan",
    type: "car",
    interestRate: "16% - 19%",
    minAmount: 500000,
    maxAmount: 10000000,
    tenure: "12 - 84 months",
    processingFee: "1.5% of loan amount",
    eligibility: ["Age 21-65 years", "Minimum income Rs. 40,000", "Valid driving license"],
    features: ["Up to 85% financing", "New and used cars", "Comprehensive insurance"],
    sourceUrl: "https://www.ubl.com/auto-finance",
    captureDate: "2025-01-14",
    lastUpdated: "2025-01-14",
    verified: true,
  },
  {
    id: "3",
    bank: "MCB",
    name: "MCB Home Loan",
    type: "home",
    interestRate: "15% - 17%",
    minAmount: 1000000,
    maxAmount: 50000000,
    tenure: "60 - 240 months",
    processingFee: "0.5% of loan amount",
    eligibility: ["Age 21-60 years", "Stable income", "Property must be approved"],
    features: ["Up to 90% financing", "Construction & purchase", "Fixed & variable rates"],
    sourceUrl: "https://www.mcb.com.pk/home-loan",
    captureDate: "2025-01-12",
    lastUpdated: "2025-01-12",
    verified: true,
  },
  {
    id: "4",
    bank: "Bank Alfalah",
    name: "Alfalah Student Loan",
    type: "student",
    interestRate: "10% - 12%",
    minAmount: 100000,
    maxAmount: 2000000,
    tenure: "12 - 84 months",
    processingFee: "Waived for students",
    eligibility: ["Admission confirmed", "Co-signer required", "Age 18-30 years"],
    features: ["Grace period available", "Low interest rates", "Local & international studies"],
    sourceUrl: "https://www.bankalfalah.com/student-loan",
    captureDate: "2025-01-10",
    lastUpdated: "2025-01-10",
    verified: true,
  },
  {
    id: "5",
    bank: "Meezan Bank",
    name: "Meezan Business Finance",
    type: "business",
    interestRate: "13% - 16%",
    minAmount: 500000,
    maxAmount: 25000000,
    tenure: "12 - 120 months",
    processingFee: "1.25% of facility",
    eligibility: ["Business operational for 2+ years", "Audited financials", "Shariah compliant"],
    features: ["Working capital", "Asset financing", "Islamic banking"],
    sourceUrl: "https://www.meezanbank.com/business-finance",
    captureDate: "2025-01-08",
    lastUpdated: "2025-01-08",
    verified: true,
  },
  {
    id: "6",
    bank: "ABL",
    name: "ABL Quick Personal Loan",
    type: "personal",
    interestRate: "15% - 19%",
    minAmount: 30000,
    maxAmount: 2500000,
    tenure: "6 - 48 months",
    processingFee: "1.5% flat",
    eligibility: ["Salaried individuals", "Age 21-60", "Minimum salary Rs. 20,000"],
    features: ["Instant approval", "Online application", "Minimal documentation"],
    sourceUrl: "https://www.abl.com/personal-loan",
    captureDate: "2025-01-15",
    lastUpdated: "2025-01-15",
    verified: true,
  },
  {
    id: "7",
    bank: "Standard Chartered",
    name: "SC Premier Auto Loan",
    type: "car",
    interestRate: "17% - 20%",
    minAmount: 800000,
    maxAmount: 15000000,
    tenure: "12 - 96 months",
    processingFee: "2% of amount",
    eligibility: ["Premier banking customer", "Age 25-65", "Monthly income Rs. 100,000+"],
    features: ["Premium service", "Fast track approval", "Flexible repayment options"],
    sourceUrl: "https://www.sc.com/pk/auto-loan",
    captureDate: "2025-01-13",
    lastUpdated: "2025-01-13",
    verified: true,
  },
  {
    id: "8",
    bank: "Faysal Bank",
    name: "Faysal Home Finance",
    type: "home",
    interestRate: "14% - 16.5%",
    minAmount: 1500000,
    maxAmount: 40000000,
    tenure: "60 - 300 months",
    processingFee: "0.75% of loan",
    eligibility: ["Age 21-65", "Salaried/Self-employed", "Property evaluation required"],
    features: ["Long tenure options", "Renovation loans", "Balance transfer facility"],
    sourceUrl: "https://www.faysalbank.com/home-finance",
    captureDate: "2025-01-11",
    lastUpdated: "2025-01-11",
    verified: true,
  },
]

export const loanSchemes = mockLoans

export const banks = [
  "HBL",
  "UBL",
  "MCB",
  "ABL",
  "Bank Alfalah",
  "Meezan Bank",
  "Standard Chartered",
  "Faysal Bank",
  "Askari Bank",
  "JS Bank",
  "Bank Al Habib",
  "Soneri Bank",
]
