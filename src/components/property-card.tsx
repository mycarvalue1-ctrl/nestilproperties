
'use client';

import type { Property } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BadgeCheck, Star, BedDouble, Bath, Expand, Heart, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { toast } = useToast();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const isFavorited = favoriteIds.has(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id, isFavorited);
  };
  
  const validPhotos = (property.photos || []).filter(p => p && !p.includes('ik.imagekit.io'));
  const imageUrl = validPhotos.length > 0 ? validPhotos[0] : 'https://picsum.photos/seed/property/600/400';

  const renderBadge = () => {
    if (property.featured) {
        return (
            <Badge variant="destructive" className="absolute top-3 left-3 z-10 flex items-center gap-1">
                <Star className="h-3 w-3" /> FEATURED
            </Badge>
        );
    }
    if (property.listingFor === 'Sale') {
        return <Badge variant="default" className="absolute top-3 left-3 z-10">FOR SALE</Badge>;
    }
    if (property.listingFor === 'Rent') {
        // Using outline with custom green colors to stay closer to theme, as there's no green variant.
        return <Badge variant="outline" className="absolute top-3 left-3 z-10 border-green-600/50 bg-green-50 text-green-700">FOR RENT</Badge>;
    }
    return null;
  };

  const renderPrice = () => {
    if (property.priceOnRequest || !property.price || property.price <= 0) {
        return <p className="text-xl font-bold font-headline text-primary">Price on Request</p>;
    }

    if (property.listingFor === 'Rent') {
        return (
            <p className="text-xl font-bold font-headline text-primary">
                ₹{new Intl.NumberFormat('en-IN').format(property.price)}
                <span className="text-sm font-normal text-muted-foreground"> /month</span>
            </p>
        );
    }

    const formatSalePrice = (p: number) => {
        if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`;
        if (p >= 100000) return `₹${(p / 100000).toFixed(0)} Lakhs`;
        return `₹${new Intl.NumberFormat('en-IN').format(p)}`;
    };
    
    const price = formatSalePrice(property.price);
    
    return (
        <p className="text-xl font-bold font-headline text-primary">
            {price}
            {property.negotiable && <span className="text-sm font-normal text-muted-foreground ml-1">negotiable</span>}
        </p>
    );
  }

  const specs = [];
  if (property.bhk) {
    specs.push({ value: property.bhk.replace('BHK', ''), label: 'Beds' });
  } else if (property.beds) {
    specs.push({ value: property.beds, label: 'Beds' });
  }

  if (property.baths) {
    specs.push({ value: property.baths, label: 'Baths' });
  }

  if (property.areaSqFt) {
    specs.push({ value: property.areaSqFt.toLocaleString('en-IN'), label: 'sqft' });
  }
  
  if (property.floor) {
    specs.push({ value: `${property.floor}${property.totalFloors ? '/' + property.totalFloors : ''}`, label: 'Floor' });
  } else if (property.propertyType) {
    let type = property.propertyType;
    if (type.includes('Independent')) type = 'House';
    if (type.includes('Flat')) type = 'Flat';
    specs.push({ value: type, label: 'Type' });
  }

  const finalSpecs = specs.slice(0, 4);
  while(finalSpecs.length < 4) {
    finalSpecs.push({ value: 'N/A', label: ' ' });
  }

  return (
    <Card className="group w-full overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-card relative hover:-translate-y-1">
      <Link href={`/properties/${property.id}`} className="flex flex-col h-full">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 group-hover:from-black/30 transition-colors"></div>
          <Image
            src={imageUrl}
            alt={`Photo of ${property.title}`}
            width={600}
            height={400}
            className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            data-ai-hint="modern house"
          />
          {renderBadge()}
          <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/60 z-20 backdrop-blur-sm" onClick={handleFavoriteClick} title="Favorite property">
            <Heart className={cn("h-4 w-4", isFavorited && "fill-destructive text-destructive")} />
          </Button>
        </div>
        
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            {renderPrice()}
            {property.isApproved && (
                <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full border border-green-200/50">
                    <BadgeCheck className="h-3 w-3" />
                    <span>Verified</span>
                </div>
            )}
          </div>
          
          <h3 className="font-bold font-headline text-md leading-snug truncate group-hover:text-primary transition-colors">{property.title}</h3>
          
          <p className="flex items-center text-sm gap-1 truncate text-muted-foreground mt-1 mb-4">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{property.address}, {property.city}</span>
          </p>
          
          <div className="border-t mt-auto pt-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                  {finalSpecs.map((spec, i) => (
                      <div key={i}>
                          <p className="font-bold text-sm text-foreground">{spec.value}</p>
                          <p className="text-xs text-muted-foreground">{spec.label}</p>
                      </div>
                  ))}
              </div>
          </div>

        </CardContent>
      </Link>
    </Card>
  );
}

export function PropertyCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden shadow-sm flex flex-col bg-card">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-2/5" />
            <Skeleton className="h-5 w-1/4" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="border-t mt-auto pt-4">
            <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1"><Skeleton className="h-4 w-3/4 mx-auto" /><Skeleton className="h-3 w-1/2 mx-auto" /></div>
                <div className="space-y-1"><Skeleton className="h-4 w-3/4 mx-auto" /><Skeleton className="h-3 w-1/2 mx-auto" /></div>
                <div className="space-y-1"><Skeleton className="h-4 w-3/4 mx-auto" /><Skeleton className="h-3 w-1/2 mx-auto" /></div>
                <div className="space-y-1"><Skeleton className="h-4 w-3/4 mx-auto" /><Skeleton className="h-3 w-1/2 mx-auto" /></div>
            </div>
        </div>
      </div>
    </Card>
  );
}
