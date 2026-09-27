package com.travelwithus.destination.config;

import com.travelwithus.destination.entity.Destination;
import com.travelwithus.destination.repository.DestinationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final DestinationRepository destinationRepository;

    @Autowired
    public DataInitializer(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Override
    public void run(String... args) {
        if (destinationRepository.count() == 0) {
            seedDestinations();
        }
    }

    private void seedDestinations() {
        List<Destination> list = List.of(
                create("Bali", "Indonesia", "Denpasar", "Tropical paradise with lush rice terraces, ancient sea temples, world-class surf, and vibrant cultural heritage.",
                        "Island", "https://images.unsplash.com/photo-1537996194471-e657df975ab4", "April to October", new BigDecimal("450.00"), new BigDecimal("1800.00"), true,
                        "Uluwatu Temple;Tegallalang Rice Terrace;Mount Batur;Sacred Monkey Forest", "Surfing;Yoga retreat;Volcano trekking;Snorkeling"),

                create("Paris", "France", "Paris", "The City of Light captivates visitors with iconic monuments, world-class art museums, haute cuisine, and romantic Seine river cruises.",
                        "City", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", "June to August", new BigDecimal("800.00"), new BigDecimal("3500.00"), true,
                        "Eiffel Tower;Louvre Museum;Notre-Dame;Arc de Triomphe", "River cruise;Wine tasting;Art tour;Bakery hop"),

                create("Maldives", "Maldives", "Male", "Unrivaled luxury overwater bungalows, crystal-clear turquoise lagoons, and extraordinary coral reef diving experiences.",
                        "Island", "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", "November to April", new BigDecimal("1200.00"), new BigDecimal("6000.00"), true,
                        "Baa Atoll Biosphere;Maafushi Island;Banana Reef", "Scuba diving;Sunset dolphin cruise;Seaplane tour;Spa treatments"),

                create("Dubai", "United Arab Emirates", "Dubai", "Futuristic metropolis featuring record-breaking skyscrapers, mega luxury shopping malls, and thrilling desert safaris.",
                        "Luxury", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", "November to March", new BigDecimal("600.00"), new BigDecimal("3200.00"), true,
                        "Burj Khalifa;Dubai Mall;Palm Jumeirah;Dubai Marina", "Desert safari;Skydiving;Helicopter tour;Dhow dinner cruise"),

                create("Tokyo", "Japan", "Tokyo", "Dynamic capital blending neon-lit skyscrapers, historic shrines, Michelin-starred cuisine, and cutting-edge pop culture.",
                        "Cultural", "https://images.unsplash.com/photo-1503899036084-c55cdd92da26", "March to May and September to November", new BigDecimal("700.00"), new BigDecimal("3000.00"), true,
                        "Senso-ji Temple;Shibuya Crossing;Tokyo Skytree;Meiji Shrine", "Sushi making;Tea ceremony;Akihabara electronic tour;Mount Fuji day trip"),

                create("London", "United Kingdom", "London", "Historic royal capital with centuries of heritage, world-renowned West End theatre, grand parks, and modern arts.",
                        "City", "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad", "May to September", new BigDecimal("750.00"), new BigDecimal("3200.00"), true,
                        "Big Ben;Tower Bridge;British Museum;Buckingham Palace", "West End shows;Thames cruise;Royal palace tour;Afternoon tea"),

                create("Singapore", "Singapore", "Singapore", "High-tech garden city celebrated for Marina Bay architecture, multicultural foodie hawker centers, and tropical conservatories.",
                        "City", "https://images.unsplash.com/photo-1525625293386-3f8f99389edd", "November to January", new BigDecimal("550.00"), new BigDecimal("2500.00"), true,
                        "Gardens by the Bay;Marina Bay Sands;Sentosa Island;Changi Jewel", "Night safari;Cable car ride;Hawker food trail;Universal Studios"),

                create("New York", "United States", "New York", "The city that never sleeps offers Broadway theater, Times Square neon, world-famous skyline views, and Central Park charm.",
                        "City", "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9", "April to June and September to November", new BigDecimal("850.00"), new BigDecimal("4000.00"), true,
                        "Empire State Building;Central Park;Statue of Liberty;Times Square", "Broadway show;Helicopter skyline tour;Museum hopping;High Line walk"),

                create("Switzerland", "Switzerland", "Interlaken", "Breathtaking Alpine vistas, pristine glacial lakes, scenic cogwheel trains, and year-round mountain adventures.",
                        "Mountain", "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99", "June to September and December to March", new BigDecimal("950.00"), new BigDecimal("4500.00"), true,
                        "Jungfraujoch Top of Europe;Matterhorn;Lake Geneva;Rhine Falls", "Skiing;Paragliding;Scenic train ride;Chocolate factory visit"),

                create("Goa", "India", "Panaji", "Sun-drenched golden beaches, Portuguese colonial churches, spice plantations, vibrant beach shacks, and seafood cuisine.",
                        "Beach", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", "November to February", new BigDecimal("200.00"), new BigDecimal("900.00"), true,
                        "Baga Beach;Basilica of Bom Jesus;Fort Aguada;Dudhsagar Falls", "Water sports;Dolphin spotting;Spice plantation tour;Sunset catamaran cruise")
        );

        destinationRepository.saveAll(list);
        log.info("Initialized {} curated destinations in destination-service", list.size());
    }

    private Destination create(String name, String country, String city, String description, String category,
                               String imageUrl, String bestTime, BigDecimal minPrice, BigDecimal maxPrice, boolean popular,
                               String attractions, String activities) {
        Destination d = new Destination(name, country, city, description, category, imageUrl, bestTime, minPrice, maxPrice, popular);
        d.setAttractions(attractions);
        d.setActivities(activities);
        d.setGalleryUrls(imageUrl);
        return d;
    }
}
