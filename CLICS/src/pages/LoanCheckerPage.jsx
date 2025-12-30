"use client"

import { useState } from "react"
import { Button } from "../components/custom-ui/Button"
import { Card } from "../components/custom-ui/Card"
import { Input } from "../components/custom-ui/Input"
import { Label } from "../components/custom-ui/Label"
import { Select } from "../components/custom-ui/Select"
import { Badge } from "../components/custom-ui/Badge"

export default function LoanCheckerPage() {
  const [currentStep, setCurrentStep] = useState(1)
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
  })

  const [eligibilityResult, setEligibilityResult] = useState(null)

  const loanTypes = [
    { value: "home", label: "Home Loan" },
    { value: "personal", label: "Personal Loan" },
    { value: "car", label: "Car Loan" },
    { value: "education", label: "Education Loan" },
    { value: "business", label: "Business Loan" },
  ]

  const employmentTypes = [
    { value: "salaried", label: "Salaried" },
    { value: "self-employed", label: "Self Employed" },
    { value: "business", label: "Business Owner" },
    { value: "professional", label: "Professional" },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateEligibility = () => {
    const income = Number.parseFloat(formData.monthlyIncome)
    const loanAmount = Number.parseFloat(formData.loanAmount)
    const creditScore = Number.parseInt(formData.creditScore)
    const existingLoans = Number.parseFloat(formData.existingLoans)
    const age = Number.parseInt(formData.age)

    // Calculate DTI (Debt-to-Income) ratio
    const monthlyLoanPayment = loanAmount / (Number.parseFloat(formData.loanTenure) * 12)
    const totalMonthlyDebt = existingLoans + monthlyLoanPayment
    const dtiRatio = (totalMonthlyDebt / income) * 100

    // Calculate eligibility score
    let eligibilityScore = 0
    const reasons = []
    const recommendations = []

    // Credit Score Check (40% weight)
    if (creditScore >= 750) {
      eligibilityScore += 40
      reasons.push("Excellent credit score")
    } else if (creditScore >= 650) {
      eligibilityScore += 25
      reasons.push("Good credit score")
      recommendations.push("Improve credit score for better interest rates")
    } else {
      eligibilityScore += 10
      reasons.push("Credit score needs improvement")
      recommendations.push("Work on improving your credit score to 750+")
    }

    // DTI Ratio Check (30% weight)
    if (dtiRatio <= 36) {
      eligibilityScore += 30
      reasons.push("Healthy debt-to-income ratio")
    } else if (dtiRatio <= 43) {
      eligibilityScore += 20
      reasons.push("Acceptable debt-to-income ratio")
      recommendations.push("Consider reducing existing debts")
    } else {
      eligibilityScore += 5
      reasons.push("High debt-to-income ratio")
      recommendations.push("Reduce existing loans before applying")
    }

    // Age Check (15% weight)
    if (age >= 25 && age <= 55) {
      eligibilityScore += 15
      reasons.push("Optimal age for loan approval")
    } else {
      eligibilityScore += 8
      recommendations.push("Age factor may affect loan terms")
    }

    // Income Check (15% weight)
    const minIncome = formData.employmentType === "salaried" ? 25000 : 50000
    if (income >= minIncome * 2) {
      eligibilityScore += 15
      reasons.push("Strong income profile")
    } else if (income >= minIncome) {
      eligibilityScore += 10
      reasons.push("Adequate income")
    } else {
      eligibilityScore += 3
      reasons.push("Income below typical requirement")
      recommendations.push("Consider applying for a smaller loan amount")
    }

    // Calculate maximum eligible loan
    const maxEligibleLoan = income * 60 - existingLoans * 12
    const approvedAmount = Math.min(loanAmount, maxEligibleLoan)

    // Determine status
    let status, statusColor, statusMessage
    if (eligibilityScore >= 75) {
      status = "Approved"
      statusColor = "bg-green-500"
      statusMessage = "Congratulations! You are highly eligible for this loan."
    } else if (eligibilityScore >= 50) {
      status = "Likely"
      statusColor = "bg-blue-500"
      statusMessage = "You have good chances of approval with some conditions."
    } else {
      status = "Review Required"
      statusColor = "bg-orange-500"
      statusMessage = "Your application may need additional review."
    }

    // Mock bank recommendations
    const bankRecommendations = [
      {
        bank: "State Bank of India",
        interestRate: "8.5%",
        processingFee: "0.5%",
        tenure: "20 years",
        rating: 4.5,
      },
      { bank: "HDFC Bank", interestRate: "8.75%", processingFee: "1%", tenure: "20 years", rating: 4.7 },
      { bank: "ICICI Bank", interestRate: "9%", processingFee: "1%", tenure: "20 years", rating: 4.6 },
    ]

    setEligibilityResult({
      status,
      statusColor,
      statusMessage,
      eligibilityScore,
      approvedAmount,
      requestedAmount: loanAmount,
      dtiRatio: dtiRatio.toFixed(2),
      reasons,
      recommendations,
      bankRecommendations,
      emi: (approvedAmount / (Number.parseFloat(formData.loanTenure) * 12)).toFixed(2),
    })
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.loanType || !formData.monthlyIncome || !formData.employmentType) {
        alert("Please fill all required fields")
        return
      }
    }
    if (currentStep === 2) {
      if (!formData.creditScore || !formData.existingLoans) {
        alert("Please fill all required fields")
        return
      }
    }
    if (currentStep === 3) {
      if (!formData.loanAmount || !formData.loanTenure || !formData.age) {
        alert("Please fill all required fields")
        return
      }
      calculateEligibility()
    }
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleReset = () => {
    setCurrentStep(1)
    setFormData({
      loanType: "",
      monthlyIncome: "",
      employmentType: "",
      creditScore: "",
      existingLoans: "",
      loanAmount: "",
      loanTenure: "",
      age: "",
      dependents: "",
    })
    setEligibilityResult(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Loan Eligibility Checker</h1>
        <p className="text-gray-600 mt-2">Check your loan eligibility in 3 simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-24 h-1 ${currentStep > step ? "bg-blue-500" : "bg-gray-300"}`}
                  style={{ marginLeft: "4px", marginRight: "4px" }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-3xl mx-auto mt-2">
          <span className="text-xs text-gray-600">Personal Info</span>
          <span className="text-xs text-gray-600">Financial Details</span>
          <span className="text-xs text-gray-600">Loan Details</span>
          <span className="text-xs text-gray-600">Results</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 1: Personal Information</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="loanType">Loan Type *</Label>
                <Select
                  id="loanType"
                  value={formData.loanType}
                  onChange={(e) => handleInputChange("loanType", e.target.value)}
                >
                  <option value="">Select loan type</option>
                  {loanTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="50000"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange("employmentType", e.target.value)}
                >
                  <option value="">Select employment type</option>
                  {employmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  type="number"
                  placeholder="2"
                  value={formData.dependents}
                  onChange={(e) => handleInputChange("dependents", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          </Card>
        )}

        {/* Step 2: Financial Details */}
        {currentStep === 2 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 2: Financial Details</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="creditScore">Credit Score *</Label>
                <Input
                  id="creditScore"
                  type="number"
                  placeholder="750"
                  value={formData.creditScore}
                  onChange={(e) => handleInputChange("creditScore", e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">Score range: 300-900</p>
              </div>

              <div>
                <Label htmlFor="existingLoans">Existing Monthly Loan EMIs (₹) *</Label>
                <Input
                  id="existingLoans"
                  type="number"
                  placeholder="10000"
                  value={formData.existingLoans}
                  onChange={(e) => handleInputChange("existingLoans", e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">Total of all current loan EMIs</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Financial Health Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Keep debt-to-income ratio below 36%</li>
                  <li>• Maintain credit score above 750 for best rates</li>
                  <li>• Consider all monthly obligations</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          </Card>
        )}

        {/* Step 3: Loan Details */}
        {currentStep === 3 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 3: Loan Details</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="loanAmount">Required Loan Amount (₹) *</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="500000"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="loanTenure">Loan Tenure (Years) *</Label>
                <Input
                  id="loanTenure"
                  type="number"
                  placeholder="10"
                  value={formData.loanTenure}
                  onChange={(e) => handleInputChange("loanTenure", e.target.value)}
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Quick Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Loan Type:</span>
                    <span className="ml-2 font-medium">{formData.loanType || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Monthly Income:</span>
                    <span className="ml-2 font-medium">₹{formData.monthlyIncome || "0"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Credit Score:</span>
                    <span className="ml-2 font-medium">{formData.creditScore || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Employment:</span>
                    <span className="ml-2 font-medium">{formData.employmentType || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Check Eligibility</Button>
            </div>
          </Card>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && eligibilityResult && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6 text-center">
              <div
                className={`w-20 h-20 ${eligibilityResult.statusColor} rounded-full mx-auto mb-4 flex items-center justify-center`}
              >
                {eligibilityResult.status === "Approved" ? (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{eligibilityResult.status}</h2>
              <p className="text-gray-600 mb-4">{eligibilityResult.statusMessage}</p>
              <div className="flex justify-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Score: {eligibilityResult.eligibilityScore}/100
                </Badge>
              </div>
            </Card>

            {/* Eligibility Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Requested Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{eligibilityResult.requestedAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{eligibilityResult.approvedAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Monthly EMI</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{Number.parseFloat(eligibilityResult.emi).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Debt-to-Income Ratio</p>
                  <p className="text-2xl font-bold text-gray-900">{eligibilityResult.dtiRatio}%</p>
                </div>
              </div>
            </Card>

            {/* Positive Factors */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Positive Factors</h3>
              <ul className="space-y-2">
                {eligibilityResult.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Recommendations */}
            {eligibilityResult.recommendations.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {eligibilityResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Bank Recommendations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Banks</h3>
              <div className="space-y-4">
                {eligibilityResult.bankRecommendations.map((bank, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{bank.bank}</h4>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>Interest: {bank.interestRate}</span>
                        <span>Processing: {bank.processingFee}</span>
                        <span>Tenure: {bank.tenure}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold">{bank.rating}</span>
                      </div>
                      <Button size="sm">Apply Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-center">
              <Button onClick={handleReset} variant="outline" className="px-8 bg-transparent">
                Check Another Loan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
