import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Mail, Phone, Globe } from "lucide-react";
import gsap from "gsap";
import api from "../utils/axios"; // axios instance

export default function BanksPage() {
  const navigate = useNavigate();

  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await api.get("/banks/getAll");

        setBanks(res.data.data.allBank);

        gsap.fromTo(
          ".bank-card",
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          }
        );
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, []);

  const handleViewSchemes = (bankId) => {
    navigate(`/schemes?bank=${bankId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Partner Banks
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore loan schemes from Pakistan's leading financial institutions
          </p>
        </div>

        {/* Banks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {banks.map((bank) => (
            <Card
              key={bank._id}
              className="bank-card overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-0"
            >

              {/* Bank Logo Section */}
              <div className="h-32 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                {bank.logoURL ? (
                  <img
                    src={bank.logoURL}
                    alt={bank.name}
                    className="h-16 object-contain bg-white p-2 rounded"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-white" />
                )}
              </div>

              {/* Bank Header */}
              <CardHeader>
                <CardTitle className="text-xl">{bank.name}</CardTitle>
                <CardDescription>
                  Bank Code: {bank.bankCode}
                </CardDescription>
              </CardHeader>

              {/* Bank Details */}
              <CardContent>
                <div className="space-y-3 text-sm">

                  {/* Website */}
                  <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="w-4 h-4" />
                    <a
                      href={bank.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{bank.contactEmail}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{bank.contactPhone}</span>
                  </div>

                  {/* Button */}
                  <Button
                    onClick={() => handleViewSchemes(bank._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-3"
                  >
                    View Loan Schemes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                </div>
              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </div>
  );
}