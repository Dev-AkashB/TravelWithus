package com.travelwithus.hotel.config;

import com.travelwithus.hotel.entity.Hotel;
import com.travelwithus.hotel.entity.RoomType;
import com.travelwithus.hotel.repository.HotelRepository;
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

    private final HotelRepository hotelRepository;

    @Autowired
    public DataInitializer(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public void run(String... args) {
        if (hotelRepository.count() == 0) {
            seedHotels();
        }
    }

    private void seedHotels() {
        Hotel h1 = new Hotel("Four Seasons Resort Bali at Sayan", 1L, "Bali", "Ubud", "Indonesia",
                "Jl. Raya Sayan, Sayan, Kecamatan Ubud", 5, new BigDecimal("4.9"), 380,
                "Award-winning architectural wonder tucked into the lush Ayung River valley surrounded by sacred rainforests.",
                "WiFi;Infinity Pool;Ayurvedic Spa;Yoga Pavilion;Riverside Restaurant;Airport Shuttle",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d", new BigDecimal("420.00"));
        h1.setGalleryUrls(h1.getImageUrl());
        addRoom(h1, "One-Bedroom Duplex Suite", "Spacious two-level suite with river views and sundeck", 2, new BigDecimal("420.00"), 12, "King", 65);
        addRoom(h1, "Riverfront Pool Villa", "Private plunge pool overlooking sacred Ayung River", 3, new BigDecimal("750.00"), 8, "King + Daybed", 120);

        Hotel h2 = new Hotel("The Ritz Paris", 2L, "Paris", "Paris", "France",
                "15 Place Vendôme, 75001 Paris", 5, new BigDecimal("4.9"), 520,
                "Timeless elegance and legendary French hospitality located on the historic Place Vendôme.",
                "WiFi;Indoor Swimming Pool;Chanel Spa;Michelin Star Dining;Bar Hemingway;Fitness Center",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945", new BigDecimal("850.00"));
        h2.setGalleryUrls(h2.getImageUrl());
        addRoom(h2, "Deluxe Historic Room", "Authentic neoclassical Parisian décor with marble bathroom", 2, new BigDecimal("850.00"), 15, "King", 40);
        addRoom(h2, "Prestige Suite Vendôme", "Grand suite overlooking Place Vendôme square", 3, new BigDecimal("1600.00"), 5, "King", 80);

        Hotel h3 = new Hotel("Anantara Kihavah Maldives Villas", 3L, "Maldives", "Male", "Maldives",
                "Kihavah Huravalhi Island, Baa Atoll", 5, new BigDecimal("4.9"), 290,
                "Sanctuary of peace surrounded by a sapphire lagoon in the UNESCO Biosphere Reserve of Baa Atoll.",
                "WiFi;Private Infinity Pool;Overwater Spa;Underwater Wine Cellar;Scuba Center;Tennis Court",
                "https://images.unsplash.com/photo-1540541338287-41700207dee6", new BigDecimal("1100.00"));
        h3.setGalleryUrls(h3.getImageUrl());
        addRoom(h3, "Overwater Pool Villa", "Direct ocean access, glass-bottom tub, and private infinity plunge pool", 2, new BigDecimal("1100.00"), 10, "King", 130);
        addRoom(h3, "Beach Pool Villa", "Enclosed tropical garden with direct private white sandy beach access", 3, new BigDecimal("950.00"), 10, "King", 150);

        Hotel h4 = new Hotel("Atlantis The Royal", 4L, "Dubai", "Dubai", "United Arab Emirates",
                "Crescent Rd, Palm Jumeirah, Dubai", 5, new BigDecimal("4.8"), 640,
                "Iconic luxury landmark on the Palm Jumeirah with 17 celebrity chef restaurants and cloud 22 sky pool.",
                "WiFi;Rooftop Sky Pool;Aquaventure Pass;Helipad;Private Beach;Full Service Spa",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", new BigDecimal("550.00"));
        h4.setGalleryUrls(h4.getImageUrl());
        addRoom(h4, "Seascape King Room", "Panoramic views of the Arabian Sea with bespoke luxury amenities", 2, new BigDecimal("550.00"), 20, "King", 55);
        addRoom(h4, "Sky Pool Villa", "Elevated private terrace with personal infinity pool overlooking Dubai skyline", 4, new BigDecimal("1400.00"), 6, "2 King", 118);

        Hotel h5 = new Hotel("Aman Tokyo", 5L, "Tokyo", "Tokyo", "Japan",
                "The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku", 5, new BigDecimal("4.9"), 310,
                "Urban sanctuary floating above Tokyo with traditional Japanese washi paper elements and Mount Fuji views.",
                "WiFi;Panoramic Spa;30m Heated Pool;Traditional Onsen;Italian Fine Dining;Wine Cellar",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427", new BigDecimal("700.00"));
        h5.setGalleryUrls(h5.getImageUrl());
        addRoom(h5, "Deluxe Palace View Room", "Expansive floor-to-ceiling glass looking out over the Imperial Palace gardens", 2, new BigDecimal("700.00"), 12, "King", 71);
        addRoom(h5, "Aman Suite", "Corner suite with dramatic skyline vistas, dining area, and sunken granite bath", 3, new BigDecimal("1500.00"), 4, "King", 157);

        Hotel h6 = new Hotel("Taj Fort Aguada Resort & Spa", 10L, "Goa", "Panaji", "India",
                "Sinquerim, Candolim, Goa 403515", 5, new BigDecimal("4.8"), 450,
                "Historic 16th century rampart resort overlooking the Arabian Sea with Portuguese architectural charm.",
                "WiFi;Sea View Pool;Jiva Spa;Water Sports;Multi-Cuisine Restaurants;Beach Access",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9", new BigDecimal("190.00"));
        h6.setGalleryUrls(h6.getImageUrl());
        addRoom(h6, "Superior Sea View Room", "Private balcony overlooking the rolling waves of the Arabian Sea", 2, new BigDecimal("190.00"), 25, "King", 38);
        addRoom(h6, "Aguada Heritage Cottage", "Colonial heritage villa nestled on hillside slopes", 4, new BigDecimal("380.00"), 8, "2 Queen", 80);

        hotelRepository.saveAll(List.of(h1, h2, h3, h4, h5, h6));
        log.info("Initialized 6 luxury hotels and room types in hotel-service");
    }

    private void addRoom(Hotel hotel, String name, String desc, int cap, BigDecimal price, int total, String bed, int size) {
        RoomType room = new RoomType(hotel, name, desc, cap, price, total, total, bed, size, hotel.getImageUrl(), "WiFi;Air Conditioning;Smart TV;Mini Bar;Espresso Machine");
        hotel.getRoomTypes().add(room);
    }
}
