import { properties } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BedDouble, Bath, Expand, MapPin, Building, School, Hospital, Phone, BadgeCheck, Sparkles, Flame } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SimilarProperties } from '@/components/similar-properties';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }
  
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');

  return (
    <div className="bg-background">
      <div className="container py-10">
        <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">{property.title}</h1>
            <div className="flex items-center text-muted-foreground text-md gap-2 mt-2">
                <MapPin className="h-5 w-5" />
                <span>{property.address}, {property.city}, {property.pincode}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                {property.owner.verified && !property.owner.isAgent && (
                    <Badge variant="default" className="text-base font-medium">
                        <BadgeCheck className="mr-1.5 h-5 w-5" /> Verified Owner
                    </Badge>
                )}
                {property.owner.verified && property.owner.isAgent && (
                    <Badge variant="secondary" className="text-base font-medium">
                        <BadgeCheck className="mr-1.5 h-5 w-5" /> Verified Agent
                    </Badge>
                )}
                {property.isNew && (
                    <Badge variant="outline" className="text-base font-medium">
                        <Sparkles className="mr-1.5 h-5 w-5" /> New Property
                    </Badge>
                )}
                {property.isUrgent && (
                    <Badge variant="destructive" className="text-base font-medium">
                        <Flame className="mr-1.5 h-5 w-5" /> Urgent Sale
                    </Badge>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {property.photos.map((photo, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-video">
                                <Image src={photo} alt={`${property.title} photo ${index + 1}`} fill className="object-cover" />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </Carousel>
                  </CardContent>
                </Card>
                
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{property.description}</p>
                    </CardContent>
                </Card>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {property.amenities.map((amenity, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="bg-secondary p-2 rounded-full">
                                      <Building className="h-4 w-4 text-secondary-foreground" />
                                    </div>
                                    <span>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                 <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Nearby Places</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {property.nearbyPlaces.map((place, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {place.name.toLowerCase().includes('school') ? <School className="h-5 w-5 text-primary" /> : <Hospital className="h-5 w-5 text-primary" />}
                                    <span>{place.name}</span>
                                </div>
                                <span className="text-muted-foreground">{place.distance}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {mapImage && (
                          <Image src={mapImage.imageUrl} alt="Map location" width={800} height={600} className="w-full rounded-lg" data-ai-hint={mapImage.imageHint}/>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-8 sticky top-24 h-min">
                 <Card className="shadow-lg">
                    <CardHeader className="bg-secondary rounded-t-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-secondary-foreground text-sm">{property.status}</p>
                                <p className="text-3xl font-bold text-primary-foreground">${property.price.toLocaleString()}</p>
                            </div>
                            <Badge variant="default">{property.type}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                       <div className="flex justify-around items-center text-center">
                          <div>
                            <BedDouble className="h-6 w-6 mx-auto text-primary" />
                            <p className="font-bold">{property.beds}</p>
                            <p className="text-xs text-muted-foreground">Beds</p>
                          </div>
                          <div>
                            <Bath className="h-6 w-6 mx-auto text-primary" />
                            <p className="font-bold">{property.baths}</p>
                             <p className="text-xs text-muted-foreground">Baths</p>
                          </div>
                           <div>
                            <Expand className="h-6 w-6 mx-auto text-primary" />
                            <p className="font-bold">{property.areaSqFt.toLocaleString()}</p>
                             <p className="text-xs text-muted-foreground">sqft</p>
                          </div>
                        </div>
                        <Separator />
                         <Card className="bg-muted border-none">
                            <CardContent className="p-4">
                                <h4 className="font-semibold">{property.owner.isAgent ? "Agent" : "Owner"} Contact</h4>
                                <p className="text-lg font-bold">{property.owner.name}</p>
                                <Button className="w-full mt-4" variant="accent"><Phone className="mr-2 h-4 w-4" /> {property.owner.phone}</Button>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
                <SimilarProperties property={property} />
            </div>
        </div>
      </div>
    </div>
  );
}
