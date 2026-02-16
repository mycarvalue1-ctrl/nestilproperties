'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Coins, Gem, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const creditPackages = [
  { amount: 10, price: 100, icon: Coins, popular: false },
  { amount: 50, price: 450, icon: Gem, popular: true },
  { amount: 100, price: 800, icon: Crown, popular: false },
];

export default function BuyCreditsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [currentUserCredits, setCurrentUserCredits] = useState(0);
  const [isFetchingCredits, setIsFetchingCredits] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<number | null>(null);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/user-login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const fetchCredits = async () => {
      if (user && firestore) {
        setIsFetchingCredits(true);
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUserCredits(userDocSnap.data().credits || 0);
        }
        setIsFetchingCredits(false);
      }
    };
    fetchCredits();
  }, [user, firestore]);

  const handleBuyCredits = async (amount: number, price: number) => {
    if (!user || !firestore) return;
    
    setIsPurchasing(amount);
    const userDocRef = doc(firestore, 'users', user.uid);

    try {
      // In a real app, you would integrate a payment gateway here.
      // For this demo, we'll just simulate a successful payment.
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      await updateDoc(userDocRef, {
        credits: increment(amount)
      });

      setCurrentUserCredits(prev => prev + amount);

      toast({
        title: "Purchase Successful!",
        description: `${amount} credits have been added to your account.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
        setIsPurchasing(null);
    }
  };
  
  if (isUserLoading || isFetchingCredits) {
      return (
          <div className="container py-12 max-w-4xl mx-auto">
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-5 w-80 mx-auto mb-10" />
              <div className="flex items-center justify-center p-4 mb-8">
                  <Skeleton className="h-12 w-52" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
              </div>
          </div>
      )
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline">Buy Credits</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Purchase credits to view owner contact details and unlock other premium features.
        </p>
      </div>

       <div className="flex items-center justify-center mb-8">
            <Card className="inline-flex flex-col items-center p-4 bg-muted border-dashed">
                <CardTitle className="text-lg text-muted-foreground">Your Current Balance</CardTitle>
                <p className="text-4xl font-bold text-primary flex items-center gap-2">
                    <Coins className="h-8 w-8" />
                    {currentUserCredits}
                </p>
            </Card>
        </div>


      <div className="grid md:grid-cols-3 gap-8">
        {creditPackages.map((pkg) => (
          <Card key={pkg.amount} className={`flex flex-col text-center ${pkg.popular ? 'border-primary border-2 shadow-lg' : ''}`}>
            {pkg.popular && <div className="bg-primary text-primary-foreground text-sm font-bold py-1 rounded-t-lg -mt-px">Most Popular</div>}
            <CardHeader>
                <pkg.icon className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-3xl">{pkg.amount} Credits</CardTitle>
              <CardDescription className="text-lg font-semibold">
                ₹{pkg.price}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* You can add more details here */}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                variant={pkg.popular ? 'default' : 'outline'}
                onClick={() => handleBuyCredits(pkg.amount, pkg.price)}
                disabled={isPurchasing !== null}
              >
                {isPurchasing === pkg.amount ? (
                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    'Buy Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

    