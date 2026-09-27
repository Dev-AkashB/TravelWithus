package com.travelwithus.pkg.config;

import com.travelwithus.pkg.entity.TravelPackage;
import com.travelwithus.pkg.repository.TravelPackageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final TravelPackageRepository packageRepository;

    @Autowired
    public DataInitializer(TravelPackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @Override
    public void run(String... args) {
        if (packageRepository.count() == 0) {
            seedPackages();
        }
    }

    private void seedPackages() {
        List<TravelPackage> packages = List.of(
                create("Bali Island Bliss & Cultural Journey", 1L, "Bali",
                        "Experience the spiritual essence of Bali with guided tours of cliffside Uluwatu, sunrise yoga in Ubud, cycling through Tegallalang rice terraces, and beachfront dining in Seminyak.",
                        7, 6, new BigDecimal("899.00"), 10, 20, 18,
                        "Maya Ubud Resort & Spa / Seminyak Beachfront Resort",
                        "Day 1: Arrival & Sunset Beach Cocktail;Day 2: Ubud Sacred Monkey Forest & Art Market;Day 3: Mount Batur Sunrise Trek;Day 4: Tegallalang Rice Terraces & Swing;Day 5: Uluwatu Temple & Kecak Dance;Day 6: Water Sports at Nusa Dua;Day 7: Departure",
                        "Surfing;Yoga;Rice terrace trek;Balinese cooking class;Temple tour",
                        "https://images.unsplash.com/photo-1537996194471-e657df975ab4", true),

                create("Paris Romance & Fine Arts Escapade", 2L, "Paris",
                        "Indulge in a curated Parisian getaway including skip-the-line Louvre passes, exclusive evening Seine river dinner cruise, Eiffel Tower summit tickets, and a Montmartre wine and cheese walking tour.",
                        5, 4, new BigDecimal("1299.00"), 15, 16, 12,
                        "Hôtel Plaza Athénée / Le Marais Boutique Hotel",
                        "Day 1: Welcome to Paris & Seine Dinner Cruise;Day 2: Private Louvre Museum Tour & Tuileries Walk;Day 3: Eiffel Tower Summit & Champs-Élysées;Day 4: Montmartre Artists & Sacré-Cœur;Day 5: Latin Quarter & Departure",
                        "Museum guided tour;Seine river cruise;Wine tasting;Bakery masterclass",
                        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", true),

                create("Maldives Overwater Luxury Dream", 3L, "Maldives",
                        "Ultimate tropical escape staying in an authentic overwater bungalow with direct ocean access, private infinity pool, seaplane transfer, and all-inclusive gourmet dining.",
                        6, 5, new BigDecimal("2499.00"), 10, 12, 8,
                        "Anantara Kihavah Maldives Villas (Overwater Pool Villa)",
                        "Day 1: Seaplane Transfer to Private Atoll;Day 2: Coral Reef Guided Snorkeling Safari;Day 3: Sunset Dolphin Cruise with Champagne;Day 4: Underwater Restaurant Dining Experience;Day 5: Couple's Ayurvedic Spa Treatment;Day 6: Seaplane Return & Departure",
                        "Scuba diving;Seaplane flight;Underwater dining;Sunset cruise;Spa",
                        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", true),

                create("Dubai Highlights & Desert Safari", 4L, "Dubai",
                        "Experience the glamorous pulse of Dubai from the Burj Khalifa observatory to gold souks and an exhilarating dune-bashing red sand safari with BBQ dinner and stargazing.",
                        5, 4, new BigDecimal("999.00"), 5, 24, 20,
                        "Atlantis The Palm / Downtown Luxury Suites",
                        "Day 1: Arrival & Dubai Marina Walk;Day 2: Burj Khalifa 148th Floor & Dubai Mall Fountain;Day 3: Desert Safari with Dune Bashing, Camel Ride & BBQ;Day 4: Palm Jumeirah & Aquaventure Waterpark;Day 5: Old Dubai Abra Boat & Departure",
                        "Desert safari;Burj Khalifa;Helicopter tour;Yacht cruise;Camel riding",
                        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", true),

                create("Tokyo Modern Neon & Ancient Heritage", 5L, "Tokyo",
                        "An immersive odyssey through Tokyo's vibrant neighborhoods: historic Asakusa, futuristic Akihabara, peaceful Meiji Jingu shrine, and a scenic day trip to Mount Fuji.",
                        8, 7, new BigDecimal("1650.00"), 12, 18, 14,
                        "Keio Plaza Hotel Tokyo / Shinjuku Granbell",
                        "Day 1: Arrival in Tokyo;Day 2: Senso-ji Temple & Sumida River Cruise;Day 3: Shibuya Crossing & Harajuku Takeshita Street;Day 4: Mount Fuji 5th Station & Lake Kawaguchiko;Day 5: Akihabara Electric Town & TeamLab Planets;Day 6: Tsukiji Outer Market & Sushi Making;Day 7: Ginza Shopping & Robot Restaurant;Day 8: Departure",
                        "Sushi masterclass;Mount Fuji tour;TeamLab digital art;Tea ceremony",
                        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26", true),

                create("Swiss Alpine Panoramic Grand Tour", 9L, "Switzerland",
                        "Traverse the majestic Swiss Alps aboard the Glacier Express, ride the cogwheel train to the Top of Europe at Jungfraujoch, and relax by Lake Geneva.",
                        7, 6, new BigDecimal("2100.00"), 0, 14, 10,
                        "Victoria-Jungfrau Grand Hotel / Zermatt Alpine Lodge",
                        "Day 1: Zurich Arrival & Transfer to Interlaken;Day 2: Jungfraujoch Top of Europe Excursion;Day 3: Lake Brienz Boat Cruise & Giessbach Falls;Day 4: Glacier Express Scenic Train to Zermatt;Day 5: Matterhorn Glacier Paradise;Day 6: Montreux & Chillon Castle;Day 7: Geneva Departure",
                        "Panoramic train;Alpine skiing;Lake cruise;Fondue dinner;Cable car",
                        "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99", true),

                create("Goa Sun, Sand & Portuguese Charm", 10L, "Goa",
                        "Recharge on sunny beaches with catamaran sunset cruises, fresh Goan seafood dining, heritage tours of Old Goa churches, and spice plantation walks.",
                        4, 3, new BigDecimal("349.00"), 15, 30, 26,
                        "Taj Fort Aguada Resort & Spa Goa",
                        "Day 1: Arrival & Candolim Beach Welcome;Day 2: Old Goa Churches & Fontainhas Latin Quarter;Day 3: Dudhsagar Waterfalls & Spice Plantation;Day 4: Water Sports & Departure",
                        "Catamaran cruise;Dolphin watching;Parasailing;Spice tour",
                        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", true)
        );

        packageRepository.saveAll(packages);
        log.info("Initialized {} curated packages in package-service", packages.size());
    }

    private TravelPackage create(String title, Long destinationId, String destinationName, String description,
                                 int days, int nights, BigDecimal price, int discount, int maxTravelers, int availableSlots,
                                 String hotel, String itinerary, String activities, String imageUrl, boolean featured) {
        LocalDate start = LocalDate.now().plusDays(14);
        LocalDate end = start.plusDays(days);
        TravelPackage p = new TravelPackage(title, destinationId, destinationName, description, days, nights,
                price, discount, maxTravelers, availableSlots, hotel, itinerary, activities, imageUrl, start, end, featured);
        p.setGalleryUrls(imageUrl);
        return p;
    }
}
