import type { Property } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Expand, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="group w-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link href={`/properties/${property.id}`} aria-label={property.title}>
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={property.photos[0]}
              alt={`Photo of ${property.title}`}
              width={600}
              height={400}
              className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="modern house"
            />
            <Badge className="absolute top-3 left-3" variant="accent">
              {property.status}
            </Badge>
             {property.featured && <Badge className="absolute top-3 right-3" variant="secondary">Featured</Badge>}
             <Button size="icon" variant="secondary" className="absolute bottom-3 right-3 rounded-full h-9 w-9 opacity-80 group-hover:opacity-100 transition-opacity">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Save to favorites</span>
            </Button>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-primary">{property.type}</p>
                    <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                        {property.title}
                    </h3>
                </div>
                <p className="text-lg font-extrabold text-primary shrink-0 ml-2">
                    ${property.price.toLocaleString()}
                    {property.status === 'For Rent' && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                </p>
            </div>
            <p className="flex items-center text-muted-foreground text-sm gap-2">
              <MapPin className="h-4 w-4" />
              <span>{property.address}, {property.city}</span>
            </p>
            <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-3">
              <span className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-primary" /> {property.beds} Beds
              </span>
              <span className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-primary" /> {property.baths} Baths
              </span>
              <span className="flex items-center gap-2">
                <Expand className="h-4 w-4 text-primary" /> {property.areaSqFt.toLocaleString()} sqft
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
