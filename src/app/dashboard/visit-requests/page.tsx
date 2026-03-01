'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import type { SiteVisit } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarCheck, Phone, Check, X, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function VisitRequestsSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-9 w-64 mb-6" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VisitRequestsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const visitRequestsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'site_visits'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: visits, isLoading } = useCollection<SiteVisit>(visitRequestsQuery);

  const handleUpdateStatus = async (visitId: string, newStatus: 'confirmed' | 'rejected') => {
    if (!firestore) return;
    const visitDocRef = doc(firestore, 'site_visits', visitId);
    try {
      await updateDoc(visitDocRef, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: `The visit request has been ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating visit status:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the visit status. Please try again.',
      });
    }
  };

  const getStatusBadgeVariant = (status: SiteVisit['status']) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading || isUserLoading) {
    return <VisitRequestsSkeleton />;
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <CalendarCheck /> Visit Requests
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Appointments</CardTitle>
          <CardDescription>
            Here are the site visit requests for your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visits && visits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Visitor</TableHead>
                  <TableHead className="hidden sm:table-cell">Requested Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <Link href={`/properties/${visit.propertyId}`} className="flex items-center gap-3 group">
                        <Image
                          src={visit.propertyImage}
                          alt={visit.propertyTitle}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <span className="font-medium group-hover:underline">{visit.propertyTitle}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{visit.visitorName}</div>
                          {visit.visitorPhone && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {visit.visitorPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{format(new Date(visit.scheduledAt), 'PPP p')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(visit.status)} className="capitalize">
                        {visit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {visit.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleUpdateStatus(visit.id, 'confirmed')}
                          >
                            <Check className="mr-1 h-4 w-4" /> Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleUpdateStatus(visit.id, 'rejected')}
                          >
                            <X className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      )}
                      {visit.status !== 'pending' && (
                        <span className="text-sm text-muted-foreground italic">
                          Responded
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16 border-dashed border-2 rounded-lg">
              <h2 className="text-xl font-semibold">No visit requests found.</h2>
              <p className="text-muted-foreground mt-2">
                When a user requests a visit to one of your properties, it will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
