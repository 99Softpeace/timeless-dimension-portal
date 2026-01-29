const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        try {
            // Try to create a temporary collection/document to verify write access
            const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
            const testDoc = new Test({ name: 'Connection Test' });
            await testDoc.save();
            console.log('✅ Write operation successful');

            await Test.deleteMany({ name: 'Connection Test' });
            console.log('✅ Cleanup successful');

            process.exit(0);
        } catch (err) {
            console.error('❌ Write operation failed:', err);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ Connection failed:', err);
        process.exit(1);
    });
