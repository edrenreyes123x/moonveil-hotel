# Moonveil Hotel ERD / Schema Diagram

## MongoDB Schema (NoSQL, but relational style)

```
User
├── _id (ObjectId)
├── firstName (String, req)
├── lastName (String, req)
├── email (String, unique, req)
├── password (String, hashed, req)
├── role (String: 'user'|'admin', default 'user')
└── timestamps (createdAt, updatedAt)

Room
├── _id (ObjectId)
├── name (String, req)
├── type (String, req)
├── price (Number, req)
├── description (String, req)
├── amenities (String[])
├── image (String)
├── rating (Number 0-5)
├── available (Boolean, default true)
├── bookings (Number, default 0)
└── timestamps

Booking (User 1---* Booking, Room 1---* Booking)
├── _id (ObjectId)
├── userId (ObjectId ref User)
├── roomId (ObjectId ref Room)
├── roomName (String)
├── guestName (String)
├── guestEmail (String)
├── checkIn (Date)
├── checkOut (Date)
├── guests (Number)
├── specialRequests (String)
├── totalPrice (Number)
├── status ('Pending'|'Confirmed'|'Completed')
├── paymentStatus ('Pending'|'Paid')
├── paymentDate (Date)
└── timestamps
```

## Relationships
- User → Bookings (1:M)
- Room → Bookings (1:M)

## Seed Data (run `npm run seed`)
- Users: admin@moonveil.com (admin123), john@example.com (password123)
- 4 Rooms: Deluxe, Suite, Standard, Penthouse
- 2 Sample bookings

View in MongoDB Compass: localhost:27017 → moonveil_hotel db
