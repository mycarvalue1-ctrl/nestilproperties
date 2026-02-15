import { PropertyCard } from "@/components/property-card"
import { properties } from "@/lib/data"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  // In a real app, this would be based on the logged-in user's favorites
  const favoriteProperties = properties.slice(0, 2)

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="text-destructive fill-destructive" />
          My Favorite Properties
        </h1>
        <p className="text-muted-foreground">The properties you've saved for later.</p>
      </div>

      {favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <h2 className="text-xl font-semibold">You have no favorite properties yet.</h2>
          <p className="text-muted-foreground mt-2">Start exploring and click the heart icon to save properties.</p>
        </div>
      )}
    </div>
  )
}
