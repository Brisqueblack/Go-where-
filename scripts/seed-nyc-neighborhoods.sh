#!/bin/bash
# Seed NYC neighborhood vibes into the neighborhood_vibes table

INSERT_ROW() {
  local city="$1"
  local nhood="$2"
  local vibe="$3"
  local sql="INSERT INTO neighborhood_vibes (city, neighborhood, vibe_description) VALUES ('${city//\'/\'\'}', '${nhood//\'/\'\'}', '${vibe//\'/\'\'}'')"
  team-db "$sql" 2>/dev/null
}

# Manhattan neighborhoods
INSERT_ROW "New York" "Williamsburg" "Artsy, laid-back, great thrift shops and rooftop bars — the epicenter of Brooklyn cool"
INSERT_ROW "New York" "Harlem" "Historic, soulful, jazz clubs and the best soul food in the city"
INSERT_ROW "New York" "Astoria" "Diverse, relaxed, the real NYC food scene with incredible Greek and Middle Eastern eats"
INSERT_ROW "New York" "Jackson Heights" "The most diverse neighborhood in America — incredible Himalayan, Colombian, and Indian food within 3 blocks"
INSERT_ROW "New York" "Arthur Avenue" "The real Little Italy — better and cheaper than Manhattan, where Italian grandmas still do the shopping"
INSERT_ROW "New York" "City Island" "A New England fishing village inside NYC — seafood shacks, sailboats, and salt air"
INSERT_ROW "New York" "Snug Harbor" "A hidden botanical garden and cultural center that most tourists never discover"
INSERT_ROW "New York" "Greenpoint" "Polish bakeries, waterfront parks, and a quietly cool vibe without the Williamsburg crowds"
INSERT_ROW "New York" "Ditmas Park" "Victorian mansions, tree-lined streets, and a truly diverse neighborhood most New Yorkers never visit"
INSERT_ROW "New York" "Forest Hills" "Tudor-style homes, great bagels, and a peaceful residential feel just 20 minutes from Midtown"
INSERT_ROW "New York" "Red Hook" "Waterfront warehouses turned into artist studios, the best key lime pie, and sweeping harbor views"
INSERT_ROW "New York" "Inwood" "Manhattan's last forest, the Cloisters museum, and Dominican restaurants that locals swear by"
INSERT_ROW "New York" "Long Island City" "Skyline views, waterfront parks, and world-class art museums with zero crowds"
INSERT_ROW "New York" "Flushing" "The real Chinatown — food stalls, dim sum palaces, and the best soup dumplings outside Shanghai"
INSERT_ROW "New York" "Crown Heights" "Caribbean food, the Brooklyn Museum, and a vibrant mix of cultures on every block"
INSERT_ROW "New York" "Sunset Park" "Industry City's food hall, waterfront parks, and Brooklyn's Chinatown along 8th Avenue"
INSERT_ROW "New York" "Riverdale" "Leafy hillside estates, Wave Hill gardens, and a suburban feel with Manhattan skyline views"
INSERT_ROW "New York" "Bay Ridge" "Waterfront promenades, old-school Italian bakeries, and a tight-knit neighborhood vibe"
INSERT_ROW "New York" "St. George" "The Staten Island Ferry terminal, minor league baseball, and the best Sri Lankan food in NYC"
INSERT_ROW "New York" "DUMBO" "Cobblestone streets, the iconic Manhattan Bridge photo spot, and world-class pizza under the bridge"

echo "Seeded 20 NYC neighborhood vibes"
