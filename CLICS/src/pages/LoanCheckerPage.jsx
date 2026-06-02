import { useState } from "react";
import { Button } from "../components/custom-ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/custom-ui/Card";
import { Input } from "../components/custom-ui/Input";
import { Label } from "../components/custom-ui/Label";
import { Badge } from "../components/custom-ui/Badge";
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Banknote, 
  Calculator, 
  FileCheck, 
  ArrowRight,
  Lightbulb,
  Building2,
  Star,
  Users,
  DollarSign,
  CreditCard,
  Calendar
} from "lucide-react";

export default function LoanCheckerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    loanType: "",
    monthlyIncome: "",
    employmentType: "",
    creditScore: "",
    existingLoans: "",
    loanAmount: "",
    loanTenure: "",
    age: "",
    dependents: "",
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Pakistani loan types
  const loanTypes = [
    { value: "personal", label: "Personal Loan" },
    { value: "car", label: "Car Loan (Auto)" },
    { value: "home", label: "Home Loan" },
    { value: "business", label: "Business Loan" },
    { value: "education", label: "Education Loan" },
  ];

  // Employment types
  const employmentTypes = [
    { value: "salaried", label: "Salaried Employee" },
    { value: "self-employed", label: "Self Employed" },
    { value: "business", label: "Business Owner" },
    { value: "professional", label: "Professional (Doctor/Lawyer)" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateEligibility = () => {
    const income = parseFloat(formData.monthlyIncome);
    const loanAmount = parseFloat(formData.loanAmount);
    const creditScore = parseInt(formData.creditScore);
    const existingLoans = parseFloat(formData.existingLoans);
    const age = parseInt(formData.age);
    const tenureYears = parseFloat(formData.loanTenure);
    const tenureMonths = tenureYears * 12;

    const monthlyEmi = loanAmount / tenureMonths;
    const totalMonthlyDebt = existingLoans + monthlyEmi;
    const dtiRatio = (totalMonthlyDebt / income) * 100;

    let eligibilityScore = 0;
    const reasons = [];
    const recommendations = [];

    // Credit Score
    if (creditScore >= 750) {
      eligibilityScore += 40;
      reasons.push("Excellent credit score (>750)");
    } else if (creditScore >= 650) {
      eligibilityScore += 25;
      reasons.push("Good credit score");
      recommendations.push("Improve credit score to 750+ for better rates");
    } else {
      eligibilityScore += 10;
      reasons.push("Credit score needs improvement");
      recommendations.push("Work on improving your credit score (pay bills on time, reduce debt)");
    }

    // DTI Ratio
    if (dtiRatio <= 36) {
      eligibilityScore += 30;
      reasons.push("Healthy debt-to-income ratio (≤36%)");
    } else if (dtiRatio <= 43) {
      eligibilityScore += 20;
      reasons.push("Acceptable debt-to-income ratio");
      recommendations.push("Consider reducing existing debts before applying");
    } else {
      eligibilityScore += 5;
      reasons.push("High debt-to-income ratio (>43%)");
      recommendations.push("Reduce existing loans or increase income");
    }

    // Age factor
    if (age >= 25 && age <= 55) {
      eligibilityScore += 15;
      reasons.push("Optimal age for loan approval (25-55)");
    } else {
      eligibilityScore += 8;
      recommendations.push("Age factor may affect loan terms (co-applicant may help)");
    }

    // Income adequacy
    let minIncome = 25000;
    if (formData.loanType === "home") minIncome = 50000;
    else if (formData.loanType === "car") minIncome = 35000;
    else if (formData.loanType === "business") minIncome = 60000;

    if (income >= minIncome * 2) {
      eligibilityScore += 15;
      reasons.push("Strong income profile");
    } else if (income >= minIncome) {
      eligibilityScore += 10;
      reasons.push("Adequate income");
    } else {
      eligibilityScore += 3;
      reasons.push("Income below typical requirement");
      recommendations.push("Consider applying for a smaller loan or adding a co-applicant");
    }

    const maxEligibleLoan = income * 48 - existingLoans * 12;
    const approvedAmount = Math.min(loanAmount, Math.max(0, maxEligibleLoan));
    const emi = approvedAmount / tenureMonths;

    let status, statusColor, statusMessage;
    if (eligibilityScore >= 75) {
      status = "High Eligibility";
      statusColor = "bg-green-500";
      statusMessage = "Congratulations! You are highly eligible for this loan.";
    } else if (eligibilityScore >= 50) {
      status = "Moderate Eligibility";
      statusColor = "bg-blue-500";
      statusMessage = "You have good chances of approval with some conditions.";
    } else {
      status = "Low Eligibility";
      statusColor = "bg-orange-500";
      statusMessage = "Your application may need additional review or improvement.";
    }

    const bankRecommendations = [
      {
        bank: "HBL (Habib Bank Limited)",
        interestRate: "13.5% - 16.5%",
        processingFee: "1%",
        tenure: "Up to 20 years",
        rating: 4.6,
      },
      {
        bank: "UBL (United Bank Limited)",
        interestRate: "14% - 17%",
        processingFee: "1%",
        tenure: "Up to 20 years",
        rating: 4.5,
      },
      {
        bank: "MCB Bank",
        interestRate: "13.75% - 16.75%",
        processingFee: "0.5% - 1%",
        tenure: "Up to 20 years",
        rating: 4.4,
      },
      {
        bank: "Meezan Bank (Islamic)",
        interestRate: "KIBOR + 4%",
        processingFee: "1%",
        tenure: "Up to 20 years",
        rating: 4.7,
      },
      {
        bank: "Faysal Bank",
        interestRate: "14% - 17.5%",
        processingFee: "1%",
        tenure: "Up to 20 years",
        rating: 4.3,
      },
    ];

    setEligibilityResult({
      status,
      statusColor,
      statusMessage,
      eligibilityScore,
      approvedAmount: Math.round(approvedAmount),
      requestedAmount: loanAmount,
      dtiRatio: dtiRatio.toFixed(1),
      reasons,
      recommendations,
      bankRecommendations,
      emi: Math.round(emi).toLocaleString(),
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.loanType || !formData.monthlyIncome || !formData.employmentType || !formData.age) {
        alert("Please fill all required fields (Loan Type, Monthly Income, Employment Type, Age)");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.creditScore || !formData.existingLoans) {
        alert("Please fill Credit Score and Existing Monthly EMIs");
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.loanAmount || !formData.loanTenure) {
        alert("Please fill Loan Amount and Tenure");
        return;
      }
      calculateEligibility();
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      loanType: "", monthlyIncome: "", employmentType: "", creditScore: "",
      existingLoans: "", loanAmount: "", loanTenure: "", age: "", dependents: "",
    });
    setEligibilityResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Loan Eligibility Checker</h1>
          <p className="text-slate-500 text-lg">Check your eligibility for Pakistani bank loans in 3 simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center z-10 bg-transparent">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${currentStep >= step ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "bg-slate-200 text-slate-500"}`}>
                  {step}
                </div>
                <span className="text-xs mt-1 text-slate-500">
                  {step === 1 && "Personal"}
                  {step === 2 && "Financial"}
                  {step === 3 && "Loan"}
                  {step === 4 && "Result"}
                </span>
              </div>
            ))}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0">
              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                   style={{ width: `${((currentStep-1)/3)*100}%` }} />
            </div>
          </div>
        </div>

        {/* Step 1 */}
        {currentStep === 1 && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <CardTitle className="text-xl flex items-center gap-2"><FileCheck className="w-5 h-5 text-blue-600" /> Step 1: Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label className="font-medium">Loan Type *</Label>
                  <select value={formData.loanType} onChange={(e) => handleInputChange("loanType", e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option value="">Select loan type</option>
                    {loanTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="font-medium">Monthly Income (PKR) *</Label>
                  <Input type="number" placeholder="e.g., 85000" value={formData.monthlyIncome}
                         onChange={(e) => handleInputChange("monthlyIncome", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="font-medium">Employment Type *</Label>
                  <select value={formData.employmentType} onChange={(e) => handleInputChange("employmentType", e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select employment</option>
                    {employmentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="font-medium">Age (years) *</Label>
                  <Input type="number" placeholder="e.g., 32" value={formData.age}
                         onChange={(e) => handleInputChange("age", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="font-medium">Dependents</Label>
                  <Input type="number" placeholder="e.g., 2" value={formData.dependents}
                         onChange={(e) => handleInputChange("dependents", e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">Next Step <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <CardTitle className="text-xl flex items-center gap-2"><Calculator className="w-5 h-5 text-blue-600" /> Step 2: Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label className="font-medium">Credit Score (300-900) *</Label>
                  <Input type="number" placeholder="e.g., 720" value={formData.creditScore}
                         onChange={(e) => handleInputChange("creditScore", e.target.value)} className="mt-1.5" />
                  <p className="text-xs text-slate-400 mt-1">Higher score ({'>'}750) improves eligibility</p>
                </div>
                <div>
                  <Label className="font-medium">Existing Monthly EMIs (PKR) *</Label>
                  <Input type="number" placeholder="e.g., 15000" value={formData.existingLoans}
                         onChange={(e) => handleInputChange("existingLoans", e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>Financial Tip:</strong> Keep total debt-to-income ratio below 36% for best approval chances.</span>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">Next Step</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <CardTitle className="text-xl flex items-center gap-2"><Banknote className="w-5 h-5 text-blue-600" /> Step 3: Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label className="font-medium">Required Loan Amount (PKR) *</Label>
                  <Input type="number" placeholder="e.g., 2000000" value={formData.loanAmount}
                         onChange={(e) => handleInputChange("loanAmount", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="font-medium">Loan Tenure (years) *</Label>
                  <Input type="number" placeholder="e.g., 5" value={formData.loanTenure}
                         onChange={(e) => handleInputChange("loanTenure", e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">Check Eligibility</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && eligibilityResult && (
          <div className="space-y-6">
            <Card className="border-0 shadow-xl rounded-2xl text-center p-6">
              <div className={`w-20 h-20 ${eligibilityResult.statusColor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                {eligibilityResult.status === "High Eligibility" ? <CheckCircle className="w-10 h-10 text-white" /> : <AlertCircle className="w-10 h-10 text-white" />}
              </div>
              <h2 className="text-2xl font-bold">{eligibilityResult.status}</h2>
              <p className="text-slate-600 mt-2">{eligibilityResult.statusMessage}</p>
              <Badge className="mt-3 text-base px-4 py-1 bg-slate-100 text-slate-700">Score: {eligibilityResult.eligibilityScore}/100</Badge>
            </Card>

            <Card className="border-0 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Eligibility Summary</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-500">Requested Amount</p><p className="text-xl font-bold">PKR {eligibilityResult.requestedAmount.toLocaleString()}</p></div>
                <div><p className="text-sm text-slate-500">Approved Amount</p><p className="text-xl font-bold text-green-600">PKR {eligibilityResult.approvedAmount.toLocaleString()}</p></div>
                <div><p className="text-sm text-slate-500">Est. Monthly EMI</p><p className="text-xl font-bold">PKR {eligibilityResult.emi}</p></div>
                <div><p className="text-sm text-slate-500">Debt-to-Income Ratio</p><p className="text-xl font-bold">{eligibilityResult.dtiRatio}%</p></div>
              </div>
            </Card>

            <Card className="border-0 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Positive Factors</h3>
              <ul className="space-y-2">
                {eligibilityResult.reasons.map((r, i) => <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{r}</li>)}
              </ul>
            </Card>

            {eligibilityResult.recommendations.length > 0 && (
              <Card className="border-0 shadow-xl rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-500" /> Recommendations</h3>
                <ul className="space-y-2">
                  {eligibilityResult.recommendations.map((r, i) => <li key={i} className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-500" />{r}</li>)}
                </ul>
              </Card>
            )}

            <Card className="border-0 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600" /> Recommended Pakistani Banks</h3>
              <div className="space-y-3">
                {eligibilityResult.bankRecommendations.map((bank, i) => (
                  <div key={i} className="flex flex-wrap items-center justify-between p-4 border rounded-xl hover:border-blue-300 transition">
                    <div>
                      <h4 className="font-semibold">{bank.bank}</h4>
                      <p className="text-sm text-slate-500">{bank.interestRate} | {bank.processingFee} fee | {bank.tenure}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{bank.rating}</span>
                      </div>
                      <Button size="sm" variant="outline" className="ml-2">Apply →</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="text-center">
              <Button onClick={handleReset} variant="outline" className="px-8">Check Another Loan</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}