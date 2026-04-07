import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  useGetOnboardingProgress, 
  useUpdateOnboardingProgress,
  useUpdateAgentProfile,
  useUpdateBusinessSettings,
  useUpdateVoiceSettings,
  useSearchTwilioNumbers,
  usePurchaseTwilioNumber
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ChevronRight, Bot, PhoneCall, Calendar, User, Search, Phone } from "lucide-react";

export default function Onboarding() {
  const { data: progress, isLoading: loadingProgress } = useGetOnboardingProgress();
  const updateProgress = useUpdateOnboardingProgress();
  const updateAgent = useUpdateAgentProfile();
  const updateBusiness = useUpdateBusinessSettings();
  const updateVoice = useUpdateVoiceSettings();
  const purchaseNumber = usePurchaseTwilioNumber();
  
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [areaCode, setAreaCode] = useState("");
  const { data: numbers, refetch: searchNumbers } = useSearchTwilioNumbers({ areaCode }, { query: { enabled: false } });

  useEffect(() => {
    if (progress?.currentStep) {
      setStep(progress.currentStep);
    }
  }, [progress]);

  const steps = [
    { id: 1, name: "Agent Profile", icon: User },
    { id: 2, name: "Business Data", icon: CheckCircle2 },
    { id: 3, name: "Voice Preferences", icon: Bot },
    { id: 4, name: "Calendar Integration", icon: Calendar },
    { id: 5, name: "Phone Setup", icon: PhoneCall },
    { id: 6, name: "Listings Setup", icon: CheckCircle2 },
    { id: 7, name: "Review & Activate", icon: CheckCircle2 },
  ];

  const handleNext = async () => {
    if (step < 7) {
      const nextStep = step + 1;
      setStep(nextStep);
      updateProgress.mutate({ data: { currentStep: nextStep, completedStep: step } });
    } else {
      updateVoice.mutate({ data: { isActive: true } }, {
        onSuccess: () => {
          toast({ title: "Assistant Activated!", description: "Your AI agent is now live and taking calls." });
          setLocation("/dashboard");
        }
      });
    }
  };

  const handlePurchase = (phoneNumber: string) => {
    purchaseNumber.mutate({ data: { phoneNumber } }, {
      onSuccess: () => {
        toast({ title: "Number Purchased", description: `${phoneNumber} has been added to your account.` });
        handleNext();
      },
      onError: () => {
        toast({ title: "Purchase Failed", description: "Could not purchase number.", variant: "destructive" });
      }
    });
  };

  if (loadingProgress) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col pt-12 items-center px-4">
      <div className="w-full max-w-3xl mb-8">
        <h1 className="text-3xl font-bold text-center mb-8">Configure Your AI Assistant</h1>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 6) * 100}%` }} />
          
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors border-2 ${
                step > s.id ? "bg-primary border-primary text-primary-foreground" :
                step === s.id ? "bg-background border-primary text-primary" :
                "bg-background border-muted text-muted-foreground"
              }`}>
                {step > s.id ? <CheckCircle2 className="h-5 w-5" /> : s.id}
              </div>
              <span className={`text-xs font-medium hidden md:block ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        <Card className="shadow-lg border-border">
          <CardContent className="p-8">
            <div className="min-h-[300px] flex flex-col">
              <div className="text-center space-y-4 mb-8">
                <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  {steps[step-1].icon && (() => { const Icon = steps[step-1].icon; return <Icon className="h-8 w-8" /> })()}
                </div>
                <h2 className="text-2xl font-bold">{steps[step-1].name}</h2>
                <p className="text-muted-foreground">Please configure the settings for this step to continue.</p>
              </div>

              <div className="flex-1">
                {step === 1 && (
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Jane Doe" /></div>
                    <div className="space-y-2"><Label>Brokerage</Label><Input placeholder="Keller Williams" /></div>
                    <div className="space-y-2"><Label>Bio</Label><Textarea placeholder="I specialize in luxury homes..." /></div>
                  </div>
                )}
                {step === 5 && (
                  <div className="space-y-6 max-w-lg mx-auto">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter Area Code (e.g. 415)" 
                        value={areaCode} 
                        onChange={(e) => setAreaCode(e.target.value)}
                      />
                      <Button onClick={() => searchNumbers()}><Search className="h-4 w-4 mr-2" /> Search</Button>
                    </div>
                    <div className="space-y-2">
                      {numbers?.map((num) => (
                        <div key={num.phoneNumber} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2 font-mono">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {num.friendlyName}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold">{num.monthlyFee}</span>
                            <Button size="sm" onClick={() => handlePurchase(num.phoneNumber)}>Purchase</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {step === 7 && (
                  <div className="text-center space-y-4 max-w-md mx-auto">
                    <div className="p-6 bg-accent rounded-xl">
                      <h3 className="font-semibold text-lg mb-2">Ready to Go Live</h3>
                      <p className="text-sm text-muted-foreground">
                        Your assistant is fully configured. Activating will enable the voice agent on your new phone number.
                      </p>
                    </div>
                  </div>
                )}
                {[2,3,4,6].includes(step) && (
                  <div className="bg-accent/50 p-8 rounded-xl border border-border border-dashed text-center text-muted-foreground text-sm">
                    Configure your {steps[step-1].name.toLowerCase()} here.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext} className="gap-2">
                {step === 7 ? "Activate Assistant" : "Continue"}
                {step !== 7 && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}