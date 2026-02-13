
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './db.js';

dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();

        console.log('Clearing existing users...');
        await User.deleteMany({});

        const adminUser = {
            name: 'ProtoHQ Admin',
            email: 'sec23it169@sairamtap.edu.in',
            password: 'Meminemyself@123',
            role: 'developer'
        };

        console.log('Creating admin user...');
        await User.create(adminUser);

        console.log('User seeded successfully');
        console.log(`Admin Email: ${adminUser.email}`);
        console.log(`Admin Password: ${adminUser.password}`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

seedUsers();
