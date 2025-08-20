"use client";
import { useState, useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { saveCreditToDb } from "@/actions/credit";
import Loader from "@/components/loader";
import { useImage } from "@/context/image";
import { useSearchParams } from "next/navigation";

export default function BuyCredits() {
  const [{ isPending }] = usePayPalScriptReducer();
  const [selected, setSelected] = useState({ credits: 10, price: 5 });
  const searchParams = useSearchParams();
  const { credits, getUserCredits } = useImage();

  const creditOptions = [
    { credits: 10, price: 5 },
    { credits: 30, price: 15 },
    { credits: 100, price: 35 },
  ];

  // Auto-select based on URL parameter
  useEffect(() => {
    const creditsParam = searchParams.get("credits");
    if (creditsParam) {
      const creditsValue = parseInt(creditsParam, 10);
      const option = creditOptions.find((opt) => opt.credits === creditsValue);
      if (option) {
        setSelected(option);
      }
    }
  }, [searchParams]);

  const handleSuccess = async (details: any) => {
    console.log("details => ", details);
    const amount = parseFloat(details.purchase_units[0].amount.value);
    const credits = parseInt(details.purchase_units[0].custom_id, 10);

    // save credit to db
    try {
      await saveCreditToDb(amount, credits);
      // get user credits from db
      getUserCredits();
      toast.success(`Successfully purchased ${credits} credits.`);
    } catch (err) {
      console.error("err => ", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleError = (err: any) => {
    console.error("err => ", err);
    toast.error("An error occurred. Please try again.");
  };

  if (isPending) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Buy Credits
          </CardTitle>
          <p className="text-center">
            You currently have{" "}
            <span className="font-bold text-primary">{credits}</span> credits
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 justify-between mb-6">
            {creditOptions.map((option) => (
              <Button
                key={option.credits}
                onClick={() => setSelected(option)}
                variant={
                  selected.credits === option.credits ? "default" : "outline"
                }
                className="h-10 cursor-pointer"
              >
                {option.credits} Credits - ${option.price}
              </Button>
            ))}
          </div>

          <div className="relative z-0">
            <PayPalButtons
              key={selected.credits} // whatever change is happening in state is grabbed.
              createOrder={(data, actions: any) => {
                const price = selected.price.toFixed(2);
                const credits = selected.credits.toString();

                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: price,
                      },
                      custom_id: credits,
                    },
                  ],
                });
              }}
              onApprove={async (data, actions: any) => {
                const details = await actions.order.capture();
                handleSuccess(details);
              }}
              onError={handleError}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
