'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {

  return (
    <div>
      <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <h2 className="text-xl font-semibold">Feature Disabled</h2>
          <p className="text-muted-foreground mt-2">This feature is not currently available.</p>
          <Button asChild className="mt-4">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
    </div>
  );
}
