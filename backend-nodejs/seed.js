const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const RoomInstance = require('./models/RoomInstance');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
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

    await User.create([
      { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: hashedUserPw },
      { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', password: hashedUserPw }
    ]);

    console.log('👥 Seeded users:', adminUser.email, regularUser.email);

    // Create rooms
    const rooms = [
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

    await Room.insertMany(rooms);
    console.log('🏨 Seeded 4 room types');

    const seededRooms = await Room.find({});

    // Create 4 instances per room type
    const roomInstances = [];
    seededRooms.forEach((roomType, typeIndex) => {
      for (let i = 1; i <= 4; i++) {
        roomInstances.push({
          typeId: roomType._id,
          roomNumber: `${roomType.name.split(' ')[0]} ${typeIndex * 4 + i}`,
          typeName: roomType.name,
          price: roomType.price
        });
      }
    });
    await RoomInstance.insertMany(roomInstances);
    console.log('🏨 Seeded 16 room instances (4 per type)');

    const seededRoomsInstances = await RoomInstance.find({}).limit(4); // for bookings

    const bookings = [
      {
        userId: regularUser._id,
        roomId: seededRooms[0]._id,
        roomName: 'Deluxe Room',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        checkIn: new Date('2026-02-15'),
        checkOut: new Date('2026-02-18'),
        guests: 2,
        specialRequests: 'High floor preferred',
        totalPrice: 450,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentDate: new Date('2026-02-10')
      },
      {
        userId: adminUser._id,
        roomId: seededRooms[3]._id,
        roomName: 'Penthouse',
        guestName: 'Admin User',
        guestEmail: 'admin@moonveil.com',
        checkIn: new Date('2026-01-10'),
        checkOut: new Date('2026-01-15'),
        guests: 2,
        specialRequests: 'Champagne on arrival',
        totalPrice: 2500,
        status: 'Completed',
        paymentStatus: 'Paid',
        paymentDate: new Date('2026-01-05')
      }
    ];

    await Booking.insertMany(bookings);
    console.log('📅 Seeded initial bookings');

    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });

