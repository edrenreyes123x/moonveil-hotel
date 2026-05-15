const bcrypt = require('bcryptjs');
const { pool, initDB } = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');
const RoomInstance = require('./models/RoomInstance');
const Booking = require('./models/Booking');

const seed = async () => {
  try {
    await initDB();
    console.log('✅ Database initialized');

    // Clear existing data
    await Booking.deleteAll();
    await RoomInstance.deleteAll();
    await Room.deleteAll();
    await User.deleteAll();
    console.log('🗑️ Cleared existing data');

    // Create users
    const hashedAdminPw = bcrypt.hashSync('admin123', 10);
    const hashedUserPw = bcrypt.hashSync('password123', 10);

    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@moonveil.com',
      password: hashedAdminPw,
      role: 'admin'
    });

    const regularUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: hashedUserPw,
      role: 'user'
    });

await User.create({ firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: hashedUserPw, role: 'user' });
    await User.create({ firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', password: hashedUserPw, role: 'user' });

    // Create staff user (frontdesk)
    const staffUser = await User.create({
      firstName: 'Sarah',
      lastName: 'Conner',
      email: 'staff@moonveil.com',
      password: hashedUserPw,
      role: 'staff'
    });

    console.log('👥 Seeded users:', adminUser.email, regularUser.email, staffUser.email);

    // Create rooms
    const roomsData = [
      {
        name: 'Deluxe Room',
        type: 'Double',
        price: 150,
        description: 'Spacious room with stunning city view',
        amenities: ['WiFi', 'AC', 'Mini Bar', 'Bathtub'],
        image: 'https://via.placeholder.com/300x200?text=Deluxe+Room',
        rating: 4.5,
        available: true,
        bookings: 45
      },
      {
        name: 'Suite Room',
        type: 'Suite',
        price: 300,
        description: 'Luxury suite with separate living area',
        amenities: ['WiFi', 'AC', 'Jacuzzi', 'Safe', 'Smart TV'],
        image: 'https://via.placeholder.com/300x200?text=Suite+Room',
        rating: 4.8,
        available: true,
        bookings: 32
      },
      {
        name: 'Standard Room',
        type: 'Single',
        price: 80,
        description: 'Comfortable room perfect for solo travelers',
        amenities: ['WiFi', 'AC', 'Shower'],
        image: 'https://via.placeholder.com/300x200?text=Standard+Room',
        rating: 4.2,
        available: true,
        bookings: 67
      },
      {
        name: 'Penthouse',
        type: 'Penthouse',
        price: 500,
        description: 'Ultimate luxury experience with panoramic views',
        amenities: ['WiFi', 'AC', 'Infinity Pool', 'Concierge', 'Spa'],
        image: 'https://via.placeholder.com/300x200?text=Penthouse',
        rating: 5.0,
        available: true,
        bookings: 12
      }
    ];

    const seededRooms = [];
    for (const r of roomsData) {
      seededRooms.push(await Room.create(r));
    }
    console.log('🏨 Seeded 4 room types');

// Create 4 instances per room type with realistic room numbers and floors
    // Deluxe: Floor 1-2 (rooms 101-108)
    // Suite: Floor 3-4 (rooms 301-308)
    // Standard: Floor 5-6 (rooms 501-508)
    // Penthouse: Floor 7 (rooms 701-702)
    const roomInstances = [];
    const floorConfig = [
      { floor: 1, start: 101, count: 4 },  // Deluxe Floor 1
      { floor: 2, start: 201, count: 4 },  // Deluxe Floor 2
      { floor: 3, start: 301, count: 4 },  // Suite Floor 3
      { floor: 4, start: 401, count: 4 },  // Suite Floor 4
      { floor: 5, start: 501, count: 4 },  // Standard Floor 5
      { floor: 6, start: 601, count: 4 },  // Standard Floor 6
      { floor: 7, start: 701, count: 2 },  // Penthouse Floor 7
    ];
    
    seededRooms.forEach((roomType, typeIndex) => {
      const floorsForType = typeIndex === 3 ? 1 : 2; // Penthouse has 1 floor, others have 2
      let instanceIndex = 0;
      for (let f = 0; f < floorsForType; f++) {
        const floorConfigIndex = typeIndex * 2 + f;
        const config = floorConfig[floorConfigIndex];
        for (let i = 0; i < config.count; i++) {
          roomInstances.push({
            typeId: roomType.id,
            roomNumber: `${config.start + i}`,
            floor: config.floor,
            typeName: roomType.name,
            price: roomType.price
          });
          instanceIndex++;
        }
      }
      // Add extra for penthouse on floor 7 if it's the penthouse
      if (typeIndex === 3) {
        roomInstances.push({
          typeId: roomType.id,
          roomNumber: '702',
          floor: 7,
          typeName: roomType.name,
          price: roomType.price
        });
      }
    });

    for (const ri of roomInstances) {
      await RoomInstance.create(ri);
    }
    console.log('🏨 Seeded 16 room instances (4 per type)');

    // Create bookings
    const bookingsData = [
      {
        userId: regularUser.id,
        roomId: seededRooms[0].id,
        roomName: 'Deluxe Room',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        checkIn: '2026-02-15',
        checkOut: '2026-02-18',
        guests: 2,
        specialRequests: 'High floor preferred',
        totalPrice: 450,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'cash',
        paymentDate: new Date('2026-02-10')
      },
      {
        userId: adminUser.id,
        roomId: seededRooms[3].id,
        roomName: 'Penthouse',
        guestName: 'Admin User',
        guestEmail: 'admin@moonveil.com',
        checkIn: '2026-01-10',
        checkOut: '2026-01-15',
        guests: 2,
        specialRequests: 'Champagne on arrival',
        totalPrice: 2500,
        status: 'Completed',
        paymentStatus: 'Paid',
        paymentMethod: 'cash',
        paymentDate: new Date('2026-01-05')
      }
    ];

    for (const b of bookingsData) {
      await Booking.create(b);
    }
    console.log('📅 Seeded initial bookings');

    console.log('🎉 Seeding completed!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

seed();
