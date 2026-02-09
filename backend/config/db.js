// import mongoose from 'mongoose';

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(
//             'mongodb+srv://farhanworks123_db_user:Farhan%40123@cluster0.3ldnsuy.mongodb.net/FoodieFrenzy'
//         );
//         console.log('DB CONNECTED');
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//     }
// };


import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://farhanworks123_db_user:Farhan%40123@cluster1.obqsjke.mongodb.net/FoodieFrency'
        );
        console.log('DB CONNECTED');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
